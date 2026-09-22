---
title: "OpenShift Localでコンテナアプリケーションを動かす『上位1%』のハンズオン"
description: "1台のPC上に単一ノードのOpenShiftクラスタを構築できるOpenShift Localを使い、サンプルアプリケーションをソースコードから自動ビルド・デプロイし、Routeで外部公開し、スケールさせるまでを実際に手を動かして体験するハンズオン。"
series: "openshift"
order: 2
tags: ["openshift", "kubernetes", "container", "handson"]
emoji: "🛠️"
pubDate: 2026-09-20
---

## はじめに

- **この記事で得られること**: [OpenShiftとは何かを『上位1%』の視点で理解する](/articles/openshift-guide)で扱った概念を、実際に手を動かして体験します。**OpenShift Local**(1台のPC上に単一ノードのOpenShiftクラスタを構築できる、Red Hat公式の学習・検証用ツール)を使い、サンプルアプリケーションをソースコードから自動ビルド・デプロイし、Routeで外部公開し、スケール(複製数の変更)させるまでの一連の流れを体験します。
- **対象読者**: [OpenShiftとは何かを『上位1%』の視点で理解する](/articles/openshift-guide)を読み、実際にOpenShiftを触ってみたい方を想定しています。
- **読むのにかかる想定時間**: 約35分(実際の操作時間を含む)

