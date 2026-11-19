// oscilloscope-calm: the calm version of oscilloscope. The same scene, slowed down and softened under a veil.
// It wraps the original scene below.

const W = 1600
const H = 900

function rng(seed) {
  let s = seed >>> 0

  return () => {
    s = (s * 1664525 + 1013904223) >>> 0

    return s / 4294967296
  }
}

function svg(defs, css, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${css}</style>${body}</svg>`
}

// A vertical gradient from a list of [offset, color] stops.
function vgrad(id, stops) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a === undefined ? '' : ` stop-opacity="${a}"`}/>`).join('')}</linearGradient>`
}

function rgrad(id, color, inner = 0.7) {
  return `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${inner}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`
}

const CSS = `
.w1{animation:scroll 8s linear infinite}
.w2{animation:scroll 12s linear infinite}
.w3{animation:scroll 6s linear infinite}
.w4{animation:scroll 16s linear infinite reverse}
.sweep{animation:sweep 14s linear infinite}
.flick{animation:flick 5s ease-in-out infinite alternate}
@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-400px)}}
@keyframes sweep{from{transform:translateX(0)}to{transform:translateX(1600px)}}
@keyframes flick{from{opacity:.88}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.w1,.w2,.w3,.w4,.sweep,.flick{animation:none}}
`

// A wave as a polyline over three periods of 400px, so that scrolling by one period loops.
function wave(y, f) {
  const pts = []

  for (let x = -400; x <= 2000; x += 8) {
    pts.push(`${x} ${(y - f((x / 400) * Math.PI * 2)).toFixed(1)}`)
  }

  return `M${pts.join(' L')}`
}

function baseScene() {
  const defs =
    rgrad('vig', '#0a2a18', 0.9) +
    vgrad('trail', [[0, '#4dff9a', 0], [1, '#4dff9a', 0.25]]) +
    `<linearGradient id="trailh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4dff9a" stop-opacity="0"/><stop offset="1" stop-color="#4dff9a" stop-opacity=".22"/></linearGradient>`

  let out = `<rect width="${W}" height="${H}" fill="#030a06"/><ellipse cx="800" cy="450" rx="1000" ry="620" fill="url(#vig)"/>`

  // The graticule: ten divisions across, eight down, with fine ticks on the centre lines.
  let grid = ''

  for (let i = 0; i <= 10; i++) {
    const x = 80 + i * 144

    grid += `<line x1="${x}" y1="${90}" x2="${x}" y2="${810}" stroke="#1f6a40" stroke-width="${i === 5 ? 2.5 : 1.5}"/>`
  }
  for (let j = 0; j <= 8; j++) {
    const y = 90 + j * 90

    grid += `<line x1="80" y1="${y}" x2="1520" y2="${y}" stroke="#1f6a40" stroke-width="${j === 4 ? 2.5 : 1.5}"/>`
  }
  for (let t = 0; t <= 50; t++) {
    const x = 80 + t * 28.8

    grid += `<line x1="${x}" y1="444" x2="${x}" y2="456" stroke="#2a8a54" stroke-width="1.5"/>`
  }
  for (let t = 0; t <= 40; t++) {
    const y = 90 + t * 18

    grid += `<line x1="794" y1="${y}" x2="806" y2="${y}" stroke="#2a8a54" stroke-width="1.5"/>`
  }
  out += grid + `<rect x="80" y="90" width="1440" height="720" fill="none" stroke="#2a8a54" stroke-width="4"/>`

  // The traces. Each has a wide faint glow under a thin bright line.
  const traces = [
    ['w1', 450, t => 150 * Math.sin(t), '#4dff9a'],
    ['w2', 450, t => 90 * Math.sin(t) + 70 * Math.sin(3 * t + 1), '#4ad8ff'],
    ['w3', 450, t => (Math.sin(t) >= 0 ? 110 : -110) + 20 * Math.sin(9 * t) * 0.3, '#ffc24a'],
    ['w4', 450, t => 130 * (2 / Math.PI) * Math.asin(Math.sin(t)), '#ff7ad8']
  ]

  for (const [cls, y, f, c] of traces) {
    const d = wave(y, f)

    out += `<g class="flick"><g class="${cls}"><path d="${d}" fill="none" stroke="${c}" stroke-width="12" stroke-opacity=".14" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="3" stroke-linejoin="round"/></g></g>`
  }

  // A cursor line that sweeps across with a trailing glow, clipped by the screen edges.
  out += `<g class="sweep"><rect x="-160" y="90" width="160" height="720" fill="url(#trailh)"/><line x1="0" y1="90" x2="0" y2="810" stroke="#9dffc8" stroke-width="2"/></g>`

  // The bezel hides what is outside the screen.
  out += `<path d="M0 0 H1600 V900 H0 Z M80 90 V810 H1520 V90 Z" fill="#030a06" fill-rule="evenodd"/>`

  return svg(defs, CSS, out)
}

// ---------- calm ----------

const SLOW = 2.5
const VEIL = '#030b07'

// Make every time in a piece of CSS or an inline style slower.
const slow = css => css.replace(/(-?\d*\.?\d+)s\b/g, (_, n) => `${+(parseFloat(n) * SLOW).toFixed(2)}s`)

export function buildScene() {
  const svg = baseScene()
    .replace(/<style>([\s\S]*?)<\/style>/, (_, css) => `<style>${slow(css)}</style>`)
    .replace(/style="([^"]*)"/g, (_, s) => `style="${slow(s)}"`)

  return svg.replace('</svg>', `<rect width="${W}" height="${H}" fill="${VEIL}" fill-opacity=".4"/></svg>`)
}
