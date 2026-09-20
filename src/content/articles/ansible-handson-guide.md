---
title: "Ansibleで複数サーバーへの設定投入を自動化する『上位1%』のハンズオン"
description: "既存のUbuntu Server VMを使い、制御ノードにAnsibleをインストールし、SSH鍵認証を設定し、InventoryとPlaybookを作成して、複数サーバーへのNginxインストール・起動・設定投入を自動化するまでを実際に手を動かして体験するハンズオン。同じPlaybookを2回実行し、冪等性(changed=0)を自分の目で確認する。"
series: "ansible"
order: 2
tags: ["ansible", "automation", "iac", "handson"]
emoji: "🛠️"
pubDate: 2026-09-20
---

## はじめに

- **この記事で得られること**: [Ansibleとは何かを『上位1%』の視点で理解する](/articles/ansible-guide)で扱った概念を、実際に手を動かして体験します。既存のUbuntu Server VMを使い、**制御ノード(Control Node)へのAnsibleインストール**、**SSH鍵認証の設定**、**InventoryとPlaybookの作成**を経て、複数サーバーへのNginxインストール・起動・設定投入を自動化し、最後に**同じPlaybookを2回実行して冪等性(`changed=0`)を自分の目で確認する**までの一連の流れを体験します。
- **対象読者**: [Ansibleとは何かを『上位1%』の視点で理解する](/articles/ansible-guide)を読み、実際にAnsibleを触ってみたい方を想定しています。
- **読むのにかかる想定時間**: 約40分(実際の操作時間を含む)

