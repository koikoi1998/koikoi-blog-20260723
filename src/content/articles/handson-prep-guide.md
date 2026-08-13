---
title: "ハンズオン準備マニュアル:Proxmox VEでのVM作成からOSインストールまで"
description: "このブログのハンズオン記事に共通して必要になる準備を、テーマ別の記事群として整理した入り口。Proxmox VEでの仮想マシン(VM)作成とOSインストールを本記事で扱い、初回ログイン後の基本操作・Teraterm・Wiresharkの使い方・Windows Serverの初期セットアップはそれぞれ専用の記事に分けている。"
series: "handson-prep"
order: 1
tags: ["proxmox", "linux", "handson", "beginner", "infrastructure"]
emoji: "🧰"
pubDate: 2026-08-09
updatedDate: 2026-08-10
---

## はじめに

- **この記事で得られること**: このブログの各ハンズオン記事(L2TP/IPsecサーバー自作など)に共通して必要になる、Proxmox VEでのVM作成からOSインストールまでの操作を身につけられます。
- **対象読者**: インフラの仮想化環境(Proxmox VEなど)やLinuxサーバーの操作が完全に初めてで、これからこのブログのハンズオン記事に取り組みたい方を想定しています。
- **読むのにかかる想定時間**: 約10分(実際に手を動かしながら読む場合はもう少しかかります)

この記事は[『上位1%』シリーズ 全記事ガイド](/sitemap)の一部です。**この記事は「ハンズオンをこれから始める方のための準備運動」に特化した操作マニュアルであり、他の記事のような内部動作の深掘りは扱いません。** Proxmox VEの内部動作(KVM/QEMUの仕組みなど)に興味がある方は[Proxmox VEとは何か](/articles/proxmox-internals-guide)を参照してください。各ハンズオン記事(たとえば[L2TP/IPsecサーバー自作ハンズオン](/articles/l2tp-ipsec-lab-guide))は、この記事群で扱う操作ができることを前提に書かれています。

## この記事群の使い方

「ハンズオン準備」はテーマごとに次の5記事に分かれています。すでに知っている・使ったことがあるテーマは読み飛ばして構いません。

1. **Proxmox VEでのVM作成とOSインストール**(本記事): VMの作成ウィザード、ISOのダウンロード・アップロード、Ubuntu Serverのインストール手順
2. [Ubuntuサーバーの初期セットアップ](/articles/ubuntu-server-setup-guide): 初回ログイン後の`sudo apt update`・`sudo su -`・`nano`の基本操作、USキーボードレイアウトの注意点、SSHサーバーの確認・有効化
3. [Windows Serverの初期セットアップ](/articles/windows-server-setup-guide): Windows Server(GUI操作)での初期設定と、SSHサーバーの有効化
4. [Teraterm(ターミナルソフト)の使い方](/articles/teraterm-guide): SSH接続の作成・保存、文字コード設定、ログ保存
5. [Wiresharkの使い方](/articles/wireshark-guide): パケットキャプチャファイルの開き方・フィルタの基本、`scp`によるファイル転送

本記事では、このうち**1. Proxmox VEでのVM作成とOSインストール**を扱います。

## Step 1: Proxmox VEでVMを作成する

Proxmox VEの管理画面(ブラウザで`https://<ProxmoxのIPアドレス>:8006`にアクセス)にログインしたら、対象のノードを選び、右上の**「Create VM」**ボタンから作成ウィザードを開きます。

| 設定タブ | 主な設定項目 | ハンズオン用途での目安 |
|---|---|---|
| General | VM ID、名前 | 名前はハンズオンの内容がわかるものにしておくと後で見分けやすい(例: `l2tp-server`) |
| OS | インストールに使うISOイメージ | Step 2でアップロードしたISOを選択 |
| System | BIOS種別、Qemuエージェントの有無など | 基本的にデフォルトのままで問題ありません |
| Disks | ディスクサイズ、保存先ストレージ | 検証用途なら8〜20GB程度で十分なことが多い(記事ごとの指定に従ってください) |
| CPU | コア数 | 検証用途なら1〜2コアで十分なことが多い |
| Memory | メモリ容量(MB) | 検証用途なら1〜2GB程度で十分なことが多い |
| Network | 接続するブリッジ(通常は`vmbr0`) | 家庭内LANに直結したい場合は`vmbr0`を選択 |

