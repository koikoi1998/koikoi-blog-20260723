---
title: "BINDでDNSサーバーを構築し、ゾーン転送を体験する『上位1%』のハンズオン"
description: "BINDを使い、マスターDNSサーバーでゾーンを作成し、スレーブDNSサーバーへゾーン転送が実際に発生する様子をdigコマンドとログで確認する。あえてシリアル番号を上げずに変更し、スレーブに反映されないことを自分の目で確認したうえで、正しい手順で反映させるところまでを体験するハンズオン。"
series: "dns"
order: 2
tags: ["dns", "bind", "handson", "linux", "infra"]
emoji: "🌐"
pubDate: 2026-09-25
---

## はじめに

- **この記事で得られること**: [DNSサーバーの基礎](/articles/dns-server-fundamentals-guide)で学んだゾーンファイル・SOAレコード・マスター/スレーブ構成の知識を、**実際に2台のBINDサーバーを構築し、ゾーン転送が発生する様子、そしてシリアル番号を上げ忘れると反映されない様子を自分の目で確認する**ことで検証します。
- **対象読者**: DNSサーバーの構築・運用に実際に携わったことがなく、まず仮想マシン上でマスター/スレーブ構成を組んで動作を確認しておきたい方を想定しています。
- **読むのにかかる想定時間**: 約20分(ハンズオン実施込み)

