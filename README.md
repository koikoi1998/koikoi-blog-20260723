# infra-blog

インフラエンジニア向け技術ブログ（Astro + Vercel）を、Claudeとのレビューサイクルで育てていくリポジトリ。Codespace上で執筆・確認まで完結させる運用を想定している。

以前はZennでの公開を前提にしていたが、投稿頻度を上げるため自分のブログサイトでの公開に切り替えた。ハンズオン教材の同梱もやめ、技術の深掘りに特化する方針にしている。

## フォルダ構成

```
astro.config.mjs / package.json / tsconfig.json  # Astroプロジェクト本体
src/
  content/
    config.ts            # articlesコレクションのスキーマ定義
    articles/<slug>.md   # 記事本体。このファイルを書く＝記事を書くこと
  layouts/                # BaseLayout（共通シェル）等
  pages/
    index.astro           # トップページ（記事一覧）
    sitemap.md             # 全記事ガイド・読む順番・シリーズ一覧
    articles/[...slug].astro  # /articles/<slug> の動的ルーティング
  remark-mermaid.mjs      # Mermaid記法を描画するためのremarkプラグイン
feedback/     記事ごとの指摘事項。feedback/<記事slug>/01_指摘事項.txt のように読んだ順で番号を振る
templates/    記事作成プロンプトのテンプレート
```

## 執筆〜公開までの流れ

1. `templates/article-prompt-template.md` のテーマ・語り口を書き換え、WEBチャットに投げて初稿を作成し、`src/content/articles/<slug>.md`として保存する。
2. 初稿を読んで気になった点を `feedback/<slug>/01_指摘事項.txt` に書き出す。
3. （2回目以降）Codespace上でClaude Codeに「指摘事項を踏まえて記事を更新して」と依頼する。
4. 更新版を読み、まだ指摘があれば `feedback/<slug>/02_指摘事項.txt` … と追記して3に戻る。
5. 指摘がなくなったら完成。新しいシリーズ・記事を追加した場合は`src/pages/sitemap.md`にも追記する。

## 新しいテーマ（シリーズ）を始めるとき

1. `templates/article-prompt-template.md`のテーマ欄を書き換えて初稿を作成する。
2. `src/content/config.ts`の`series`のenumに新しいシリーズ名を追加する。
3. `feedback/<slug>/`フォルダを作成する。
4. 記事が完成したら`src/pages/sitemap.md`にシリーズと記事へのリンクを追記する。

## ローカルでの確認コマンド

```bash
npm install       # 初回のみ
npm run dev       # http://localhost:4321 でプレビュー
npm run build     # 本番ビルド（frontmatterの型エラーやリンク切れもここで検出される）
```

## Vercelへのデプロイ

このリポジトリはAstroの静的サイトとしてそのままVercelにデプロイできる（追加設定不要、フレームワークはVercel側で自動検出される）。Vercelダッシュボードでこのリポジトリをimportすれば、以降は`main`ブランチへのpushで自動デプロイされる。実際の連携作業（Vercelアカウントでのimport等）はCodespace外で行う。
