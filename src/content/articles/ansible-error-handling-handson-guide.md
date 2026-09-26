---
title: "Ansibleのblock/rescue/alwaysで構成変更失敗時のロールバックを設計する『上位1%』のハンズオン——例外処理と自動復旧の実像"
description: "設定投入の途中で失敗するシナリオを意図的に再現し、block/rescue/alwaysで検知・自動ロールバック・後始末を行う。ignore_errorsとblock/rescueの決定的な違い、failed_whenによる失敗判定のカスタマイズ、そして『変更したが確認していない状態』を残さないための設計思想までを扱うハンズオン。"
series: "ansible"
subSeries: "handson"
order: 10
tags: ["ansible", "iac", "infra", "reliability", "handson"]
emoji: "🧯"
pubDate: 2026-09-26
---

## はじめに

- **この記事で得られること**: 設定投入の途中でタスクが失敗するという、実務で頻繁に起こるシナリオを意図的に再現し、`block`/`rescue`/`always`を使って、その失敗を検知し、変更前の状態へ自動的にロールバックし、後始末を行うという、一連の例外処理の設計を体験します。
- **対象読者**: `ignore_errors: true`だけで失敗への対処をすべて済ませてしまっており、`block`/`rescue`の存在を意識したことがない方を想定しています。
- **読むのにかかる想定時間**: 約20分(実際に構築しながら進める場合は40分程度を見込んでください)

