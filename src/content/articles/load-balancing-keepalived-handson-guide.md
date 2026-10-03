---
title: "keepalivedで2台のHAProxyを冗長化し、VIPの自動フェイルオーバーを体験する『上位1%』のハンズオン"
description: "keepalivedを使い、2台のHAProxyサーバーをActive/Standby構成で冗長化し、1つの共有VIPを割り当てる。Active機を意図的に停止させ、Gratuitous ARPによってVIPが数秒で自動的にStandby機へ引き継がれる様子を、tcpdumpとip addrコマンドで自分の目で確認するハンズオン。"
series: "load-balancing"
subSeries: "handson"
order: 9
tags: ["load-balancing", "keepalived", "vrrp", "haproxy", "handson", "infra"]
emoji: "🔁"
pubDate: 2026-10-05
---

## はじめに

- **この記事で得られること**: [VRRPとkeepalivedの仕組み](/articles/load-balancing-vrrp-keepalived-guide)で学んだ知識を、**実際に2台のHAProxyサーバーをkeepalivedで冗長化し、Active機を停止させた際にVIPが自動的にStandby機へ引き継がれる様子**を、自分の目で確認することで検証します。
- **対象読者**: VRRPとkeepalivedの座学は理解したものの、実際に構築した経験がなく、VIPの切り替えが具体的に何秒で、どのように発生するのかを確認しておきたい方を想定しています。
- **読むのにかかる想定時間**: 約25分(ハンズオン実施込み)

