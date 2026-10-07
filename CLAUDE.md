# my-site

なましかの自己紹介・ポートフォリオサイト。企業に見せることもある。
構成・コマンド・作品の追加方法は README.md を参照する。

## ブランチ運用（git flow）

- main に直接 commit しない。作業は develop から `feature/*` を切って行う
- `feature/*` → develop は PR（merge commit）。develop → main も PR（merge commit）。release ブランチは使わない
- マージ済みの `feature/*` は削除する
- back-merge はリリースのたびではなく、作業開始時に確認して必要なときだけ行う。
  develop → main を merge commit で入れている限り、main にしかないのはマージコミットだけで中身は同じため

作業開始時：

```powershell
git switch develop
git pull
git log --oneline develop..origin/main  # 何か出たときだけ次の2行
git merge origin/main
git push
```

## 複数の PC で作業する

- 作業前に develop を pull してから feature ブランチを切る
- PC を離れる前に、途中でも feature ブランチを push しておく
- pull で `package.json` / `package-lock.json` が変わったら `npm install` する

## 作業の進め方

- 作者は学びながら進めている。初めて使う git 操作は、実行前に目的と各コマンドの意味を説明する
- push・ブランチ削除の前は毎回確認する
- commit 前に `npm run lint` と `npm run build` を通す

## 注意点

- React Router は v7 を使っている。v8 は Node.js 22.22.0 以上が必要で、開発環境（Node 22.16.0）では入らないため。書き方（Declarative Mode）は v7 と v8 で同じ
- `SolarSystem.tsx` 冒頭の「調整済みの数値」は、動きの手触りを調整した結果なので変更しない
- ページを追加したら、直接アクセスしても 404 にならないことを Vercel の Preview で確認する（`vercel.json` の rewrites に依存している）
