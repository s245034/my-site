import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { planets, SUN_COLOR } from '../data/planets'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import './SolarSystem.css'

// ---------- 調整済みの数値（変更しない） ----------
const ORBIT_STEP = 0.005 // 公転：1フレームあたり speed * ORBIT_STEP ラジアン
const INITIAL_ANGLE_STEP = 0.9 // 初期角度：惑星の番号 * 0.9 ラジアン
const SPEED_KEEP = 0.85 // カーソル速度の平滑化：spd = spd * 0.85 + 移動距離 * 0.15
const SPEED_NEW = 0.15
const FLEE_THRESHOLD = 1.5 // flee = clamp((spd - 1.5) / 6, 0, 1.6)
const FLEE_DIVISOR = 6
const FLEE_MAX = 1.6
const REPEL_RADIUS = 90 // カーソルからこの距離（px）未満だと押し出される
const REPEL_POWER = 3.2
const RETURN_FORCE = 0.04 // 軌道に戻る力
const DAMPING = 0.86 // 減衰

// ---------- 見た目の設定 ----------
const SUN_RADIUS = 16
const EMPTY_ALPHA = 0.22 // 作品がない惑星の不透明度
const RING_FRAMES = 70 // 選択時の輪を表示するフレーム数
const LAYOUT_RADIUS = 220 // 太陽系全体の半径（一番外の軌道 200px + 余白）。これが入りきらない画面では縮小する
const MAX_CANVAS_HEIGHT = 480
const CLICK_MARGIN = 10 // クリックの当たり判定：惑星の大きさ + 10px
const TAP_MARGIN = 20 // タッチは指が太いので、さらに広く取る

// 各惑星の「今の状態」。React の state ではなく、毎フレーム書き換える普通の変数として持つ
type Body = { angle: number; x: number; y: number; vx: number; vy: number }

// 選べるもの。惑星は planets の番号、太陽（＝自己紹介）は 'sun'
type Target = number | 'sun'

// コンポーネントの外（ボタンや一覧）からキャンバスを操作するための関数
type Controls = {
  setMotion: (motion: boolean) => void
  resetToInitial: () => void
  highlight: (target: Target) => void
}

// 「ユーザーが選んだ一時停止状態」と、そのときの reduced-motion の値をセットで覚える
type PauseChoice = { paused: boolean; reducedMotion: boolean }

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