この記事は[『上位1%』シリーズ 全記事ガイド](/sitemap)の一部、[ロードバランシング基礎シリーズ](/sitemap#シリーズ一覧)の9本目です。[ハンズオン準備マニュアル](/articles/handson-prep-guide)で作成したUbuntu Server環境が2台あれば実施できます([HAProxyハンズオン](/articles/load-balancing-haproxy-handson-guide)のバックエンドサーバーとは別に用意してください)。

## 前提知識

- **VRRPとkeepalivedの仕組み**: [ロードバランサー自体の冗長化](/articles/load-balancing-vrrp-keepalived-guide)を先に読んでおいてください。
- **HAProxyの基本設定**: [HAProxyハンズオン](/articles/load-balancing-haproxy-handson-guide)で構築した設定を前提にします。

## 全体像をつかむ

このハンズオンで行うことは、次の4ステップです。

```mermaid
graph LR
    Step1["Step1<br/>2台にHAProxyを<br/>インストール"]
    Step2["Step2<br/>keepalivedを設定し<br/>共有VIPを割り当てる"]
    Step3["Step3<br/>どちらがMasterかを<br/>確認する"]
    Step4["Step4<br/>Master機を停止し<br/>フェイルオーバーを確認"]
    Step1 --> Step2 --> Step3 --> Step4
```

## ハンズオン手順

### Step 1: 2台のサーバーに、HAProxyをインストールする

2台のUbuntu Server(例: `10.0.0.21`・`10.0.0.22`)に、それぞれHAProxyをインストールします。

```bash
sudo apt update
sudo apt install -y haproxy
```

`/etc/haproxy/haproxy.cfg`に、動作確認用の簡単な設定を追記します(両方のサーバーで同じ内容)。

```
frontend http_front
    bind *:80
    default_backend http_back

backend http_back
    server local 127.0.0.1:8080 check
```

動作確認用に、両方のサーバーで簡易Webサーバーを起動しておきます。

```bash
mkdir -p /tmp/web && echo "Response from $(hostname)" > /tmp/web/index.html
cd /tmp/web && nohup python3 -m http.server 8080 &
sudo systemctl restart haproxy
```

### Step 2: 両方のサーバーにkeepalivedをインストールし、設定する

```bash
sudo apt install -y keepalived
```

**1台目**(Master、例: `10.0.0.21`)の`/etc/keepalived/keepalived.conf`に、次の内容を作成します。

```
vrrp_instance VI_1 {
    state MASTER
    interface eth0
    virtual_router_id 51
    priority 150
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass lb_lab_secret
    }
    virtual_ipaddress {
        10.0.0.100/24
    }
}
```

**2台目**(Backup、例: `10.0.0.22`)には、`state`と`priority`だけを変えた、次の内容を作成します。

```
vrrp_instance VI_1 {
    state BACKUP
    interface eth0
    virtual_router_id 51
    priority 100
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass lb_lab_secret
    }
    virtual_ipaddress {
        10.0.0.100/24
    }
}
```

**priorityの値が高い方が、優先的にMasterになります。** [前の記事](/articles/load-balancing-vrrp-keepalived-guide)で扱ったとおり、`virtual_router_id`は、同じVRRPグループに属するサーバー同士で、必ず一致させる必要があります。両方のサーバーで、サービスを起動します。

```bash
sudo systemctl enable --now keepalived
```

<details>
<summary>なぜ`auth_pass`の設定が必要なのか</summary>

VRRPの生存確認パケット(Advertisement)は、同一ネットワーク内にブロードキャストまたはマルチキャストされます。`auth_pass`による簡易的な認証がなければ、**同じネットワーク上にある、無関係な別のVRRPグループや、悪意のある第三者が送信した偽のAdvertisementを受け取ってしまい、意図しないフェイルオーバーが発生するリスク**があります。このハンズオンでは簡易的なプレーンテキスト認証(PASS)を使っていますが、実務の本番環境では、VRRPの生存確認用の通信経路自体を、[前の記事](/articles/load-balancing-vrrp-keepalived-guide)で扱ったとおり、専用のネットワークに分離することが、より確実な対策になります。

</details>

### Step 3: どちらのサーバーが現在Masterかを確認する

1台目(Master想定)で、VIPが実際に割り当てられているかを確認します。

```bash
ip addr show eth0
```

**実行結果(該当部分)**:

```
inet 10.0.0.21/24 ...
inet 10.0.0.100/24 scope global secondary eth0
```

1台目に、通常のIPアドレス(`10.0.0.21`)に加えて、**VIP(`10.0.0.100`)が`secondary`として追加されている**ことが確認できます。2台目では、`ip addr show eth0`を実行しても、VIPは表示されません。

ネットワーク内の別の端末から、VIPへアクセスしてみます。

```bash
curl http://10.0.0.100/
```

**実行結果:**

```
Response from lb01
```

1台目(Master)のホスト名が応答として返ってくることが確認できました。

### Step 4: Master機を停止し、フェイルオーバーを確認する

2台目(Backup)で、VRRPの生存確認パケットを監視しながら、1台目を停止させます。

**2台目で実行(監視用):**

```bash
sudo tcpdump -i eth0 vrrp
```

**別の端末から、1台目のkeepalivedサービスを停止:**

```bash
ssh 10.0.0.21 "sudo systemctl stop keepalived"
```

2台目のtcpdumpの出力を見ると、1台目からのAdvertisementが途絶えた後、数秒で2台目自身がAdvertisementを送信し始める様子が確認できます。

2台目で、VIPの状態を確認します。

```bash
ip addr show eth0
```

**実行結果(該当部分)**:

```
inet 10.0.0.22/24 ...
inet 10.0.0.100/24 scope global secondary eth0
```

**VIPが、2台目へ引き継がれています。** 再度、VIPへアクセスしてみます。

```bash
curl http://10.0.0.100/
```

**実行結果:**

```
Response from lb02
```

**応答するサーバーが、クライアント側は一切意識することなく(接続先のIPアドレスは`10.0.0.100`のまま変わっていない)、1台目から2台目へ切り替わっていることが確認できました。** これが、[Gratuitous ARPによる、ネットワーク層での即座の切り替え](/articles/load-balancing-vrrp-keepalived-guide)が実際に機能している様子です。

1台目で`sudo systemctl start keepalived`を実行し、復旧させると、`priority`の値がより高いため、再びMasterの役割を取り戻すことも確認してみてください。

## プロが見ている視点(上位1%の理解)

### フェイルオーバーの速さは、「何を」切り替えているかに直結している

Step 4で確認したフェイルオーバーは、わずか数秒で完了しました。これは、[前の記事](/articles/load-balancing-vrrp-keepalived-guide)で扱ったとおり、**VRRPがDNSの応答を書き換えているのではなく、ネットワーク層でVIPの所在地そのものを書き換えている**ためです。[GSLBの仕組み](/articles/load-balancing-gslb-guide)によるデータセンター単位のフェイルオーバーが、DNSのTTLに起因する分単位の遅延を抱えていたのとは対照的に、同一ネットワーク内でのVRRPによる切り替えは、秒単位で完了します。**「何を切り替えているか」という、仕組みの階層の違いが、フェイルオーバーの速さという、具体的な結果の違いとして表れている**ことを、このハンズオンを通じて体感してもらうことが狙いです。

## よくある誤解・つまずきポイント

- **誤解1: 「keepalivedをインストールするだけで、自動的にVIPが割り当てられる」**
  `keepalived.conf`で、`virtual_ipaddress`やインターフェース名を正しく設定する必要があります。
- **誤解2: 「priorityの値は、どちらのサーバーでも同じにしておくべきである」**
  priorityが同じ値だと、どちらがMasterになるべきかが不定になる可能性があります。明確に差をつける必要があります。
- **誤解3: 「フェイルオーバー後、クライアント側で何らかの再接続設定が必要になる」**
  VIPのIPアドレス自体は変わらないため、クライアント側は何も変更する必要がありません。これがVIPという設計の価値です。

## 障害・トラブルシューティングの視点

1. **`ip addr show`で、どちらのサーバーにもVIPが表示されない**: `keepalived.conf`の`virtual_ipaddress`の設定と、`systemctl status keepalived`でサービスが正常に起動しているかを確認します。
2. **両方のサーバーに同時にVIPが表示される(スプリットブレイン)**: `virtual_router_id`が両サーバーで一致しているか、そしてVRRPの生存確認パケットが実際に届いているか(`tcpdump`で確認)をチェックします。
3. **Master機を復旧させても、Masterの役割が戻らない**: `keepalived.conf`に`nopreempt`という設定が入っていないかを確認します。この設定があると、priorityが高くても、自動的には役割を取り戻しません。

## まとめ

- keepalivedの`keepalived.conf`で、`state`・`priority`・`virtual_ipaddress`を設定することで、複数台のHAProxyサーバー間でVIPを共有できます。
- priorityの値が高いサーバーが、優先的にMasterとなり、VIPを保持します。
- Master機が停止すると、数秒以内に、Backup機へVIPが自動的に引き継がれ、クライアント側は接続先の変更を一切意識する必要がありません。
- この高速なフェイルオーバーは、DNSを書き換えるのではなく、ネットワーク層でVIPの所在地を直接書き換えているために実現されています。

**今日から意識すべきこと**
1. keepalivedを設定する際は、priorityの値に明確な差をつけ、Master/Backupの役割を意図的に固定しましょう。
2. フェイルオーバーの速さを検証する際は、実際に`tcpdump`でVRRPパケットを観察し、仕組みを目で確認する習慣をつけましょう。

## 参考文献

- [Keepalived Documentation](https://www.keepalived.org/manpage.html)
- [RFC 5798 - Virtual Router Redundancy Protocol (VRRP) Version 3](https://datatracker.ietf.org/doc/html/rfc5798)
