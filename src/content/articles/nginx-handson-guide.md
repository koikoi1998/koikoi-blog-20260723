---
title: "Nginxで独自の仮想ホストとリバースプロキシを構築する『上位1%』のハンズオン"
description: "Nginxのデフォルトページを卒業し、独自ドメイン用のserverブロックを作成し、簡単なバックエンドアプリケーションへのリバースプロキシを構築する。sites-available/sites-enabledの使い方、nginx -tによる構文チェック、nginx -s reloadによる無停止反映までを、実際に手を動かして体験するハンズオン。"
series: "linux"
subSeries: "handson"
order: 17
tags: ["linux", "nginx", "web", "infra", "handson"]
emoji: "🌐"
pubDate: 2026-09-27
---

## はじめに

- **この記事で得られること**: [Nginxの仕組みを『上位1%』の視点で理解する](/articles/nginx-fundamentals-guide)で扱った知識を使い、Nginxのデフォルトページのままではなく、**独自のserverブロック(仮想ホスト)を作成**し、簡単なバックエンドアプリケーションへの**リバースプロキシ**を実際に構築します。
- **対象読者**: `apt install nginx`はしたことがあるが、独自の設定ファイルを自分で作成したことがなく、`proxy_pass`を実際に使ったことがない方を想定しています。
- **読むのにかかる想定時間**: 約20分(実際に構築しながら進める場合は35分程度を見込んでください)

