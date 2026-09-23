---
title: "DCの正常性確認を『上位1%』の視点で理解する——repadmin /showreplとnet shareの読み方"
description: "AD移行の各段階で必ず実行する repadmin /showrepl と net share。それぞれの出力が何を表しており、どう読めば「正常」と判断できるのか。repadmin /showreplで確認できる5つのパーティションとは何か、net shareに表示されるC$・IPC$・ADMIN$・NETLOGON・SYSVOLとは何か、SysvolReadyレジストリ値の意味まで、DCの正常性確認を体系的に理解する。"
series: "active-directory"
subSeries: "main"
order: 7
tags: ["windows-server", "active-directory", "infra", "troubleshooting"]
emoji: "🩺"
pubDate: 2026-09-20
---

## はじめに

- **この記事で得られること**: AD移行やDC構築の手順書に必ず登場する`repadmin /showrepl`と`net share`という2つのコマンドについて、それぞれの出力が具体的に何を表しており、どういう基準で「正常」と判断できるのかを体系的に理解できます。`repadmin /showrepl`で確認できる5つのパーティションの正体、`net share`に表示される`C$`・`IPC$`・`ADMIN$`・`NETLOGON`・`SYSVOL`という共有の意味、そして`SysvolReady`レジストリ値が示していることまでを扱います。
- **対象読者**: AD移行やDC構築の手順書に沿って`repadmin /showrepl`や`net share`を実行したことはあるものの、その出力の意味を理解せずに「エラーが出ていなければOK」という表面的な判断にとどまっている方を想定しています。
- **読むのにかかる想定時間**: 約19分

