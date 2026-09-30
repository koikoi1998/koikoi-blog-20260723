---
title: "オープンリレーを自分の手で再現し、正しい制限設定で防御する『上位1%』のハンズオン"
description: "誰でも自由に中継できてしまう「オープンリレー」の状態を、検証環境で意図的に再現し、無関係な第三者宛のメールを、自分のサーバーが黙って転送してしまう様子を確認する。そしてsmtpd_relay_restrictionsを正しく設定することで、この危険な状態を防ぐ方法までを扱う、教育・防御目的のハンズオン。"
series: "messaging"
subSeries: "handson"
order: 10
tags: ["email", "postfix", "handson", "security"]
emoji: "🚧"
pubDate: 2026-09-30
---

## はじめに

- **この記事で得られること**: [メールサーバーの基礎](/articles/mail-server-fundamentals-guide)で扱ったMTAの役割を悪用され、誰でも自由に中継できてしまう**オープンリレー**という危険な状態を、検証環境の中で意図的に再現します。そのうえで、`smtpd_relay_restrictions`を正しく設定することで、この状態を防ぐ方法を確認します。
- **対象読者**: 「オープンリレーは危険だ」という知識はあるが、実際にどういう設定ミスがオープンリレーを生み出すのか、自分の手で確認したことがない方を想定しています。**このハンズオンは、自分が管理する検証環境の防御力を高めるための、教育・防御目的のものです。実運用中の他者の環境に対して、許可なくこの手順を実行しないでください。**
- **読むのにかかる想定時間**: 約30分

この記事は[『上位1%』シリーズ 全記事ガイド](/sitemap)の一部です。

## 前提知識

- **MTAとSMTPによる中継**: [メールサーバーの基礎](/articles/mail-server-fundamentals-guide)で扱った、MTA同士がSMTPでメールを転送し合う仕組みを前提とします。

## 全体像をつかむ

```mermaid
graph LR
    Attacker["第三者(悪意ある送信者)"]
    MyServer["自分のPostfixサーバー"]
    Victim["まったく無関係な、外部の宛先"]
    Attacker -->|"MAIL FROM: 詐称した送信者<br/>RCPT TO: 無関係な外部アドレス"| MyServer
    MyServer -.オープンリレー状態だと、<br/>そのまま中継してしまう.-> Victim
```

## ハンズオン手順

### Step 1: あえてオープンリレーの状態を作る

`/etc/postfix/main.cf`の`smtpd_relay_restrictions`を、意図的に緩い設定へ書き換えます。

```
smtpd_relay_restrictions = permit
```

```bash
sudo systemctl restart postfix
```

**`permit`は、「送信元やあて先の条件を一切確認せず、すべての中継要求を無条件に許可する」という設定です。** 通常、これほど緩い設定を意図的に行うことはありませんが、複雑な条件を積み重ねた結果、実質的にこれと同じ状態になってしまっている、という事故が実務では起こり得ます。

### Step 2: 無関係な外部ドメイン宛のメールを、中継させてみる

`mailtest.local`とは無関係な、外部の宛先へ向けたメールを、telnetで送信してみます。

```bash
telnet localhost 25
```

```
HELO attacker.example
MAIL FROM:<spoofed@somewhere-else.example>
RCPT TO:<victim@totally-unrelated-domain.example>
DATA
Subject: This should never be relayed

If this succeeds, your server is an open relay.
.
QUIT
```

**`250`が返ってきてしまえば、あなたのサーバーは、送信者・宛先のどちらとも一切関係のない、第三者間の通信を、無条件に中継してしまう状態にあります。** これが、実際のインターネット上で悪用されるオープンリレーの正体です。悪意ある送信者は、この状態のサーバーを踏み台にして、大量の迷惑メールやフィッシングメールを、自分の身元を隠したまま送信できてしまいます。

### Step 3: smtpd_relay_restrictionsを正しく設定し、防御する

`main.cf`を、正しい制限設定へ戻します。

```
smtpd_relay_restrictions =
    permit_mynetworks,
    permit_sasl_authenticated,
    reject_unauth_destination
```

```bash
sudo systemctl restart postfix
```

再度、Step 2とまったく同じ問い合わせを送信します。

```bash
telnet localhost 25
```

```
HELO attacker.example
MAIL FROM:<spoofed@somewhere-else.example>
RCPT TO:<victim@totally-unrelated-domain.example>
```