この記事は[『上位1%』シリーズ 全記事ガイド](/sitemap)の一部、[Ansibleシリーズ](/sitemap#シリーズ一覧)の10本目です。

## 全体像をつかむ

このハンズオンで行うことは、次の4ステップです。

```mermaid
graph LR
    Step1["Step1<br/>設定変更前の状態を<br/>バックアップ"]
    Step2["Step2<br/>意図的に失敗する<br/>タスクを実行"]
    Step3["Step3<br/>rescueで検知し<br/>自動ロールバック"]
    Step4["Step4<br/>alwaysで<br/>後始末を保証"]
    Step1 --> Step2 --> Step3 --> Step4
```

## ハンズオン手順

### Step 1: 設定変更前の状態をバックアップする

Nginxの設定ファイルを変更する前に、既存の設定をバックアップしておきます。

```yaml
- name: Back up the current nginx config before making changes
  copy:
    src: /etc/nginx/nginx.conf
    dest: /etc/nginx/nginx.conf.bak
    remote_src: true
```

**このバックアップが、後のロールバック処理の前提になります。** ロールバックとは、「失敗する前の正常な状態に戻す」処理であり、その正常な状態そのものを保存しておかなければ実現できません。

### Step 2: 意図的に失敗するタスクをblockで囲む

構文的に不正な設定を投入し、`nginx -t`の構文チェックがそれを検知して失敗する、という状況を`block`の中に記述します。

```yaml
- block:
    - name: Deploy a (deliberately broken) nginx config
      template:
        src: broken_nginx.conf.j2
        dest: /etc/nginx/nginx.conf

    - name: Validate nginx config syntax
      command: nginx -t
```

**`block`は、複数のタスクを1つのまとまりとして扱う仕組みです。** この中のどこかのタスクが失敗すると、`block`全体の実行がそこで止まり、後述する`rescue`セクションへ処理が移ります。

### Step 3: rescueで検知し自動ロールバックする

`block`の直後に、失敗した場合だけ実行される`rescue`セクションを追加します。

```yaml
  rescue:
    - name: Roll back to the backed-up config
      copy:
        src: /etc/nginx/nginx.conf.bak
        dest: /etc/nginx/nginx.conf
        remote_src: true

    - name: Restart nginx with the rolled-back config
      service:
        name: nginx
        state: restarted

    - name: Fail the play with a clear message
      fail:
        msg: "Deployment failed and was rolled back. Check broken_nginx.conf.j2."
```

**`rescue`セクションは、`block`内で失敗が発生した場合にだけ実行されます。** ここでは、バックアップからの復元、正常な設定でのnginx再起動、そして最後に`fail`モジュールで明示的にPlaybook全体を失敗として終わらせる、という3段階の処理を行っています。

### Step 4: alwaysで後始末を保証する

`rescue`のさらに直後に、成功・失敗にかかわらず必ず実行される`always`セクションを追加します。

```yaml
  always:
    - name: Remove the temporary backup file
      file:
        path: /etc/nginx/nginx.conf.bak
        state: absent
```

**`always`セクションは、`block`が成功した場合も、`rescue`で失敗処理をした場合も、両方のケースで必ず実行されます。** 一時ファイルの削除やロックの解放など、「成功・失敗に関わらず、後始末として必ずやっておきたい処理」をここに書きます。

## プロが見ている視点(上位1%の理解)

### ignore_errorsとblock/rescueは、目的からして違う

`ignore_errors: true`は、「そのタスクが失敗しても、以降の処理をそのまま続行する」というだけの、非常に単純な仕組みです。これに対して`block`/`rescue`/`always`は、「失敗を検知し、失敗した場合だけ特定の復旧処理を実行し、成功・失敗どちらでも共通の後始末を行う」という、構造化された例外処理です。**`ignore_errors`を安易に使い続けると、『本当は失敗しているのに、何事もなかったかのように処理が続いてしまう』という、実務で最も危険なパターンにつながります。** 失敗した場合に何らかの対応(ロールバック・通知・別経路への切り替えなど)が必要なら、`ignore_errors`ではなく`block`/`rescue`を使うべきです。

### 「変更したが確認していない状態」を残さないという設計思想

このハンズオンの`rescue`セクションが、単にロールバックするだけでなく、最後に`fail`モジュールで明示的に失敗を報告している点に注目してください。**もしここで単純にロールバックだけして正常終了してしまうと、Playbookの実行結果だけを見た運用担当者は『成功した』と誤解し、実際には設定投入が失敗してロールバックされたという事実に気づけません。** ロールバックによってシステムは安全な状態に戻っていても、「なぜ失敗したのか」という原因調査が必要な状態であることを、実行結果として正確に伝えることが、実務における例外処理設計の本質です。

## よくある誤解・つまずきポイント

- **誤解1: 「ignore_errors: trueを使えば、block/rescueと同じことができる」**
  ignore_errorsは失敗を無視して処理を続行するだけです。失敗時の復旧処理(ロールバックなど)を行うには、block/rescueが必要です。
- **誤解2: 「rescueセクションの中のタスクが失敗したら、さらに別のrescueが実行される」**
  rescueセクションの中で失敗した場合、そのエラーはさらに外側のblockに伝播するか、Playbook全体が失敗します。無限に入れ子になるわけではありません。
- **誤解3: 「alwaysセクションは、blockが成功した場合には実行されない」**
  alwaysセクションは、blockの成功・失敗にかかわらず、必ず実行されます。

## 障害・トラブルシューティングの視点

1. **rescueセクションが期待通りに実行されない**: 失敗しているタスクが本当にblock内にあるか、blockの外側にあるタスクの失敗はrescueの対象にならないことを確認してください。
2. **ロールバック後もサービスが正常に戻らない**: ロールバック処理自体(設定ファイルの復元、サービスの再起動)が正しく完了しているか、rescueセクション内のタスクの実行結果を確認してください。
3. **alwaysセクションが実行されずPlaybookが止まる**: alwaysセクション自体の中でタスクが失敗していないか確認してください。alwaysの中の失敗は、それ以上の後始末を妨げる可能性があります。

## まとめ

- `ignore_errors`は失敗を無視して続行するだけの単純な仕組みです。
- `block`/`rescue`/`always`を使うと、失敗の検知・復旧処理・後始末を構造化して記述できます。
- `rescue`セクションは、`block`内で失敗が発生した場合にだけ実行されます。
- `always`セクションは、成功・失敗にかかわらず必ず実行されます。

**今日から意識すべきこと**
1. 失敗時に何らかの復旧処理が必要なタスクには、`ignore_errors`ではなく`block`/`rescue`を使いましょう。
2. ロールバック処理を書くときは、成功したかのように見えてしまわないよう、最後に明示的な失敗報告を入れましょう。

## 参考文献

- [Handling errors | Ansible Documentation](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_blocks.html)
- [Error handling with blocks | Ansible Documentation](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_error_handling.html)
