import './App.css'
import SolarSystem from './components/SolarSystem'

const GITHUB_URL = 'https://github.com/s245034'

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
        <SolarSystem />
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