**今度は、`554 5.7.1 Relay access denied`のようなエラーが返り、中継が拒否されるはずです。**

## プロが見ている視点(上位1%の理解)

### `reject_unauth_destination`が、実質的な防御の中核である

Step 3の設定を1つずつ見ると、`permit_mynetworks`(信頼できる内部ネットワークからは許可)、`permit_sasl_authenticated`(認証済みユーザーからは許可)、`reject_unauth_destination`(それ以外は、自分が権威を持つドメイン宛以外を拒否)という3行で構成されています。**このうち、オープンリレー対策として実質的に機能しているのは、最後の`reject_unauth_destination`です。** 前の2つの`permit`行は、あくまで「正規の利用者を早期に許可する」ための最適化であり、**この3行の順序を守り、最後に`reject_unauth_destination`を置いておくことで、それ以外のすべての中継要求(信頼できるネットワークの外から、自分が管理していないドメイン宛)を、確実に拒否する**という設計になっています。

### なぜ「気づかないうちにオープンリレーになる」事故が起きるのか

実務でオープンリレーが発生する典型的なパターンは、**あえて`smtpd_relay_restrictions = permit`のような極端な設定を行うことではなく、`permit_mynetworks`の範囲を広げすぎてしまう**ことです。たとえば、社内ネットワークのIPアドレス範囲を`mynetworks`に登録する際、意図せず広すぎるCIDR表記(`0.0.0.0/0`に近いもの)を指定してしまうと、**実質的にインターネット上のすべてのIPアドレスが「信頼できる内部ネットワーク」として扱われてしまい**、`reject_unauth_destination`が実行される前に`permit_mynetworks`で許可されてしまいます。オープンリレーの点検では、`smtpd_relay_restrictions`の記述だけでなく、**`mynetworks`に実際に登録されているCIDR範囲そのもの**を、必ずあわせて確認する必要があります。

## よくある誤解・つまずきポイント

- **誤解1: 「オープンリレーは、明示的にpermitと書かない限り発生しない」**
  実務では、mynetworksの範囲を広げすぎるなど、間接的な設定ミスによってオープンリレーと同じ状態が生まれることがあります。
- **誤解2: 「reject_unauth_destinationさえ書いておけば、順序に関係なく安全である」**
  Postfixのアクセス制御は上から順に評価されるため、reject_unauth_destinationより前の行で意図せずpermitされてしまうと、reject_unauth_destinationまで到達しません。
- **誤解3: 「オープンリレーになっていても、自分のサーバーには実害がない」**
  自分のサーバーが迷惑メールの送信元として広く認識されると、正規のメール送信までブラックリストに登録され、拒否されるようになるという、深刻な実害があります。

## 障害・トラブルシューティングの視点

1. **自分のサーバーがオープンリレーになっていないか確認したい**: 外部のネットワークから、自分が管理していないドメイン宛の中継を試み、`554`で拒否されることを確認します。
2. **正規の社内ユーザーからの送信まで拒否されるようになった**: `mynetworks`に、正規の送信元IPアドレス範囲が正しく含まれているかを確認します。
3. **自分のサーバーが、外部のブラックリストに登録されてしまった**: オープンリレーとして悪用されていないかをまず確認し、該当する場合は設定を修正したうえで、ブラックリスト運営元へ削除を申請します。

## まとめ

- オープンリレーは、送信元・宛先のどちらとも無関係な、第三者間の通信を無条件に中継してしまう、危険な状態です。
- `smtpd_relay_restrictions`の最後に`reject_unauth_destination`を置くことが、実質的な防御の中核です。
- 意図的な`permit`設定だけでなく、`mynetworks`の範囲を広げすぎることでも、実質的にオープンリレーと同じ状態が生まれます。
- オープンリレーとして悪用されると、正規のメール送信までブラックリストによって拒否されるという、深刻な実害につながります。

**今日から意識すべきこと**
1. `smtpd_relay_restrictions`の設定順序と、最後に`reject_unauth_destination`があることを、必ず確認しましょう。
2. `mynetworks`に登録するCIDR範囲は、必要最小限に絞りましょう。

## 参考文献

- [Postfix SMTP Relay and Rejection Settings](https://www.postfix.org/SMTPD_ACCESS_README.html)
- [Open Mail Relay | Wikipedia](https://en.wikipedia.org/wiki/Open_mail_relay)
