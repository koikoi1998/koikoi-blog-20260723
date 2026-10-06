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

**現時点では、[ActiveDirectory学科](#activedirectory学科)・[AWS学科](#aws学科)・[Ansible/IaC学科](#ansibleiac学科)・[VPN学科](#vpn学科)・[DNS基盤学科](#dns基盤学科)・[メール基盤学科](#メール基盤学科)・[Windows Server学科](#windows-server学科)・[ロードバランシング学科](#ロードバランシング学科)・[Web/API学科](#webapi学科)・[ストレージ学科](#ストレージ学科)・[Linux基盤学科](#linux基盤学科)・[Webプロキシ・キャッシュ学科](#webプロキシキャッシュ学科)が、学年構成をすべて満たす「開講済み」の学科です。** 他の学科は、今後のコンテンツ追加によって、少しずつ学年が埋まっていきます。既存の記事フォルダやURLは変更していません。このページは、あくまで「見せ方」を変えるための、追加の入り口です。

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

## 卒業試験について

各学科の記事には、それぞれ[確認問題](/quiz)が用意されています。新しく機能を追加したものではなく、このサイトに以前からある確認問題を、大学の比喩に沿って「卒業試験」として位置づけ直したものです。[確認問題](/quiz)のテーマ別モードで、その学科の記事を選んで挑戦してください。特に、その学科が「開講済み」であれば4年生・大学院の記事、そうでなければ現時点での最終学年の記事に、自力で正解できるかどうかが、卒業(あるいは、その学年を修了したこと)の目安になります。間違えた問題は、紐づいている記事に戻って復習しましょう。

## 学部・学科の全体像(ロードマップ)

現状のコンテンツ量に関わらず、最終的に用意したい学部・学科を、先に一覧化しています。「状態」列が「開講済み」以外の学科は、今後記事を追加していく対象です。

### サーバーエンジニア学部

| 学科 | 対応シリーズ | 状態 |
|---|---|---|
| ActiveDirectory学科 | [active-directory](/sitemap#シリーズ一覧) | 🎓 開講済み(大学院まで) |
| DNS基盤学科 | [dns](/sitemap#シリーズ一覧) | 🎓 開講済み(大学院まで) |
| メール基盤学科 | [messaging](/sitemap#シリーズ一覧) | 🎓 開講済み(大学院まで) |
| Linux基盤学科 | [linux](/sitemap#シリーズ一覧) | 🎓 開講済み(大学院まで) |
| Windows Server学科 | [windows-server](/sitemap#シリーズ一覧) | 🎓 開講済み(大学院まで) |
| ストレージ学科 | [storage](/sitemap#シリーズ一覧) | 🎓 開講済み(大学院まで) |

### ネットワークエンジニア学部

| 学科 | 対応シリーズ | 状態 |
|---|---|---|
| VPN学科 | [vpn](/sitemap#シリーズ一覧) / [modern-vpn](/sitemap#シリーズ一覧) / [site-to-site-vpn](/sitemap#シリーズ一覧) | 🎓 開講済み(大学院まで) |
| Webプロキシ・キャッシュ学科 | [web-proxy](/sitemap#シリーズ一覧) | 🎓 開講済み(大学院まで) |
| ロードバランシング学科 | [load-balancing](/sitemap#シリーズ一覧) | 🎓 開講済み(大学院まで) |

### クラウドエンジニア学部

| 学科 | 対応シリーズ | 状態 |
|---|---|---|
| AWS学科 | [aws-basics](/sitemap#シリーズ一覧) | 🎓 開講済み(大学院まで) |
| Ansible/IaC学科 | [ansible](/sitemap#シリーズ一覧) | 🎓 開講済み(大学院まで) |

### Web/APIエンジニア学部

| 学科 | 対応シリーズ | 状態 |
|---|---|---|
| Web/API学科 | [api](/sitemap#シリーズ一覧) | 🎓 開講済み(大学院まで) |

**凡例**: 🎓 大学院まで開講済み / 📗 ハンズオン4段階まで開講(座学は薄い) / 📙 3年生相当まで到達 / 📖 教養課程〜1年生相当 / 🌱 記事少数 / ⬜ 未着手

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
4. [NTLM認証の仕組みを『上位1%』の視点で理解する](/articles/ad-ntlm-mechanism-guide)
5. [IAKerbとローカルKDCの仕組みを『上位1%』の視点で理解する](/articles/ad-iakerb-localkdc-guide)
6. [AES128とAES256、そしてKerberosにおけるSHA-1の役割を『上位1%』の視点で理解する](/articles/ad-kerberos-encryption-types-guide)
7. [Windows 11 24H2/WindowsServer 2025以降のRDP認証の変更点を『上位1%』の視点で理解する](/articles/ad-rdp-auth-changes-guide)
8. [SYSVOL・DFSR・グループポリシーの仕組みを『上位1%』の視点で理解する](/articles/ad-sysvol-dfsr-gpo-guide)
9. [AD DS・AD CS・AD FS・AD LDS・AD RMSの違いを『上位1%』の視点で理解する](/articles/ad-family-overview-guide)
10. [LDAPプロトコルの仕組みを『上位1%』の視点で理解する](/articles/ad-ldap-protocol-guide)
11. [NetBIOS名とDNSホスト名、なぜ2つの名前が共存しているのか](/articles/ad-netbios-dns-history-guide)
12. [ADのスキーマ拡張を『上位1%』の視点で理解する](/articles/ad-schema-extension-guide)
13. [.NET FrameworkとPowerShellの関係を『上位1%』の視点で理解する](/articles/ad-dotnet-powershell-guide)
14. [ISP(インターネットサービスプロバイダー)とは何かを『上位1%』の視点で理解する](/articles/ad-isp-guide)

### 3年生:実務シナリオ編ハンズオン

1. [買収を想定した2つの独立フォレスト間の信頼関係構築ハンズオン](/articles/ad-forest-trust-handson-guide)
2. [誤って削除したユーザー・OUを復元するAD ごみ箱のハンズオン](/articles/ad-recycle-bin-handson-guide)
3. [GPOを実際に作成・リンクし、優先順位とトラブルシューティングを体験するハンズオン](/articles/ad-gpo-handson-guide)
4. [きめ細かいパスワードポリシー(PSO)で部署ごとに異なるパスワード要件を適用するハンズオン](/articles/ad-fgpp-handson-guide)
5. [OUへの権限移譲(Delegation of Control)でヘルプデスクに権限だけを渡すハンズオン](/articles/ad-delegation-handson-guide)
6. [Kerberos制約付き委任で『ダブルホップ問題』を解決するハンズオン](/articles/ad-constrained-delegation-handson-guide)
7. [System Stateバックアップと権威的復元(Authoritative Restore)のハンズオン](/articles/ad-backup-restore-handson-guide)
8. [旧DCが完全に失われた状況を想定し、FSMOをシージ(強制移行)するハンズオン](/articles/ad-fsmo-seize-handson-guide)
9. [【障害調査】新DC昇格後にAdministratorでログインできなくなる事象を、エラーから調査するハンズオン](/articles/ad-dc-replace-ntlm-lockout-investigation-guide)
10. [DCリプレース前に、特権アカウントのパスワードを棚卸し・再設定するハンズオン](/articles/ad-privileged-password-refresh-handson-guide)

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
3. [制約なし委任(Unconstrained Delegation)の危険性を自分の手で再現し、『センシティブで委任不可』による防御を確認するハンズオン](/articles/ad-unconstrained-delegation-handson-guide)

いずれも、自分が管理する検証環境の防御力を高めるための、教育・防御目的のハンズオンです。

### 卒業制作(キャップストーン)

1. [ActiveDirectory学科の卒業制作:買収統合シナリオを、ポートフォリオとして完成させる総合演習](/articles/ad-capstone-handson-guide)

これまでのハンズオンで個別に習得した技術(フォレスト間の信頼関係、GPO、権限移譲、gMSA、バックアップ、Kerberoasting/DCSync監査)を、1つの架空の企業買収シナリオへ、自分の力で統合する総合演習です。手順をなぞる力ではなく、要件から自分で設計する力が求められ、成果物は転職活動でも使えるポートフォリオとしてまとめます。

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

### 卒業制作(キャップストーン)

1. [AWS学科の卒業制作:架空のECサイトのインフラを、ポートフォリオとして完成させる総合演習](/articles/aws-capstone-handson-guide)

これまでのハンズオンで個別に習得した技術(VPC設計、EC2、RDS/Secrets Manager、S3、IAMロール、VPCエンドポイント、EBSバックアップ、最小権限ポリシー、CloudTrail/GuardDuty)を、1つの架空のECサイト移行シナリオへ、自分の力で統合する総合演習です。手順をなぞる力ではなく、要件から自分で設計する力が求められ、成果物は転職活動でも使えるポートフォリオとしてまとめます。

### アーキテクト以降

まだ記事がありません。複数の学科(AWSだけでなく、Ansible/IaCやネットワーク設計なども含む)をまたいだ、システム全体のアーキテクチャ設計を扱う内容になる見込みです。

### 耳で学ぶ補助教材(学年を問わず)

- [【音声で聴く】AWS基礎シリーズ総復習](/articles/aws-basics-audio-review-guide)(卒業後の復習用)

## Ansible/IaC学科

AWS学科に続いて、3つ目の「開講済み」学科です。**この学科のカリキュラムをすべて自力で実施・理解できれば、実務レベルのAnsible構成管理を、チームでの運用まで見据えて自力で回せるレベル**を目標にしています。

### 教養課程(前提科目)

- [ハンズオン準備マニュアル:Ubuntuサーバーの初期セットアップ](/articles/ubuntu-server-setup-guide) — Ansibleが土台にしているSSH接続の基本です。

### 1年生:基礎編+初めてのハンズオン

**座学(基礎編、4記事)**

1. [Ansibleとは何かを『上位1%』の視点で理解する](/articles/ansible-guide)
2. [ansible.cfgと設定の優先順位を『上位1%』の視点で理解する](/articles/ansible-cfg-guide)
3. [Ansibleの変数の優先順位を『上位1%』の視点で理解する](/articles/ansible-variable-precedence-guide)
4. [AnsibleのCheck ModeとDiff Modeを『上位1%』の視点で理解する](/articles/ansible-check-diff-mode-guide)

**実技(ハンズオン基礎編、1記事)**

1. [Ansibleで複数サーバーへの設定投入を自動化するハンズオン](/articles/ansible-handson-guide)

### 2年生:補足・深掘り編

1. [Ansibleの実行戦略(strategy)とforkの並列度を『上位1%』の視点で理解する](/articles/ansible-execution-strategy-guide)
2. [Ansibleのignore_errors・any_errors_fatal・failed_whenを『上位1%』の視点で理解する](/articles/ansible-error-handling-strategies-guide)
3. [Ansible Tower/AWXを『上位1%』の視点で理解する](/articles/ansible-tower-awx-overview-guide)

### 3年生:実務シナリオ編ハンズオン

1. [Ansibleのroles・Handlers・テンプレートで実務レベルの構成管理を体験するハンズオン](/articles/ansible-roles-handson-guide)
2. [Ansible Vaultでパスワードをgitにプレーンテキストのまま置かないハンズオン](/articles/ansible-vault-handson-guide)
3. [AnsibleでAWSの動的インベントリを使い、静的なIPリストから解放されるハンズオン](/articles/ansible-aws-dynamic-inventory-handson-guide)
4. [Ansibleでdev/staging/prodを1つのPlaybookで安全に使い分けるハンズオン](/articles/ansible-environments-handson-guide)
5. [Ansible Galaxyでコミュニティ製のroleとCollectionを使うハンズオン](/articles/ansible-galaxy-collections-handson-guide)

### 4年生(卒業):ニッチな仕様・機能編ハンズオン

1. [AnsibleのJinja2フィルターとloop・whenの落とし穴を体験するハンズオン](/articles/ansible-jinja2-loops-handson-guide)
2. [Ansibleのfacts収集をキャッシュして大規模インベントリを高速化するハンズオン](/articles/ansible-facts-caching-handson-guide)
3. [Ansibleのblock/rescue/alwaysで構成変更失敗時のロールバックを設計するハンズオン](/articles/ansible-error-handling-handson-guide)

**この3本まで自力で実施・理解できれば、「4年生」として卒業水準です。**

### 大学院:セキュリティ強化編ハンズオン(攻撃者視点)

1. [Ansible実行時に機密情報がログとプロセス一覧に漏れる経路を塞ぐハンズオン](/articles/ansible-secrets-exposure-handson-guide)

自分が管理する検証環境の防御力を高めるための、教育・防御目的のハンズオンです。

### 卒業制作(キャップストーン)

1. [Ansible/IaC学科の卒業制作:架空のスタートアップの構成管理基盤を、ポートフォリオとして完成させる総合演習](/articles/ansible-capstone-handson-guide)

これまでのハンズオンで個別に習得した技術(roles/Handlers/テンプレート、Vault、AWS動的インベントリ、環境分離、Galaxy、エラーハンドリング、機密情報保護)を、1つの架空のスタートアップの構成管理基盤へ、自分の力で統合する総合演習です。手順をなぞる力ではなく、要件から自分で設計する力が求められ、成果物は転職活動でも使えるポートフォリオとしてまとめます。

### アーキテクト以降

まだ記事がありません。AWS学科と同様、複数学科をまたいだシステム全体のアーキテクチャ設計を扱う内容になる見込みです。

### 耳で学ぶ補助教材(学年を問わず)

- [【音声で聴く】Ansibleシリーズ総復習](/articles/ansible-audio-review-guide)(卒業後の復習用)

## VPN学科

ActiveDirectory学科・AWS学科・Ansible/IaC学科に続く4つ目の「開講済み」学科です。**この学科は、既存の[vpn](/sitemap#シリーズ一覧)・[modern-vpn](/sitemap#シリーズ一覧)・[site-to-site-vpn](/sitemap#シリーズ一覧)という3つのシリーズをまたいで構成されている点が、他の「開講済み」学科と異なります。** この学科のカリキュラムをすべて自力で実施・理解できれば、リモートアクセスVPN・現代的なVPNプロトコル・拠点間VPNのいずれについても、設計から構築、トラブルシューティング、セキュリティ強化まで一通り自力で対応できるレベルを目標にしています。

### 教養課程(前提科目)

- [NAT/NAPTの仕組みを『上位1%』の視点で理解する](/articles/nat-guide) — IPsecのNAT越え(NAT-T)を理解するための前提になっています。

### 1年生:基礎編+初めてのハンズオン

**座学(基礎編、3記事)**

1. [L2TP/IPsecの仕組みを『上位1%』の視点で理解する](/articles/l2tp-ipsec-guide)
2. [なぜ同一セグメントなのにVPNクライアントにゲートウェイが必要なのか](/articles/windows-server-l2tp-vpn-guide)
3. [L2TP/IPsecと現代的なVPNプロトコルを『上位1%』の視点で比較する](/articles/vpn-protocols-comparison-guide)

**実技(ハンズオン基礎編、1記事)**

1. [L2TP/IPsecサーバーを自作し、理論を自分の目で検証するハンズオン](/articles/l2tp-ipsec-lab-guide)

### 2年生:補足・深掘り編

1. [IPsecのAH(Authentication Header)とは何かを『上位1%』の視点で理解する](/articles/ipsec-ah-guide)
2. [Windows Server RRASのVPNアクセス・ダイヤルアップ・デマンドダイヤル・NAT・LANルーティングの違いを『上位1%』の視点で理解する](/articles/windows-rras-roles-guide)
3. [OpenVPNの仕組みを『上位1%』の視点で理解する](/articles/openvpn-internals-guide)
4. [WireGuardの仕組みを『上位1%』の視点で理解する](/articles/wireguard-internals-guide)
5. [Tailscaleの仕組みを『上位1%』の視点で理解する](/articles/tailscale-internals-guide)
6. [ZTNA(ゼロトラストネットワークアクセス)とは何かを『上位1%』の視点で理解する](/articles/ztna-guide)

### 3年生:実務シナリオ編ハンズオン

1. [L2TP/IPsecトラブルシューティング演習](/articles/l2tp-ipsec-troubleshooting-lab)
2. [WireGuardトンネルを自分の手で構築し、Cryptokey Routingを体感するハンズオン](/articles/wireguard-handson-guide)

### 4年生(卒業):ニッチな仕様・機能編

**座学(3記事)**

1. [拠点間VPN(Site-to-Site VPN)を『上位1%』の視点で理解する](/articles/site-to-site-vpn-guide)
2. [AWSとの拠点間VPN(Site-to-Site VPN)を『上位1%』の視点で理解する](/articles/site-to-site-vpn-aws-guide)
3. [SD-WANとエッジルーター選定を『上位1%』の視点で理解する](/articles/sdwan-edge-router-guide)

**実技(1記事)**

1. [strongSwanで異なるベンダー間のSite-to-Site IPsecトンネルを模擬構築するハンズオン](/articles/site-to-site-vpn-handson-guide)

**この4本まで自力で実施・理解できれば、「4年生」として卒業水準です。**

### 大学院:セキュリティ強化編ハンズオン(攻撃者視点)

1. [IKE Aggressive ModeとPSKに対するオフライン辞書攻撃を再現し、IKEv2への移行で防ぐハンズオン](/articles/ike-psk-cracking-handson-guide)

自分が管理する検証環境の防御力を高めるための、教育・防御目的のハンズオンです。

### 卒業制作(キャップストーン)

1. [VPN学科の卒業制作:架空の多拠点企業のVPN基盤を、ポートフォリオとして完成させる総合演習](/articles/vpn-capstone-handson-guide)

これまでのハンズオンで個別に習得した技術(Site-to-Site VPN、WireGuard、L2TP/IPsec、IKEv2によるPSK強化、トラブルシューティング)を、1つの架空の多拠点企業のVPN基盤へ、自分の力で統合する総合演習です。手順をなぞる力ではなく、要件から自分で設計する力が求められ、成果物は転職活動でも使えるポートフォリオとしてまとめます。

### アーキテクト以降

まだ記事がありません。他の学科と同様、複数学科をまたいだシステム全体のアーキテクチャ設計を扱う内容になる見込みです。

### 耳で学ぶ補助教材(学年を問わず)

- [【音声で聴く】リモートアクセスVPN/L2TP・IPsecシリーズ総復習](/articles/vpn-audio-review-guide)(卒業後の復習用)
- [【音声で聴く】現代的VPNプロトコル深掘りシリーズ総復習](/articles/modern-vpn-audio-review-guide)(卒業後の復習用)
- [【音声で聴く】拠点間VPN(Site-to-Site VPN)シリーズ総復習](/articles/site-to-site-vpn-audio-review-guide)(卒業後の復習用)

## ロードバランシング学科

記事が1本もない「未着手」状態から新設され、ActiveDirectory・AWS・Ansible/IaC・VPN・DNS基盤・メール基盤・Windows Serverに続く8つ目の「開講済み」学科に到達しました。対応シリーズは[load-balancing](/sitemap#シリーズ一覧)です。この学科のカリキュラムをすべて自力で実施・理解できれば、L4/L7ロードバランサーの違い、振り分けアルゴリズムとヘルスチェックの設計、TLS証明書の配置方式(ターミネーション/パススルー/ブリッジング)、ロードバランサー自体の冗長化、GSLBによる広域分散、そしてDSRやHTTPリクエストスマグリングのようなニッチな仕様・セキュリティ上の弱点まで、実務レベルで判断できることを目標にしています。

### 教養課程(前提科目)

なし。

### 1年生:基礎編+初めてのハンズオン

**座学(基礎編、3記事)**

1. [ロードバランサーのL4とL7の違いを『上位1%』の視点で理解する](/articles/load-balancing-fundamentals-guide)
2. [ロードバランシングのアルゴリズムとヘルスチェックの仕組みを『上位1%』の視点で理解する](/articles/load-balancing-algorithms-guide)
3. [SSLターミネーションとSSLパススルーの違いを『上位1%』の視点で理解する](/articles/load-balancing-ssl-termination-guide)

**実技(ハンズオン基礎編、1記事)**

1. [HAProxyでL7ロードバランサーを構築し、複数のバックエンドサーバーへ振り分けるハンズオン](/articles/load-balancing-haproxy-handson-guide)

**この4本まで自力で実施・理解できれば、「1年生」として一区切りです。**

### 2年生:補足・深掘り編

1. [GSLB(グローバルサーバーロードバランシング)の仕組みを『上位1%』の視点で理解する](/articles/load-balancing-gslb-guide)
2. [ロードバランサー自体の冗長化を『上位1%』の視点で理解する](/articles/load-balancing-vrrp-keepalived-guide)
3. [PROXY protocolの仕組みを『上位1%』の視点で理解する](/articles/load-balancing-proxy-protocol-guide)

### 3年生:実務シナリオ編ハンズオン

1. [keepalivedで2台のHAProxyを冗長化し、VIPの自動フェイルオーバーを体験するハンズオン](/articles/load-balancing-keepalived-handson-guide)

### 4年生(卒業):ニッチな仕様・機能編ハンズオン

1. [IPVSでDSR(Direct Server Return)を構築し、応答がロードバランサーを経由しない設計を体感するハンズオン](/articles/load-balancing-dsr-handson-guide)

**この1本まで自力で実施・理解できれば、「4年生」として卒業水準です。**

### 大学院:セキュリティ強化編ハンズオン(攻撃者視点)

1. [HTTPリクエストスマグリングの原理をCurlとNetcatで再現し、HAProxyの厳格なパース処理による防御を確認するハンズオン](/articles/load-balancing-request-smuggling-handson-guide)

自分が管理する検証環境の防御力を高めるための、教育・防御目的のハンズオンです(第三者のシステムへの攻撃手順は一切含みません)。

### 卒業制作(キャップストーン)

1. [ロードバランシング学科の卒業制作:架空の動画配信スタートアップの負荷分散基盤を、ポートフォリオとして完成させる総合演習](/articles/load-balancing-capstone-handson-guide)

これまでのハンズオンで個別に習得した技術(GSLB、HAProxyによるL7ロードバランシング、VRRP/keepalivedによる冗長化、SSL配置方式の選定、DSR、PROXY protocolによるクライアントIP保持、HTTPリクエストスマグリング対策)を、1つの架空の動画配信スタートアップの負荷分散基盤へ、自分の力で統合する総合演習です。手順をなぞる力ではなく、要件から自分で設計する力が求められ、成果物は転職活動でも使えるポートフォリオとしてまとめます。

### アーキテクト以降

まだ記事がありません。他の学科と同様、複数学科をまたいだシステム全体のアーキテクチャ設計を扱う内容になる見込みです。

### 耳で学ぶ補助教材(学年を問わず)

- [【音声で聴く】ロードバランシング基礎シリーズ総復習](/articles/load-balancing-audio-review-guide)(卒業後の復習用)

## DNS基盤学科

ActiveDirectory・AWS・Ansible/IaC・VPNに続く5つ目の「開講済み」学科です。この学科のカリキュラムをすべて自力で実施・理解できれば、BINDでのDNSサーバー構築・運用、DNSSECによる署名・検証、そして委任やDNS増幅攻撃への防御まで、実務レベルで扱えるようになることを目標にしています。

### 教養課程(前提科目)

- [DNSの仕組みを『上位1%』の視点で理解する](/articles/dns-guide) — このシリーズ全体の前提になっている、名前解決の基礎です。

### 1年生:基礎編+初めてのハンズオン

**座学(基礎編、2記事)**

1. [DNSサーバーの基礎を『上位1%』の視点で理解する](/articles/dns-server-fundamentals-guide)
2. [digとnslookupの使い方・使い分けを『上位1%』の視点で理解する](/articles/dig-nslookup-guide)

**実技(ハンズオン基礎編、1記事)**

1. [BINDでDNSサーバーを構築し、ゾーン転送を体験するハンズオン](/articles/dns-server-handson-guide)

### 2年生:補足・深掘り編

1. [DNSSECの仕組みを『上位1%』の視点で理解する](/articles/dns-dnssec-fundamentals-guide)
2. [再帰リゾルバとフォワーダー、ネガティブキャッシュの仕組みを『上位1%』の視点で理解する](/articles/dns-recursive-caching-guide)
3. [スプリットホライズンDNS(BINDのviews)の仕組みを『上位1%』の視点で理解する](/articles/dns-split-horizon-guide)
4. [DNS over HTTPS(DoH)とDNS over TLS(DoT)の仕組みを『上位1%』の視点で理解する](/articles/dns-doh-dot-guide)

### 3年生:実務シナリオ編ハンズオン

1. [BINDでゾーンにDNSSEC署名を行い、検証失敗(SERVFAIL)を自分の手で再現するハンズオン](/articles/dns-dnssec-handson-guide)

### 4年生(卒業):ニッチな仕様・機能編ハンズオン

1. [サブドメインの委任(Delegation)を自分の手で構築し、Lame Delegationを再現するハンズオン](/articles/dns-delegation-handson-guide)

**この1本まで自力で実施・理解できれば、「4年生」として卒業水準です。**

### 大学院:セキュリティ強化編ハンズオン(攻撃者視点)

1. [DNS増幅攻撃の仕組みを自分の目で確認し、レスポンスレートリミティング(RRL)で防御するハンズオン](/articles/dns-amplification-rrl-handson-guide)

自分が管理する検証環境の防御力を高めるための、教育・防御目的のハンズオンです(送信元IPアドレスの偽装は一切扱いません)。

### 卒業制作(キャップストーン)

1. [DNS基盤学科の卒業制作:架空企業のDNS基盤を、ポートフォリオとして完成させる総合演習](/articles/dns-capstone-handson-guide)

これまでのハンズオンで個別に習得した技術(マスター/スレーブ構成とゾーン転送、スプリットホライズン、サブドメイン委任、DNSSEC、DNS増幅攻撃対策)を、1つの架空企業のDNS基盤へ、自分の力で統合する総合演習です。手順をなぞる力ではなく、要件から自分で設計する力が求められ、成果物は転職活動でも使えるポートフォリオとしてまとめます。

### アーキテクト以降

まだ記事がありません。他の学科と同様、複数学科をまたいだシステム全体のアーキテクチャ設計を扱う内容になる見込みです。

### 耳で学ぶ補助教材(学年を問わず)

- [【音声で聴く】DNSサーバー基礎シリーズ総復習](/articles/dns-audio-review-guide)(卒業後の復習用)

## メール基盤学科

ActiveDirectory・AWS・Ansible/IaC・VPN・DNS基盤に続く6つ目の「開講済み」学科です。この学科のカリキュラムをすべて自力で実施・理解できれば、Postfix/Dovecotでのメールサーバー構築・運用、SPF/DKIMによるなりすまし対策、そしてバーチャルドメインの運用やオープンリレー対策まで、実務レベルで扱えるようになることを目標にしています。

### 教養課程(前提科目)

なし(DNSの基礎知識があれば十分です)。

### 1年生:基礎編+初めてのハンズオン

**座学(基礎編、2記事)**

1. [M365へのメール移行を『上位1%』の視点で理解する](/articles/m365-email-fundamentals-guide)
2. [メールサーバーの基礎を『上位1%』の視点で理解する](/articles/mail-server-fundamentals-guide)

**実技(ハンズオン基礎編、1記事)**

1. [PostfixとDovecotでメールサーバーを構築するハンズオン](/articles/mail-server-handson-guide)

### 2年生:補足・深掘り編

1. [SPF・DKIM・DMARCの仕組みを『上位1%』の視点で理解する](/articles/mail-spf-dkim-dmarc-guide)
2. [メールキューとバウンスの仕組みを『上位1%』の視点で理解する](/articles/mail-queue-bounce-guide)
3. [SMTPにおけるSTARTTLSの仕組みを『上位1%』の視点で理解する](/articles/mail-tls-encryption-guide)

### 3年生:実務シナリオ編ハンズオン

1. [PostfixにSPFチェックとDKIM署名を実装するハンズオン](/articles/mail-spf-dkim-dmarc-handson-guide)

### 4年生(卒業):ニッチな仕様・機能編ハンズオン

1. [Postfixで複数ドメインのメールを1台で中継するバーチャルドメインを構築するハンズオン](/articles/mail-virtual-domains-handson-guide)

**この1本まで自力で実施・理解できれば、「4年生」として卒業水準です。**

### 大学院:セキュリティ強化編ハンズオン(攻撃者視点)

1. [オープンリレーを自分の手で再現し、正しい制限設定で防御するハンズオン](/articles/mail-open-relay-handson-guide)

自分が管理する検証環境の防御力を高めるための、教育・防御目的のハンズオンです。

### 卒業制作(キャップストーン)

1. [メール基盤学科の卒業制作:架空企業のメール基盤を、ポートフォリオとして完成させる総合演習](/articles/mail-capstone-handson-guide)

これまでのハンズオンで個別に習得した技術(Postfix/Dovecot構築、バーチャルドメイン、SPF/DKIM/DMARC、STARTTLS、オープンリレー対策、バウンス処理)を、1つの架空企業のメール基盤へ、自分の力で統合する総合演習です。手順をなぞる力ではなく、要件から自分で設計する力が求められ、成果物は転職活動でも使えるポートフォリオとしてまとめます。

### アーキテクト以降

まだ記事がありません。他の学科と同様、複数学科をまたいだシステム全体のアーキテクチャ設計を扱う内容になる見込みです。

### 耳で学ぶ補助教材(学年を問わず)

- [【音声で聴く】メール基盤シリーズ総復習](/articles/mail-audio-review-guide)(卒業後の復習用)

## Windows Server学科

ActiveDirectory・AWS・Ansible/IaC・VPN・DNS基盤・メール基盤に続く7つ目の「開講済み」学科です。この学科のカリキュラムをすべて自力で実施・理解できれば、IIS・SMB共有・DFSを中心に、Windows Serverのファイル/Webサーバー運用と、SMB1の無効化やSNIの活用といったセキュリティ・運用上の要点まで、実務レベルで扱えるようになることを目標にしています。

### 教養課程(前提科目)

なし。

### 1年生:基礎編+初めてのハンズオン

**座学(基礎編、6記事)**

1. [Windows Serverのライセンス(OEM・Datacenter・Standard)を『上位1%』の視点で理解する](/articles/windows-server-licensing-guide)
2. [Windows ServerでNTPサーバーを構築する際の設定値を『上位1%』の視点で理解する](/articles/windows-ntp-server-guide)
3. [IISとASP.NETの仕組みを『上位1%』の視点で理解する](/articles/iis-fundamentals-guide)
4. [IISとFTPの関係を『上位1%』の視点で理解する](/articles/iis-ftp-guide)
5. [Windows ServerのSMB共有を『上位1%』の視点で理解する](/articles/smb-file-sharing-guide)
6. [SMBとCIFSは何が違うのか](/articles/smb-cifs-linux-interop-guide)

**実技(ハンズオン基礎編、1記事)**

1. [自分の手でHTTPサーバーを書いてみるハンズオン](/articles/minimal-http-server-handson-guide) — HTTPの正体をゼロから理解するための導入的なハンズオンで、Windows Server管理そのものを扱うハンズオンではありません。

### 2年生:補足・深掘り編

1. [DFS名前空間とDFSレプリケーションの仕組みを『上位1%』の視点で理解する](/articles/windows-server-dfs-guide)
2. [IISのアプリケーションプールのリサイクルを『上位1%』の視点で理解する](/articles/windows-server-app-pool-recycling-guide)
3. [プリントサーバーとスプーラーの仕組みを『上位1%』の視点で理解する](/articles/windows-server-print-spooler-guide)

### 3年生:実務シナリオ編ハンズオン

1. [DFS名前空間とDFSレプリケーションで複数ファイルサーバーを統合し、自動フェイルオーバーを体験するハンズオン](/articles/windows-server-dfs-handson-guide) — このシリーズで初めての、Windows Server管理そのものを扱う本格的なハンズオンです。

### 4年生(卒業):ニッチな仕様・機能編ハンズオン

1. [IISでSNIを使い、1つのIPアドレスで複数ドメインのTLS証明書を運用するハンズオン](/articles/windows-server-iis-sni-handson-guide)

**この1本まで自力で実施・理解できれば、「4年生」として卒業水準です。**

### 大学院:セキュリティ強化編ハンズオン(攻撃者視点)

1. [SMB1の危険性を自分の目で確認し、プロトコルの無効化と署名の強制で防御するハンズオン](/articles/windows-server-smb1-hardening-handson-guide)

自分が管理する検証環境の防御力を高めるための、教育・防御目的のハンズオンです(実際の脆弱性エクスプロイトは扱いません)。

### 卒業制作(キャップストーン)

1. [Windows Server学科の卒業制作:架空企業のWindows Server基盤を、ポートフォリオとして完成させる総合演習](/articles/windows-server-capstone-handson-guide)

これまでのハンズオンで個別に習得した技術(DFS名前空間とレプリケーション、IISのSNI、アプリケーションプールのリサイクル、プリントスプーラー運用、SMB1無効化による強化、NTP時刻同期)を、1つの架空企業のWindows Server基盤へ、自分の力で統合する総合演習です。手順をなぞる力ではなく、要件から自分で設計する力が求められ、成果物は転職活動でも使えるポートフォリオとしてまとめます。

### アーキテクト以降

まだ記事がありません。他の学科と同様、複数学科をまたいだシステム全体のアーキテクチャ設計を扱う内容になる見込みです。

### 耳で学ぶ補助教材(学年を問わず)

- [【音声で聴く】Windows Server運用シリーズ総復習](/articles/windows-server-audio-review-guide)(卒業後の復習用)

## Web/API学科

記事数が少ない状態から育成を開始し、ロードバランシング学科に続く9つ目の「開講済み」学科に到達しました。対応シリーズは[api](/sitemap#シリーズ一覧)です。

### 教養課程(前提科目)

なし。

### 1年生:基礎編+初めてのハンズオン

**座学(基礎編、1記事)**

1. [RESTful APIとは何か？HTTP・JSONの基礎から実務設計まで『上位1%』の視点で理解する](/articles/restful-api-guide)

**実技(ハンズオン基礎編、1記事)**

1. [自分の手でシンプルなRESTful APIを構築し、冪等性とページネーションをcurlで検証するハンズオン](/articles/restful-api-handson-guide)

**この2本まで自力で実施・理解できれば、「1年生」として一区切りです。**

### 2年生:補足・深掘り編

1. [決済APIの裏側の仕組みを『上位1%』の視点で理解する](/articles/payment-api-guide) — Stripeを題材に、PaymentIntentの多段階ライフサイクル・Webhook・PCI DSS対応までを扱う、実務密度の高い深掘り記事です。
2. [OAuth 2.0の仕組みを『上位1%』の視点で理解する](/articles/oauth2-guide) — 認可コードフローと、認証(OpenID Connect)との違いを扱います。
3. [GraphQLとRESTful APIの違いを『上位1%』の視点で理解する](/articles/graphql-vs-rest-guide) — オーバーフェッチ/アンダーフェッチの解消を扱います。

### 3年生:実務シナリオ編ハンズオン

1. [Webhookの受信エンドポイントを自分の手で構築し、署名検証と再送への対応を体験するハンズオン](/articles/webhook-signature-handson-guide)

### 4年生(卒業):ニッチな仕様・機能編ハンズオン

1. [トークンバケットでレートリミットを自分の手で実装し、固定ウィンドウ方式の境界バーストを再現するハンズオン](/articles/rate-limiting-handson-guide)

**この1本まで自力で実施・理解できれば、「4年生」として卒業水準です。**

### 大学院:セキュリティ強化編ハンズオン(攻撃者視点)

1. [JWTの『alg: none』脆弱性を自分の手で再現し、許可アルゴリズムの明示的な制限による防御を確認するハンズオン](/articles/jwt-alg-none-handson-guide)

自分が管理する検証環境の防御力を高めるための、教育・防御目的のハンズオンです(第三者のシステムへの攻撃手順は一切含みません)。

### 卒業制作(キャップストーン)

1. [Web/API学科の卒業制作:架空のSaaSスタートアップの公開APIプラットフォームを、ポートフォリオとして完成させる総合演習](/articles/api-capstone-handson-guide)

これまでのハンズオンで個別に習得した技術(RESTful APIの冪等性設計、OAuth 2.0による認可、JWT検証の安全な実装、レートリミット、Webhookの署名検証と重複排除)を、1つの架空のSaaSスタートアップの公開APIプラットフォームへ、自分の力で統合する総合演習です。手順をなぞる力ではなく、要件から自分で設計する力が求められ、成果物は転職活動でも使えるポートフォリオとしてまとめます。

### アーキテクト以降

まだ記事がありません。他の学科と同様、複数学科をまたいだシステム全体のアーキテクチャ設計を扱う内容になる見込みです。

### 耳で学ぶ補助教材(学年を問わず)

- [【音声で聴く】Web/APIシリーズ総復習](/articles/api-audio-review-guide)(卒業後の復習用)

## Webプロキシ・キャッシュ学科

Linux基盤学科に続いて、12個目の「開講済み」学科です。対応シリーズは[web-proxy](/sitemap#シリーズ一覧)です。

### 教養課程(前提科目)

なし。

### 1年生:基礎編+初めてのハンズオン

**座学(基礎編、2記事)**

1. [プロキシとファイアウォールの使い分けを『上位1%』の視点で理解する](/articles/proxy-firewall-guide)
2. [HTTPSの普及とプロキシキャッシュの終焉を『上位1%』の視点で理解する](/articles/http-caching-cdn-guide)

**実技(ハンズオン基礎編、1記事)**

1. [Squidで明示的プロキシを構築し、URL単位のアクセス制御を体験するハンズオン](/articles/squid-proxy-handson-guide)

**この3本まで自力で実施・理解できれば、「1年生」として一区切りです。**

### 2年生:補足・深掘り編

1. [PACファイルとWPADの仕組みを『上位1%』の視点で理解する](/articles/pac-wpad-guide)
2. [プロキシ認証(Basic/NTLM/Kerberos)の違いを『上位1%』の視点で理解する](/articles/proxy-auth-guide)
3. [Cache-ControlとVaryヘッダーの仕組みを『上位1%』の視点で理解する](/articles/cache-control-vary-guide)

### 3年生:実務シナリオ編ハンズオン

1. [Squidをキャッシュプロキシとして構築し、X-CacheヘッダーでHIT/MISSを確認するハンズオン](/articles/squid-caching-handson-guide)

### 4年生(卒業):ニッチな仕様・機能編ハンズオン

1. [iptablesとSquidで透過型プロキシを構築し、クライアント設定なしでプロキシを強制する仕組みを体験するハンズオン](/articles/transparent-proxy-handson-guide)

**この1本まで自力で実施・理解できれば、「4年生」として卒業水準です。**

### 大学院:セキュリティ強化編ハンズオン(攻撃者視点)

1. [Squidのオープンプロキシ化の危険性を自分の手で再現し、ACLによるアクセス制限で防御するハンズオン](/articles/squid-open-proxy-hardening-handson-guide)

自分が管理する検証環境の防御力を高めるための、教育・防御目的のハンズオンです(第三者のシステムへの攻撃手順は一切含みません)。

### 卒業制作(キャップストーン)

1. [Webプロキシ・キャッシュ学科の卒業制作:架空の多拠点企業の社内インターネットアクセス基盤を、ポートフォリオとして完成させる総合演習](/articles/web-proxy-capstone-handson-guide)

これまでのハンズオンで個別に習得した技術(Squidによる明示的プロキシ構築とURL単位のアクセス制御、Cache-Control/Varyによるキャッシュ制御、iptablesとSquidによる透過型プロキシ、オープンプロキシ化対策)と、座学で学んだ知識(PACファイル/WPADによる自動設定、Basic/NTLM/Kerberosによるプロキシ認証)を、1つの架空の多拠点企業「KoiKoi Retail」の社内インターネットアクセス基盤へ、自分の力で統合する総合演習です。手順をなぞる力ではなく、要件から自分で設計する力が求められ、成果物は転職活動でも使えるポートフォリオとしてまとめます。

### アーキテクト以降

まだ記事がありません。他の学科と同様、複数学科をまたいだシステム全体のアーキテクチャ設計を扱う内容になる見込みです。

### 耳で学ぶ補助教材(学年を問わず)

- [【音声で聴く】Webプロキシ/キャッシュ基礎シリーズ総復習](/articles/web-proxy-audio-review-guide)(卒業後の復習用)

## ストレージ学科

Web/API学科に続いて、10個目の「開講済み」学科です。対応シリーズは[storage](/sitemap#シリーズ一覧)です。

### 教養課程(前提科目)

なし。

### 1年生:基礎編+初めてのハンズオン

**座学(基礎編、3記事)**

1. [RAIDとWindowsのディスク管理の関係を『上位1%』の視点で理解する](/articles/disk-raid-fundamentals-guide)
2. [FCケーブル接続とLANケーブル接続の違いを『上位1%』の視点で理解する](/articles/fc-san-fundamentals-guide)
3. [NTFSファイルシステムの仕組みを『上位1%』の視点で理解する](/articles/ntfs-mft-internals-guide)

**実技(ハンズオン基礎編、1記事)**

1. [mdadmでLinuxソフトウェアRAID1を構築し、ディスク障害とリビルドを自分の手で再現するハンズオン](/articles/mdadm-raid-handson-guide)

**この4本まで自力で実施・理解できれば、「1年生」として一区切りです。**

### 2年生:補足・深掘り編

1. [RAID5とRAID6のパリティ計算の仕組みを『上位1%』の視点で理解する](/articles/raid5-parity-guide)
2. [iSCSIの仕組みを『上位1%』の視点で理解する](/articles/iscsi-guide)
3. [シンプロビジョニングの仕組みを『上位1%』の視点で理解する](/articles/thin-provisioning-guide)

### 3年生:実務シナリオ編ハンズオン

1. [mdadmでRAID5を構築し、パリティによるデータ復元を自分の手で確認するハンズオン](/articles/mdadm-raid5-handson-guide)

### 4年生(卒業):ニッチな仕様・機能編ハンズオン

1. [LVMスナップショットを自分の手で作成し、コピーオンライトの正体を確認するハンズオン](/articles/lvm-snapshot-handson-guide)

**この1本まで自力で実施・理解できれば、「4年生」として卒業水準です。**

### 大学院:セキュリティ強化編ハンズオン(攻撃者視点)

1. [iSCSIが認証なしで乗っ取られる危険性を自分の手で再現し、CHAP認証による防御を確認するハンズオン](/articles/iscsi-chap-hardening-handson-guide)

自分が管理する検証環境の防御力を高めるための、教育・防御目的のハンズオンです(第三者のシステムへの攻撃手順は一切含みません)。

### 卒業制作(キャップストーン)

1. [ストレージ学科の卒業制作:架空の映像制作スタジオの共有ストレージ基盤を、ポートフォリオとして完成させる総合演習](/articles/storage-capstone-handson-guide)

これまでのハンズオンで個別に習得した技術(RAID1・RAID5による冗長化とパリティの仕組み、iSCSIによるSANの構築とCHAP認証、LVMによる論理ボリューム管理とスナップショット)を、1つの架空の映像制作スタジオ「KoiKoi Studio」の共有ストレージ基盤へ、自分の力で統合する総合演習です。手順をなぞる力ではなく、要件から自分で設計する力が求められ、成果物は転職活動でも使えるポートフォリオとしてまとめます。

### アーキテクト以降

まだ記事がありません。他の学科と同様、複数学科をまたいだシステム全体のアーキテクチャ設計を扱う内容になる見込みです。

### 耳で学ぶ補助教材(学年を問わず)

- [【音声で聴く】ストレージ基礎シリーズ総復習](/articles/storage-audio-review-guide)(卒業後の復習用)

## Linux基盤学科

ストレージ学科に続いて、11個目の「開講済み」学科です。対応シリーズは[linux](/sitemap#シリーズ一覧)です。他の学科からも前提知識として参照されることが多い、Linux/OSの基礎そのものを扱う学科です。記事数自体は以前から蓄積されていましたが、学年構成として整理した上で、4年生・大学院相当のハンズオンを追加しました。

### 教養課程(前提科目)

なし。

### 1年生:基礎編+初めてのハンズオン

**座学(基礎編、9記事)**

1. [デーモン(daemon)とは何か](/articles/linux-daemon-guide)
2. [ライブラリ(library)とは何か](/articles/software-library-guide)
3. [ユーザー空間とカーネル空間、TUN/TAPデバイスの仕組み](/articles/linux-user-kernel-space-guide)
4. [パーミッション(chmod)とは何か](/articles/linux-file-permissions-guide)
5. [sysctlと/etc/sysctl.confの仕組み](/articles/linux-sysctl-guide)
6. [iptables(netfilter)の仕組み](/articles/linux-iptables-guide)
7. [/etcとLinuxのディレクトリ構成(FHS)](/articles/linux-filesystem-hierarchy-guide)
8. [設定ファイルが「効く」までの仕組み](/articles/linux-config-activation-guide)
9. [journalctlでエラーログを調査する方法](/articles/linux-journalctl-guide)

**実技(ハンズオン基礎編、1記事)**

1. [findコマンドでファイル・ディレクトリを自力で探し当てるハンズオン](/articles/linux-find-guide)

**この10本まで自力で実施・理解できれば、「1年生」として一区切りです。**

### 2年生:補足・深掘り編

1. [curlコマンドの裏側の仕組み](/articles/curl-guide)
2. [フレームワークとは何か](/articles/software-framework-guide)
3. [cat > file << 'EOF'の仕組み](/articles/linux-heredoc-redirect-guide)
4. [Gitの仕組み](/articles/git-basics-guide)
5. [Nginxの仕組み](/articles/nginx-fundamentals-guide)

### 3年生:実務シナリオ編ハンズオン

1. [Nginxで独自の仮想ホストとリバースプロキシを構築するハンズオン](/articles/nginx-handson-guide)

### 4年生(卒業):ニッチな仕様・機能編ハンズオン

1. [Linuxのnamespaceを自分の手で構築し、『コンテナ』の正体を体験するハンズオン](/articles/linux-namespaces-handson-guide)

**この1本まで自力で実施・理解できれば、「4年生」として卒業水準です。**

### 大学院:セキュリティ強化編ハンズオン(攻撃者視点)

1. [SUIDビットの危険性を自分の手で再現し、Capabilitiesによる最小権限の防御を確認するハンズオン](/articles/linux-suid-capabilities-handson-guide)

自分が管理する検証環境の防御力を高めるための、教育・防御目的のハンズオンです(第三者のシステムへの攻撃手順は一切含みません)。

### 卒業制作(キャップストーン)

1. [Linux基盤学科の卒業制作:架空の社内開発プラットフォームを、ポートフォリオとして完成させる総合演習](/articles/linux-capstone-handson-guide)

これまでのハンズオンで個別に習得した技術(findコマンドでの調査、Nginxによるリバースプロキシ構築、namespaceによるプロセス分離、SUIDを避けたCapabilitiesによる最小権限設計)と、座学で学んだ知識(デーモン・パーミッション・iptables・journalctl・設定ファイルの反映)を、1つの架空のスタートアップ「KoiKoi Dev」の社内開発プラットフォームへ、自分の力で統合する総合演習です。手順をなぞる力ではなく、要件から自分で設計する力が求められ、成果物は転職活動でも使えるポートフォリオとしてまとめます。

### アーキテクト以降

まだ記事がありません。他の学科と同様、複数学科をまたいだシステム全体のアーキテクチャ設計を扱う内容になる見込みです。

### 耳で学ぶ補助教材(学年を問わず)

- [【音声で聴く】Linux/OS基礎シリーズ総復習](/articles/linux-audio-review-guide)(卒業後の復習用)

## 今後の予定

- **「開講済み」の全12学科(ActiveDirectory・AWS・Ansible/IaC・VPN・DNS基盤・メール基盤・Windows Server・ロードバランシング・Web/API・ストレージ・Linux基盤・Webプロキシ・キャッシュ)すべてに、複数学年の内容を組み合わせた総合演習(卒業制作)ハンズオンが出揃いました。** 成果物をGitHubリポジトリなどの形でまとめ、転職活動のポートフォリオとして使える形式になっています。これで、現時点で構想している学科・学年構成は、ひととおり完成しました。
- 次の拡充の方向性としては、各学科の「アーキテクト以降」(複数学科をまたいだシステム全体のアーキテクチャ設計)の新設、あるいは、新しい学科そのものの追加が考えられます。
