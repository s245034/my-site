import { Link } from 'react-router'
import { SUN_COLOR } from '../data/planets'
import './LogPage.css'

// 好きなもの1件分の形
type Like = {
  emoji: string
  title: string
  text: string
}

const likes: Like[] = [
  { emoji: '🎧', title: '音楽', text: 'ヨルシカが好きです。' },
  { emoji: '📷', title: 'カメラ', text: '写真を撮るのが好きです。' },
]

// 自己紹介ページ（/about）。太陽系の中心＝太陽として表示する
function About() {
  return (
    <main className="container log">
      <Link className="log-back" to="/">
        ← 太陽系に戻る
      </Link>

      <header className="log-header" style={{ borderColor: SUN_COLOR }}>
        <p className="log-label">
          <span className="log-dot" style={{ background: SUN_COLOR }} aria-hidden="true" />
          中心星・太陽
        </p>
        <h1 className="log-title">なましか</h1>
        <p className="log-summary">
          Web フロントエンドに興味があり、このサイトで React や TypeScript などの技術を試しています。
        </p>
      </header>

      <section className="log-section">
        <h2 className="section-title">好きなもの</h2>
        <ul className="log-cards">
          {likes.map((like) => (
            <li key={like.title} className="log-card">
              <span className="log-card-emoji" aria-hidden="true">
                {like.emoji}
              </span>
              <h3 className="log-card-title">{like.title}</h3>
              <p>{like.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default About
