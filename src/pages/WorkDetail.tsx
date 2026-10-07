import { Link, useParams } from 'react-router'
import { planets } from '../data/planets'
import NotFound from './NotFound'
import './LogPage.css'

// 作品の詳細ページ（/works/:slug）。惑星の「探査ログ」として表示する
function WorkDetail() {
  // URL の :slug の部分（/works/holo-journal なら 'holo-journal'）
  const { slug } = useParams()
  const index = planets.findIndex((planet) => planet.work?.slug === slug)
  const planet = planets[index]

  // /works/abc のような、存在しない作品の URL
  if (!planet?.work) return <NotFound />
  const { work } = planet

  return (
    <main className="container log">
      <Link className="log-back" to="/">
        ← 太陽系に戻る
      </Link>

      <header className="log-header" style={{ borderColor: planet.color }}>
        <p className="log-label">
          <span className="log-dot" style={{ background: planet.color }} aria-hidden="true" />
          探査ログ #{String(index + 1).padStart(2, '0')}・{planet.name}
        </p>
        <h1 className="log-title">{work.title}</h1>
        <p className="log-summary">{work.summary}</p>
      </header>

      <section className="log-section">
        <h2 className="section-title">目的</h2>
        <p>{work.purpose}</p>
      </section>

      <section className="log-section">
        <h2 className="section-title">意識したこと</h2>
        <ul className="log-list">
          {work.focus.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      </section>

      <section className="log-section">
        <h2 className="section-title">使った技術</h2>
        <ul className="log-tags">
          {work.tech.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </section>

      <section className="log-section">
        <h2 className="section-title">リンク</h2>
        <ul className="log-links">
          {work.links.map((link) => (
            <li key={link.label}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.label} ↗<span className="sr-only">（新しいタブで開きます）</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default WorkDetail
