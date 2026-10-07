import { holoJournal, mySite, type Work } from './works'

// 惑星1つ = 作品1つ。作品を追加するときは works.ts に作品を書き、太陽に近い惑星から順に work に入れる
export type Planet = {
  name: string
  orbit: number // 軌道半径（px）
  size: number // 半径（px）
  color: string
  speed: number // 公転速度係数。1フレームあたり speed * 0.005 ラジアン進む
  work: Work | null // 作品。null なら「準備中」
}

// 太陽 = 自己紹介。太陽系のキャンバスと自己紹介ページで同じ色を使う
export const SUN_COLOR = '#EF9F27'

export const planets: Planet[] = [
  { name: '水星', orbit: 36, size: 4, color: '#888780', speed: 2.4, work: holoJournal },
  { name: '金星', orbit: 58, size: 6, color: '#F0997B', speed: 1.8, work: mySite },
  { name: '地球', orbit: 80, size: 6, color: '#378ADD', speed: 1.5, work: null },
  { name: '火星', orbit: 101, size: 5, color: '#D85A30', speed: 1.25, work: null },
  { name: '木星', orbit: 128, size: 11, color: '#BA7517', speed: 0.85, work: null },
  { name: '土星', orbit: 157, size: 9, color: '#FAC775', speed: 0.65, work: null },
  { name: '天王星', orbit: 180, size: 7, color: '#5DCAA5', speed: 0.5, work: null },
  { name: '海王星', orbit: 200, size: 7, color: '#185FA5', speed: 0.4, work: null },
]