すべてのタブを確認したら「Confirm」で作成を確定します。この時点ではまだVMは起動していません。

## Step 2: OSのインストールメディア(ISO)をダウンロード・アップロードする

**ISOをダウンロードする**: 使用するOSの配布元サイトから、インストール用のISOイメージをダウンロードします。たとえばUbuntu Serverの場合は、[Ubuntuの公式ダウンロードページ](https://ubuntu.com/download/server)からLTS(長期サポート)版を選ぶのが無難です。

**Proxmoxにアップロードする**: Proxmoxの管理画面で、ISOを保存したいストレージ(通常は`local`)を選び、「ISO Images」→「Upload」から、ダウンロードしたISOファイルをアップロードします。ネットワーク越しにISOのURLを直接指定してダウンロードさせる「Download from URL」機能が使える場合は、手元の回線を経由しない分アップロードが速く済むこともあります。

## Step 3: ISOからOSをインストールする(Ubuntu Serverを例に)

Step 1で作成したVMを選び、「Start」で起動したあと、「Console」タブを開くと、VMの画面をブラウザ上で操作できます(noVNCという技術で、リモートデスクトップのようにVMの画面を映しています)。

Ubuntu Serverのインストーラーが起動したら、おおむね次の流れで進みます。

1. **言語選択**: 通常は「English」のまま進めることが多いです(日本語UIは情報が少なく、エラーメッセージも英語のままの方が検索しやすいため)。
2. **キーボードレイアウト選択**: ここで選んだレイアウトが、以降のインストール作業やインストール後の入力方式に影響します。手元が日本語配列のキーボードであれば「Japanese」を選ぶと、キートップの印字通りに入力できます。ここで「English (US)」を選んだ場合の注意点は[Ubuntuサーバーの初期セットアップ](/articles/ubuntu-server-setup-guide)で扱います。
3. **ネットワーク設定**: `vmbr0`をLANに直結している場合、通常はDHCPで自動的にIPアドレスが割り当てられ、そのまま次に進めます。
4. **ストレージ設定**: 特に理由がなければ「Use an entire disk」のようなデフォルトの案内に従って問題ありません。
5. **プロフィール設定**: サーバー名・ユーザー名・パスワードを設定します。ここで設定したユーザーが、インストール後に`sudo`を使える管理ユーザーになります。
6. **OpenSSH Serverのインストール**: 「Install OpenSSH server」にチェックを入れておくことを強く推奨します。これにより、インストール完了後にSSH経由でVMへ接続できるようになり(Console画面よりコピー&ペーストがしやすく作業効率が上がります)、以降のハンズオン記事の手順もSSH接続を前提に書かれています。チェックを忘れた場合の対処は[Ubuntuサーバーの初期セットアップ](/articles/ubuntu-server-setup-guide)で扱っています。
7. **featured server snapsの選択**: ハンズオンで別途指定がなければ、何も選択せずに進めて構いません(あとから`apt`で必要なものを個別にインストールします)。

インストール完了後は再起動を促されます。**再起動前にISOイメージをVMの光学ドライブから取り出す(またはブート順序を変更する)** ことを忘れないようにしてください。これを忘れると、再起動のたびにインストーラーが再度起動してしまいます(ProxmoxのVMの「Hardware」タブ→CD/DVDドライブから、マウントしているISOを取り外せます)。

再起動できたら、[Ubuntuサーバーの初期セットアップ](/articles/ubuntu-server-setup-guide)に進み、SSH接続後の基本操作を確認してください。

## まとめ

- Proxmox VEでのVM作成は、General→OS→System→Disks→CPU→Memory→Networkという各タブの設定を一通り確認して「Confirm」するだけで完了します。
- OSのインストールメディア(ISO)は配布元サイトからダウンロードし、Proxmoxの「ISO Images」からアップロードして使います。
- インストール完了後は、ISOイメージを光学ドライブから取り外してから再起動する必要があります。
- 初回ログイン後の基本操作(`apt update`/`su -`/`nano`/SSHサーバー確認)は[Ubuntuサーバーの初期セットアップ](/articles/ubuntu-server-setup-guide)、SSHクライアントの使い方は[Teraterm(ターミナルソフト)の使い方](/articles/teraterm-guide)で扱います。

## 参考文献

- [Proxmox VE Administration Guide](https://pve.proxmox.com/pve-docs/)
- [Ubuntu Server download](https://ubuntu.com/download/server)
