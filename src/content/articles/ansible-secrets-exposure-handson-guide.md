---
title: "Ansible実行時に機密情報がログとプロセス一覧に漏れる経路を塞ぐ『上位1%』のハンズオン——no_logとシェルインジェクションの実像"
description: "パスワードを扱うタスクの実行結果が、意図せずログに平文で残ってしまう状況を再現し、no_logで塞ぐ。psコマンドで他のプロセスから引数が見えてしまうリスク、そしてshell/commandモジュールに変数をそのまま埋め込むことで生まれるシェルインジェクションの再現までを扱う、教育・防御目的のハンズオン。"
series: "ansible"
order: 11
tags: ["ansible", "iac", "infra", "security", "handson"]
emoji: "🕳️"
pubDate: 2026-09-26
---

## はじめに

- **この記事で得られること**: [Ansible Vaultでパスワードをgitにプレーンテキストのまま置かない『上位1%』のハンズオン](/articles/ansible-vault-handson-guide)でVaultによる保管時の暗号化を扱いましたが、実行時にも機密情報が漏洩する経路が別に存在します。この記事では、**ログへの平文出力**・**プロセス一覧からの参照**・**シェルインジェクション**という3つの実行時の漏洩経路を、自分が管理する検証環境で実際に再現し、それぞれの塞ぎ方を体験します。**このハンズオンは、自分が管理する検証環境の防御力を高めるための、教育・防御目的のものです。実運用中の他者の環境に対して、許可なくこの手順を実行しないでください。**
- **対象読者**: Ansible Vaultで保管時の暗号化はしているが、実行時のログやプロセス一覧に機密情報が残るリスクを意識したことがない方を想定しています。
- **読むのにかかる想定時間**: 約20分(実際に構築しながら進める場合は35分程度を見込んでください)

