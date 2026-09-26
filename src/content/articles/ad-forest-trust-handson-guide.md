---
title: "買収を想定した2つの独立フォレスト間の信頼関係構築ハンズオン——フォレストトラストと、トラストだけでは解決しない課題"
description: "自社(example.com)とは無関係に育ってきた買収先企業(acquired.example)のADフォレストを想定し、2つの独立したフォレストの間にフォレストトラストを構築、クロスフォレストでのリソースアクセスを実際に確認する。マルチドメイン・マルチツリーのハンズオンで扱った「同一フォレスト内の自動的な信頼関係」とは異なり、独立したフォレスト同士の信頼関係は手動での構築が必須であることを体験したうえで、トラストだけでは解決しないユーザー・データ統合の課題と、ADMT(Active Directory Migration Tool)の現在地についても整理する。"
series: "active-directory"
subSeries: "handson"
order: 16
tags: ["windows-server", "active-directory", "infra", "identity", "handson", "trust"]
emoji: "🤝"
pubDate: 2026-09-25
---

## はじめに

- **この記事で得られること**: [マルチドメイン・マルチツリーのADフォレストを構築するハンズオン](/articles/ad-multidomain-handson-guide)では、**同じフォレストの中に**子ドメインや別ツリーを追加し、自動的に信頼関係が結ばれる様子を確認しました。本記事では、**最初から完全に独立して運用されてきた2つの別々のフォレスト**(たとえば、自社と買収した企業のADフォレスト)の間で、実際に**フォレストトラスト**を構築し、クロスフォレストでのリソースアクセスが成立する様子を確認します。あわせて、トラストの構築だけでは解決しない、ユーザーアカウント・データそのものの統合という課題と、そのための専用ツールであるADMT(Active Directory Migration Tool)の現在地についても整理します。
- **対象読者**: [マルチドメイン・マルチツリーのADフォレストを構築するハンズオン](/articles/ad-multidomain-handson-guide)を読み終え、同一フォレスト内の信頼関係は理解したものの、**完全に別々の会社・別々のフォレスト同士を統合する**という、より実務に近いシナリオでは何が違うのかを確かめたい方を想定しています。
- **読むのにかかる想定時間**: 約25分(実際に構築しながら進める場合は1.5〜2時間程度を見込んでください)

