import { Link } from 'react-router'
import './LogPage.css'

// どの URL にも当てはまらなかったときのページ
function NotFound() {
  return (
    <main className="container log">
      <header className="log-header">
        <p className="log-label">404</p>
        <h1 className="log-title">この惑星は見つかりませんでした</h1>
        <p className="log-summary">URL が間違っているか、まだ存在しないページです。</p>
      </header>
      <Link className="log-back" to="/">
        ← 太陽系に戻る
      </Link>
    </main>
  )
}

export default NotFound
