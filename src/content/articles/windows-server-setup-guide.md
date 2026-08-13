---
title: "ハンズオン準備マニュアル:Windows Server 2025の初期セットアップとSSHサーバーの有効化(GUI操作)"
description: "Proxmox VE上に作成したWindows Server 2025のVMに対し、GUI(設定画面)だけを使って初期設定を行い、OpenSSHサーバーを有効化してTeratermなどのSSHクライアントから接続できるようにするまでの手順を解説する準備マニュアル。PowerShellのコマンドではなく、Server Managerの画面操作で完結させる。"
series: "handson-prep"
order: 3
tags: ["windows-server", "handson", "beginner", "ssh", "infrastructure"]
emoji: "🪟"
pubDate: 2026-08-10
---

## はじめに

- **この記事で得られること**: Proxmox VE上に作成したWindows Server 2025のVMに対し、GUI(設定画面)だけを使って初期設定(コンピューター名・ネットワーク・タイムゾーン)を行い、OpenSSHサーバーを有効化してTeratermなどのSSHクライアントから接続できるようにするまでの手順を身につけられます。
- **対象読者**: Windows Serverの操作がこれから初めてで、このブログのハンズオン記事(たとえば[Windows Server(RRAS)でのL2TP/IPsec VPN構築](/articles/windows-server-l2tp-vpn-guide)関連の検証)に取り組みたい方を想定しています。
- **読むのにかかる想定時間**: 約15分

この記事は[『上位1%』シリーズ 全記事ガイド](/sitemap)の一部で、[ハンズオン準備マニュアル](/articles/handson-prep-guide)からテーマ別に分割された記事の1つです。**本記事は一貫してGUI(設定画面・Server Manager)での操作を扱い、PowerShellコマンドは使いません。** VM自体の作成手順は[Proxmox VEでのVM作成とOSインストール](/articles/handson-prep-guide)を参照してください(ISOの入手先が異なる点以外は、作成手順自体はLinuxのVMと共通です)。

## Step 1: 初回ログイン後の初期設定

インストール完了後、初回ログイン時にAdministratorのパスワード設定を求められます。ログイン後、既定では**Server Manager**が自動的に開きます(閉じてしまった場合は、スタートメニューから再度開けます)。

Server Managerのダッシュボード左上にある「Local Server」を選び、右側に並ぶ設定項目から次を確認・変更します。

| 設定項目 | 操作 |
|---|---|
| コンピューター名 | 項目の値をクリックすると「System Properties」ダイアログが開き、「Change」ボタンから変更できます。変更後は再起動が必要です。 |
| イーサネット(IPアドレス) | 項目の値(通常「IPv4 address assigned by DHCP, IPv6 enabled」のような表示)をクリックすると、ネットワークアダプターの設定画面が開きます。固定IPアドレスにしたい場合は、アダプターを右クリック→「Properties」→「Internet Protocol Version 4 (TCP/IPv4)」→「Properties」から、IPアドレス・サブネットマスク・デフォルトゲートウェイを入力します。 |
| タイムゾーン | 項目の値をクリックすると日時設定画面が開きます。「Tokyo」などお使いの地域に合わせて設定してください。 |
| Windows Update | 最新の状態にしておくことを推奨します(「Download and install updates」から実行できます)。 |

## Step 2: OpenSSHサーバーを有効化する(GUI操作)

Windows Server 2019以降には、標準機能として**OpenSSH Server**が同梱されています。Server Managerのダッシュボードから、次の手順でGUI操作だけを使って有効化します。

1. Server Managerのダッシュボード右上にある「Manage」メニューから「**Add Roles and Features**」を選びます。
2. ウィザードが起動したら、「Installation Type」で「Role-based or feature-based installation」を選んだまま「Next」を繰り返し、対象サーバー(通常はそのままローカルサーバーが選択されています)を確認して進みます。
3. 「Server Roles」の画面は何も選ばずそのまま「Next」で進みます。
4. 「**Features**」の画面で、一覧から「**OpenSSH Server**」にチェックを入れます(近くに「OpenSSH Client」もありますが、こちらはこのVMから他のサーバーへSSH接続する側の機能なので、今回は不要です)。
5. 「Next」→「Install」で機能のインストールが始まります。完了したら「Close」でウィザードを閉じます。

