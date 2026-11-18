// Code Rain: original columns of falling glyphs in phosphor green. Each column
// has a bright head and a fading tail; the columns under the reading column
// are dimmer. Vector art on a 1600x900 canvas, using the system monospace font.
// Pure SVG + CSS animation: no script.

const W = 1600
const H = 900
const STEP = 29
const ROW = 25
const GLYPHS = '01ABCDEFGHJKLMNPQRSTUVWXYZ<>{}[]/\\*+-=#$%&?;:'

function rng(seed) {
  let s = seed >>> 0

  return () => {
    s = (s * 1664525 + 1013904223) >>> 0

    return s / 4294967296
  }
}

function smooth(a, b, v) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)))

  return t * t * (3 - 2 * t)
}

const away = x => Math.max(1 - smooth(300, 560, x), smooth(1040, 1300, x))

const CSS = `
text{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:22px}
.col{animation:fall linear infinite}
.fl{animation:fl 3s steps(1,end) infinite}
@keyframes fall{from{transform:translateY(calc(var(--len) * -1))}to{transform:translateY(${H + 40}px)}}
@keyframes fl{0%,100%{opacity:1}50%{opacity:.3}}
@media (prefers-reduced-motion:reduce){.col,.fl{animation:none}}
`

export function buildScene() {
  const r = rng(13)
  let out = `<defs><radialGradient id="glow" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#0b2415"/><stop offset="1" stop-color="#030806"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#glow)"/>`

  for (let x = 14; x < W; x += STEP) {
    const n = 12 + Math.floor(r() * 12)
    const len = n * ROW
    const dim = 0.3 + 0.7 * away(x)
    const dur = (7 + r() * 11).toFixed(1)
    const delay = (-r() * 18).toFixed(1)
    let spans = ''

    for (let i = 0; i < n; i++) {
      const head = i === n - 1
      const fade = (i + 1) / n
      const ch = GLYPHS[Math.floor(r() * GLYPHS.length)].replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])
      const flick = !head && r() < 0.06 ? ' class="fl"' : ''

      spans += `<tspan x="${x}" dy="${i === 0 ? 0 : ROW}" fill="${head ? '#e6ffee' : '#2cff7a'}" fill-opacity="${(head ? 1 : fade ** 1.6 * 0.85).toFixed(2)}"${flick}>${ch}</tspan>`
    }
    out += `<g opacity="${dim.toFixed(2)}"><text class="col" style="--len:${len}px;animation-duration:${dur}s;animation-delay:${delay}s" y="0">${spans}</text></g>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><style>${CSS}</style>${out}</svg>`
}
