# 空間情報研究室 Webサイト

弓削商船高等専門学校 空間情報研究室のHPです．Node.jsで生成する静的サイトをGitHub Pagesで公開します．外部パッケージのインストールは不要です．

## 手元で確認する

Node.js 22以降を用意します（GitHub Actionsは24を使用）．

```powershell
npm run dev
```

http://127.0.0.1:4173 を開きます．編集後はサーバーを終了し，同じコマンドで再起動すると再生成されます．

Windows PowerShellで `npm.ps1` の実行が拒否される場合は，実行ポリシーを変更せず `npm.cmd run dev`，`npm.cmd run check` を使ってください．

```powershell
npm run check
```

本文データからHTMLを生成し，ページ内リンクやアセットを検証します．生成先は `dist/` です．学校のサーバーへ移す場合も，このフォルダの中身を配置できます．

## 内容を更新する

本文は [content/site.json](content/site.json) にまとめています．JSONの末尾のカンマに注意してください．空の配列は準備中表示になります．実績やメンバーを推測して追加しないでください．

| 項目 | 編集箇所 |
| --- | --- |
| 研究室紹介 | `description`，`about`，`headline` |
| 研究テーマ | `researchIntro`，`research` |
| お知らせ | `news`（日付が新しい順に表示） |
| メンバー | `members`（入力順） |
| 研究業績 | `publications`（入力順） |
| 連絡先 | `contactEmail`（未登録時は準備中表示） |
| 所在地・学校サイト | `address`，`accessUrl`，`schoolUrl` |

追加するデータの形式は以下です．例文や仮名はそのまま掲載せず，確認済みの情報に置き換えます．`url` は任意です．メンバーの `description`，お知らせの `category` も任意です．

```json
{
  "news": [
    {"date": "2026-11-11", "category": "お知らせ", "title": "確認済みのお知らせ本文", "url": "https://www.yuge.ac.jp/"}
  ],
  "members": [
    {"role": "教員", "name": "掲載する氏名", "description": "紹介文", "url": "https://www.yuge.ac.jp/"}
  ],
  "publications": [
    {"year": "2026", "title": "論文タイトル", "authors": "著者", "venue": "掲載誌・学会名", "url": "https://www.yuge.ac.jp/"}
  ]
}
```

デザインは `src/styles.css`，HTML構成は `scripts/build.mjs`，メニューと点群の概念図は `src/app.js` です．点群図は装飾用の生成図で，実際の計測データや弓削島の地形を示すものではありません．研究紹介は予定の説明で，実績の表明ではありません．学校所在地の確認元は `content/site.json` の `sources` に記録しています．

## GitHub Pagesを有効にする

1. リポジトリの **Settings → Pages → Build and deployment → Source** で **GitHub Actions** を選択します．
2. **Actions → Deploy GitHub Pages → Run workflow** で `main` を選んで実行します．
3. 以後は `main` へのpushでビルドと公開が自動実行されます．失敗時は直前の公開版が残ります．

標準URLは `https://d-iwase.github.io/iwaselab/` です．公開成功はActionsの結果で確認してください．GitHub Pagesの利用可否はリポジトリの公開範囲と契約プランによって異なります．リポジトリの公開範囲はこのソースでは変更しません．

参照：<https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages>

普段の更新はブランチで行い，プルリクエストで内容とチェック結果を確認してから `main` に取り込む運用を推奨します．個人情報や学生の写真は，掲載の同意と学校の運用ルールを確認してから追加してください．
