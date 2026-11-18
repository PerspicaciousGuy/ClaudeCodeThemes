// Halftone Harbor: an original two-ink print of a harbor at sunset. Every mark
// is a round dot on one tilted screen, and dot size is the only drawing tool:
// a coral sun and its wake, blue water, a headland with a lighthouse, two boats.
// The art lies at the sides and rests under the reading column.
// Vector art on a 1600x1000 canvas. Pure SVG + CSS animation: no script.

const NIGHT = false

const W = 1600
const H = 1000
const PITCH = 14
const HORIZON = 650
const SUN = { x: 1290, y: HORIZON, r: 175 }

const STOCK = NIGHT
  ? { top: '#1a1f33', foot: '#262a41', coral: '#e0663f', coralOp: 0.9, blue: '#8196c6', blueOp: 0.72, blend: 'normal' }
  : { top: '#f6ecdc', foot: '#f1dcc4', coral: '#d85f3e', coralOp: 1, blue: '#5f82b8', blueOp: 1, blend: 'multiply' }

function smooth(a, b, v) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)))

  return t * t * (3 - 2 * t)
}

// 1 at the sides, 0 under the reading column.
function away(x) {
  return Math.max(1 - smooth(300, 520, x), smooth(1080, 1260, x))
}

const crest = x => HORIZON - 215 * Math.exp(-(((x - 110) / 250) ** 2)) - 95 * Math.exp(-(((x - 430) / 150) ** 2)) - 6 * Math.sin(x / 40)

function sunInk(x, y) {
  const d = Math.hypot(x - SUN.x, y - SUN.y)
  const up = 1 - smooth(0, 16, y - (HORIZON - 4))
  const body = d < SUN.r ? 0.44 * (1 - (d / SUN.r) ** 4) : 0
  const glow = 0.07 * (1 - smooth(0, 170, d - SUN.r * 0.9)) ** 1.3
  let tone = Math.max(body, glow) * up

  // The wake on the water below.
  if (y > HORIZON) {
    const t = y - HORIZON
    const spread = 46 + t * 0.28
    const streak = 0.5 + 0.5 * Math.sin(t * 0.34) ** 2

    tone = Math.max(tone, 0.34 * Math.exp(-(((x - SUN.x) / spread) ** 2)) * streak * (1 - smooth(10, 320, t)))
  }

  // Boats and the lighthouse's lamp, in coral.
  const boat = (bx, by, s) => {
    const sx = (x - bx) / s
    const sy = (y - by) / s

    return sy > -92 && sy < -8 && sx > 0 && sx < 62 * (1 - (-sy - 8) / 90) ? 0.5 : 0
  }

  return Math.max(tone, boat(440, 735, 1), boat(1445, 805, 0.7), x > 148 && x < 176 && y > crest(160) - 150 && y < crest(160) - 128 ? 0.5 : 0)
}

function blueInk(x, y) {
  let tone = 0

  // Water: ripples that thicken toward the foot, thin under the column and the wake.
  if (y > HORIZON + 2) {
    const t = y - HORIZON
    const wave = 0.5 + 0.5 * Math.sin(t * 0.15 + Math.sin(x * 0.012) * 1.6)

    tone = 0.36 * wave * (0.22 + 0.78 * away(x)) * smooth(0, 22, t) * (0.6 + 0.4 * smooth(0, 340, t))
    tone *= 1 - 0.85 * Math.exp(-(((x - SUN.x) / 120) ** 2)) * (1 - smooth(0, 300, t))
  }

  // The headland and lighthouse.
  const c = crest(x)

  if (y > c && y <= HORIZON + 6) {
    tone = Math.max(tone, (0.5 - 0.18 * smooth(0, 120, y - c)) * (0.3 + 0.7 * away(x)))
  }
  if (x > 150 && x < 174 && y > crest(160) - 128 && y <= crest(160)) {
    tone = Math.max(tone, Math.floor((y - crest(160)) / 22) % 2 === 0 ? 0.55 : 0.3)
  }

  // Hulls and a far shore.
  const hull = (bx, by, s) => (x > bx - 22 * s && x < bx + 72 * s && y > by - 8 * s && y < by + 4 * s ? 0.6 : 0)

  tone = Math.max(tone, hull(440, 735, 1), hull(1445, 805, 0.7))

  if (y > HORIZON - 30 && y <= HORIZON + 2) {
    tone = Math.max(tone, 0.2 * away(x) * smooth(900, 1000, x) * (x > 1000 ? 1 : 0))
  }

  return tone
}

function screen(tone, ringAt, half) {
  const turn = (15 * Math.PI) / 180
  const cos = Math.cos(turn)
  const sin = Math.sin(turn)
  const reach = Math.ceil(2000 / PITCH)
  const off = half ? 0.5 : 0
  const groups = new Map()

  for (let i = -reach; i <= reach; i++) {
    for (let j = -reach; j <= reach; j++) {
      const x = 800 + ((i + off) * cos - (j + off) * sin) * PITCH
      const y = 500 + ((i + off) * sin + (j + off) * cos) * PITCH

      if (x < -6 || x > W + 6 || y < -6 || y > H + 6) {
        continue
      }

      const dia = 2 * PITCH * Math.sqrt(tone(x, y) / Math.PI)

      if (dia < 2.6) {
        continue
      }

      const phase = Math.floor(ringAt(x, y)) % 8
      const w = Math.round(dia * 2) / 2
      const key = `${phase}|${w}`
      const g = groups.get(key) ?? { phase, w, d: '' }

      g.d += `M${Math.round(x)} ${Math.round(y)}h0`
      groups.set(key, g)
    }
  }

  let out = ''

  for (const g of groups.values()) {
    out += `<path stroke-width="${g.w}" style="animation-delay:${(-g.phase * 0.75).toFixed(2)}s" d="${g.d}"/>`
  }

  return out
}

const CSS = `
.ink path{fill:none;stroke-linecap:round;animation:pulse 6s ease-in-out infinite}
.ink{mix-blend-mode:${STOCK.blend}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@media (prefers-reduced-motion:reduce){.ink path{animation:none}}
`

export function buildScene() {
  const coral = screen(sunInk, (x, y) => Math.hypot(x - SUN.x, y - SUN.y) / 46, false)
  const blue = screen(blueInk, (x, y) => Math.abs(y - HORIZON) / 36 + Math.abs(x - SUN.x) / 400, true)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><style>${CSS}</style><defs><linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${STOCK.top}"/><stop offset="1" stop-color="${STOCK.foot}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#paper)"/><g class="ink" stroke="${STOCK.coral}" stroke-opacity="${STOCK.coralOp}">${coral}</g><g class="ink" stroke="${STOCK.blue}" stroke-opacity="${STOCK.blueOp}">${blue}</g></svg>`
}
