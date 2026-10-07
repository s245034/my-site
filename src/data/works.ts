// 作品1つ分の詳細。詳細ページ（/works/:slug）に「探査ログ」として表示する
export type Work = {
  slug: string // URL に使う名前。/works/holo-journal の holo-journal の部分
  title: string
  summary: string // 一言説明
  purpose: string // なぜ作ったか
  focus: string[] // 意識したこと
  tech: string[]
  links: { label: string; url: string }[]
}

const GITHUB_URL = 'https://github.com/s245034'

// 中身は各リポジトリの README から転記したもの
export const holoJournal: Work = {
  slug: 'holo-journal',
  title: 'Holo Journal',
  summary: '日々の振り返りや気分の記録、そして書く習慣を身につけるための日記アプリです。',
  purpose: 'スマホで日記を書く中で、使っていた日記アプリへの不満を解消するために自分で作りました。',
  focus: [
    '「その時の気分を記録できない」→ 5段階の気分を選んで残せるようにした',
    '「日記を分類できない」→ 色と絵文字つきのラベルで分類できるようにした',
    '「一覧表示が見づらく、管理しづらい」→ 日記を週ごとにまとめて表示するようにした',
    'スマホでの利用が前提でも、ネイティブアプリではなく Web アプリにした。iPhone・Android・PC のどれからでも同じデータにアクセスできるため',
    'Supabase のすべてのテーブルで行レベルセキュリティ（RLS）を有効にし、ユーザーが自分のデータだけを参照・編集できるようにした',
  ],
  tech: [
    'React 18',
    'TypeScript',
    'Vite',
    'Tailwind CSS',
    'shadcn/ui',
    'Zustand',
    'TanStack Query',
    'React Router',
    'Supabase',
    'Vitest',
  ],
  links: [
    { label: 'デモ', url: 'https://holo-daily-spark.lovable.app/' },
    { label: 'GitHub', url: `${GITHUB_URL}/holo-journal` },
  ],
}

export const mySite: Work = {
  slug: 'my-site',
  title: 'my-site',
  summary: 'なましかの自己紹介・ポートフォリオサイト。いま見ているこのサイトです。',
  purpose: '自分の作品をまとめて見せる場所として作りました。気になる技術を試す場としても使っています。',
  focus: [
    'アニメーション用のライブラリを使わず、Canvas API と requestAnimationFrame で「カーソルから逃げる太陽系」を作った',
    'OS の「動きを減らす」設定が有効なら最初から動きを止め、止める／再開するボタンも用意した（WCAG 2.2 達成基準 2.2.2）',
    'キャンバスは装飾として扱い、情報は一覧と読み上げ用のメッセージで伝えるようにした',
    'スマホでは逃げる動きを止め、タップしやすい当たり判定にした',
  ],
  tech: ['React 19', 'TypeScript', 'Vite', 'React Router', 'Canvas API', 'Vercel'],
  links: [{ label: 'GitHub', url: `${GITHUB_URL}/my-site` }],
}