この記事は[『上位1%』シリーズ 全記事ガイド](/sitemap)の一部、[Linux/OS基礎シリーズ](/sitemap#シリーズ一覧)の17本目です。

## 前提知識

- [Nginxの仕組みを『上位1%』の視点で理解する](/articles/nginx-fundamentals-guide): master/workerプロセス、`server`ブロック、`proxy_pass`の考え方が、この記事の前提になっています。

## 全体像をつかむ

このハンズオンで行うことは、次の4ステップです。

```mermaid
graph LR
    Step1["Step1<br/>簡単なバックエンドアプリを起動"]
    Step2["Step2<br/>独自のserverブロックを作成"]
    Step3["Step3<br/>構文チェックして反映"]
    Step4["Step4<br/>静的ページとAPIの<br/>両方を確認"]
    Step1 --> Step2 --> Step3 --> Step4
```

## ハンズオン手順

### Step 1: 簡単なバックエンドアプリケーションを起動する

`proxy_pass`の転送先として、Pythonの標準ライブラリだけで動く、簡単なHTTPサーバーを起動しておきます。

```bash
mkdir -p ~/backend-app && cd ~/backend-app
echo '{"message": "Hello from the backend app"}' > response.json
python3 -m http.server 3000
```

**このアプリケーションを、別のターミナル(または`screen`・`tmux`のセッション)で動かしたままにしておいてください。** 以降の手順は、元のターミナルで続けます。

### Step 2: 独自のserverブロックを作成する

Nginxをまだインストールしていなければインストールし、`sites-available`配下に、新しい設定ファイルを作成します。

```bash
sudo apt update
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/lab-app
```

```nginx
server {
    listen 80;
    server_name lab.example.test;

    location / {
        root /var/www/html;
        index index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
    }
}
```

**`root /var/www/html`が静的ファイルの配信、`proxy_pass http://127.0.0.1:3000/`がStep 1で起動したバックエンドアプリへの転送です。** 1つの`server`ブロックの中に、2つの異なる役割の`location`が共存しています。

続けて、この設定ファイルを`sites-enabled`へシンボリックリンクします。

```bash
sudo ln -s /etc/nginx/sites-available/lab-app /etc/nginx/sites-enabled/
```

### Step 3: 構文チェックしてから反映する

設定を反映する前に、必ず構文チェックを行います。

```bash
sudo nginx -t
```

**`syntax is ok`・`test is successful`と表示されれば成功です。** ここでエラーが出た場合、Nginx自体の再起動・reloadを実行してはいけません。エラーメッセージに表示されているファイル名と行番号を頼りに、設定ファイルを修正してください。構文チェックが通ったら、無停止で設定を反映します。

```bash
sudo nginx -s reload
```

### Step 4: 静的ページとAPIの両方を確認する

まず、静的ファイルを`root`で指定したディレクトリに配置します。

```bash
echo "<h1>Hello from Nginx static file</h1>" | sudo tee /var/www/html/index.html
```

`curl`で、トップページとAPIの両方にアクセスして、それぞれ異なる処理経路を通っていることを確認します。

```bash
curl http://localhost/
curl http://localhost/api/response.json
```

**1つ目のコマンドは、Nginx自身が`/var/www/html/index.html`を直接返しています。** **2つ目のコマンドは、Nginxがリクエストをそのままバックエンドアプリ(3000番ポート)へ転送し、そこからの応答をそのまま返しています。** 同じNginxの、同じ80番ポートへのリクエストが、`location`の設定に応じて、まったく異なる2つの処理経路に振り分けられていることを、実際に確認できました。

## プロが見ている視点(上位1%の理解)

### locationブロックのマッチング順序という、実務で頻出する落とし穴

このハンズオンでは`location /`と`location /api/`という、単純な前方一致のパターンだけを使いましたが、実務では正規表現を使った`location`や、複数の`location`が同時にマッチしうる、より複雑な設定に遭遇します。**Nginxは、複数の`location`が同時にマッチする場合、単純に設定ファイルに書かれた順番ではなく、「より長く、より具体的にマッチするパターン」を優先する**という規則で、どの`location`を適用するかを決定します。この規則を正確に把握していないと、「`/api/`向けの設定を書いたはずなのに、なぜか`/`の設定が適用されている」という、実務でよくあるトラブルの原因を特定できません。

### なぜバックエンドアプリを直接インターネットに公開しないのか

Step 1で起動したバックエンドアプリは、`127.0.0.1`(ローカルホスト)にしかバインドしておらず、外部から直接アクセスすることはできません。**Nginxだけを外部に公開し、実際にアプリケーションロジックを実行するバックエンドは、あくまでNginxからの転送でしか到達できない状態にしておく**、というこの構成は、実務における非常に一般的なパターンです。Nginxという1つの受付窓口に、TLS終端・静的ファイルのキャッシュ・レートリミットといった処理を集約させ、バックエンドのアプリケーションサーバーは、そうした処理を気にせずビジネスロジックだけに集中できる、という役割分担が実現されています。

## よくある誤解・つまずきポイント

- **誤解1: 「`sites-available`に設定ファイルを置いただけで、その設定は有効になる」**
  `sites-enabled`へのシンボリックリンクを作成しない限り、Nginxはその設定ファイルを読み込みません。
- **誤解2: 「`nginx -t`でエラーが出ても、とりあえず`reload`すれば直ることがある」**
  構文エラーがある状態で`reload`を実行すると、失敗するか、最悪の場合、古い設定のままworkerプロセスが動き続けます。必ず`nginx -t`が成功してから`reload`してください。
- **誤解3: 「複数のlocationがマッチする場合、設定ファイルに書いた順番で適用される」**
  Nginxは、より長く具体的にマッチするパターンを優先するという、独自の規則で適用順序を決定します。

## 障害・トラブルシューティングの視点

1. **`curl http://localhost/api/response.json`が失敗する**: Step 1のバックエンドアプリ(`python3 -m http.server 3000`)が、実際にまだ起動しているかを確認してください。
2. **設定ファイルを作成したのに反映されない**: `sites-enabled`へのシンボリックリンクが作成されているか、`ls -la /etc/nginx/sites-enabled/`で確認してください。
3. **`nginx -t`で構文エラーになる**: エラーメッセージに表示されているファイル名・行番号を確認し、`{}`の対応やセミコロンの付け忘れがないかを確認してください。

## まとめ

- `sites-available`に設定ファイルを置き、`sites-enabled`へシンボリックリンクを作成することで、設定を有効化します。
- `nginx -t`で構文チェックしてから、`nginx -s reload`で無停止に設定を反映するのが正しい手順です。
- 1つの`server`ブロックの中に、静的ファイル配信の`location`と、`proxy_pass`によるリバースプロキシの`location`を共存させられます。
- Nginxは、複数のlocationがマッチする場合、より長く具体的にマッチするパターンを優先します。

**今日から意識すべきこと**
1. 設定ファイルを変更したら、`nginx -t`→`nginx -s reload`の順序を必ず守りましょう。
2. バックエンドアプリケーションは、Nginxからしか到達できない状態(ローカルホストへのバインドなど)にしておく設計を基本にしましょう。

## 参考文献

- [Nginx: How nginx processes a request](https://nginx.org/en/docs/http/request_processing.html)
- [Nginx: ngx_http_core_module (location)](https://nginx.org/en/docs/http/ngx_http_core_module.html#location)
