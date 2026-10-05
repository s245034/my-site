# my-site

なましかの自己紹介・ポートフォリオサイトです。
気になる技術を試す場としても使っています。

**公開 URL:** https://my-site-sage-phi.vercel.app/

## 主な内容

| セクション | 内容 |
| --- | --- |
| About | 自己紹介 |
| Likes | 趣味・好きなこと |
| Works | 作品一覧（GitHub・公開ページへのリンク付き） |

## 使用技術

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- CSS（ライブラリなし）
- [ESLint](https://eslint.org/) + [typescript-eslint](https://typescript-eslint.io/)
- ホスティング: [Vercel](https://vercel.com/)

## 動作環境

- Node.js 22 以上（開発時は v22.16.0 を使用）
- npm

## セットアップ

```powershell
git clone https://github.com/s245034/my-site.git
cd my-site
npm install
```

## コマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動（http://localhost:5173） |
| `npm run build` | 型チェックをしてから本番用にビルド（`dist/` に出力） |
| `npm run preview` | ビルド結果をローカルで確認 |
| `npm run lint` | ESLint でコードをチェック |

## ディレクトリ構成

```
my-site/
├── public/            # そのまま配信される静的ファイル（favicon など）
├── src/
│   ├── App.tsx        # ページ本体（自己紹介・趣味・作品のデータもここ）
│   ├── App.css        # ページのスタイル
│   ├── index.css      # サイト全体の共通スタイル・色の設定
│   └── main.tsx       # エントリーポイント
├── index.html
├── vite.config.ts
└── tsconfig*.json     # TypeScript の設定
```

## コンテンツの更新方法

- **趣味を追加する**：`src/App.tsx` の `likes` 配列に1件追加する
- **作品を追加する**：`src/App.tsx` の `works` 配列に1件追加する
- **色を変える**：`src/index.css` の `:root` にある変数（`--blue` など）を変更する

## デプロイ

`main` ブランチに push すると、Vercel が自動でビルドして公開します。

## 作者

なましか — [GitHub](https://github.com/s245034)
