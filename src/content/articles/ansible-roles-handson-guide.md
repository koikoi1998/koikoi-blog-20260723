---
title: "Ansibleのroles・Handlers・テンプレートで実務レベルの構成管理を体験する『上位1%』のハンズオン"
description: "1つのYAMLファイルにすべて書いていたPlaybookを、再利用可能なroleへ分割し、Jinja2テンプレートで設定ファイルを配布し、設定が変わったときだけサービスを再起動するHandlerを実装する。実務のAnsibleコードがなぜroleという単位で構成されているのかを、手を動かしながら体験するハンズオン。"
series: "ansible"
subSeries: "handson"
order: 3
tags: ["ansible", "iac", "infra", "handson", "automation"]
emoji: "🗂️"
pubDate: 2026-09-26
---

## はじめに

- **この記事で得られること**: [Ansibleで複数サーバーへの設定投入を自動化する『上位1%』のハンズオン](/articles/ansible-handson-guide)で作った、1つのYAMLファイルにすべてを書いたPlaybookを、**role**(ロール)という単位に分割し、**Jinja2テンプレート**で環境ごとに異なる設定ファイルを配布し、**Handler**を使って「設定ファイルが実際に変更されたときだけ」サービスを再起動する、という実務のAnsibleコードでほぼ必ず使われる3つの仕組みを、手を動かして体験します。
- **対象読者**: [前回のハンズオン](/articles/ansible-handson-guide)を終え、単一のPlaybookで小さな自動化はできるようになったが、実務のAnsibleコードがなぜroleという単位で構成されているのかが分からない方を想定しています。
- **読むのにかかる想定時間**: 約30分(実際に構築しながら進める場合は1時間程度を見込んでください)

この記事は[『上位1%』シリーズ 全記事ガイド](/sitemap)の一部です。[前回のハンズオン](/articles/ansible-handson-guide)で使った`control`・`node1`の環境を、そのまま流用します。

## 前提知識

- [Ansibleで複数サーバーへの設定投入を自動化する『上位1%』のハンズオン](/articles/ansible-handson-guide): Inventory、Playbook、冪等性について、この記事の前提になっています。

## 全体像をつかむ

このハンズオンで行うことは、次の4ステップです。

```mermaid
graph LR
    Step1["Step1<br/>roleの雛形を作成"]
    Step2["Step2<br/>変数とテンプレートで<br/>設定ファイルを配布"]
    Step3["Step3<br/>Handlerで<br/>変更時だけ再起動"]
    Step4["Step4<br/>実行して冪等性と<br/>Handler発火を確認"]
    Step1 --> Step2 --> Step3 --> Step4
```

## ハンズオン手順

### Step 1: roleの雛形を作成する

前回作成した`~/ansible-lab`ディレクトリで、`ansible-galaxy`コマンドを使い、role用の定型ディレクトリ構成を自動生成します。

```bash
cd ~/ansible-lab
mkdir roles
ansible-galaxy init roles/webserver
```

生成されたディレクトリ構成を、`tree`コマンドで確認してみましょう。まだインストールされていなければ、先にインストールします。

```bash
sudo apt update
sudo apt install -y tree
tree roles/webserver
```

```
roles/webserver/
├── tasks/main.yml       # このroleが実行するTaskの本体
├── handlers/main.yml    # Handler(変更があったときだけ実行される処理)
├── templates/           # Jinja2テンプレート(空)
├── vars/main.yml        # roleごとの変数
├── defaults/main.yml    # 変数の既定値(varsより優先度が低い)
└── (その他、今回は使わないディレクトリ)
```

**`tree`は、ディレクトリの階層構造を、そのまま図のように表示してくれるコマンドです。** `ls`をディレクトリごとに繰り返す代わりに、この1つのコマンドで、roleの全体像を一望できます。

**「タスク」「Handler」「テンプレート」「変数」が、それぞれ専用のディレクトリ・ファイルに分離されている**ことに注目してください。前回のハンズオンでは、これらすべてを`site.yml`という1つのファイルに詰め込んでいました。roleは、この詰め込みを整理し、**「webserverを構築する」という単位で、他のプロジェクトにもそのままコピーして再利用できる**ようにするための仕組みです。

### Step 2: 変数とテンプレートで設定ファイルを配布する

まず、環境ごとに変えたい値を変数として切り出します。`roles/webserver/vars/main.yml`を編集します。

```bash
nano roles/webserver/vars/main.yml
```

