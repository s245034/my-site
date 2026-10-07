import SolarSystem from '../components/SolarSystem'

// トップページ（/）
function Home() {
  return (
    <>
      <header className="hero">
        <h1 className="hero-name">なましか</h1>
        <p className="hero-lead">React と TypeScript で Web アプリを作っています</p>
      </header>

      <main className="container">
        <SolarSystem />
      </main>
    </>
  )
}

export default Home