<details>
<summary>OpenSSH Serverが一覧に見当たらない場合</summary>

Windows Serverのエディション・言語パックの状態によっては、この機能自体がまだWindows Updateから取得されていないことがあります。その場合はいったんWindows Updateを実行し(Step 1参照)、再起動してから「Add Roles and Features」を再度開いてみてください。

</details>

## Step 3: SSHサービスを起動し、自動起動を有効にする

機能をインストールしただけでは、サービスがまだ起動していません。GUIのサービス管理画面から起動状態を確認・設定します。

1. スタートメニューの検索欄に「**Services**」と入力し、「Services」アプリ(`services.msc`)を開きます。
2. 一覧から「**OpenSSH SSH Server**」を探し、ダブルクリックしてプロパティを開きます。
3. 「Startup type」を「**Automatic**」に変更します(既定では「Manual」になっていることが多く、これだとOS再起動のたびに自分でサービスを起動し直す必要があります)。
4. 「Service status」欄の「**Start**」ボタンをクリックして、サービスを今すぐ起動します。
5. 「OK」で設定を保存します。

## Step 4: ファイアウォールの許可ルールを確認する

OpenSSH Serverの機能をインストールすると、通常は「OpenSSH SSH Server (sshd)」という名前の受信規則(インバウンドルール)が自動的に作成され、TCP 22番ポートが許可された状態になります。念のため、次の手順でGUIから確認しておきましょう。

1. スタートメニューの検索欄に「**Windows Defender Firewall with Advanced Security**」と入力して開きます。
2. 左側のツリーから「Inbound Rules」を選びます。
3. 一覧に「**OpenSSH SSH Server (sshd)**」というルールがあり、状態が有効(緑色のチェックマーク)になっていることを確認します。無効になっている場合は、右クリックして「Enable Rule」を選びます。

ここまで完了すると、手元のPCから[Teraterm](/articles/teraterm-guide)などのSSHクライアントを使って、`ssh Administrator@<このVMのIPアドレス>`のようにSSH接続できるようになります(初回接続時は、サーバーの鍵の指紋(フィンガープリント)を信頼するかどうかの確認画面が表示されます)。

<details>
<summary>参考: リモートデスクトップ(RDP)も有効にしておくと便利</summary>

SSHはコマンドライン操作が中心になるため、GUI操作が必要な設定作業(たとえば後述のRRASの構成ウィザードなど)では、リモートデスクトップ接続(RDP)を使う場面も出てきます。Server Managerの「Local Server」ダッシュボードで「Remote Desktop」の項目をクリックし、「Allow remote connections to this computer」を選択しておくと、手元のPCのリモートデスクトップ接続アプリからGUI画面ごと操作できるようになります。

</details>

## まとめ

- Windows Server 2025の初期設定は、Server Managerの「Local Server」ダッシュボードから、コンピューター名・IPアドレス・タイムゾーンをGUIだけで一通り設定できます。
- OpenSSH Serverは「Add Roles and Features」ウィザードの「Features」画面からGUIだけでインストールできます(PowerShellの`Add-WindowsCapability`コマンドを使わなくても導入可能です)。
- インストール後は、Servicesアプリで「OpenSSH SSH Server」のStartup typeを「Automatic」に変更し、忘れずに起動しておく必要があります。
- ファイアウォールの「OpenSSH SSH Server (sshd)」受信規則が有効になっているかを、Windows Defender Firewallの画面から確認しておくと安心です。

## 参考文献

- [OpenSSH in Windows Server | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_overview)
- [Windows Server documentation | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/)
