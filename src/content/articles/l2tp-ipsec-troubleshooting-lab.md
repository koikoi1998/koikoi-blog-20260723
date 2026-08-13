---
title: "L2TP/IPsecトラブルシューティング演習——自分でエラーログから原因を突き止める『上位1%』のハンズオン"
description: "L2TP/IPsecサーバー自作ハンズオンの環境を使い、実際によく起こる5つの障害をわざと再現し、journalctlの出力だけを手がかりに自力で原因を診断・修正する演習教材。答えを見る前に自分で調査する体験を通じて、要件通りに動かない設定に出会ったときの実務的な調査力を養う。"
series: "vpn"
order: 5
tags: ["network", "vpn", "l2tp", "ipsec", "troubleshooting", "handson"]
emoji: "🩺"
pubDate: 2026-08-10
---

## はじめに

- **この記事で得られること**: [L2TP/IPsecサーバー自作ハンズオン](/articles/l2tp-ipsec-lab-guide)の手順通りに構築した環境を使い、実務でありがちな5つの障害を意図的に再現します。それぞれについて、いきなり答えを見るのではなく、`journalctl`などの出力だけを手がかりに自分で原因を推測し、修正する練習をします。この記事自体が題材にしている5つの障害は、実際に本ブログの読者がこのハンズオンを実施した際に遭遇したものです。
- **対象読者**: [L2TP/IPsecサーバー自作ハンズオン](/articles/l2tp-ipsec-lab-guide)を一度最後まで終え、環境が(正常な状態で)手元に残っている方を想定しています。まだの場合は先にそちらを完了させてください。
- **読むのにかかる想定時間**: 約60分(実際に手を動かして1つずつ診断する場合)

**この記事の位置づけ**: 手順通りに進める従来のハンズオンは「正しい設定を写経すれば動く」体験でしたが、実務では**要件に応じて自分で値を決め、うまくいかなければ自分で調べて直す**力が必要です。この記事はその力を鍛えるための演習です。この記事は[『上位1%』シリーズ 全記事ガイド](/sitemap)の一部です。

## 演習の進め方

各シナリオは次の4段階で構成されています。

1. **症状**: ユーザーから見える現象(実行したコマンドと、その結果)
2. **調査のヒント**: どのコマンド・どのログを見ればよいかの方向性(答えそのものではありません)
3. **`<details>`内の答え**: 実際の原因と修正方法。**先に自分で1〜2分は調べてみてから開くことを強くお勧めします。**
4. **教訓**: この障害から得られる、他の場面にも応用できる考え方

エラーの調査方法そのもの(`journalctl`の`-u`/`-t`/`-f`など)にまだ自信がない場合は、先に[journalctlでエラーログを調査する](/articles/linux-journalctl-guide)を読んでおくと、この演習がスムーズに進みます。

## シナリオ1: `xl2tpd`が起動しない

クライアント側(またはサーバー側)で、次のように`/etc/xl2tpd/xl2tpd.conf`の該当セクションをコメントアウトから戻したうえで、`systemctl restart strongswan-starter xl2tpd`を実行してみてください。

```
;[lac L2TPLab]
lns = <サーバーのIPアドレス>
ppp debug = yes
pppoptfile = /etc/ppp/options.l2tpd.client
length bit = yes
```

```bash
sudo systemctl restart strongswan-starter xl2tpd
```

**症状**: 次のようなエラーが出て、`xl2tpd`が起動に失敗します。

```
Job for xl2tpd.service failed because the control process exited with error code.
See "systemctl status xl2tpd.service" and "journalctl -xeu xl2tpd.service" for details.
```

**調査のヒント**: 案内された通り`journalctl -xeu xl2tpd.service`を実行してみてください。`parse_config`という単語を含む行に注目してください。

<details>
<summary>答えを見る</summary>

`journalctl -xeu xl2tpd.service`を実行すると、`parse_config: line NN: data '...'`のようなメッセージと共に、設定ファイルの読み込みに失敗していることが分かります。原因は、`[lac L2TPLab]`の行頭に`;`(コメント記号)が残ったままだったことです。この状態だと、xl2tpdの設定パーサーはこのセクション自体が存在しないものとして扱い、後続の`lns = ...`のような行も意味を持たなくなります(所属先のセクションがコメントアウトされているため)。`;`を削除して`sudo systemctl restart strongswan-starter xl2tpd`を再実行すると解消します。

</details>

**教訓**: `xl2tpd.conf`はデフォルトで大量のサンプル行が`;`付きでコメントアウトされています。既存の行をコピー&編集する場合は、行頭の`;`を消し忘れていないか必ず確認する癖をつけましょう。

## シナリオ2: `ipsec`/`xl2tpd`は動いているのに`ppp0`が現れない(その1)

サーバー側の`/etc/ppp/options.xl2tpd`に、次のように`lock`を追加してみてください(演習用に、あえて元に戻します)。