この記事は[『上位1%』シリーズ 全記事ガイド](/sitemap)の一部、[OpenShiftシリーズ](/sitemap#シリーズ一覧)の2本目です。

## 前提知識

- **OpenShift Local(旧CodeReady Containers、CRC)**: Red Hatが提供する、1台のPC上で動作する仮想マシンの中に、単一ノードのOpenShiftクラスタを構築するツールです。本番運用向けではなく、学習・検証を目的としています。

## ハンズオンの前提条件

- **ハードウェア要件**: CPU(仮想化支援機能が有効なこと)、メモリ16GB以上を推奨、ディスク空き容量35GB以上。
- **Red Hatアカウント**: OpenShift Localの利用には、無料のRed Hatアカウント登録と、そのアカウントで取得できる**プルシークレット**(コンテナイメージを取得するための認証情報)が必要です。

## Step 0: OpenShift Localのセットアップ

### アカウント登録とプルシークレットの取得

Red HatのDeveloperサイトで無料アカウントを作成し、OpenShift Localのダウンロードページから、自分の環境向けのプルシークレットをダウンロードしておきます。

### OpenShift Localのインストールとセットアップ

```bash
# ダウンロードした実行ファイルを展開後、PATHの通った場所へ配置してから
crc setup
```

`crc setup`は、OpenShift Localの動作に必要な仮想化環境の準備(ハイパーバイザーの確認、ネットワーク設定など)を行います。完了したら、クラスタを起動します。

```bash
crc start --pull-secret-file /path/to/pull-secret.txt
```

このコマンドは、実際に単一ノードのOpenShiftクラスタを、ローカルの仮想マシンとして起動します。初回は数分から十数分かかります。完了すると、クラスタへログインするための情報(URLと初期パスワード)が表示されます。

## Step 1: Webコンソールとoc CLIへのログイン

`crc start`完了後に表示されるURLへブラウザでアクセスすると、OpenShiftのWebコンソールにログインできます。あわせて、コマンドラインからの操作に使う`oc`(OpenShift CLI)でもログインしておきます。

```bash
# crc startの出力に表示されるコマンドをそのまま実行(例)
oc login -u developer -p developer https://api.crc.testing:6443
```

```bash
# 現在のログイン状態・接続先クラスタを確認
oc whoami
oc project
```

## Step 2: サンプルアプリケーションのデプロイ(Source-to-Image)

[OpenShiftとは何かを『上位1%』の視点で理解する](/articles/openshift-guide)で扱った<strong>Source-to-Image(S2I)</strong>の仕組みを、実際に体験します。ここでは、公開されているサンプルのNode.jsアプリケーションのリポジトリを例に使います。

```bash
# 作業用のProject(Namespace)を新規作成
oc new-project handson-demo

# Gitリポジトリを指定するだけで、ビルド用のコンテナイメージが自動選定され、
# ソースコードからアプリケーションのイメージがビルド・デプロイされる
oc new-app nodejs~https://github.com/sclorg/nodejs-ex.git --name=hello-node
```

`oc new-app`を実行すると、OpenShiftは指定したGitリポジトリの内容(この場合Node.jsアプリケーションであること)を検知し、対応するビルダーイメージを使って自動的にビルドを開始します。ビルドの進行状況は、次のコマンドで確認できます。

```bash
# ビルドの進行状況をリアルタイムで確認
oc logs -f bc/hello-node

# Podが実際に起動したかを確認
oc get pods
```

`STATUS`が`Running`になっているPodが見えれば、アプリケーションのデプロイは成功しています。

## Step 3: Routeでアプリケーションを外部公開する

デプロイしたアプリケーションは、既定ではクラスタの内部からしかアクセスできません。[OpenShiftとは何かを『上位1%』の視点で理解する](/articles/openshift-guide)で扱った**Route**を作成し、外部からアクセスできるようにします。

```bash
# Serviceに対してRouteを作成し、外部アクセス用のホスト名を割り当てる
oc expose service/hello-node

# 割り当てられたホスト名を確認
oc get route hello-node
```

表示されたホスト名へブラウザでアクセスすると、サンプルアプリケーションの画面が表示されます。**このRouteの作成が、[IISとASP.NETの仕組みを『上位1%』の視点で理解する](/articles/iis-fundamentals-guide)で扱ったバインド設定と同様に、ホスト名を基準に外部からのリクエストを特定のアプリケーションへ振り分けている**ことを確認してみてください。

## Step 4: スケール(複製数の変更)を体験する

Kubernetes・OpenShiftの中核的な特徴である、**Deploymentによる宣言的な複製数の管理**を体験します。

```bash
# 現在のPod数を確認(通常は1)
oc get pods

# 複製数を3に変更する
oc scale deployment/hello-node --replicas=3

# 数秒後、Podが3つに増えていることを確認
oc get pods
```

**指定した複製数(3)に対して、実際のPod数が自動的に一致するよう調整される**という挙動が確認できます。試しに、いずれかのPodを手動で削除してみましょう。

```bash
# Pod名を確認してから、いずれか1つを削除
oc delete pod <Pod名>

# 少し待ってから再度確認すると、新しいPodが自動的に1つ補充され、
# 常に3つの状態が維持されていることが分かる
oc get pods
```

**この「宣言した状態を、実際の状態が常に一致するよう自動的に維持する」という挙動こそが、Kubernetes・OpenShiftの中核的な設計思想**です。

## Step 5: 後片付け

検証が終わったら、作成したProjectを削除し、クラスタ自体も停止・削除しておきます。

```bash
# 作成したProjectを削除(中のリソースもまとめて削除される)
oc delete project handson-demo

# クラスタを停止する(次回crc startで再開できる)
crc stop

# クラスタを完全に削除する場合
crc delete
```

## よくあるエラーとその対処

- **`crc start`が、仮想化支援機能に関するエラーで失敗する**: BIOS/UEFIの設定で、CPUの仮想化支援機能(Intel VT-x、AMD-V)が有効になっているかを確認します。
- **プルシークレットの形式エラー**: ダウンロードしたプルシークレットのファイルが、余分な改行や引用符を含んでいないかを確認します。
- **`oc new-app`のビルドが失敗する**: `oc logs -f bc/<ビルド名>`でビルドログを確認し、ネットワーク到達性(Gitリポジトリへのアクセスや、ビルダーイメージの取得先への到達性)に問題がないかを確認します。

## まとめ

- OpenShift Localを使うことで、1台のPC上に単一ノードのOpenShiftクラスタを構築し、学習・検証を行えます。
- `oc new-app`とGitリポジトリの指定だけで、Source-to-Imageの仕組みによりソースコードから自動的にコンテナイメージがビルド・デプロイされます。
- Routeを作成することで、デプロイしたアプリケーションをホスト名ベースで外部公開できます。
- `oc scale`によるレプリカ数の変更と、Podを手動削除した際の自動補充を通じて、宣言的な状態管理というKubernetes・OpenShiftの中核的な設計思想を体感できます。

**今日から意識すべきこと**
1. `oc get pods`などの状態確認コマンドを、操作の前後で必ず実行し、変化を目で確認する習慣をつけましょう。
2. Podを手動で削除しても新しいPodが自動的に補充される挙動を通じて、宣言的な状態管理の考え方を体感しておきましょう。

## 参考文献

- [Red Hat OpenShift Local | Red Hat Developer](https://developers.redhat.com/products/openshift-local/overview)
- [Understanding builds | Red Hat OpenShift Documentation](https://docs.openshift.com/container-platform/latest/cicd/builds/understanding-image-builds.html)
- [Configuring Routes | Red Hat OpenShift Documentation](https://docs.openshift.com/container-platform/latest/networking/routes/route-configuration.html)