```yaml
server_name: lab.example.com
welcome_message: "Hello from Ansible Roles!"
```

**変数自体は、これまでのハンズオンでも`-e`オプションなどを通じて馴染みがあるはずです。**

次に、この変数を埋め込んだNginxのテストページを、Jinja2テンプレートとして`roles/webserver/templates/index.html.j2`に作成します。

```bash
nano roles/webserver/templates/index.html.j2
```

```html
<h1>{{ welcome_message }}</h1>
<p>server_name: {{ server_name }}</p>
```

**`{{ }}`で囲まれた部分が、実行時に`vars/main.yml`の値へ置き換えられる、Jinja2テンプレートの変数展開構文です。** この仕組みにより、同じテンプレートファイル1つで、`vars/main.yml`の値を変えるだけで、環境ごとに異なる内容の設定ファイルを配布できます。**Jinja2自体は、Pythonの世界で広く使われているテンプレートエンジンで、Ansibleはこれをそのまま採用しています。** 難しく考えず、「`{{ 変数名 }}`と書いた場所が、実行時に実際の値へ置き換わる」という1点だけ覚えておけば、この後の手順を進める中で自然と感覚がつかめます。

続いて、`roles/webserver/tasks/main.yml`を編集し、Nginxのインストールとこのテンプレートの配布を記述します。

```bash
nano roles/webserver/tasks/main.yml
```

```yaml
---
- name: Nginxをインストールする
  ansible.builtin.apt:
    name: nginx
    state: present
    update_cache: true

- name: テストページをテンプレートから配置する
  ansible.builtin.template:
    src: index.html.j2
    dest: /var/www/html/index.html
  notify: Nginxを再起動する
```

**前回のハンズオンで使った`ansible.builtin.copy`モジュールの代わりに、`ansible.builtin.template`モジュールを使っている点に注目してください。** `copy`は静的なファイルをそのまま転送しますが、`template`は、Jinja2テンプレート内の`{{ }}`を実行時に展開してから配布します。

### Step 3: Handlerで「変更があったときだけ」サービスを再起動する

先ほどのTaskの最後にある`notify: Nginxを再起動する`が、Handlerを起動するための指定です。`roles/webserver/handlers/main.yml`を編集し、対応するHandlerを定義します。

```bash
nano roles/webserver/handlers/main.yml
```

```yaml
---
- name: Nginxを再起動する
  ansible.builtin.service:
    name: nginx
    state: restarted
```

**Handlerは、見た目こそ通常のTaskとほぼ同じですが、「呼ばれない限り実行されない」という一点が決定的に異なります。** 通常のTaskは、Playbookに書かれた順番に必ず実行されますが、Handlerは、どこかのTaskから`notify`で名指しされた場合にだけ、それも「実際に変更があった場合にだけ」実行される、いわば控えめな存在です。**この`notify`と`handlers`の組み合わせが、実務のAnsibleコードで非常に重要な役割を果たします。** `template`モジュールを使ったTaskは、配布先のファイルの中身が実際に変わった場合にだけ`changed`という結果を返し、その場合にだけ`notify`で指定したHandlerが呼び出されます。**ファイルの中身に変化がなかった場合(2回目以降の実行など)は、Handlerは呼び出されず、Nginxは再起動されません。** これにより、「設定ファイルを配布するたびに無条件でサービスを再起動する」という、実務では避けたい過剰な処理を防いでいます。

### Step 4: site.ymlからroleを呼び出して実行する

`~/ansible-lab/site.yml`を、roleを呼び出すだけのシンプルな内容に書き換えます。

```bash
nano site.yml
```

```yaml
---
- name: Webサーバーの構築(role版)
  hosts: webservers
  become: true
  roles:
    - webserver
```

実行します。前回のハンズオンと同様に、`sudo`のパスワードを尋ねる`-K`オプションを付けます。

```bash
ansible-playbook -i inventory.ini site.yml -K
```

初回実行では、Nginxのインストールとテンプレートの配布(そしてそれに伴うHandlerの発火によるNginx再起動)が行われ、`changed`として報告されるはずです。**同じPlaybookをもう一度実行してください。** 今度はテンプレートの中身に変化がないため、`template`のTaskは`ok`として報告され、**`notify`で指定したHandlerも呼び出されず、Nginxは再起動されません。**

続いて、`vars/main.yml`の`welcome_message`の値を書き換えてから、もう一度実行してみてください。今度は`template`のTaskが`changed`として報告され、それにともなって**Handlerが実際に呼び出され、Nginxが再起動される**ことを、`PLAY RECAP`の内容から確認できます。