```
require-mschap-v2
ms-dns 8.8.8.8
ms-dns 1.1.1.1
asyncmap 0
auth
crtscts
idle 1800
mtu 1410
mru 1410
nodefaultroute
debug
lock
proxyarp
connect-delay 5000
```

サービスを再起動し、クライアントから接続を試みてください。

**症状**: `sudo ipsec statusall`ではIKE/IPsec SAが正常に`ESTABLISHED`と表示されるのに、クライアント側で`ip a show ppp0`を実行しても`ppp0`が一向に現れません。エラーメッセージらしいものも、パッと見では見当たりません。

**調査のヒント**: `xl2tpd`自身のログ(`journalctl -u xl2tpd`)にはっきりしたエラーが見当たらない場合、`xl2tpd`が子プロセスとして起動している別のプログラムのログを、`-u`ではなく`-t`で確認してみてください。サーバー側・クライアント側の両方で試してみましょう。

<details>
<summary>答えを見る</summary>

`sudo journalctl -t pppd -n 30 --no-pager`をサーバー側で実行すると、`pppd`のプロセスが`Plugin pppol2tp.so loaded.`のあと、明確なエラーメッセージを出さないまま終了していることが分かります。原因は`options.xl2tpd`に含めた`lock`です。`lock`はpppdがシリアルデバイスに対してロックファイルを作成するためのオプションですが、`pppol2tp`プラグイン経由の接続には、ロック対象となる実体のあるデバイスが存在しません。この不整合により、`pppd`が正しく起動できずに終了しています。`lock`の行を削除して再起動すると解消します。

</details>

**教訓**: 「エラーメッセージが出ない静かな失敗」は、ログの文字列検索だけでは原因にたどり着けないことがあります。疑わしい設定を1つずつ外して比較する、という地道な切り分けが必要になる典型例です。

## シナリオ3: `ipsec`/`xl2tpd`は動いているのに`ppp0`が現れない(その2)

今度は、サーバー側の`/etc/xl2tpd/xl2tpd.conf`にある`pppoptfile`の指定先ファイル(`/etc/ppp/options.xl2tpd`)を、`sudo mv /etc/ppp/options.xl2tpd /etc/ppp/options.xl2tpd.bak`のように一時的にリネームして「存在しない状態」を再現してみてください。

**症状**: シナリオ2と同じく、`ipsec statusall`は正常なのに`ppp0`が現れません。

**調査のヒント**: シナリオ2と同じ調査手順(`journalctl -t pppd`)で見えるメッセージを、注意深く読んでみてください。今回は明確な文章のエラーメッセージが出ます。

<details>
<summary>答えを見る</summary>

`sudo journalctl -t pppd -n 30 --no-pager`(サーバー側)を見ると、`Can't open options file /etc/ppp/options.xl2tpd: No such file or directory`という明確なメッセージが出ています。`xl2tpd.conf`の`pppoptfile`で指定したファイルパスが存在しないことが直接の原因です。ファイル名を元に戻す(または新規作成する)ことで解消します。

</details>

**教訓**: `xl2tpd.conf`はあくまで「`pppd`をどう起動するか」の指示書であり、実際にPPPのオプションを解釈するのは`pppd`自身です。両者は別のプロセス・別のログを持つため、`xl2tpd`側の設定ミスの結果が`pppd`側のログにしか出ないケースがあることを覚えておいてください。

## シナリオ4: IKEが`NO_PROPOSAL_CHOSEN`で失敗する

クライアント側の`/etc/ipsec.conf`にある`ike=`の値に、あえて次のようにカンマの後ろへ空白を入れてみてください。

```
ike=aes256-sha1-modp1024, aes128-sha1-modp1024, 3des-sha1-modp1024!
```

`sudo systemctl restart strongswan-starter`のあと、`sudo ipsec up L2TP-PSK`を実行してみてください。

**症状**: 次のようなエラーで接続が失敗します。

```
received NO_PROPOSAL_CHOSEN error notify
establishing connection 'L2TP-PSK' failed
```

**調査のヒント**: `ike=`の値をよく見比べてください(1文字単位で)。修正して`strongswan-starter`を再起動したら、クライアント側だけでなく**サーバー側**の状態も疑ってみてください。

<details>
<summary>答えを見る</summary>

原因は`ike=`のカンマの後ろに入った半角スペースです。strongSwanの暗号スイート一覧はカンマ区切りで厳密にパースされるため、空白を含む項目は不正なアルゴリズム名として扱われ、そのプロポーザル(提案)全体が拒否されます。スペースを削除してクライアント側の`strongswan-starter`を再起動するだけでは直らないことがあります。これは、設定ファイルの編集が稼働中のcharonデーモンに即座に反映されるわけではないこと、そして失敗したネゴシエーションの状態がデーモン内に残っている場合があることが原因です。**クライアント側だけでなく、サーバー側の`strongswan-starter`も再起動する**と、双方が新しい設定でクリーンな状態から鍵交換をやり直し、解消します。

