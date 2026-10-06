import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

// OS の設定が変わったら React に知らせる（change イベントを購読する）
function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

// 今の設定値を返す
function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

/**
 * OS の「動きを減らす」設定が有効なら true を返す。
 * ページを開いたまま設定を変えても、すぐに再レンダリングされる。
 */
export function usePrefersReducedMotion() {
  // useSyncExternalStore は「React の外にある値（ここではブラウザの設定）」を安全に読むためのフック
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
