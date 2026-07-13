# zenn-blog-idrac-20260713

Zennに公開する技術ブログ記事を、Claudeとのレビューサイクルで育てていくリポジトリ。

## フォルダ構成

```
articles/    Zenn記事本体（Zenn CLIの規約に合わせ、articles/直下にslug.mdを置く）
feedback/    記事ごとの指摘事項。feedback/<記事slug>/01_指摘事項.txt のように読んだ順で番号を振る
templates/   記事作成プロンプトのテンプレート
```

## 執筆〜公開までの流れ

1. `templates/zenn-blog-prompt-template.md` のテーマ・語り口を書き換え、WEBチャットに投げて初稿を作成（`articles/<slug>.md`）
2. 初稿を読んで気になった点を `feedback/<slug>/01_指摘事項.txt` に書き出す
3. （2回目以降）CodeSpaces上でClaude Codeに「指摘事項を踏まえて記事を更新して」と依頼
4. 更新版を読み、まだ指摘があれば `feedback/<slug>/02_指摘事項.txt` … と追記して3に戻る
5. 指摘がなくなったら完成。Zenn CLIリポジトリの `articles/` に取り込んで公開する