</details>

**教訓**: 設定ファイルを直しても、稼働中のデーモンの状態(特に接続の両端)まで含めてクリーンにしないと再現しない不具合があります。「編集した側だけ再起動して直らない」ときは、通信相手側の状態も疑ってみましょう。

## シナリオ5: Windowsクライアントだけ接続できない

サーバー側の`/etc/ppp/chap-secrets`から、いったんワイルドカード運用(`labuser * "パスワード" *`)ではなく、次のようにサーバー名を固定した状態を再現してみてください。

```
# client        server  secret                    IP addresses
labuser         L2TPLab "十分な強度のパスワード"      *
```

この状態のまま、Windows標準のVPN設定画面から接続を試みてください(Linuxクライアントからの接続はこの変更の影響を受けず、成功します)。

**症状**: Windows側で次のようなエラーが表示され、接続できません。

```
リモート コンピューターへの接続を確立できなかったので、この接続に使われたポートは閉じています。
```

**調査のヒント**: サーバー側で`sudo journalctl -t pppd -f`を実行しながら、Windows側から再接続を試みてください。何かを「見つけられない」というメッセージが出ないか確認してください。

<details>
<summary>答えを見る</summary>

サーバー側の`pppd`ログに`couldn't find any suitable secret (password)`が出ます。`chap-secrets`の2番目のフィールド(サーバー名)を`L2TPLab`に固定していたため、Windows側のRRASクライアントが名乗る際の値と一致せず、認証情報の検索に失敗していました(Linuxクライアント・xl2tpd経由の接続では、たまたま値が一致していたため気づきにくい問題です)。サーバー名フィールドを`*`(ワイルドカード)に変更することで、名乗り方の違いによらず同じエントリで認証できるようになります。

</details>

**教訓**: 同じサーバーに複数の異なる種類のクライアント(LinuxのCLIクライアント、WindowsのRRASクライアントなど)を接続させる場合、片方でしか検証していない設定は、もう片方で予期しない形で壊れることがあります。可能な限り、異なる種類のクライアントそれぞれで動作確認をしておくと安心です。

## プロが見ている視点(上位1%の理解):障害対応の型を持つ

5つのシナリオを振り返ると、調査の型はいずれも共通しています。

1. **症状(何が起きているか)を正確に言葉にする**: 「動かない」ではなく「`ipsec statusall`はESTABLISHEDだが`ppp0`が現れない」のように、どこまでは正常でどこから異常かを切り分けます。
2. **正常なら通過するはずの各段階(IKE→L2TP→PPP)を、ログで1つずつ裏取りする**: [journalctlでエラーログを調査する](/articles/linux-journalctl-guide)で扱った、`-u`/`-t`の使い分けと調査順序がここで活きます。
3. **「エラーが出ない」こと自体も情報として扱う**: 明確なエラーメッセージがない場合は、疑わしい設定を1つずつ外す実験に切り替えます。
4. **修正後は、変更した側だけでなく関係する両端を再起動・再検証する**: 特に鍵交換のような双方向のネゴシエーションでは、片側だけの修正では状態が食い違ったままになることがあります。

要件に応じて自分で設定値を決め、エラーが出たら自分でこの型に沿って調査する——これができるようになることが、[L2TP/IPsecサーバー自作ハンズオン](/articles/l2tp-ipsec-lab-guide)を「手順をなぞるだけの体験」から「実務で使える経験」に変える一番の近道です。

## まとめ

- `xl2tpd.conf`のコメントアウト解除忘れ、`options.xl2tpd`の`lock`オプション、`pppoptfile`の指定ミス、`ike=`のスペース、`chap-secrets`のサーバー名固定——いずれも実際にハンズオンで発生した、再現性のある障害です。
- 調査の基本は、IKE→L2TP→PPPという接続確立の順序に沿って、`ipsec statusall`→`journalctl -u xl2tpd`→`journalctl -t pppd`の順にログを確認していくことです。
- エラーメッセージが出ない「静かな失敗」には、疑わしい設定を1つずつ外して比較する実験的なアプローチが必要になることがあります。

**今日から意識すべきこと**
1. 答えを覚えるのではなく、「症状から仮説を立て、ログで裏取りする」というプロセス自体を体に染み込ませましょう。実務で出会う障害は、この記事の5つとまったく同じ形では現れません。
2. うまくいかない設定に出会ったとき、それは学習のノイズではなく、実務力を鍛える一番の機会だと捉え直してみてください。

## 参考文献

- [journalctl(1) — Linux manual page](https://man7.org/linux/man-pages/man1/journalctl.1.html)
- [strongSwan Documentation](https://docs.strongswan.org/)
- [xl2tpd | Linux man-pages](https://man7.org/linux/man-pages/man8/xl2tpd.8.html)