function SolarSystem() {
  const reducedMotion = usePrefersReducedMotion()
  const [pauseChoice, setPauseChoice] = useState<PauseChoice | null>(null)
  const [selected, setSelected] = useState<Target | null>(null)

  // ボタンを押していなければ reduced-motion の設定に従う。
  // OS の設定が変わったら、以前のボタン操作は無視して新しい設定を優先する
  const paused =
    pauseChoice !== null && pauseChoice.reducedMotion === reducedMotion
      ? pauseChoice.paused
      : reducedMotion

  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controlsRef = useRef<Controls | null>(null)

  // ---------- キャンバスの準備とアニメーション（最初の1回だけ実行） ----------
  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!wrap || !canvas || !ctx) return

    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const coarseQuery = window.matchMedia('(pointer: coarse)')

    const bodies: Body[] = planets.map((_, i) => ({
      angle: i * INITIAL_ANGLE_STEP,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
    }))

    let width = 0
    let height = 0
    let scale = 1
    let motion = false
    let pointer: { x: number; y: number } | null = null // 太陽を原点にしたカーソル位置
    let prevPointer: { x: number; y: number } | null = null
    let speed = 0
    let ring: { target: Target; frames: number } | null = null
    let rafId = 0
    let pageVisible = !document.hidden
    let onScreen = true

    // 本来いるべき軌道上の位置
    const orbitPosition = (i: number) => {
      const r = planets[i].orbit * scale
      return { x: Math.cos(bodies[i].angle) * r, y: Math.sin(bodies[i].angle) * r }
    }

    const placeOnOrbit = (i: number) => {
      const target = orbitPosition(i)
      bodies[i].x = target.x
      bodies[i].y = target.y
      bodies[i].vx = 0
      bodies[i].vy = 0
    }

    // 次のフレームを予約する。タブが非表示・画面外のときは予約しない
    const requestFrame = () => {
      if (!rafId && pageVisible && onScreen) rafId = requestAnimationFrame(tick)
    }

    const stopFrame = () => {
      cancelAnimationFrame(rafId)
      rafId = 0
    }

    // ---------- 1フレーム分の動きを計算する ----------
    const step = () => {
      if (!motion) return

      // カーソルの速さを平滑化する（急な値の変化をならす）
      if (pointer && prevPointer) {
        const moved = Math.hypot(pointer.x - prevPointer.x, pointer.y - prevPointer.y)
        speed = speed * SPEED_KEEP + moved * SPEED_NEW
      }
      prevPointer = pointer ? { ...pointer } : null

      // 速く動かすほど強く逃げる。ゆっくりなら 0 で逃げない
      const fleeEnabled = pointer !== null && !coarseQuery.matches
      const flee = fleeEnabled ? clamp((speed - FLEE_THRESHOLD) / FLEE_DIVISOR, 0, FLEE_MAX) : 0

      bodies.forEach((body, i) => {
        body.angle += planets[i].speed * ORBIT_STEP
        const target = orbitPosition(i)

        // カーソルと反対方向に押し出す
        if (pointer && flee > 0) {
          const dx = body.x - pointer.x
          const dy = body.y - pointer.y
          const dist = Math.hypot(dx, dy)
          if (dist > 0 && dist < REPEL_RADIUS) {
            const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_POWER * flee
            body.vx += (dx / dist) * force
            body.vy += (dy / dist) * force
          }
        }

        // 軌道に戻る力 → 減衰 → 位置を更新
        body.vx += (target.x - body.x) * RETURN_FORCE
        body.vy += (target.y - body.y) * RETURN_FORCE
        body.vx *= DAMPING
        body.vy *= DAMPING
        body.x += body.vx
        body.y += body.vy
      })
    }

    // ---------- 描画 ----------
    const draw = () => {
      const dark = darkQuery.matches
      const cx = width / 2
      const cy = height / 2

      ctx.clearRect(0, 0, width, height)

      // 軌道
      ctx.lineWidth = 1
      ctx.strokeStyle = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
      planets.forEach((planet) => {
        ctx.beginPath()
        ctx.arc(cx, cy, planet.orbit * scale, 0, Math.PI * 2)
        ctx.stroke()
      })

      // 太陽
      ctx.fillStyle = SUN_COLOR
      ctx.beginPath()
      ctx.arc(cx, cy, SUN_RADIUS * scale, 0, Math.PI * 2)
      ctx.fill()

      // 惑星
      planets.forEach((planet, i) => {
        const x = cx + bodies[i].x
        const y = cy + bodies[i].y
        const r = planet.size * scale
        const hasWork = planet.work !== null

        ctx.fillStyle = planet.color
        ctx.strokeStyle = planet.color
        ctx.globalAlpha = hasWork ? 1 : EMPTY_ALPHA
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()

        // 土星の輪
        if (planet.name === '土星') {
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.ellipse(x, y, (planet.size + 7) * scale, planet.size * 0.45 * scale, -0.4, 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.globalAlpha = 1

        // 作品がない惑星は点線の輪郭を付ける
        if (!hasWork) {
          ctx.lineWidth = 1
          ctx.setLineDash([2, 3])
          ctx.beginPath()
          ctx.arc(x, y, r, 0, Math.PI * 2)
          ctx.stroke()
          ctx.setLineDash([])
        }
      })

      // 選択した惑星の周りの輪。動きが止まっているときは広がらず、そのまま表示するだけ
      if (ring) {
        // 太陽なら中心（太陽からの距離 0）、惑星ならその惑星の位置に輪を出す
        const { target } = ring
        const body = target === 'sun' ? { x: 0, y: 0 } : bodies[target]
        const size = target === 'sun' ? SUN_RADIUS : planets[target].size
        const progress = 1 - ring.frames / RING_FRAMES
        const r = size * scale + (motion ? 6 + progress * 12 : 8)
        ctx.globalAlpha = motion ? ring.frames / RING_FRAMES : 1
        ctx.strokeStyle = target === 'sun' ? SUN_COLOR : planets[target].color
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(cx + body.x, cy + body.y, r, 0, Math.PI * 2)
        ctx.stroke()
        ctx.globalAlpha = 1
      }
    }

    // ---------- アニメーションループ ----------
    function tick() {
      rafId = 0
      step()
      draw()
      if (ring) {
        ring.frames -= 1
        if (ring.frames <= 0) ring = null
      }
      // 止まっていて輪も出ていなければ、ここでループを終える（無駄に描き続けない）
      if (motion || ring) requestFrame()
    }

    // ---------- サイズ調整（高解像度ディスプレイ対応） ----------
    const resize = () => {
      width = wrap.clientWidth
      height = Math.min(MAX_CANVAS_HEIGHT, width)
      scale = Math.min(1, Math.min(width, height) / 2 / LAYOUT_RADIUS)

      // 実際のピクセル数は devicePixelRatio 倍にし、見た目のサイズは CSS で指定する
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      bodies.forEach((_, i) => placeOnOrbit(i))
      requestFrame()
    }

    // ---------- イベント ----------
    const toLocal = (e: PointerEvent | MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      return { x: e.clientX - rect.left - width / 2, y: e.clientY - rect.top - height / 2 }
    }

    const onPointerMove = (e: PointerEvent) => {
      // 逃げる動きはマウスのときだけ。タッチやペンでは反応しない
      if (e.pointerType !== 'mouse') return
      pointer = toLocal(e)
    }

    // キャンバスの外に出たら反発をなくす（惑星は軌道に戻る）
    const onPointerLeave = () => {
      pointer = null
      prevPointer = null
      speed = 0
    }

    // クリック（タップ）された位置に一番近い惑星（または太陽）を選ぶ
    const onClick = (e: MouseEvent) => {
      const p = toLocal(e)
      const margin = coarseQuery.matches ? TAP_MARGIN : CLICK_MARGIN
      let hit: Target | null = null
      let best = Infinity
      // 太陽は原点にあるので、原点からの距離で判定する
      const sunDist = Math.hypot(p.x, p.y)
      if (sunDist <= SUN_RADIUS * scale + margin) {
        best = sunDist
        hit = 'sun'
      }
      for (let i = 0; i < planets.length; i++) {
        const dist = Math.hypot(p.x - bodies[i].x, p.y - bodies[i].y)
        if (dist <= planets[i].size * scale + margin && dist < best) {
          best = dist
          hit = i
        }
      }
      if (hit !== null) {
        setSelected(hit)
        highlight(hit)
      }
    }

    const onVisibilityChange = () => {
      pageVisible = !document.hidden
      if (pageVisible) requestFrame()
      else stopFrame()
    }

    const onThemeChange = () => requestFrame()

    const highlight = (target: Target) => {
      ring = { target, frames: RING_FRAMES }
      requestFrame()
    }

    // 画面外に出たらアニメーションを止める
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      if (onScreen) requestFrame()
      else stopFrame()
    })
    // 画面幅が変わったらキャンバスのサイズを計算し直す
    const resizeObserver = new ResizeObserver(resize)

    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onPointerLeave)
    canvas.addEventListener('click', onClick)
    document.addEventListener('visibilitychange', onVisibilityChange)
    darkQuery.addEventListener('change', onThemeChange)
    intersectionObserver.observe(canvas)
    resizeObserver.observe(wrap)

    controlsRef.current = {
      setMotion: (next) => {
        motion = next
        onPointerLeave()
        requestFrame()
      },
      resetToInitial: () => {
        bodies.forEach((body, i) => {
          body.angle = i * INITIAL_ANGLE_STEP
          placeOnOrbit(i)
        })
        requestFrame()
      },
      highlight,
    }

    resize()

    // アンマウント時の後片付け。ループもイベントもすべて解除する
    return () => {
      stopFrame()
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      canvas.removeEventListener('click', onClick)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      darkQuery.removeEventListener('change', onThemeChange)
      intersectionObserver.disconnect()
      resizeObserver.disconnect()
      controlsRef.current = null
    }
  }, [])

  // 一時停止の状態をキャンバスに伝える
  useEffect(() => {
    controlsRef.current?.setMotion(!paused)
  }, [paused])

  // 「動きを減らす」が有効になったら、惑星を初期位置に戻す
  useEffect(() => {
    if (reducedMotion) controlsRef.current?.resetToInitial()
  }, [reducedMotion])

  const select = (target: Target) => {
    setSelected(target)
    controlsRef.current?.highlight(target)
  }

  const selectedPlanet = selected !== null && selected !== 'sun' ? planets[selected] : null

  return (
    <section className="section solar" aria-labelledby="solar-title">
      <h2 id="solar-title" className="section-title">
        Works
      </h2>
      <p className="solar-lead">
        真ん中の太陽が、わたし自身。惑星ひとつが、作品ひとつ。作品が増えるたびに、太陽に近い惑星から色が灯っていきます。
        惑星はカーソルから逃げるので、ゆっくり近づいてクリック（スマホはタップ）してみてください。
      </p>

      <div className="solar-toolbar">
        <button
          type="button"
          className="solar-button"
          onClick={() => setPauseChoice({ paused: !paused, reducedMotion })}
        >
          <span aria-hidden="true">{paused ? '▶' : '⏸'}</span>
          {paused ? '動きを再開' : '動きを止める'}
        </button>
      </div>

      <div ref={wrapRef} className="solar-canvas-wrap">
        {/* 情報は下の一覧で伝えるので、キャンバスは読み上げ対象から外す */}
        <canvas ref={canvasRef} className="solar-canvas" aria-hidden="true" />
      </div>

      {/* 選択結果。aria-live でスクリーンリーダーに読み上げてもらう */}
      <div className="solar-message" aria-live="polite">
        {selected === 'sun' && (
          <p>
            太陽：なましか <Link to="/about">自己紹介を見る</Link>
          </p>
        )}
        {selectedPlanet &&
          (selectedPlanet.work ? (
            <p>
              {selectedPlanet.name}：{selectedPlanet.work.title}{' '}
              <Link to={`/works/${selectedPlanet.work.slug}`}>探査ログを見る</Link>
            </p>
          ) : (
            <p>{selectedPlanet.name}：まだ未開拓の惑星です。次の作品を準備中</p>
          ))}
      </div>

      <h3 className="solar-list-title">太陽と惑星の一覧</h3>
      <ul className="solar-list">
        <li>
          <Link className="solar-item" to="/about">
            <span className="solar-dot" style={{ background: SUN_COLOR }} aria-hidden="true" />
            太陽｜なましか（自己紹介）
          </Link>
        </li>
        {planets.map((planet, i) => (
          <li key={planet.name}>
            {planet.work ? (
              <Link className="solar-item" to={`/works/${planet.work.slug}`}>
                <span className="solar-dot" style={{ background: planet.color }} aria-hidden="true" />
                {planet.name}｜{planet.work.title}
              </Link>
            ) : (
              <button type="button" className="solar-item solar-item-empty" onClick={() => select(i)}>
                <span className="solar-dot" style={{ borderColor: planet.color }} aria-hidden="true" />
                {planet.name}｜準備中
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default SolarSystem