この記事は[『上位1%』シリーズ 全記事ガイド](/sitemap)の一部、[Ansibleシリーズ](/sitemap#シリーズ一覧)の11本目です。

## 全体像をつかむ

このハンズオンで行うことは、次の4ステップです。

```mermaid
graph LR
    Step1["Step1<br/>パスワードがログに<br/>平文出力される状況を再現"]
    Step2["Step2<br/>no_logで<br/>ログ出力を抑制"]
    Step3["Step3<br/>プロセス一覧から<br/>引数が見える状況を再現"]
    Step4["Step4<br/>シェルインジェクションの<br/>危険性を再現"]
    Step1 --> Step2 --> Step3 --> Step4
```

## ハンズオン手順

### Step 1: パスワードがログに平文出力される状況を再現する

パスワードを引数に含むコマンドを、`no_log`なしで実行します。

```yaml
- name: Create a database user (leaks the password into the log)
  command: "mysql -u root -p{{ db_root_password }} -e \"CREATE USER 'app'@'%' IDENTIFIED BY 'AppP@ss123!';\""
```

このPlaybookを`-v`(verboseモード)で実行してみてください。

```bash
ansible-playbook -i inventory.ini site.yml -v
```

**実行結果の出力に、`db_root_password`の実際の値が、コマンドライン全体としてそのまま表示されてしまいます。** CI/CDのジョブログとして、このPlaybookの実行結果が保存・共有される運用をしていた場合、そのログを見られる全員に、rootパスワードが漏洩することになります。

### Step 2: no_logでログ出力を抑制する

同じタスクに`no_log: true`を追加します。

```yaml
- name: Create a database user (log output suppressed)
  command: "mysql -u root -p{{ db_root_password }} -e \"CREATE USER 'app'@'%' IDENTIFIED BY 'AppP@ss123!';\""
  no_log: true
```

**同じコマンドを`-v`付きで再実行すると、出力が`censored`という文字列に置き換えられ、実際の値が一切表示されなくなります。** 機密情報を扱うタスクには、`no_log: true`を付けることが、実務上ほぼ必須の運用です。

### Step 3: プロセス一覧から引数が見える状況を再現する

`no_log`を設定していても、実行中の一瞬だけ、別の経路から漏洩することがあります。

```yaml
- name: Long-running command that embeds a secret as an argument
  shell: "sleep 5 && echo done"
  args:
    warn: false
  environment:
    DB_PASSWORD: "{{ db_root_password }}"
```

このタスクの実行中に、別のターミナルから同じホストで確認します。

```bash
ps aux | grep mysql
```

**`no_log`はAnsible自身のログ出力だけを抑制するものであり、対象ホスト上でコマンドが実際に実行されている間、そのコマンドライン引数がOSのプロセス一覧に表示されてしまうという経路までは防げません。** 引数ではなく環境変数や、パスワードファイルの一時的な配置経由でパスワードを渡す設計が、この経路への対策になります。

### Step 4: シェルインジェクションの危険性を再現する

外部から渡された値を、`shell`モジュールにそのまま埋め込んだ場合の危険性を再現します。

```yaml
- name: Vulnerable to shell injection if user_supplied_value is untrusted
  shell: "echo {{ user_supplied_value }}"
  vars:
    user_supplied_value: "hello; rm -rf /tmp/testdir"
```

**この`user_supplied_value`のように、外部の入力(APIのレスポンスや、ユーザーが入力したフォームの値など)を信頼できない前提で`shell`モジュールに渡すと、`;`以降が別のコマンドとして実行されてしまいます。** この検証環境では`rm -rf /tmp/testdir`という無害な例にとどめていますが、実際の攻撃ではこの経路を使って任意のコマンドが実行され得ます。

## プロが見ている視点(上位1%の理解)

### 保管時の暗号化と、実行時の漏洩経路は、別々に対策が必要な問題である

[Ansible Vaultでパスワードをgitにプレーンテキストのまま置かない『上位1%』のハンズオン](/articles/ansible-vault-handson-guide)で扱ったVaultは、**保管時**(Gitリポジトリに置かれている間)の機密情報を守る仕組みです。一方、このハンズオンで扱った`no_log`・プロセス一覧・シェルインジェクションは、いずれも**実行時**に発生する、まったく別の種類のリスクです。「Vaultで暗号化しているから安全」という理解は、実行時の経路までは守ってくれないという意味で、不完全な理解です。実務では、この2種類のリスクを別々に、両方とも塞ぐ必要があります。

### シェルインジェクション対策の本質は、`shell`を使わないことである

`shell`モジュールにパラメータを直接埋め込むのではなく、多くの場合、そもそも`shell`モジュールを使わず、専用モジュール(`user`・`mysql_user`・`copy`など)を使うことで、この種のリスクを根本から回避できます。専用モジュールは、内部でパラメータを安全に扱うように設計されているためです。**「`shell`モジュールで何でもできるから便利」という発想ではなく、「専用モジュールが存在するなら、まずそちらを検討する」という判断が、上位1%のエンジニアがAnsibleのコードレビューで真っ先に確認する観点**です。どうしても`shell`を使わざるを得ない場合は、`quote`フィルターで値をエスケープするか、`args: {executable: ...}`のような形で、シェル解釈を経由しない実行方法を検討します。

## よくある誤解・つまずきポイント

- **誤解1: 「no_logを設定すれば、機密情報の漏洩経路はすべて塞がれる」**
  no_logはAnsible自身のログ出力だけを抑制します。対象ホスト上のプロセス一覧への表示など、別の経路までは防げません。
- **誤解2: 「Ansible Vaultで暗号化していれば、実行時の漏洩対策は不要」**
  Vaultは保管時の対策であり、実行時の漏洩(ログ・プロセス一覧・シェルインジェクション)は別途対策が必要です。
- **誤解3: 「shellモジュールに変数を埋め込んでも、Ansibleが自動的にエスケープしてくれる」**
  Ansibleは自動的なエスケープを行いません。信頼できない値を埋め込む場合は、`quote`フィルターなどで明示的にエスケープする必要があります。

## 障害・トラブルシューティングの視点

1. **no_logを設定したのに、一部の情報がログに出力される**: `no_log`はタスク単位の設定です。前後の別のタスク(`debug`など)で、同じ変数を別の場所から出力していないか確認してください。
2. **専用モジュールへの置き換えが難しい**: 専用モジュールが存在しない操作の場合、`shell`の代わりに`command`モジュール(シェル解釈を経由しない)を使えないか、まず検討してください。
3. **CI/CDのログに過去の機密情報が残っている**: `no_log`の追加は、それ以降の実行にしか適用されません。過去に出力されたCI/CDのログ自体を、別途削除・非公開化する対応が必要です。

## まとめ

- 機密情報を扱うタスクには`no_log: true`を付け、Ansibleのログ出力を抑制します。
- `no_log`は、対象ホストのプロセス一覧への表示という、別の漏洩経路までは防げません。
- 外部から渡された信頼できない値を`shell`モジュールに直接埋め込むと、シェルインジェクションのリスクが生まれます。
- 保管時の暗号化(Vault)と実行時の漏洩対策は、別々に講じる必要がある、異なる種類の対策です。

**今日から意識すべきこと**
1. パスワードや秘密鍵を扱うすべてのタスクに、`no_log: true`を付けることを標準にしましょう。
2. `shell`モジュールを使う前に、専用モジュールで代替できないか、まず検討する習慣をつけましょう。

## 参考文献

- [Protecting sensitive data with no_log | Ansible Documentation](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_variables.html#hiding-output-with-no-log)
- [Command Injection | OWASP](https://owasp.org/www-community/attacks/Command_Injection)