この記事は[『上位1%』シリーズ 全記事ガイド](/sitemap)の一部、[DNSサーバー基礎シリーズ](/sitemap#シリーズ一覧)の2本目です。[ハンズオン準備マニュアル](/articles/handson-prep-guide)で作成したUbuntu Server環境が2台あれば実施できます(1台のVMを複製するか、新規に2台目を作成してください)。

## 前提知識

- **ゾーンファイル・SOAレコード・マスター/スレーブ構成**: [DNSサーバーの基礎](/articles/dns-server-fundamentals-guide)を先に読んでおいてください。

## 全体像をつかむ

このハンズオンで行うことは、次の4ステップです。

```mermaid
graph LR
    Step1["Step1<br/>マスターにゾーンを作成"]
    Step2["Step2<br/>スレーブを構築し<br/>ゾーン転送を確認"]
    Step3["Step3<br/>シリアル番号を上げずに変更し<br/>反映されないことを確認"]
    Step4["Step4<br/>正しい手順で<br/>反映させる"]
    Step1 --> Step2 --> Step3 --> Step4
```

## ハンズオン手順

### Step 1: マスターサーバーにゾーンを作成する

1台目のUbuntu ServerにBINDをインストールします。

```bash
sudo apt update
sudo apt install -y bind9 bind9utils dnsutils
```

**この3つのパッケージは、それぞれ役割が分かれています。** `bind9`がDNSサーバー本体(`named`デーモン)、`bind9utils`が`named-checkzone`や`rndc`といった管理用コマンド群、`dnsutils`が`dig`や`nslookup`といった問い合わせ用コマンド群です。サーバーとして動かすだけなら`bind9`だけで足りますが、構築・検証・トラブルシューティングには残り2つのパッケージのコマンドが不可欠なため、まとめてインストールしています。

<details>
<summary>なぜ「lab.example.test」という、聞き慣れないドメイン名を使っているのか</summary>

このハンズオンで使う`lab.example.test`は、AD環境で見かけるような内部ドメイン名の書き方とは、意図がまったく異なります。`.test`は、[RFC 2606](https://datatracker.ietf.org/doc/html/rfc2606)で「実際にインターネット上では絶対に登録されず、検証・ドキュメント用にいつでも安全に使ってよい」と正式に予約されているTLD(トップレベルドメイン)です(同様に予約されているものに`.example`・`.invalid`・`.localhost`があります)。検証環境でドメイン名を決めるとき、実在する可能性のある`.com`や`.local`を使ってしまうと、本物のインターネット上の名前空間と衝突するリスクがありますが、`.test`を使えばそのリスクが原理的にありません。

また、この記事でいう「ゾーン」と、AD DSでいう「ドメイン」は、似ているようで異なる概念です。**ドメインは名前空間そのものを指す概念であるのに対し、ゾーンは「そのDNSサーバーが実際に管理しているデータのまとまり」という、より実務寄りの単位です。** 多くの場合、1つのドメインに対して1つのゾーンファイルが対応しますが、大きな組織では、`example.com`というドメインの中の`dev.example.com`という部分だけを別のDNSサーバーに委任し、別のゾーンとして管理する、ということも行われます。「ドメイン=名前空間の設計」「ゾーン=それを実際に管理するデータの単位」と分けて理解しておくと、委任(delegation)のような、より発展的な話題にもつながります。

</details>

`/etc/bind/named.conf.local`に、新しいゾーンを追加します。

```bash
sudo nano /etc/bind/named.conf.local
```

```
zone "lab.example.test" {
    type master;
    file "/etc/bind/db.lab.example.test";
    allow-transfer { <スレーブサーバーのIPアドレス>; };
};
```

**`allow-transfer`で、ゾーン転送を許可する相手を明示的に指定している点がポイントです。** これを指定しないと、既定では原則すべての相手からのゾーン転送要求を許可してしまい、ゾーンデータの中身(社内のホスト名の一覧など)を誰でも取得できてしまいます。

<details>
<summary>named.confとnamed.conf.localは何が違うのか</summary>

BINDを起動すると、まず`/etc/bind/named.conf`が読み込まれますが、このファイル自体は空に近く、中身のほとんどは`include`文で他のファイルを読み込んでいるだけです。

```
include "/etc/bind/named.conf.options";
include "/etc/bind/named.conf.local";
include "/etc/bind/named.conf.default-zones";
```

`named.conf.options`はサーバー全体の動作オプション、`named.conf.default-zones`はUbuntuパッケージが最初から用意しているデフォルトのゾーン(ローカルホスト用など)、そして`named.conf.local`が、**管理者が自分で追加するゾーン定義を書くために、あらかじめ空けておかれているファイル**です。ゾーンの追加を`named.conf`本体に直接書き込むこともできてしまいますが、そうすると将来のBINDパッケージ更新で`named.conf`自体が上書きされた際に、自分で書いた設定が失われるリスクがあります。`named.conf.local`という、パッケージが手を触れない場所に管理者の変更を隔離しておくことで、この事故を防いでいます。

</details>

続けて、ゾーンファイル`/etc/bind/db.lab.example.test`を作成します。

```bash
sudo nano /etc/bind/db.lab.example.test
```

```
$TTL 86400
@   IN  SOA   ns1.lab.example.test. admin.lab.example.test. (
                2026092501  ; シリアル番号
                3600        ; リフレッシュ
                900         ; リトライ
                604800      ; 有効期限
                86400 )     ; ネガティブキャッシュTTL
@       IN  NS      ns1.lab.example.test.
@       IN  NS      ns2.lab.example.test.
ns1     IN  A       <マスター自身のIPアドレス>
ns2     IN  A       <スレーブサーバーのIPアドレス>
www     IN  A       10.0.20.100
```

SOAレコードより下の行についても、内容を確認しておきましょう。

- **`$TTL 86400`**: このゾーン内の、個々のレコードの既定のTTL(キャッシュしてよい時間、秒単位)です。個々のレコードで明示的に指定しない場合、このデフォルト値が使われます。
- **`@`**: このゾーンファイルが管理しているゾーン自身(ここでは`lab.example.test`)を指す、省略記法です。`named.conf.local`の`zone "lab.example.test"`という宣言と対応しています。
- **`@  IN  NS  ns1.lab.example.test.`**: 「`lab.example.test`というゾーンの権威サーバーの1つは`ns1.lab.example.test`である」という宣言です。同様に2行目で`ns2`も権威サーバーとして宣言しています。
- **`ns1  IN  A  <マスター自身のIPアドレス>`**: `ns1.lab.example.test`という名前を、実際のIPアドレスに変換するAレコードです。NSレコードで名前を宣言しただけでは、その名前がどのIPアドレスを指すのかはまだ分かりません。この行(グルーレコードとも呼ばれます)があって初めて、NSレコードの名前が実際に解決可能になります。
- **`www  IN  A  10.0.20.100`**: このゾーンが実際に公開したい、任意のホスト名のAレコードです。

構文チェックを行ってから、BINDを再起動します。

```bash
sudo named-checkzone lab.example.test /etc/bind/db.lab.example.test
sudo systemctl restart bind9
```

**`named-checkzone`は、実際にはBINDの本体(`named`)が使っているのと同じゾーンファイルの構文解析ロジックを、単体のコマンドとして切り出したものです。** 1つ目の引数(`lab.example.test`)はチェック対象のゾーン名、2つ目の引数(`/etc/bind/db.lab.example.test`)はそのゾーンファイルの実際のパスです。BINDを再起動する前にこのコマンドで検証しておくことで、「構文エラーのあるゾーンファイルを読み込もうとして、BIND自体が起動に失敗する」という事態を未然に防げます。

`dig`コマンドで、マスター自身に問い合わせて動作を確認します。`dig`の使い方そのものを詳しく知りたい場合は、[digコマンドの使い方を『上位1%』の視点で理解する](/articles/dig-nslookup-guide)を参照してください。

```bash
dig @localhost www.lab.example.test A
```

`ANSWER SECTION`に`10.0.20.100`が表示されれば成功です。

### Step 2: スレーブサーバーを構築し、ゾーン転送を確認する

2台目のUbuntu ServerにもBINDをインストールし、`/etc/bind/named.conf.local`に次のように追加します。

```bash
sudo apt update
sudo apt install -y bind9 bind9utils dnsutils
sudo nano /etc/bind/named.conf.local
```

```
zone "lab.example.test" {
    type slave;
    file "/var/cache/bind/db.lab.example.test";
    masters { <マスターサーバーのIPアドレス>; };
};
```

**スレーブ側は、自分でゾーンファイルの中身を書くのではなく、マスターから転送されたデータを保存する場所(`file`)を指定するだけ**である点に注目してください。BINDを再起動します。

```bash
sudo systemctl restart bind9
```

ゾーン転送が成功していれば、`/var/cache/bind/`に`db.lab.example.test`というファイルが自動的に作成されているはずです。

```bash
sudo ls -la /var/cache/bind/
sudo journalctl -u bind9 | grep transfer
```

ログに`transfer of 'lab.example.test/IN' from <マスターのIP>#53: Transfer status: success`のような記録があれば、ゾーン転送は成功しています。**環境によっては、このgrepで何も表示されないことがありますが、その場合の原因と確認方法は、この記事末尾のFAQを参照してください。** 最も確実な確認方法は、次のようにスレーブ自身に対して`dig`で問い合わせ、マスターと同じ結果が返ってくることです。

```bash
dig @localhost www.lab.example.test A
```

### Step 3: シリアル番号を上げずに変更し、反映されないことを確認する

ここが、このハンズオンで最も体感してほしい部分です。マスター側のゾーンファイルを編集し、`www`のIPアドレスを変更しますが、**あえてシリアル番号は上げません。**

```bash
sudo nano /etc/bind/db.lab.example.test
```

```
www     IN  A       10.0.20.200
```

```bash
sudo named-checkzone lab.example.test /etc/bind/db.lab.example.test
sudo systemctl restart bind9
```

マスターへ問い合わせると、新しい値がすぐに反映されます。

```bash
dig @<マスターのIP> www.lab.example.test A   # 10.0.20.200が返る
```

しかし、**スレーブへ問い合わせると、古い値のままのはずです。**

```bash
dig @<スレーブのIP> www.lab.example.test A   # 依然として10.0.20.100のまま
```

[DNSサーバーの基礎](/articles/dns-server-fundamentals-guide)で説明した通り、スレーブはシリアル番号を基準に「更新の有無」を判断しています。シリアル番号が変わっていないため、スレーブは「マスター側に更新はない」と判断し、ゾーン転送を要求しません。**この「知識としては知っていたはずなのに、実際に古い値が返ってくる」という体験こそが、このハンズオンの核心です。**

### Step 4: シリアル番号を正しく上げて、反映させる

マスターのゾーンファイルで、シリアル番号だけを増やします。

```bash
sudo nano /etc/bind/db.lab.example.test
```

```
2026092502  ; シリアル番号を1つ増やす
```

```bash
sudo named-checkzone lab.example.test /etc/bind/db.lab.example.test
sudo systemctl restart bind9
```

スレーブへ再度問い合わせます。**リフレッシュ間隔(3600秒)を待たなくても、多くの場合すぐに新しい値が返ってきます。** その理由は、この記事の「プロが見ている視点」で扱います。もし待っても反映されない場合は、スレーブ側で`sudo rndc retransfer lab.example.test`を実行すると、即座にゾーン転送を強制できます。

```bash
dig @<スレーブのIP> www.lab.example.test A   # 10.0.20.200に更新されているはず
```

新しい値が返ってくれば成功です。**シリアル番号という、たった1つの数値を変え忘れただけで複製が止まり、正しく増やすだけで複製が再開する**、という一連の流れを、自分の手で確認できました。

<details>
<summary>ステップアップ:生のDNSクエリをPythonで手作りしてみる</summary>

余力があれば、`dig`を使わず、Pythonの`socket`モジュールでUDPポート53番へ生のDNSクエリを直接送ってみてください。DNSメッセージの先頭12バイトは固定長のヘッダーで構成されており、`struct`モジュールを使えば手作りできます。[自分の手でHTTPサーバーを書いてみるハンズオン](/articles/minimal-http-server-handson-guide)で体感した「プロトコルは結局、決まった書式のバイト列に過ぎない」という感覚を、DNSでも味わうことができます。

</details>

## プロが見ている視点(上位1%の理解)

### 「知識として知っている」と「実際に体で覚えている」の差

Step 3で体験した「シリアル番号を上げ忘れると、スレーブには反映されない」という現象は、[DNSサーバーの基礎](/articles/dns-server-fundamentals-guide)を読んだだけでも知識としては知っていたはずです。しかし、**実際に自分の手で再現し、`dig`の結果が食い違う瞬間を目で見る**ことで、この知識は初めて「実務でとっさに疑える」レベルの理解に変わります。「マスターとスレーブで応答が違う」という障害に将来遭遇したとき、このハンズオンの経験が、シリアル番号を疑うという最初の一手を、迷いなく選べるようにしてくれます。

### なぜStep 4では、リフレッシュ間隔(3600秒)を待たずにすぐ反映されたのか

Step 4で体験した通り、シリアル番号を正しく上げると、スレーブは3600秒のリフレッシュ間隔を律儀に待つことなく、ほぼ即座に新しい値を返しました。これは偶然ではなく、**NOTIFY**という仕組みが既定で有効になっているためです。

BINDは、マスター側でゾーンがリロードされ、シリアル番号が変化したことを検知すると、`allow-transfer`で許可されているスレーブに対して、「このゾーンに更新がありました」という通知(NOTIFYメッセージ、[RFC 1996](https://datatracker.ietf.org/doc/html/rfc1996))を能動的に送信します。スレーブはこのNOTIFYを受け取ると、リフレッシュ間隔を待たずに、その場でゾーン転送を要求します。**つまり、リフレッシュ間隔というのは、あくまで「NOTIFYが何らかの理由(ネットワーク断など)で届かなかった場合の、保険としてのポーリング間隔」であり、実務での通常運用は、ほとんどの場合このNOTIFYによって即座に同期される**のです。この仕組みを知らないと、「リフレッシュ間隔は3600秒のはずなのに、なぜすぐ反映されたのか」という、一見矛盾した挙動に戸惑うことになります。

## よくある誤解・つまずきポイント

- **誤解1: 「スレーブサーバーにも、マスターと同じゾーンファイルの中身を手動で書く必要がある」**
  スレーブは自分でゾーンファイルの中身を書く必要はなく、`file`にはマスターから転送されたデータの保存先を指定するだけです。
- **誤解2: 「ゾーン転送は、`allow-transfer`を設定しなくても安全に制限されている」**
  `allow-transfer`を明示的に指定しないと、既定では広く許可されてしまう可能性があり、ゾーンデータが誰でも取得できる状態になりかねません。
- **誤解3: 「シリアル番号を正しく上げても、リフレッシュ間隔である3600秒待たないと反映されない」**
  実際には、NOTIFYという仕組みによって、マスターの更新がほぼ即座にスレーブへ伝わります。リフレッシュ間隔は、NOTIFYが届かなかった場合の保険としてのポーリング間隔です。

<details>
<summary>編集したいファイルのパスを忘れてしまったときは</summary>

このハンズオンでは、編集するファイルのパスを毎回明示していますが、実務ではメモを見返さずに「あのファイルはどこだったか」を自力で探し出す場面が頻繁にあります。ファイル名やディレクトリ名から、そこに何が格納されていそうかを予想し、`find`コマンドで実際に探し当てる方法は、[findコマンドでファイル・ディレクトリを自力で探し当てる『上位1%』のハンズオン](/articles/linux-find-guide)で扱っています。また、`/var/cache/bind/`のような`/var`配下のディレクトリの位置づけについては、[Linuxのディレクトリ構造](/articles/linux-filesystem-hierarchy-guide)で詳しく解説しています。

</details>

## 障害・トラブルシューティングの視点

1. **スレーブでゾーン転送が発生しない**: マスター側の`allow-transfer`に、スレーブのIPアドレスが正しく指定されているかを確認します。ファイアウォールでTCP 53番ポート(ゾーン転送はTCPを使います)がブロックされていないかも確認します。
2. **`named-checkzone`でエラーが出る**: ゾーンファイルの構文(セミコロンの位置、丸括弧の対応など)を確認します。特に、`unexpected end of line`や`unexpected end of input`のようなエラーは、コピー&ペースト時にゾーンファイルの先頭へ余計な記号(`]`など、ターミナルの表示を一緒にコピーしてしまった場合によく混入します)が紛れ込んでいないか、`cat -A <ゾーンファイル>`で不可視文字を含めて確認してください。
3. **スレーブの値が更新されない**: マスター側でシリアル番号を上げ忘れていないかを、まず疑います。

このハンズオンで実際に遭遇しやすいエラーへの、より詳しい対処法は、この記事末尾のFAQも参照してください。

### 予防策・恒久対策

- ゾーンファイルを変更する運用フローに、「シリアル番号を上げる」ことをチェックリストとして明示的に組み込む。
- `allow-transfer`を必ず明示的に設定し、意図しない相手へのゾーン転送を防ぐ。

## まとめ

- BINDのマスター/スレーブ構成は、マスター側に`type master`とゾーンファイル、スレーブ側に`type slave`と保存先の`file`、`masters`(転送元)を指定するだけで構築できます。
- ゾーン転送(AXFR/IXFR)は、スレーブがマスターのシリアル番号を確認し、自分より新しければ発生します。
- シリアル番号を上げ忘れると、実際にレコードを変更してもスレーブには反映されないことを、`dig`の結果の違いとして実際に確認できます。
- `allow-transfer`を明示的に設定し、意図しない相手へのゾーンデータの流出を防ぐことが実務上重要です。

**今日から意識すべきこと**
1. ゾーンファイルを変更したら、`dig`でマスター・スレーブ双方に問い合わせて、実際に反映されているかを確認する習慣をつけましょう。
2. マスター/スレーブ構成を組む際は、`allow-transfer`を必ず明示的に設定しましょう。

## 参考文献

- [BIND 9 Administrator Reference Manual](https://bind9.readthedocs.io/en/latest/)
- [dig(1) - Linux manual page](https://linux.die.net/man/1/dig)
