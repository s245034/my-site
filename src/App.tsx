import './App.css'

// 趣味・好きなこと1件分の形。TypeScript で「どんなデータか」を決めておくと、書き間違いに気づきやすい
type Like = {
  emoji: string
  title: string
  text: string
}

// TODO: 仮の内容。自分の趣味・好きなことに書き換える
const likes: Like[] = [
  { emoji: '💻', title: 'プログラミング', text: '気になる技術を触って、小さく作ってみるのが好き。' },
  { emoji: '🎮', title: 'ゲーム', text: 'ここに好きなゲームのジャンルやタイトルを書く。' },
  { emoji: '🎧', title: '音楽', text: 'ここに好きなアーティストやジャンルを書く。' },
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
            <li className="card">
              <h3 className="card-title">my-site</h3>
              <p>このサイト。React + TypeScript + Vite で作成。</p>
            </li>
            <li className="card card-placeholder">
              <p>Coming soon...</p>
            </li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 なましか</p>
      </footer>
    </>
  )
}

export default App
