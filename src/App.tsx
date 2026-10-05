import './App.css'

// 趣味・好きなこと1件分の形。TypeScript で「どんなデータか」を決めておくと、書き間違いに気づきやすい
type Like = {
  emoji: string
  title: string
  text: string
}

const likes: Like[] = [
  { emoji: '🎧', title: '音楽', text: 'ヨルシカが好きです。' },
  { emoji: '📷', title: 'カメラ', text: '写真を撮るのが好きです。' },
]

// 作品1件分の形。links は「表示名と URL」の組をいくつでも持てる
type Work = {
  title: string
  text: string
  links: { label: string; url: string }[]
}

const GITHUB_URL = 'https://github.com/s245034'

const works: Work[] = [
  {
    title: 'my-site',
    text: 'このサイト。React + TypeScript + Vite で作成し、Vercel で公開しています。',
    links: [{ label: 'GitHub', url: `${GITHUB_URL}/my-site` }],
  },
  {
    title: 'holo-journal',
    text: '気分の記録や書く習慣づくりができる日記アプリ。Lovable で作成。',
    links: [
      { label: 'Site', url: 'https://holo-daily-spark.lovable.app/' },
      { label: 'GitHub', url: `${GITHUB_URL}/holo-journal` },
    ],
  },
]

function App() {
  return (
    <>
      <header className="hero">
        <p className="hero-label">Hello, I'm</p>
        <h1 className="hero-name">なましか</h1>
        {/* TODO: 仮の一言紹介。自分の言葉に書き換える */}
        <p className="hero-lead">気になる技術を、作りながら学んでいます。</p>
      </header>

      <main className="container">
        <section className="section">
          <h2 className="section-title">About</h2>
          {/* TODO: 仮の自己紹介文 */}
          <p>
            はじめまして、なましかです。Web フロントエンドに興味があり、このサイトで React や TypeScript
            などの技術を試しています。
          </p>
        </section>

        <section className="section">
          <h2 className="section-title">Likes</h2>
          <ul className="card-list">
            {likes.map((like) => (
              <li key={like.title} className="card">
                <span className="card-emoji">{like.emoji}</span>
                <h3 className="card-title">{like.title}</h3>
                <p>{like.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="section">
          <h2 className="section-title">Works</h2>
          <ul className="card-list">
            {works.map((work) => (
              <li key={work.title} className="card">
                <h3 className="card-title">{work.title}</h3>
                <p>{work.text}</p>
                <div className="card-links">
                  {work.links.map((link) => (
                    <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              </li>
            ))}
            <li className="card card-placeholder">
              <p>Coming soon...</p>
            </li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <a className="footer-link" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
        <p>© 2026 なましか</p>
      </footer>
    </>
  )
}

export default App
