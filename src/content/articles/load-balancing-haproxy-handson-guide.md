---
title: "HAProxyでL7ロードバランサーを構築し、複数のバックエンドサーバーへ振り分ける『上位1%』のハンズオン"
description: "OSSのロードバランサーソフトウェアHAProxyを使い、2台のバックエンドWebサーバーへリクエストを振り分けるL7ロードバランサーを実際に構築する。ラウンドロビンと最小接続数アルゴリズムの振る舞いの違い、ヘルスチェックによる異常サーバーの自動切り離し、statsページでの稼働状況の確認までを、自分の手で体験するハンズオン。"
series: "load-balancing"
subSeries: "handson"
order: 4
tags: ["load-balancing", "haproxy", "handson", "linux", "infra"]
emoji: "⚙️"
pubDate: 2026-10-03
---

## はじめに

- **この記事で得られること**: [L4/L7の違い](/articles/load-balancing-fundamentals-guide)と[アルゴリズム・ヘルスチェックの仕組み](/articles/load-balancing-algorithms-guide)で学んだ知識を、**OSSのロードバランサーソフトウェアHAProxyを使い、実際に2台のバックエンドWebサーバーへ振り分けるL7ロードバランサーを構築する**ことで検証します。ラウンドロビンと最小接続数の振る舞いの違い、ヘルスチェックによる異常サーバーの自動切り離しを、自分の目で確認します。
- **対象読者**: ロードバランシングの座学は理解したものの、実際にロードバランサーを構築・設定した経験がなく、まず手を動かして動作を確認しておきたい方を想定しています。
- **読むのにかかる想定時間**: 約25分(ハンズオン実施込み)