この記事は[『上位1%』シリーズ 全記事ガイド](/sitemap)の一部、[Active Directoryシリーズ](/sitemap#シリーズ一覧)の16本目です。[マルチドメイン・マルチツリーのADフォレストを構築するハンズオン](/articles/ad-multidomain-handson-guide)を先に読んでおくことを強く推奨します。VM自体の作成手順は[ハンズオン準備マニュアル](/articles/handson-prep-guide)と[Windows Serverの初期セットアップ](/articles/windows-server-setup-guide)を参照してください。

## 前提知識

- **フォレストは最上位のセキュリティ境界**: [ADとDC、ドメインとフォレストの違い](/articles/ad-dc-fundamentals-guide)で扱った通り、フォレストが異なれば、設定パーティション・スキーマパーティションも共有されず、信頼関係も自動的には発生しません。
- **同一フォレスト内の信頼関係との違い**: [マルチドメイン・マルチツリーのADフォレストを構築するハンズオン](/articles/ad-multidomain-handson-guide)で確認した、親ドメイン・子ドメイン間やツリールート間の**自動的な**信頼関係とは対照的に、本記事で扱う独立したフォレスト同士の信頼関係(**フォレストトラスト**)は、**管理者が明示的に構築しない限り、絶対に発生しません。**

## ハンズオンの前提条件

- Windows Server 2025のVMが2台。それぞれ独立した、既存のADフォレストのDC(1台目)として構築済みであること(前回のハンズオンの`example.com`をそのまま使うか、新規に構築してください)。
- もう1台、**買収した企業を想定した、まったく別のフォレストのDC**を新規に構築します。本記事では、次のホスト名・ドメイン名を使います。

| 役割 | ホスト名 | ドメイン名 |
|---|---|---|
| 自社フォレストのDC(既存) | `DC-CORP` | `example.com` |
| 買収先フォレストのDC(新規) | `DC-ACQ` | `acquired.example` |

`DC-ACQ`の構築手順は、[マルチドメイン・マルチツリーのADフォレストを構築するハンズオン](/articles/ad-multidomain-handson-guide)のフォレストルートドメイン構築手順とまったく同じです(ドメイン名だけを`acquired.example`に変えてください)。

## ハンズオン手順

### Step 1: 双方向のDNS名前解決を確立する

フォレストトラストを構築する前に、**双方のDCが、互いのドメイン名を名前解決できる**必要があります。[AD環境のDNS](/articles/ad-dns-guide)で扱った**条件付きフォワーダー**を、それぞれのDCに設定します。

`DC-CORP`側で実行:

```powershell
Add-DnsServerConditionalForwarderZone -Name "acquired.example" -MasterServers <DC-ACQのIPアドレス>
```

`DC-ACQ`側で実行:

```powershell
Add-DnsServerConditionalForwarderZone -Name "example.com" -MasterServers <DC-CORPのIPアドレス>
```

双方向で`nslookup`が通ることを確認してから、次のステップへ進んでください。

```powershell
nslookup acquired.example <DC-CORPで実行>
nslookup example.com <DC-ACQで実行>
```

### Step 2: フォレストトラストを構築する

`DC-CORP`上で、`netdom`コマンドを使い、双方向のフォレストトラストを構築します。

```powershell
netdom trust example.com /d:acquired.example /add /twoway `
    /UserD:acqadmin /PasswordD:* `
    /UserO:corpadmin /PasswordO:*
```

- `/d:acquired.example`: 信頼を結ぶ相手のドメイン(フォレスト)を指定します。
- `/twoway`: 双方向の信頼関係にします(片方向だけの信頼も可能です)。
- `/UserD`・`/PasswordD`: 相手側(acquired.example)の管理者資格情報です。
- `/UserO`・`/PasswordO`: 自分側(example.com)の管理者資格情報です。

成功すると、`ドメインとトラストの管理(Active Directory Domains and Trusts)`のMMCコンソールで、`example.com`のプロパティの「信頼」タブに`acquired.example`が表示されます。**[マルチドメイン・マルチツリーのハンズオン](/articles/ad-multidomain-handson-guide)では、この信頼関係が子ドメインやツリールートの追加時に何もしなくても自動的に成立していましたが、今回は完全に独立したフォレスト同士であるため、この`netdom trust`のコマンドを実行しない限り、永久に信頼関係は成立しません。** この違いこそが、本ハンズオンで最も体感してほしいポイントです。

<details>
<summary>SIDフィルタリングという既定のセキュリティ機能</summary>

フォレストトラストには既定で**SIDフィルタリング**という保護機能が有効になっています。これは、信頼された側のフォレストが、悪意を持って「自分は実はEnterprise Adminsのメンバーだ」というSID(セキュリティ識別子)を偽装して主張してきても、信頼する側のフォレストがそれを無条件に信じてしまわないようにする仕組みです。買収先の環境を完全に信頼しきれない場合や、セキュリティ監査の観点からは、この既定の保護を無効化しないことが推奨されます。

</details>

### Step 3: クロスフォレストでのリソースアクセスを確認する

`DC-CORP`側で、共有フォルダーを1つ作成し、**`acquired.example`側のユーザーに対して**、共有アクセス許可を付与します。

```powershell
New-Item -Path "C:\CrossForestShare" -ItemType Directory
New-SmbShare -Name "CrossForestShare" -Path "C:\CrossForestShare" -FullAccess "ACQUIRED\Domain Users"
```

**トラストが正しく機能していれば、フォレストが異なるにもかかわらず、`acquired.example`側のアカウント(`ACQUIRED\ドメインのユーザー名`)を、`example.com`側の共有アクセス許可の設定画面から選択できる**ようになっているはずです。実際に`acquired.example`ドメインのユーザーでログオンした端末から、`\\DC-CORP\CrossForestShare`へアクセスできることを確認してください。

## プロが見ている視点(上位1%の理解)

### トラストが解決する問題と、トラストでは解決しない問題

ここまでで、**「認証を跨がせる」という問題は解決しました**。しかし、実際の企業買収・組織統合の現場では、これだけでは終わりません。トラストが解決しないまま残る、典型的な課題には次のようなものがあります。

- **ユーザーアカウントそのものの重複**: 双方のフォレストに、たまたま同じユーザー名(`jsmith`など)が存在していた場合、トラストだけではこの衝突は解決しません。
- **最終的な統合(片方のフォレストの廃止)**: トラストは「2つの組織が別々のまま連携する」ための仕組みであり、最終的に片方のフォレストを完全に廃止し、すべてのユーザー・グループを一方へ統合したい場合には、まったく別の作業が必要になります。
- **既存のリソースへのアクセス権を保ったままの移行**: 単純にユーザーアカウントを作り直すと、旧アカウントのSIDに紐づいていたファイルサーバーなどのアクセス権が引き継がれません。

<details>
<summary>ADMT(Active Directory Migration Tool)の現在地</summary>

こうした「ユーザーアカウントを別フォレストへ、SID履歴(SID History、旧アカウントのSIDを新アカウントの属性として保持し、既存のアクセス権を維持する仕組み)ごと移行する」という作業のために、Microsoftは伝統的に**ADMT**(Active Directory Migration Tool)というツールを提供してきました。

ただし実務でADMTを検討する際は、**現在のADMTが置かれている状況を正確に理解しておく必要があります。** ADMTの開発は既に停止しており、Microsoft公式のサポートポリシーでも、移行元・移行先ともにWindows Server 2012 R2までが動作確認の対象で、Windows Server 2025のような最新バージョンでの動作は検証されていません。SQL Serverの専用インスタンスを別途用意する必要がある点も含め、**このブログのハンズオンで前提としているWindows Server 2025環境でADMTを実際に動かして検証することは推奨できない**、というのが正直なところです。そのため本記事では、ADMTを実際に動かすハンズオンとしては扱わず、**「トラストの先に、こうした専用ツールが必要になる領域がある」という事実と、その専用ツール自体が既に岐路に立たされている**という実務上の現在地を伝えるにとどめます。実際の統合プロジェクトでは、ADMTに代わる選択肢(サードパーティ製の移行ツール、あるいはMicrosoft Entra ID側でのID統合)を、案件の要件に応じて個別に調査・検証する必要があります。

</details>

## よくある誤解・つまずきポイント

- **誤解1: 「同じ会社のADであれば、フォレストが違っても自動的に信頼関係が結ばれる」**
  自動的な信頼関係が結ばれるのは、同一フォレスト内のドメイン同士(親子・ツリールート間)だけです。独立したフォレスト同士は、`netdom trust`のようなコマンドで明示的に構築しない限り、信頼関係は絶対に発生しません。
- **誤解2: 「フォレストトラストを構築すれば、企業統合はほぼ完了したことになる」**
  トラストが解決するのは認証・アクセス許可の連携だけです。ユーザーアカウントの重複解消や、最終的な片方のフォレストの廃止には、まったく別の作業(場合によっては専用の移行ツール)が必要です。

## 障害・トラブルシューティングの視点

1. **`netdom trust`が失敗する**: Step 1のDNS名前解決(条件付きフォワーダー)が、双方向で正しく機能しているかを確認します。名前解決に失敗していると、トラストの構築自体が失敗します。
2. **トラストは成立したのに、相手フォレストのユーザーが選択肢に出てこない**: SIDフィルタリングの設定や、トラストの方向(一方向・双方向)が意図通りになっているかを確認します。

### 予防策・恒久対策

- フォレストトラストを構築する前に、双方向のDNS名前解決(条件付きフォワーダー)を必ず先に確立し、疎通を確認する。
- 企業買収・組織統合のプロジェクトでは、トラストの構築と、ユーザー・データの実際の統合(専用ツールの要否)を、別々のフェーズとして計画する。

## まとめ

- 同一フォレスト内のドメイン同士とは異なり、完全に独立したフォレスト同士の信頼関係(フォレストトラスト)は、`netdom trust`のようなコマンドで管理者が明示的に構築しない限り、絶対に自動発生しません。
- フォレストトラストの構築には、事前に双方向のDNS名前解決(条件付きフォワーダー)を確立しておく必要があります。
- フォレストトラストが解決するのは認証・アクセス許可の連携までであり、ユーザーアカウントの重複解消や最終的なフォレスト統合には別の作業が必要です。
- ADMTはこの領域の伝統的な専用ツールですが、開発が停止しており、最新のWindows Serverバージョンでの動作は検証されていません。

**今日から意識すべきこと**
1. 「フォレストが違う」という言葉を聞いたら、信頼関係は自動発生しないという前提に立って設計しましょう。
2. トラストの構築(認証の連携)と、ユーザー・データの統合(専用ツールが必要な領域)は、別の課題として切り分けて考えましょう。

## 参考文献

- [How Trusts Work | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/adac/introduction-to-active-directory-domains-and-trusts)
- [Netdom trust | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/netdom-trust)
- [SID Filtering and Claims Transformation | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/security/kerberos/sid-filtering-and-claims-transformation)
- [Support policy and known issues for ADMT | Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-server/active-directory/support-policy-and-known-issues-for-admt)
