# my-site

なましかの自己紹介・ポートフォリオサイトです。
気になる技術を試す場としても使っています。

**公開 URL:** https://my-site-sage-phi.vercel.app/

## 主な内容

トップページの中心は「**カーソルから逃げる太陽系**」です。

- 8つの惑星が、それぞれ1つの作品を表します。作品がある惑星だけ色が灯り、まだない惑星は薄く表示されます
- 作品が増えるたびに、太陽に近い惑星から順に埋まっていきます
- 惑星はカーソルを速く動かすと逃げ、ゆっくり近づくと捕まえられます。クリック（スマホはタップ）で作品が表示されます
- キャンバスの下には、すべての惑星を並べた普通の作品一覧があり、ここからも作品を開けます

### アクセシビリティ

- OS の「動きを減らす」設定（`prefers-reduced-motion`）が有効な場合は、最初から動きを止めます
- 動きを止める／再開するボタンを用意しています（WCAG 2.2 達成基準 2.2.2）
- キャンバスは装飾として扱い（`aria-hidden`）、情報は作品一覧と読み上げ用のメッセージ（`aria-live`）で伝えます
- キーボードだけで操作でき、フォーカスの位置がはっきり見えます
- 「準備中」は色の濃さだけでなく文字でも表示します（WCAG 1.4.1）
- スマホでは逃げる動きを止め、タップしやすい当たり判定にしています
- ダークモードに対応しています

## 使用技術

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- CSS（ライブラリなし）
- Canvas API + `requestAnimationFrame`（アニメーション用のライブラリは使っていません）
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
│   ├── components/
│   │   ├── SolarSystem.tsx   # 太陽系の本体（描画・動き・一時停止ボタン・作品一覧）
│   │   └── SolarSystem.css
│   ├── data/
│   │   └── planets.ts        # 惑星と作品のデータ
│   ├── hooks/
│   │   └── usePrefersReducedMotion.ts  # 「動きを減らす」設定の判定
│   ├── App.tsx        # ページ全体の構成（Hero・太陽系・フッター）
│   ├── App.css        # ページのスタイル
│   ├── index.css      # サイト全体の共通スタイル・色の設定（ダークモードを含む）
│   └── main.tsx       # エントリーポイント
├── index.html
├── vite.config.ts
└── tsconfig*.json     # TypeScript の設定
```

## コンテンツの更新方法

- **作品を追加する**：`src/data/planets.ts` で、作品がまだない惑星のうち太陽に一番近いものの `work`（作品名）と `url` を書き換える
- **色を変える**：`src/index.css` の `:root` にある変数（`--blue` など）を変更する。ダークモードの色は、同じファイルの `@media (prefers-color-scheme: dark)` の中にある

## ブランチ運用

git flow に沿って運用しています。

| ブランチ | 役割 |
| --- | --- |
| `main` | 公開中のもの |
| `develop` | 開発中のものをまとめるブランチ |
| `feature/*` | 機能ごとの作業用。`develop` から作り、PR で `develop` にマージする |

`develop` から `main` へは PR でマージし、マージ後は `main` を `develop` に取り込んで揃えます（back-merge）。

## デプロイ

`main` ブランチに push すると、Vercel が自動でビルドして公開します。
それ以外のブランチは、Vercel の Preview 環境で確認できます。

## 作者

なましか — [GitHub](https://github.com/s245034)