この記事は[『上位1%』シリーズ 全記事ガイド](/sitemap)の一部、[Active Directoryシリーズ](/sitemap#シリーズ一覧)の7本目です。パーティションの種類については[ADとDC、ドメインとフォレストの違いを『上位1%』の視点で理解する](/articles/ad-dc-fundamentals-guide)、`_msdcs`・`ForestDnsZones`については[DNSゾーンとレコードの読み方を『上位1%』の視点で理解する](/articles/dns-zones-records-guide)を前提にしています。

## 前提知識

- **レプリケーション**: AD DSの変更内容を、DC間で複製し合う仕組みです。詳しくは[ADとDC、ドメインとフォレストの違いを『上位1%』の視点で理解する](/articles/ad-dc-fundamentals-guide)を参照してください。
- **SYSVOL**: グループポリシーオブジェクト(GPO)の実体ファイルやログオンスクリプトなどを格納する、DC間で複製される共有フォルダーです。

## 全体像をつかむ

### 一言で言うと

**`repadmin /showrepl`は「AD DSのデータそのものが、DC間で正しく複製されているか」を確認するコマンド、`net share`は「そのDCが実際にファイル共有として提供すべきものを、正しく提供できているか」を確認するコマンドです。** 両者は確認している対象のレイヤーが異なり、DCの正常性を確認する際はこの2つを組み合わせて見ていく必要があります。

```mermaid
graph TB
    subgraph Repadmin["repadmin /showreplが見ているもの"]
        Data["AD DSのデータそのもの<br/>(ドメイン・設定・スキーマ・DNSゾーン)"]
    end
    subgraph NetShare["net shareが見ているもの"]
        Shares["ファイル共有として実際に提供されているか<br/>(SYSVOL・NETLOGONなど)"]
    end
    Repadmin -.異なるレイヤーの正常性.-> NetShare
```

## 基礎から徹底解説

### `repadmin /showrepl`が表示する5つのパーティション

`repadmin /showrepl`を実行すると、そのDCが保持している複数のパーティション(命名コンテキスト)それぞれについて、レプリケーション相手(パートナー)ごとの最終同期状況が表示されます。単一ドメインのフォレストで一般的な構成であれば、次の5つのパーティションが表示されます。

| パーティション | 内容 | レプリケーション範囲 |
|---|---|---|
| ドメインパーティション(例: `DC=corp,DC=example,DC=com`) | ユーザー・コンピューター・グループなどのオブジェクト | ドメイン内の全DC |
| 設定パーティション(`CN=Configuration,...`) | サイト構成、レプリケーショントポロジなどフォレスト全体の構成情報 | フォレスト内の全DC |
| スキーマパーティション(`CN=Schema,CN=Configuration,...`) | オブジェクトの型定義 | フォレスト内の全DC |
| DomainDnsZonesパーティション | AD統合DNSゾーンのうち、ドメイン単位で共有されるデータ | ドメイン内の全DC(DNSサーバーの役割を持つDC) |
| ForestDnsZonesパーティション | `_msdcs`などフォレスト全体で共有されるべきDNSゾーンデータ | フォレスト内の全DC(DNSサーバーの役割を持つDC) |

この5つの区分は、[ADとDC、ドメインとフォレストの違いを『上位1%』の視点で理解する](/articles/ad-dc-fundamentals-guide)で説明したドメイン/設定/スキーマという3パーティションに、[DNSゾーンとレコードの読み方を『上位1%』の視点で理解する](/articles/dns-zones-records-guide)で説明したDNS特有の2パーティション(DomainDnsZones・ForestDnsZones)を加えたものと正確に対応しています。**それぞれのパーティションは異なるレプリケーション範囲を持つため、レプリケーションの不整合を切り分ける際は「どのパーティションで問題が起きているか」を必ず確認する**ことが重要です。

### 「成功」とは何を意味しているのか

`repadmin /showrepl`の出力では、各パートナーからの受信レプリケーションについて、次のような情報が表示されます。

```
DC1\CORP.EXAMPLE.COM
DC Options: IS_GC
Site Options: (none)
DSA object GUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
DSA invocationID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

==== INBOUND NEIGHBORS ======================================

DC=corp,DC=example,DC=com
    CN=Configuration,DC=corp,DC=example,DC=com
        DC2\CORP.EXAMPLE.COM via RPC
            DSA object GUID: yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
            Last attempt @ <日時> was successful.
```

この出力を正しく読むうえで最も重要なのは、**「誰が」「誰から」複製を受け取っているのかという主語を取り違えないこと**です。上記の例は`DC1`上で実行した結果であり、見出しの`INBOUND NEIGHBORS`(受信側の隣接相手)が示す通り、これは「**DC1が、DC2から変更を取り込む(プルする)」という向きのレプリケーション**の状態です。`repadmin /showrepl`は常に、**コマンドを実行したそのDC自身を主語(受け手)として、そのDCが他のDCから受信している側の状態だけ**を表示します。DC2側から見た「DC2が送信した内容が正しくDC1に届いているか」を確認したい場合は、DC2上で同じコマンドを実行するか、後述の`repadmin /replsummary`のように複数DCをまとめて確認する必要があります。「DC1で`showrepl`を実行して成功と出ていたのに、DC2側では別のエラーが出ていた」という食い違いは、この受信側限定という性質を理解していないと見落としやすい典型的な落とし穴です。

そのうえで確認すべき最も重要な情報は、**各パートナーとの間で、最後に試みたレプリケーションが`was successful`(成功)になっているか、そしてその日時が現在時刻から見て妥当な範囲(通常は直近数時間以内)に収まっているか**です。**「成功」とは、あるパートナーとの間で直近のレプリケーション試行が正常に完了したことだけを意味しており、それ以前に長期間レプリケーションが停止していた可能性までは否定しません。** 直近の1回だけを見て安心するのではなく、失敗回数(Consecutive failures)が0であるか、最終成功時刻が異常に古くないかもあわせて確認する必要があります。

<details>
<summary>失敗している場合の表示</summary>

レプリケーションが失敗している場合、`was successful`の代わりに、たとえば次のようなエラーコードとその意味が表示されます。

```
Last attempt @ <日時> failed, result 1722 (0x6ba):
    The RPC server is unavailable.
    <失敗回数> consecutive failure(s).
Last success @ <日時>.
```

**`<失敗回数> consecutive failure(s)`が0より大きい場合は、確実に何らかの異常がある**ことを意味します。エラーコード(この例では1722)は、RPC(そのDC間の通信手段)自体が到達できない状況を示しており、ネットワーク疎通やファイアウォール、DNS名前解決に問題がないかを確認する手がかりになります。

</details>

### `net share`が表示する既定の共有:C$・IPC$・ADMIN$・NETLOGON・SYSVOL

DC(に限らずWindows Server全般)で`net share`コマンドを実行すると、明示的に作成した共有フォルダーに加えて、**既定で自動的に用意されている管理共有**が表示されます。

| 共有名 | 実体 | 用途 |
|---|---|---|
| `C$` | `C:\`ドライブ全体 | 管理者権限を持つユーザーが、リモートからそのドライブ全体へアクセスするための管理共有(ドライブレターごとに`D$`なども同様に自動作成される) |
| `ADMIN$` | `%SYSTEMROOT%`(通常`C:\Windows`) | リモートでの管理操作(サービスのインストールなど、多くのリモート管理ツールが内部的に利用)のための管理共有 |
| `IPC$` | 実体のあるフォルダーではなく、プロセス間通信用の名前付きパイプ | ファイル共有ではなく、リモートプロシージャコール(RPC)などのプロセス間通信をSMB経由で行うための特殊な共有。ファイルの中身を持たない点が他の共有と異なる |
| `NETLOGON` | SYSVOL配下の`scripts`フォルダー | ログオンスクリプトなどを配布するための共有 |
| `SYSVOL`| SYSVOLフォルダー全体 | グループポリシーオブジェクト(GPO)の実体ファイルを配布するための共有 |

**このうちC$・IPC$・ADMIN$の3つはAD DSやDC固有のものではなく、通常のWindows(Server)であれば既定で必ず作成される管理共有**です。一方**NETLOGONとSYSVOLの2つは、そのサーバーがDCとして正しく機能していることの証**であり、DCの正常性確認において特に重要な意味を持ちます。

<details>
<summary>C$・ADMIN$・IPC$は、RDP接続のためにあるのか</summary>

実務でよくある誤解ですが、**これら3つの管理共有は、RDP(リモートデスクトップ)接続そのものとは関係がありません**。RDP接続は、そのサーバーのデスクトップ画面を丸ごとリモートに転送する独立した仕組み(RDPプロトコル、既定TCP 3389番)であり、RDPでログインした時点でCドライブやデスクトップが見えるのは、**単に「そのサーバーに直接座っているのと同じ状態でOSを操作している」からであり、C$共有を経由しているわけではありません**。

これら管理共有の本当の用途は、**RDPのようなフルのデスクトップセッションを開かずに、ネットワーク経由でファイルシステムやサービスへ直接アクセスする**ことです。

- **C$**: `\\サーバー名\C$`という形式でUNCパスとして直接アクセスすることで、リモートの管理者がエクスプローラーやコマンドラインから、そのサーバーのCドライブの中身を(RDPで一々ログインしなくても)直接参照・操作できます。バックアップソフトウェアや、複数サーバーへ一括でファイルを配布する運用スクリプトなどが、日常的にこの経路を使っています。
- **ADMIN$**: 実体は`C:\Windows`(`%SYSTEMROOT%`)で、多くのリモート管理ツール(サービスのリモートインストール、`PsExec`のようなリモート実行ツールなど)が、実行ファイルを一時的に転送したり、サービスとして登録したりするために内部的に利用します。「管理者権限でRDP接続したときだけ使える特別な共有」ではなく、**管理者権限を持つアカウントであれば、RDPを介さずリモートから直接アクセスできる、Windowsフォルダー専用の共有**です。
- **IPC$**: 中身を持つファイル共有ではなく、**SMBの上でリモートプロシージャコール(RPC)や名前付きパイプによる通信を行うための、通信専用のチャネル**です。たとえばリモートのレジストリ編集、サービスの一覧取得・起動停止、共有フォルダー一覧の取得といった、多くのリモート管理系API呼び出しがこのIPC$を経由して行われます。ファイルを置いたり取り出したりする用途ではなく、**「このサーバーに対して管理系のコマンド・問い合わせを送るための土管**」とイメージすると実態に近くなります。

まとめると、C$・ADMIN$・IPC$はいずれも「**RDPでログインしなくても、リモートからファイルやサービスを直接操作するための経路**」であり、RDPはこれらとは別の独立した仕組みです。

</details>

### NETLOGONとSYSVOL、そしてなぜ両方が必要なのか

前述の表の通り、`NETLOGON`共有の実体は`SYSVOL`フォルダーの中の`scripts`サブフォルダーです。つまり**NETLOGON共有は、SYSVOL共有が公開しているツリーの一部を、別名でもう一度公開しているだけ**であり、独立した別のデータではありません。両方ともDC上の同じSYSVOLフォルダーに由来し、**どちらもクライアント・DC双方からアクセスされる共有です**(「SYSVOLはDC間専用、NETLOGONはクライアント専用」という切り分けではありません)。

「SYSVOLフォルダー全体をそのまま共有しているなら、NETLOGON共有は不要では」という疑問はもっともですが、NETLOGON共有が今でも独立して存在し続けているのは**歴史的な互換性のため**です。Windows 2000でAD DSとSYSVOLが導入される以前、Windows NT 4.0以前のドメインでは、ログオンスクリプトは`\\サーバー名\netlogon\スクリプト名`という固定のパスに配置する慣習があり、多くのログオンスクリプトやツールがこのパスをそのまま前提にしていました。SYSVOL導入後も、この`\\ドメイン名\netlogon\...`という慣れ親しんだ短いパスをそのまま使い続けられるように、`scripts`サブフォルダーへのエイリアス的な共有として`NETLOGON`が残されています。実務では、ログオンスクリプトの参照には伝統的に短い`NETLOGON`パスが、GPOの設定ファイル本体(`Policies`フォルダー配下)へのアクセスにはより広い範囲をカバーする`SYSVOL`パスが使われる、という役割分担で理解しておくとよいでしょう。

### なぜNETLOGONとSYSVOLの共有有無がDCの正常性確認になるのか

NETLOGONとSYSVOLの共有は、SYSVOLフォルダーの複製(DFSRまたは旧FRS)が正常に完了し、Netlogonサービスがその内容を配布可能と判断した場合にのみ、自動的に作成されます。**DCへの昇格直後や、SYSVOLレプリケーションに問題が生じている場合には、この2つの共有が存在しない(あるいは一時的に非表示になる)ことがあります。** `net share`を実行してこの2つの共有が表示されない場合、そのDCはグループポリシーの適用やログオンスクリプトの配布ができない状態にある可能性が高く、実務上はDCとして完全には機能していないと判断すべきです。

<details>
<summary>DCが複数ある場合、クライアントはどのDCのSYSVOLを見に行くのか</summary>

GPOやログオンスクリプトの実体ファイルはDFSR(または旧FRS)によって**すべてのDCへ複製される**ため、クライアントはどのDCのSYSVOLを参照しても、理屈上は同じ内容にたどり着けます。ではクライアントは実際にどのDCを選んでいるのかというと、これは**そのクライアント自身がログオン時にKerberos認証で使うDCと同じDC**です。クライアントは起動・ログオン時にDNSのSRVレコードを使って**自分が所属するサイト(拠点)に最も近いDC**を検索し、以降の認証・GPO取得・ログオンスクリプト取得を、基本的にはそのDCに対して行います。DCを明示的に指定する設定をしていない限り、管理者が個々のDCを手動で割り当てているわけではありません。このDC選択(DCロケータ)の詳しい仕組みは、DNSのSRVレコードを扱った[DNSゾーンとレコードの読み方を『上位1%』の視点で理解する](/articles/dns-zones-records-guide)や、[ADの「サイト」とレプリケーショントポロジーを『上位1%』の視点で理解する](/articles/ad-sites-guide)で深掘りしています。

この仕組み上、**複数DCへの変更のレプリケーションが完了していないタイミングでは、クライアントがどのDCを見に行くかによって、一時的に反映済み/未反映のGPOが混在しうる**という点は覚えておく価値があります。GPOを変更した直後にすべてのクライアントへ即座に反映されるわけではなく、レプリケーションの伝播とクライアント側のGPO再適用のタイミング(既定で90分ごと+ランダムオフセット、DCは5分ごと)の両方に依存します。

</details>

この判断をより確実に行うためのコマンドが、`reg query`によるレジストリ値の確認です。

```powershell
reg query "HKLM\SYSTEM\CurrentControlSet\Services\Netlogon\Parameters" /v SysvolReady
```

このレジストリ値`SysvolReady`は、Netlogonサービスが**SYSVOLの複製が完了し、共有を開始してよいと判断した時点で`1`に設定されます。** `net share`で目視するだけでなく、この値が`1`になっていることを確認することで、「共有が一時的に見えていないだけなのか、本当にまだ複製が完了していないのか」をより確実に切り分けられます。

## プロが見ている視点(上位1%の理解)

### 降格させたDCの情報が残っていないことの確認

AD移行の実務では、DCを正式に降格・撤去した後、**そのDCの情報がAD DS内に一切残っていないこと**を確認する作業が発生します。これを`repadmin`の観点から確認する場合、次のようなコマンドが使われます。

```powershell
repadmin /replsummary
repadmin /showrepl *
```

これらのコマンドの出力に、**既に撤去したはずの旧DCの名前がレプリケーションパートナーとして依然として登場する場合、そのDCの降格処理が完全ではなく、AD DS上に古い参照(メタデータ)が残っている**ことを意味します。これは正常性を損なう明確な兆候であり、[DNSゾーンとレコードの読み方を『上位1%』の視点で理解する](/articles/dns-zones-records-guide)で扱った`_msdcs`ゾーンのSRVレコード・GUIDレコードの残存確認とあわせて、AD移行完了の判定基準として扱うべきポイントです。AD DS上のオブジェクトとしての削除確認(`dsa.msc`・`adsiedit.msc`などを使ったクリーンアップ)については、後続記事で扱います。

### 複数のDC・複数のパートナー間での確認の徹底

`repadmin /showrepl`は、実行したDC自身が受信側となっているレプリケーション(インバウンド)の状況を表示します。**DCが複数台ある環境では、1台だけで確認して終わりにするのではなく、各DC上でこのコマンドを実行し、すべてのDC間の組み合わせで正常にレプリケーションが成立しているかを確認する**ことが重要です。`repadmin /replsummary`を使うと、フォレスト内の全DCについて、失敗しているレプリケーションの概要を一覧でまとめて確認でき、大規模環境での効率的な健全性確認に役立ちます。

`repadmin`には`/showrepl`以外にも、DC構築・DC移行の現場で実際に使う機会のあるサブコマンドがいくつかあります。代表的なものを挙げます。

| サブコマンド | 用途 |
|---|---|
| `repadmin /replsummary` | フォレスト内の全DCについて、レプリケーションの失敗有無を一覧で確認する(前述) |
| `repadmin /showrepl * /csv` | 全DCの`/showrepl`結果を、Excelなどで扱いやすいCSV形式で一括出力する。台数が多い環境の定期監査で有用 |
| `repadmin /syncall <DC名> /AdeP` | 指定したDCを起点に、レプリケーションのスケジュールを待たず**今すぐ**全パートナーとの同期を強制する。DC構築直後や、変更をすぐに全DCへ行き渡らせたい移行作業の検証時に使う(`/A`=全パーティション対象、`/d`=サーバーを識別子(GUID)ではなく識別名(DN)で分かりやすく表示、`/e`=フォレスト内の全サイトへ拡張、`/P`=このDCから他のDCへ変更をプッシュ配信) |
| `repadmin /kcc <DC名>` | そのDCのKCC(Knowledge Consistency Checker、レプリケーショントポロジを自動計算する仕組み)に、トポロジの再計算を即座に実行させる。サイト構成を変更した直後などに使う |
| `repadmin /queue <DC名>` | 送信待ちになっているレプリケーション要求のキューを確認する。大量の変更が発生した直後、複製が詰まっていないかの確認に使う |

これらは`/showrepl`のように毎回確認するものではなく、**構築直後の即時反映や、変更が疑わしいときのピンポイントな調査**で使う位置づけです。日常的な健全性確認としては、まず`/showrepl`と`/replsummary`を押さえておけば十分です。

## よくある誤解・つまずきポイント

- **誤解1: 「repadmin /showreplでエラーが出ていなければ、AD DSは完全に正常」**
  `repadmin /showrepl`が確認しているのはAD DSのデータの複製状況だけです。SYSVOLの共有状況(`net share`で確認する内容)は別のレイヤーの正常性であり、両方をあわせて確認する必要があります。
- **誤解2: 「NETLOGONとSYSVOLの共有が一度でも表示されれば、以降は確認不要」**
  SYSVOLレプリケーションに後から問題が生じた場合、共有自体は残っていても中身(GPOファイルなど)の複製が滞っている可能性があります。共有の有無だけでなく、複製内容自体の健全性も継続的に確認する必要があります。
- **誤解3: 「C$やADMIN$はAD環境特有の危険な共有であり、DCでは無効化すべき」**
  C$・IPC$・ADMIN$はAD DS固有のものではなく、Windows Server全般で既定で作成される管理共有です。無効化するとリモート管理ツールの多くが正常に機能しなくなるため、通常は無効化せず、アクセス制御(誰が管理者権限を持つか)で保護するのが定石です。

## 障害・トラブルシューティングの視点

DCの正常性確認は、**「AD DSのデータの複製(repadmin)」と「SYSVOLの共有・複製(net share/SysvolReady)」の2つのレイヤーを両方確認する**のが基本です。

1. **特定のDC間でレプリケーションが失敗している**: `repadmin /showrepl`のエラーコードを確認し、RPC到達性・DNS名前解決・ファイアウォールのいずれに問題があるかを切り分けます。
2. **特定のDCでグループポリシーが適用されない**: そのDCで`net share`を実行し、NETLOGON・SYSVOL共有が存在するかを確認します。存在しない場合は`SysvolReady`レジストリ値と、SYSVOLレプリケーション(DFSR)サービスの状態を確認します。
3. **AD移行後、撤去したはずの旧DCの情報が残っている**: `repadmin /replsummary`や`repadmin /showrepl *`で、旧DCの名前がレプリケーションパートナーとして表示されないかを確認します。

### 予防策・恒久対策

- 複数のDCがある環境では、`repadmin /replsummary`を定期的に実行し、フォレスト全体のレプリケーション状況を一覧で監視する。
- DCを新規に構築・昇格させた直後は、`net share`と`SysvolReady`の両方でSYSVOLの共有開始を確認してから、本番運用(クライアントからの参照先として追加すること)に組み込む。
- DCを降格・撤去する際は、`repadmin`の出力から旧DCの名前が完全に消えたことを確認するまでを、作業完了の基準とする。

## まとめ

- `repadmin /showrepl`はAD DSのデータそのものの複製状況を、`net share`はSYSVOLなどのファイル共有としての提供状況を確認するコマンドであり、両者は異なるレイヤーの正常性を見ています。
- `repadmin /showrepl`で確認できる5つのパーティションは、ドメイン・設定・スキーマという3つの基本パーティションに、DomainDnsZones・ForestDnsZonesというDNS特有の2つを加えたものです。
- 「成功」という表示は直近の試行が成功したことしか意味せず、失敗回数や最終成功時刻もあわせて確認する必要があります。
- NETLOGON・SYSVOLの共有はSYSVOLレプリケーションの完了を示す証であり、`SysvolReady`レジストリ値と組み合わせて確認することで、DCの正常性をより確実に判断できます。

**今日から意識すべきこと**
1. `repadmin /showrepl`の出力を見るときは、「成功」の表示だけでなく、失敗回数と最終成功時刻もあわせて確認しましょう。
2. AD移行でDCを降格・撤去したら、`repadmin /replsummary`でその名前が完全に消えたことを確認してから作業完了と判断しましょう。

## 参考文献

- [Repadmin overview | Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-server/identity/repadmin-overview)
- [Monitoring and Troubleshooting Active Directory Replication Using Repadmin | Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-server/identity/useful-repadmin-commands)
- [Understanding SYSVOL Replication | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/storage/dfs-replication/migrate-sysvol-to-dfsr)
- [Overview of problems that are caused by disabling NTLM or administrative shares | Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/disable-administrative-shares)
