// Retro Grid: an original neon horizon. A slatted sun, wireframe mountains and
// a perspective grid that rolls toward you. A dark veil rests the center.
// Vector art on a 1600x900 canvas. Pure SVG + CSS animation: no script.

const W = 1600
const H = 900
const HORIZON = 540
const VANISH = 800

function rng(seed) {
  let s = seed >>> 0

  return () => {
    s = (s * 1664525 + 1013904223) >>> 0

    return s / 4294967296
  }
}

const CSS = `
.rolling{animation:roll 1.8s linear infinite}
.sun{animation:glow 7s ease-in-out infinite}
.tw{animation:tw 4s ease-in-out infinite}
.beam{animation:scan 9s linear infinite}
@keyframes roll{from{transform:translateY(0)}to{transform:translateY(var(--d))}}
@keyframes glow{0%,100%{opacity:.9}50%{opacity:1}}
@keyframes tw{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes scan{from{transform:translateX(-1700px)}to{transform:translateX(100px)}}
@media (prefers-reduced-motion:reduce){.rolling,.sun,.tw,.beam{animation:none}}
`

function mountain(points, color) {
  const d = points.map(([x, y]) => `${x} ${y}`).join(' L')

  return `<path d="M${d} L${points[points.length - 1][0]} ${HORIZON} L${points[0][0]} ${HORIZON} Z" fill="#0a0620" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>`
}

export function buildScene() {
  const r = rng(4)
  const defs =
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07041a"/><stop offset=".6" stop-color="#1a0b3a"/><stop offset="1" stop-color="#4a1060"/></linearGradient>' +
    '<linearGradient id="sunG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd24a"/><stop offset=".5" stop-color="#ff6a8a"/><stop offset="1" stop-color="#c02ad8"/></linearGradient>' +
    '<radialGradient id="halo"><stop offset="0" stop-color="#ff4fa8" stop-opacity=".5"/><stop offset="1" stop-color="#ff4fa8" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a0a4a"/><stop offset="1" stop-color="#0a0418"/></linearGradient>' +
    '<radialGradient id="veil" cx=".5" cy=".62" r=".5"><stop offset="0" stop-color="#07041a" stop-opacity=".72"/><stop offset="1" stop-color="#07041a" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="bm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6ff3ff" stop-opacity="0"/><stop offset=".5" stop-color="#6ff3ff" stop-opacity=".5"/><stop offset="1" stop-color="#6ff3ff" stop-opacity="0"/></linearGradient>'

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  for (let i = 0; i < 90; i++) {
    out += `<circle class="tw" cx="${Math.round(r() * W)}" cy="${Math.round(r() * (HORIZON - 40))}" r="${(0.6 + r() * 1.3).toFixed(1)}" fill="#f0e8ff" opacity=".8" style="animation-delay:${(-r() * 4).toFixed(1)}s"/>`
  }

  // The sun, set behind the right-hand mountains, with slats cut across it.
  const sx = 1180
  const sy = 400

  out += `<g class="sun"><circle cx="${sx}" cy="${sy}" r="330" fill="url(#halo)"/><circle cx="${sx}" cy="${sy}" r="170" fill="url(#sunG)"/>`
  for (let i = 0; i < 7; i++) {
    out += `<rect x="${sx - 175}" y="${sy + 20 + i * 24}" width="350" height="${3 + i * 2.2}" fill="#1a0b3a"/>`
  }
  out += '</g>'

  // Wireframe mountains at the sides.
  out += mountain([[-20, HORIZON], [90, 380], [170, 450], [290, 300], [410, 440], [520, 380], [600, HORIZON]], '#33e6ff')
  out += mountain([[1000, HORIZON], [1090, 440], [1190, 330], [1280, 420], [1380, 280], [1480, 400], [1620, 330], [1620, HORIZON]], '#ff4fa8')

  // The floor and its grid.
  out += `<rect y="${HORIZON}" width="${W}" height="${H - HORIZON}" fill="url(#floor)"/>`
  for (let i = -24; i <= 24; i++) {
    out += `<line x1="${VANISH}" y1="${HORIZON}" x2="${VANISH + i * 210}" y2="${H}" stroke="#ff4fa8" stroke-width="2" opacity=".5"/>`
  }

  const ys = []

  for (let k = 0; k < 16; k++) {
    ys.push(HORIZON + 340 * (k / 15) ** 2.1 + 2)
  }
  ys.forEach((y, k) => {
    const next = k + 1 < ys.length ? ys[k + 1] : y + 120
    const o = Math.min(0.95, 0.2 + 0.05 * k)

    out += `<g class="rolling" style="--d:${(next - y).toFixed(1)}px"><line x1="-40" y1="${y.toFixed(1)}" x2="${W + 40}" y2="${y.toFixed(1)}" stroke="#ff4fa8" stroke-width="${(1 + k * 0.2).toFixed(1)}" opacity="${o.toFixed(2)}"/></g>`
  })
  out += `<line x1="0" y1="${HORIZON}" x2="${W}" y2="${HORIZON}" stroke="#6ff3ff" stroke-width="3" opacity=".7"/>`

  // A scan line across the horizon, and a veil over the middle for the words.
  out += `<g class="beam"><rect x="0" y="${HORIZON - 4}" width="400" height="8" fill="url(#bm)"/></g>`
  out += `<rect width="${W}" height="${H}" fill="url(#veil)"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