## プロが見ている視点(上位1%の理解)

### なぜ実務のAnsibleコードは、単一のPlaybookではなくroleで構成されるのか

前回のハンズオンのように、すべてを1つの`site.yml`に書く方法は、対象がNginx1つだけの小さな自動化では問題になりません。しかし実務では、Webサーバー・データベースサーバー・ロードバランサーなど、複数の異なる役割のサーバーを同時に管理することが普通です。**roleという単位に分割しておくことで、「webserverロールだけを別プロジェクトへコピーして再利用する」「dbserverロールだけをチームの別メンバーに任せる」といった、役割ごとの独立した管理・再利用が可能になります。** さらに、`ansible-galaxy`上には、世界中のエンジニアが公開した既製のroleが大量に存在し、車輪の再発明をせずに済むというメリットもあります。

### Handlerが「最後にまとめて1回だけ」実行される仕組み

Handlerには、もう1つ重要な特性があります。**同じPlay内で複数のTaskが同じHandlerに`notify`していた場合でも、そのHandlerはPlayの最後に、まとめて1回だけ実行されます。** たとえば、Nginxの設定ファイルを3つ配布するTaskがすべて同じ`notify: Nginxを再起動する`を指定していたとしても、Nginxの再起動は(そのうち1つでも変更があれば)Playの最後に1回だけ実行され、3回再起動されることはありません。これは、複数の設定変更をまとめてから1回だけ安全にサービスを再起動する、という実務上、非常に理にかなった設計です。

## よくある誤解・つまずきポイント

- **誤解1: 「`copy`モジュールでも`template`モジュールでも、やっていることは同じである」**
  `copy`は静的なファイルをそのまま転送しますが、`template`はJinja2の`{{ }}`構文を実行時に展開してから配布します。変数を埋め込みたい場合は`template`を使う必要があります。
- **誤解2: 「`notify`を指定したTaskが実行されるたびに、必ずHandlerも実行される」**
  Handlerが実行されるのは、そのTaskが実際に`changed`(変更あり)として報告された場合だけです。
- **誤解3: 「同じHandlerに複数のTaskがnotifyしていると、notifyした回数だけHandlerが実行される」**
  同じPlay内であれば、Handlerは(1回以上notifyされていれば)Playの最後にまとめて1回だけ実行されます。

## 障害・トラブルシューティングの視点

1. **設定ファイルを変更して再実行したのに、サービスが再起動されない**: Taskに`notify`が正しく指定されているか、そして`notify`で指定した文字列と`handlers/main.yml`内の`name`が完全に一致しているか(1文字でも違うと別のHandlerとして扱われ、静かに無視されます)を確認してください。
2. **`template`モジュールのTaskで、変数が展開されずそのまま`{{ }}`が出力される**: 変数名のタイポ、または`vars/main.yml`に定義していない変数を参照していないかを確認してください。
3. **roleが見つからないというエラーが出る**: `site.yml`を実行するディレクトリと、`roles`ディレクトリの相対位置が正しいか(`ansible.cfg`や実行時のカレントディレクトリを基準に`roles/`が探索されます)を確認してください。

## まとめ

- `ansible-galaxy init`で、role用の定型ディレクトリ構成(tasks・handlers・templates・vars)を自動生成できます。
- `template`モジュールは、Jinja2の`{{ }}`構文を実行時に展開してから設定ファイルを配布します。`copy`との違いを理解しておいてください。
- `notify`と`handlers`を組み合わせることで、「実際に変更があったときだけ」サービスを再起動する、安全な仕組みを実装できます。
- 同じPlay内で複数のTaskが同じHandlerにnotifyしていても、Handlerの実行はPlayの最後にまとめて1回だけです。
- roleという単位に分割することで、役割ごとの独立した管理・再利用が可能になります。

**今日から意識すべきこと**
1. サービスの再起動が必要になるTaskを書くときは、無条件で再起動するのではなく、`notify`とHandlerの組み合わせを使う習慣をつけましょう。
2. 2つ目のWebサーバー用途のPlaybookを書く機会があれば、今回作ったwebserver roleをそのままコピーして再利用できるかを試してみましょう。

## 参考文献

- [Ansible: Roles](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_reuse_roles.html)
- [Ansible: Handlers and notify](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_handlers.html)
- [Ansible: ansible.builtin.template module](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/template_module.html)
