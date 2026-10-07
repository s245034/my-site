import { useEffect } from 'react'
import { Outlet, Route, Routes, useLocation, useNavigationType } from 'react-router'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import WorkDetail from './pages/WorkDetail'
import NotFound from './pages/NotFound'

const GITHUB_URL = 'https://github.com/s245034'

// URL と表示するページの対応表。上から順に見て、合うものを1つだけ表示する
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="works/:slug" element={<WorkDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

// 全ページ共通の枠。<Outlet /> の位置に、URL に合ったページが入る
function Layout() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  // リンクで移動したときはページの先頭から表示する。
  // 「戻る」（POP）のときはブラウザが元の位置に戻すので、何もしない
  useEffect(() => {
    if (navigationType !== 'POP') window.scrollTo(0, 0)
  }, [pathname, navigationType])

  return (
    <>
      <Outlet />

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