この記事は[『上位1%』シリーズ 全記事ガイド](/sitemap)の一部、[ロードバランシング基礎シリーズ](/sitemap#シリーズ一覧)の4本目です。[ハンズオン準備マニュアル](/articles/handson-prep-guide)で作成したUbuntu Server環境が3台あれば実施できます(ロードバランサー用に1台、バックエンド用に2台)。

## 前提知識

- **L4/L7ロードバランサーの違い**: [ロードバランサーのL4とL7の違い](/articles/load-balancing-fundamentals-guide)を先に読んでおいてください。
- **アルゴリズムとヘルスチェック**: [ロードバランシングのアルゴリズムとヘルスチェック](/articles/load-balancing-algorithms-guide)を先に読んでおいてください。

## 全体像をつかむ

このハンズオンで行うことは、次の4ステップです。

```mermaid
graph LR
    Step1["Step1<br/>バックエンド2台に<br/>簡易Webサーバーを起動"]
    Step2["Step2<br/>HAProxyをインストールし<br/>L7ロードバランサーを構築"]
    Step3["Step3<br/>ラウンドロビンの<br/>振り分けを確認"]
    Step4["Step4<br/>ヘルスチェックによる<br/>自動切り離しを確認"]
    Step1 --> Step2 --> Step3 --> Step4
```

## ハンズオン手順

### Step 1: バックエンドサーバー2台に、簡易Webサーバーを起動する

2台目・3台目のUbuntu Serverに、それぞれ自分がどちらのサーバーかを判別できる、簡易的なHTTPサーバーを起動します。Pythonの標準ライブラリだけで、十分な動作確認ができます。

**バックエンド1台目(例: `10.0.0.11`)で実行:**

```bash
mkdir -p /tmp/web && echo "Response from Backend-1" > /tmp/web/index.html
cd /tmp/web && python3 -m http.server 8080
```

**バックエンド2台目(例: `10.0.0.12`)で実行:**

```bash
mkdir -p /tmp/web && echo "Response from Backend-2" > /tmp/web/index.html
cd /tmp/web && python3 -m http.server 8080
```

**それぞれのサーバーが、自分自身の名前を含むレスポンスを返すようにしている**のは、後の手順で「どちらのバックエンドが応答したか」を、レスポンスの内容だけで一目で判別できるようにするためです。

### Step 2: HAProxyをインストールし、L7ロードバランサーを構築する

3台目のUbuntu Server(ロードバランサー役)に、HAProxyをインストールします。

```bash
sudo apt update
sudo apt install -y haproxy
```

`/etc/haproxy/haproxy.cfg`の末尾に、次の設定を追記します(`10.0.0.11`・`10.0.0.12`は、Step 1で用意したバックエンドサーバーのIPアドレスに置き換えてください)。

```
frontend http_front
    bind *:80
    default_backend http_back

backend http_back
    balance roundrobin
    option httpchk GET /
    http-check expect status 200
    server backend1 10.0.0.11:8080 check
    server backend2 10.0.0.12:8080 check
```

**この設定の各行が担っている役割**を整理しておきます。

| 設定項目 | 役割 |
|---|---|
| `frontend http_front` | クライアントからの接続を受け付ける窓口の定義。`bind *:80`で、全インターフェースの80番ポートで待ち受けます。 |
| `default_backend http_back` | この窓口に届いたリクエストを、どのバックエンド集合へ渡すかの指定です。 |
| `balance roundrobin` | [前の記事](/articles/load-balancing-algorithms-guide)で扱ったラウンドロビンアルゴリズムを指定しています。 |
| `option httpchk` / `http-check expect` | アクティブヘルスチェックの設定です。各サーバーへHTTP GETリクエストを送り、ステータスコード200が返ってくるかを確認します。 |
| `server backend1 ... check` | 振り分け先のバックエンドサーバーの定義です。末尾の`check`が、このサーバーをヘルスチェックの対象にする指定です。 |

設定を反映させます。

```bash
sudo systemctl restart haproxy
sudo systemctl status haproxy
```

<details>
<summary>なぜ「balance roundrobin」をあえて明示しているのか</summary>

実はHAProxyの`balance`ディレクティブを省略すると、デフォルトでラウンドロビンが使われます。**しかし、このハンズオンでは、[前の記事](/articles/load-balancing-algorithms-guide)で扱ったアルゴリズムの違いを、実際に設定を書き換えて体感してもらうことを目的としているため、意図的に明示しています。** 実務でも、デフォルト値に依存するのではなく、採用しているアルゴリズムを設定ファイル上で明示しておくことで、将来この設定を読む人(自分自身を含む)が、暗黙の挙動を推測する必要がなくなります。

</details>

### Step 3: ラウンドロビンの振り分けを確認する

ロードバランサー(3台目のサーバー)自身から、繰り返しアクセスして、レスポンスが交互に切り替わる様子を確認します。

```bash
for i in {1..6}; do curl -s http://localhost/; done
```

**実行結果:**

```
Response from Backend-1
Response from Backend-2
Response from Backend-1
Response from Backend-2
Response from Backend-1
Response from Backend-2
```

ラウンドロビンの設定どおり、2台のバックエンドサーバーへ、交互に、均等にリクエストが振り分けられていることが確認できました。設定を`balance leastconn`(最小接続数)に変更して`systemctl restart haproxy`を実行し、同じコマンドを試すと、少なくとも今回のような単純な検証では、やはり交互に振り分けられる結果になります。**これは、最小接続数アルゴリズムが「異常ではない」ことの確認にすぎません。** [前の記事](/articles/load-balancing-algorithms-guide)で扱った最小接続数アルゴリズムの本当の価値は、片方のバックエンドの処理に時間がかかっている(接続が多く残っている)場合に、もう一方へ優先的に振り分ける点にあります。興味があれば、`time.sleep()`を仕込んだ重いレスポンスを返すバックエンドを1台用意し、挙動の違いを確認してみてください。

### Step 4: ヘルスチェックによる自動切り離しを確認する

バックエンド1台目を停止し、ヘルスチェックによって、ロードバランサーが自動的にそのサーバーへの振り分けを止める様子を確認します。

バックエンド1台目で、`Ctrl+C`でPythonのHTTPサーバーを停止します。

ロードバランサーから、HAProxyの管理ログを確認します。

```bash
sudo tail -f /var/log/haproxy.log
```

数秒後(デフォルトのヘルスチェック間隔が経過した後)、次のようなログが出力されます。

```
Server http_back/backend1 is DOWN, reason: Layer4 connection problem...
```

再度、繰り返しアクセスを試みます。

```bash
for i in {1..4}; do curl -s http://localhost/; done
```

**実行結果:**

```
Response from Backend-2
Response from Backend-2
Response from Backend-2
Response from Backend-2
```

バックエンド1台目が停止しているにもかかわらず、**エラーにはならず、正常なバックエンド2台目へすべてのリクエストが振り分けられる**ことが確認できました。これが、[ヘルスチェックの仕組み](/articles/load-balancing-algorithms-guide)が実際に機能している様子です。停止したバックエンド1台目を再起動すると、再び振り分け対象として復帰することも確認してみてください。

## プロが見ている視点(上位1%の理解)

### 「エラーが出ない」ことこそが、ヘルスチェックの成果である

Step 4で確認した「バックエンドを1台落としても、クライアント側にはエラーが一切見えない」という結果こそが、ヘルスチェックが正しく機能している証拠です。**ヘルスチェックが機能していない構成では、クライアントのリクエストが、停止しているバックエンドへそのまま送られてしまい、接続タイムアウトやエラーがクライアントに直接返ってしまいます。** 障害が起きてもサービスが継続する、という当たり前に見える結果の裏側に、ヘルスチェックという具体的な仕組みが存在していることを、この手順を通じて体感してもらうことが、このハンズオンの狙いです。

## よくある誤解・つまずきポイント

- **誤解1: 「balanceディレクティブを省略すると、振り分けが一切行われない」**
  省略した場合のデフォルトはラウンドロビンです。振り分け自体は行われますが、アルゴリズムを明示しないと、設定を読む人に意図が伝わりません。
- **誤解2: 「ヘルスチェックに失敗したら、即座にサーバーが切り離される」**
  HAProxyのデフォルトでは、連続して複数回失敗しないと「異常」と判定されません([前の記事](/articles/load-balancing-algorithms-guide)で扱ったFallスレッショルドの考え方です)。
- **誤解3: 「最小接続数アルゴリズムは、ラウンドロビンと全く違う挙動を常に示す」**
  各リクエストの処理時間がほぼ均一な場合、最小接続数もラウンドロビンとほぼ同じ結果になります。違いが現れるのは、処理時間に差があるときです。

## 障害・トラブルシューティングの視点

1. **`systemctl restart haproxy`が失敗する**: `sudo haproxy -c -f /etc/haproxy/haproxy.cfg`で、設定ファイルの構文エラーを確認できます。
2. **バックエンドへの振り分けが一切発生しない**: `server`行のIPアドレスとポート番号が、Step 1で起動したPythonのHTTPサーバーと一致しているかを確認します。
3. **バックエンドを停止してもログに「DOWN」と出ない**: ヘルスチェックの間隔(デフォルトでは数秒)が経過するまで待ちます。即座に反映されるわけではありません。

## まとめ

- HAProxyは、設定ファイル1つで、L7ロードバランサーのfrontend(受付窓口)とbackend(振り分け先集合)を定義できるOSSソフトウェアです。
- `balance roundrobin`・`balance leastconn`といったディレクティブで、振り分けアルゴリズムを明示的に選択できます。
- `option httpchk`によるアクティブヘルスチェックが、バックエンドの異常を検知し、クライアントにエラーを見せることなく、自動的に振り分け対象から除外します。

**今日から意識すべきこと**
1. ロードバランサーの設定を書くときは、アルゴリズムをデフォルトのまま省略せず、明示する習慣をつけましょう。
2. バックエンドサーバーを停止・再起動する運用(メンテナンス時など)の前に、ヘルスチェックが正しく機能するかを事前に確認する習慣をつけましょう。

## 参考文献

- [HAProxy Configuration Manual](https://docs.haproxy.org/)
- [HAProxy Health Check Documentation](https://www.haproxy.org/#docs)
