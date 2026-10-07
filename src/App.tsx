import './App.css'
import SolarSystem from './components/SolarSystem'

const GITHUB_URL = 'https://github.com/s245034'

function App() {
  return (
    <>
      <header className="hero">
        <h1 className="hero-name">なましか</h1>
        <p className="hero-lead">React と TypeScript で Web アプリを作っています</p>
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
