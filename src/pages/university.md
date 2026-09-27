---
layout: ../layouts/MarkdownPageLayout.astro
title: "『上位1%』大学——未経験からトップエンジニアまでの学部・学科・学年ロードマップ"
description: "『上位1%』シリーズを、大学の学部・学科・学年になぞらえて再編したロードマップ。未経験からAWS/Google級のトップエンジニアまでを見通せる、学科ごとのカリキュラムを提供する。"
lang: "ja"
altHref: "/en/university"
---

## このページについて

[サイトマップ](/sitemap)は、記事を全部読み切る前提の「STEP1〜STEP8」というロードマップになっていますが、記事数が増えるにつれて、それだけでは「今の自分に何が必要か」が見えにくくなってきました。このページは、その代わりに、**学部・学科・学年**という大学の比喩で、記事とハンズオンを再編したものです。

- **学部(Faculty)**: どの方向のエンジニアを目指すか、という大分類です。
- **学科(Department)**: 学部の中の専門領域です。1つの学科は、既存の「シリーズ」1つに、ほぼそのまま対応します。
- **学年(Grade)**: 記事・ハンズオンの難易度そのものです。教養課程から大学院、その先まで、未経験からトップエンジニアまでの距離を、段階として示します。

**現時点では、[ActiveDirectory学科](#activedirectory学科)と[AWS学科](#aws学科)が、学年構成をすべて満たす「開講済み」の学科です。** 他の学科は、今後のコンテンツ追加によって、少しずつ学年が埋まっていきます。既存の記事フォルダやURLは変更していません。このページは、あくまで「見せ方」を変えるための、追加の入り口です。

## 学年ラベルの共通ルール

すべての学科は、次の学年ラベルを共通で使います。

| 学年 | 対応するレベル | ゴールの目安 |
|---|---|---|
| 教養課程 | シリーズ横断の前提知識 | どの学科に進んでも困らない基礎ができている |
| 1年生 | 基礎編(概念)+ハンズオン基礎編(構築しながら覚える) | 手順書があれば、自分の手で構築できる |
| 2年生 | 補足・深掘り編 | 「なぜそうなっているのか」を、内部動作から説明できる |
| 3年生 | ハンズオン実務シナリオ編 | 実際の案件でよく遭遇する状況に、自力で対応できる |
| 4年生(卒業) | ハンズオンニッチ仕様編 | 細かな仕様・機能を正確に説明でき、トラブルシューティングできる |
| 大学院 | ハンズオンセキュリティ強化編(攻撃者視点) | 攻撃者の視点を理解した上で、防御を設計できる |
| アーキテクト | (今後拡充予定) | 複数の学科をまたいだシステム全体を設計できる |
| プリンシパルアーキテクト | (今後拡充予定) | 組織・案件をまたいだ設計方針そのものを作れる |
| フェロー | (今後拡充予定) | 技術そのものの方向性に影響を与えられる |

**大学院までは、多くの学科で「講義記事(座学)」と「ハンズオン(実技)」が学年ごとに組になっています。** アーキテクト以降は、特定の1学科だけでは完結しない、複数学科をまたいだ内容になる見込みのため、現時点ではまだ記事がありません。

## 学部・学科の全体像(ロードマップ)

現状のコンテンツ量に関わらず、最終的に用意したい学部・学科を、先に一覧化しています。「状態」列が「開講済み」以外の学科は、今後記事を追加していく対象です。

### サーバーエンジニア学部

| 学科 | 対応シリーズ | 状態 |
|---|---|---|
| ActiveDirectory学科 | [active-directory](/sitemap#シリーズ一覧) | 🎓 開講済み(大学院まで) |
| DNS基盤学科 | [dns](/sitemap#シリーズ一覧) / [dns-server](/sitemap#シリーズ一覧) | 📖 教養課程〜1年生相当 |
| メール基盤学科 | [messaging](/sitemap#シリーズ一覧) | 📖 教養課程〜1年生相当 |
| Linux基盤学科 | [linux](/sitemap#シリーズ一覧) | 📖 教養課程相当(全学科共通の基礎科目に近い) |
| Windows Server学科 | [windows-server](/sitemap#シリーズ一覧) | 📖 教養課程〜1年生相当 |
| ストレージ学科 | [storage](/sitemap#シリーズ一覧) | 🌱 記事少数 |

### ネットワークエンジニア学部

| 学科 | 対応シリーズ | 状態 |
|---|---|---|
| VPN学科 | [vpn](/sitemap#シリーズ一覧) / [modern-vpn](/sitemap#シリーズ一覧) / [site-to-site-vpn](/sitemap#シリーズ一覧) | 📖 教養課程〜1年生相当 |
| Webプロキシ・キャッシュ学科 | [web-proxy](/sitemap#シリーズ一覧) | 🌱 記事少数(1年生ハンズオンまで) |
| ロードバランシング学科 | (未着手) | ⬜ 未着手 |

### クラウドエンジニア学部

| 学科 | 対応シリーズ | 状態 |
|---|---|---|
| AWS学科 | [aws-basics](/sitemap#シリーズ一覧) | 🎓 開講済み(大学院まで) |
| Ansible/IaC学科 | [ansible](/sitemap#シリーズ一覧) | 📗 ハンズオン4段階まで開講(座学は教養課程相当のみ) |

### Web/APIエンジニア学部

| 学科 | 対応シリーズ | 状態 |
|---|---|---|
| Web/API学科 | [api](/sitemap#シリーズ一覧) | 🌱 記事少数 |

**凡例**: 🎓 大学院まで開講済み / 📗 ハンズオン4段階まで開講(座学は薄い) / 📖 教養課程〜1年生相当 / 🌱 記事少数 / ⬜ 未着手

## ActiveDirectory学科

現時点で唯一、学年構成のすべてを満たしている学科です。**この学科のカリキュラムをすべて自力で実施・理解できれば、ADにまつわるどのような実務案件にも対応できるレベル**を目標にしています。

### 教養課程(前提科目)

- [DNSの仕組みを『上位1%』の視点で理解する](/articles/dns-guide) — このシリーズ全体の前提になっている、名前解決の基礎です。

### 1年生:基礎編+初めてのハンズオン

**座学(基礎編、10記事)**

1. [ADとDC、ドメインとフォレストの違いを『上位1%』の視点で理解する](/articles/ad-dc-fundamentals-guide)
2. [sysdm.cplとnetdom computernameは何が違うのか](/articles/ad-computername-netdom-guide)
3. [Windowsのログインとユーザープロファイルの仕組みを『上位1%』の視点で理解する](/articles/ad-windows-login-guide)
4. [AD環境のDNSはなぜこう設計されているのか](/articles/ad-dns-guide)
5. [DNSゾーンとレコードの読み方を『上位1%』の視点で理解する](/articles/dns-zones-records-guide)
6. [FSMO(操作マスター)とは何かを『上位1%』の視点で理解する](/articles/fsmo-guide)
7. [DCの正常性確認を『上位1%』の視点で理解する](/articles/dc-health-check-guide)
8. [ADの「サイト」とレプリケーショントポロジーを『上位1%』の視点で理解する](/articles/ad-sites-guide)
9. [dcdiag /vの読み方を『上位1%』の視点で理解する](/articles/dcdiag-guide)
10. [AD移行後のクリーンアップを『上位1%』の視点で理解する](/articles/ad-migration-cleanup-guide)

**実技(ハンズオン基礎編、2記事)**

1. [マルチドメイン・マルチツリーのADフォレストを構築するハンズオン](/articles/ad-multidomain-handson-guide)
2. [旧DCから新DCへのAD移行(リプレース)ハンズオン](/articles/ad-migration-handson-guide)

### 2年生:補足・深掘り編

1. [SPN(サービスプリンシパル名)の仕組みを『上位1%』の視点で理解する](/articles/ad-spn-guide)
2. [Netlogonサービスとセキュアチャネルの仕組みを『上位1%』の視点で理解する](/articles/ad-netlogon-guide)
3. [Kerberos認証の仕組みを『上位1%』の視点で理解する](/articles/ad-kerberos-guide)
4. [SYSVOL・DFSR・グループポリシーの仕組みを『上位1%』の視点で理解する](/articles/ad-sysvol-dfsr-gpo-guide)
5. [AD DS・AD CS・AD FS・AD LDS・AD RMSの違いを『上位1%』の視点で理解する](/articles/ad-family-overview-guide)
6. [LDAPプロトコルの仕組みを『上位1%』の視点で理解する](/articles/ad-ldap-protocol-guide)
7. [NetBIOS名とDNSホスト名、なぜ2つの名前が共存しているのか](/articles/ad-netbios-dns-history-guide)
8. [ADのスキーマ拡張を『上位1%』の視点で理解する](/articles/ad-schema-extension-guide)
9. [.NET FrameworkとPowerShellの関係を『上位1%』の視点で理解する](/articles/ad-dotnet-powershell-guide)
10. [ISP(インターネットサービスプロバイダー)とは何かを『上位1%』の視点で理解する](/articles/ad-isp-guide)

### 3年生:実務シナリオ編ハンズオン

1. [買収を想定した2つの独立フォレスト間の信頼関係構築ハンズオン](/articles/ad-forest-trust-handson-guide)
2. [誤って削除したユーザー・OUを復元するAD ごみ箱のハンズオン](/articles/ad-recycle-bin-handson-guide)
3. [GPOを実際に作成・リンクし、優先順位とトラブルシューティングを体験するハンズオン](/articles/ad-gpo-handson-guide)
4. [きめ細かいパスワードポリシー(PSO)で部署ごとに異なるパスワード要件を適用するハンズオン](/articles/ad-fgpp-handson-guide)
5. [OUへの権限移譲(Delegation of Control)でヘルプデスクに権限だけを渡すハンズオン](/articles/ad-delegation-handson-guide)
6. [Kerberos制約付き委任で『ダブルホップ問題』を解決するハンズオン](/articles/ad-constrained-delegation-handson-guide)
7. [System Stateバックアップと権威的復元(Authoritative Restore)のハンズオン](/articles/ad-backup-restore-handson-guide)
8. [旧DCが完全に失われた状況を想定し、FSMOをシージ(強制移行)するハンズオン](/articles/ad-fsmo-seize-handson-guide)

### 4年生(卒業):ニッチな仕様・機能編ハンズオン

1. [gMSA(グループ管理サービスアカウント)でパスワード管理から解放されるハンズオン](/articles/ad-gmsa-handson-guide)
2. [AD CS(証明書サービス)でエンタープライズCAを構築し証明書の自動発行を体験するハンズオン](/articles/ad-cs-handson-guide)
3. [拠点展開のためのRODC(読み取り専用ドメインコントローラー)を構築するハンズオン](/articles/ad-rodc-handson-guide)
4. [ドメイン・フォレスト機能レベルを引き上げるハンズオン](/articles/ad-functional-level-handson-guide)
5. [AD統合DNSのスキャベンジング(古いレコードの自動削除)を設定するハンズオン](/articles/ad-dns-scavenging-handson-guide)
6. [サイトリンクのコスト設定でレプリケーション経路を制御するハンズオン](/articles/ad-sitelink-topology-handson-guide)

**この6本まで自力で実施・理解できれば、「4年生」として卒業水準です。**

### 大学院:セキュリティ強化編ハンズオン(攻撃者視点)

1. [Kerberoasting攻撃を自分の手で再現し、サービスアカウントを守るハンズオン](/articles/ad-kerberoasting-handson-guide)
2. [DCSyncが悪用する複製権限を監査し、Tier 0管理モデルで守るハンズオン](/articles/ad-dcsync-audit-handson-guide)

いずれも、自分が管理する検証環境の防御力を高めるための、教育・防御目的のハンズオンです。

### アーキテクト以降

まだ記事がありません。複数の学科(ADだけでなく、DNS・証明書基盤・監視なども含む)をまたいだ、組織全体のディレクトリサービス設計を扱う内容になる見込みです。今後、他の学科がある程度育ってきた段階で着手します。

### 耳で学ぶ補助教材(学年を問わず)

- [【音声で学ぶ】Active Directory講義 Part1〜4](/articles/ad-audio-lecture-1-guide)(全4回、記事を読まずにゼロから音声だけで学べます)
- [【音声で聴く】Active Directoryシリーズ総復習](/articles/ad-audio-review-guide)(卒業後の復習用)

## AWS学科

ActiveDirectory学科に続いて、学年構成のすべてを満たした学科です。**この学科のカリキュラムをすべて自力で実施・理解できれば、AWS上でのシステム構築・運用・セキュリティ対応を、一通り自力で回せるレベル**を目標にしています。

### 教養課程(前提科目)

- [ハンズオン準備マニュアル:AWSマネジメントコンソールの基本操作](/articles/aws-console-setup-guide) — マネジメントコンソールの画面操作に不慣れな場合は、先にこちらを読んでおくと、以降のハンズオンで迷いません。

### 1年生:基礎編+初めてのハンズオン

**座学(基礎編、4記事)**

1. [EC2のキーペアとサブネットの予約IPを『上位1%』の視点で理解する](/articles/aws-ec2-networking-basics-guide)
2. [AWSのリージョン・アベイラビリティーゾーン・エッジロケーションを『上位1%』の視点で理解する](/articles/aws-global-infrastructure-guide)
3. [EC2の料金モデル(オンデマンド・リザーブド・スポット)を『上位1%』の視点で理解する](/articles/aws-ec2-pricing-models-guide)
4. [責任共有モデルを『上位1%』の視点で理解する](/articles/aws-shared-responsibility-model-guide)

**実技(ハンズオン基礎編、1記事)**

1. [AWSでEC2インスタンスを起動し、Webサーバーを公開するハンズオン](/articles/aws-ec2-webserver-handson-guide)

### 2年生:補足・深掘り編

1. [IAMポリシーの評価ロジックを『上位1%』の視点で理解する](/articles/aws-iam-policy-evaluation-guide)
2. [S3のストレージクラスとライフサイクルポリシーを『上位1%』の視点で理解する](/articles/aws-s3-storage-classes-guide)
3. [セキュリティグループとネットワークACL(NACL)の違いを『上位1%』の視点で理解する](/articles/aws-nacl-security-group-guide)

### 3年生:実務シナリオ編ハンズオン

1. [IAMロールでEC2にアクセスキーを一切持たせないハンズオン](/articles/aws-iam-role-handson-guide)
2. [S3バケットで静的Webサイトを公開するハンズオン](/articles/aws-s3-static-website-handson-guide)
3. [パブリック/プライベートサブネットを持つVPCを自力で構築するハンズオン](/articles/aws-vpc-handson-guide)
4. [RDSとSecrets Managerでアプリにパスワードを一切書かせないハンズオン](/articles/aws-rds-secrets-handson-guide)

### 4年生(卒業):ニッチな仕様・機能編ハンズオン

1. [VPCエンドポイントでNATゲートウェイを経由せずS3にアクセスするハンズオン](/articles/aws-vpc-endpoint-handson-guide)
2. [EBSスナップショットとAMIでバックアップ・リストア戦略を組むハンズオン](/articles/aws-ebs-snapshot-handson-guide)

**この2本まで自力で実施・理解できれば、「4年生」として卒業水準です。**

### 大学院:セキュリティ強化編ハンズオン(攻撃者視点)

1. [過剰な権限を持つIAMポリシーの危険性を再現し、最小権限に絞り込むハンズオン](/articles/aws-least-privilege-policy-handson-guide)
2. [CloudTrailとGuardDutyで漏洩したアクセスキーの不正利用を検知するハンズオン](/articles/aws-cloudtrail-guardduty-handson-guide)

いずれも、自分が管理する検証環境の防御力を高めるための、教育・防御目的のハンズオンです。

### アーキテクト以降

まだ記事がありません。複数の学科(AWSだけでなく、Ansible/IaCやネットワーク設計なども含む)をまたいだ、システム全体のアーキテクチャ設計を扱う内容になる見込みです。

### 耳で学ぶ補助教材(学年を問わず)

- [【音声で聴く】AWS基礎シリーズ総復習](/articles/aws-basics-audio-review-guide)(卒業後の復習用)

## 今後の予定

- 各学科の卒業要件として、複数学年の内容を組み合わせた**総合演習(卒業制作)ハンズオン**を新設する予定です。
- 成果物をGitHubリポジトリなどの形でまとめ、転職活動のポートフォリオとして使える形式を検討しています。
- ActiveDirectory学科以外の学科についても、既存のクイズ機能を「卒業試験」として位置づけるなど、大学の比喩に沿った拡張を進めていきます。