この記事は[『上位1%』シリーズ 全記事ガイド](/sitemap)の一部、[Ansibleシリーズ](/sitemap#シリーズ一覧)の2本目です。

## 前提知識

- **エージェントレスの仕組み**: [Ansibleとは何かを『上位1%』の視点で理解する](/articles/ansible-guide)で扱った、制御ノードから管理対象へSSH経由でpushする、という基本アーキテクチャです。
- **冪等性(idempotency)**: 同じPlaybookを何度実行しても、最終的な結果が変わらないという設計思想です。この記事のStep 7で、実際に自分の目で確認します。

## ハンズオンの前提条件

- **Ubuntu Server VMが2台**: [ハンズオン準備マニュアル:Proxmox VEでのVM作成からOSインストールまで](/articles/handson-prep-guide)と[ハンズオン準備マニュアル:Ubuntuサーバーの初期セットアップ](/articles/ubuntu-server-setup-guide)の手順で、SSHサーバーが有効なUbuntu Server VMを**2台**用意してください。1台を**制御ノード(以下`control`)**、もう1台を**管理対象(以下`node1`)**として使います。まだ1台しか作っていない場合は、同じ手順を1回繰り返すだけで2台目を作れます。
- **各VMのIPアドレス**: `ip a`コマンドで確認した、`control`と`node1`それぞれのIPアドレスを控えておいてください。以降、`<controlのIP>`・`<node1のIP>`と表記します。
- **各VMへのSSHログイン**: [Teraterm(ターミナルソフト)の使い方](/articles/teraterm-guide)などを使い、まず`control`へSSHでログインしておきます(以降の作業はすべて`control`上で行います)。

## Step 0: 制御ノードにAnsibleをインストールする

`control`にSSHログインした状態で、Ansible本体をインストールします。

```bash
sudo apt update
sudo apt install -y ansible
```

インストールが完了したら、バージョンを確認します。

```bash
ansible --version
```

バージョン情報とあわせて、Pythonのバージョンやconfigファイルの場所も表示されます。**Ansible自体はPythonで実装されたソフトウェアであり、`control`側にもPythonの実行環境が必要**であることが、ここからも分かります。

## Step 1: SSH鍵認証を設定する

Ansibleは既定でSSH接続を使いますが、実行のたびにパスワードを手入力するのは非効率かつ自動化に適さないため、**SSH鍵認証**を設定します。

```bash
# controlユーザーの鍵ペアを生成(すでに鍵がある場合は再生成不要)
ssh-keygen -t ed25519
```

すべてEnterキーでデフォルトのまま進めて構いません(パスフレーズは今回は空でも構いませんが、実務では設定を推奨します)。生成した公開鍵を、`node1`へ登録します。

```bash
ssh-copy-id <node1のユーザー名>@<node1のIP>
```

`ssh-copy-id`は、`control`で生成した公開鍵を、`node1`の`~/.ssh/authorized_keys`へ自動的に追記してくれるコマンドです。実行後、次のコマンドで**パスワード入力なしにログインできる**ことを確認してください。

```bash
ssh <node1のユーザー名>@<node1のIP>
# パスワードを聞かれずにログインできればOK。確認後はexitでcontrolに戻る
exit
```

## Step 2: Inventoryファイルを作成する

作業用のディレクトリを作り、管理対象のサーバー一覧を記述する**Inventory**ファイルを作成します。

```bash
mkdir ~/ansible-lab && cd ~/ansible-lab
nano inventory.ini
```

次の内容を記述します(IPアドレス・ユーザー名は自分の環境に置き換えてください)。

```ini
[webservers]
node1 ansible_host=<node1のIP> ansible_user=<node1のユーザー名>
```

`[webservers]`は**グループ名**で、複数のサーバーをまとめて指定する際の単位になります。今回は1台だけですが、2台目の管理対象VMを追加した場合は、同じ`[webservers]`グループの中に1行追加するだけで台数を増やせます。

## Step 3: 疎通確認をする(pingモジュール)

Inventoryに書いたサーバーへ、Ansibleが実際に接続できるかを確認します。

```bash
ansible all -i inventory.ini -m ping
```

`-m ping`は、ICMPの`ping`コマンドではなく、**Ansibleの`ping`モジュール**を指定するオプションです。SSH接続とPythonの実行が正常に行えるかを確認するための、Ansible独自のモジュールです。次のような結果が表示されれば成功です。

```
node1 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
```

`"ping": "pong"`が返ってくれば、`control`から`node1`へのSSH接続とPython実行環境が正常に機能していることが確認できました。

## Step 4: Playbookを作成する

Nginxをインストールし、起動し、簡単なテストページを配置する**Playbook**を作成します。

```bash
nano site.yml
```

```yaml
---
- name: Webサーバーの基本セットアップ
  hosts: webservers
  become: true   # 管理者権限(sudo)で実行する
  tasks:
    - name: Nginxをインストールする
      ansible.builtin.apt:
        name: nginx
        state: present
        update_cache: true

    - name: Nginxを起動し、自動起動も有効にする
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: true

    - name: テストページを配置する
      ansible.builtin.copy:
        content: "<h1>Hello from Ansible!</h1>\n"
        dest: /var/www/html/index.html
```

`become: true`は、Task全体を管理者権限(`sudo`)で実行することを宣言しています。3つのTaskはそれぞれ、パッケージのインストール・サービスの起動・ファイルの配置という、[前提知識](/articles/ansible-guide)で扱った「状態の宣言」にあたります。

## Step 5: Playbookを実行する

```bash
ansible-playbook -i inventory.ini site.yml
```

実行すると、各Taskについて`changed`または`ok`の結果が、色分けされた形で表示されます。初回実行では、Nginxがまだインストールされていない状態から変更を加えるため、3つのTaskすべてが`changed`(黄色)として報告されるはずです。最後に表示される`PLAY RECAP`で、`ok=4 changed=3`のような要約を確認できます。

実行が成功したら、`control`から次のコマンドでテストページが配信されているかを確認します。

```bash
curl http://<node1のIP>/
```

`<h1>Hello from Ansible!</h1>`が返ってくれば、Playbookによる設定投入が実際に反映されています。

## Step 6: 冪等性を自分の目で確認する

[前提知識](/articles/ansible-guide)で扱った冪等性を、実際に確認します。**同じPlaybookを、内容を一切変更せずにもう一度実行**します。

```bash
ansible-playbook -i inventory.ini site.yml
```

2回目の実行結果を確認してください。今回は、`PLAY RECAP`が`ok=4 changed=0`のようになっているはずです。**「Nginxをインストールする」「起動する」「配置する」という3つのTaskすべてが、`changed`ではなく`ok`(すでに望ましい状態だった)として報告される**ことを確認してください。これが、Ansibleの各Moduleが冪等性を内部で担保していることの、実際の動作による証明です。

<details>
<summary>補足: 意図的にPlaybookを冪等でなくしてみる</summary>

冪等性の重要さを体感するために、試しに`copy`モジュールの代わりに、シェルコマンドでファイルへ追記する`shell`モジュールを使ったTaskを追加してみてください。

```yaml
    - name: (悪い例)ファイルへ追記する
      ansible.builtin.shell: echo "test" >> /var/www/html/index.html
```

このTaskは、`ansible.builtin.shell`モジュールを使って生のシェルコマンドを実行しているため、Ansibleは「すでに望ましい状態かどうか」を判断できません。そのため、**何度実行しても毎回`changed`として報告され**、実行するたびにファイルへ`test`の行が増えていくことを確認できます。これが、冪等性を保証しないTaskの典型例です。実務では、`shell`や`command`モジュールを使う際は、`creates`や`changed_when`といったオプションで、冪等性を自分で補う必要があります。

</details>

## Step 7: 後片付け

ハンズオンで作成した設定は、VM自体を次の検証で再利用する予定がなければ、そのまま残しておいて構いません。Nginxを停止したい場合は、次のPlaybookをその場で書いて実行することもできます。

```yaml
---
- name: Nginxを停止する
  hosts: webservers
  become: true
  tasks:
    - name: Nginxを停止し、自動起動も無効にする
      ansible.builtin.service:
        name: nginx
        state: stopped
        enabled: false
```

「サーバーへSSHログインして手作業で`systemctl stop nginx`する」のではなく、**後片付けもPlaybookとして記述して実行する**という発想に、すでに慣れてきていることに気づくはずです。

## よくあるエラーとその対処

- **`UNREACHABLE`と表示され、SSH接続に失敗する**: Step 1のSSH鍵認証が正しく設定されているかを確認してください。また、`node1`へ初めてSSH接続する際に表示される「ホスト鍵を保存するか」という確認プロンプトが、Ansible実行時には表示されず失敗の原因になることがあります。事前に一度手動で`ssh <node1のユーザー名>@<node1のIP>`を実行し、ホスト鍵を承認しておいてください。
- **Pythonの実行に関するエラーが出る**: `node1`にPython 3がインストールされているかを確認してください(Ubuntu Serverには通常標準で入っています)。特殊な環境でPythonのパスが異なる場合は、Inventoryに`ansible_python_interpreter=/usr/bin/python3`を追記します。
- **`apt`モジュールのTaskが権限エラーで失敗する**: Playbook側の`become: true`が設定されているか、また`node1`側のユーザーがパスワードなしで`sudo`を実行できる設定(`NOPASSWD`)になっているか、`sudo -l`で確認してください。

## まとめ

- 既存のUbuntu Server VMを使い、制御ノードへのAnsibleインストール、SSH鍵認証の設定という2つの準備を行いました。
- Inventoryで管理対象を定義し、`ansible ... -m ping`で疎通確認を行うことで、SSH接続とPython実行環境が機能しているかを事前に検証できます。
- PlaybookはYAMLで「最終的な状態」を宣言し、`ansible-playbook`コマンドで実行します。
- 同じPlaybookを2回実行し、1回目は`changed`、2回目は`ok`(`changed=0`)になることを確認することで、冪等性が実際に機能していることを自分の目で確認できます。

**今日から意識すべきこと**
1. Playbookを書いたら、必ず2回連続で実行し、2回目が`changed=0`になることを確認する習慣をつけましょう。
2. `shell`や`command`モジュールを使いたくなったときは、まず「対応する専用モジュール(`apt`・`service`・`copy`など)がないか」を確認する癖をつけましょう。専用モジュールの方が、冪等性を自動的に担保してくれます。

## 参考文献

- [Ansible Documentation](https://docs.ansible.com/)
- [Ansible: Building an inventory](https://docs.ansible.com/ansible/latest/inventory_guide/intro_inventory.html)
- [Ansible: ansible.builtin.service module](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/service_module.html)
