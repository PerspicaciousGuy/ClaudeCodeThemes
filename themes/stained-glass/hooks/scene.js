// Stained Glass: an original scene of a cathedral window at night, lit from
// behind. Tall arched lancets of jewel-colored panes in dark lead, a rose window
// above, and soft light that drifts slowly across the glass.
// Vector art on a 1600x900 canvas.
// Pure SVG + CSS animation: no script, nothing loaded.

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
.lg0{animation:lg 9s ease-in-out infinite alternate}
.lg1{animation:lg 9s ease-in-out -3s infinite alternate}
.lg2{animation:lg 9s ease-in-out -6s infinite alternate}
.sweep{animation:sweep 40s linear infinite}
.rose{animation:rose 240s linear infinite;transform-origin:800px 170px}
@keyframes lg{from{opacity:.55}to{opacity:1}}
@keyframes sweep{from{transform:translateX(-500px)}to{transform:translateX(2100px)}}
@keyframes rose{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.lg0,.lg1,.lg2,.sweep,.rose{animation:none}}
`

const JEWELS = ['#b8202e', '#1f4fa8', '#e0a020', '#2a8a5a', '#7a2a8a', '#d86a1e', '#1f8aa8', '#c04a7a']

// Split a rectangle into panes at random, returning the panes as [x, y, w, h].
function panes(x, y, w, h, rand, depth) {
  if (depth === 0 || w < 70 || h < 70) {
    return [[x, y, w, h]]
  }

  const vertical = w > h ? true : w < h ? false : rand() < 0.5
  const t = 0.35 + rand() * 0.3

  return vertical
    ? [...panes(x, y, w * t, h, rand, depth - 1), ...panes(x + w * t, y, w * (1 - t), h, rand, depth - 1)]
    : [...panes(x, y, w, h * t, rand, depth - 1), ...panes(x, y + h * t, w, h * (1 - t), rand, depth - 1)]
}

export function buildScene() {
  const rand = rng(23)
  let defs =
    vgrad('wall', [[0, '#120a18'], [1, '#08040c']]) +
    vgrad('shine', [[0, '#ffffff', 0.45], [1, '#ffffff', 0]]) +
    `<linearGradient id="sw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff2c0" stop-opacity="0"/><stop offset=".5" stop-color="#fff2c0" stop-opacity=".35"/><stop offset="1" stop-color="#fff2c0" stop-opacity="0"/></linearGradient>`

  let out = `<rect width="${W}" height="${H}" fill="url(#wall)"/>`

  // Four lancets, each an arched window clipped from a field of panes.
  const lancets = [[110, 270], [450, 270], [810, 270], [1170, 270]]
  let k = 0

  for (const [x0, w0] of lancets) {
    const id = `lan${k}`
    const top = 330

    defs += `<clipPath id="${id}"><path d="M${x0} 860 V${top + w0 / 2} A ${w0 / 2} ${w0 / 2} 0 0 1 ${x0 + w0} ${top + w0 / 2} V860 Z"/></clipPath>`

    let g = ''

    for (const [x, y, w, h] of panes(x0, top, w0, 860 - top, rand, 5)) {
      g += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${JEWELS[Math.floor(rand() * JEWELS.length)]}" stroke="#0a0610" stroke-width="7"/>`
    }
    out += `<g clip-path="url(#${id})"><g class="lg${k % 3}">${g}</g><rect x="${x0}" y="${top}" width="${w0}" height="${860 - top}" fill="url(#shine)" opacity=".35"/></g>`
    out += `<path d="M${x0} 860 V${top + w0 / 2} A ${w0 / 2} ${w0 / 2} 0 0 1 ${x0 + w0} ${top + w0 / 2} V860" fill="none" stroke="#2a2030" stroke-width="12"/>`
    k++
  }

  // A rose window above, turning very slowly: spokes and petals in colored glass.
  let rose = ''

  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2
    const b = ((i + 1) / 12) * Math.PI * 2

    rose += `<path d="M800 170 L${(800 + Math.cos(a) * 140).toFixed(0)} ${(170 + Math.sin(a) * 140).toFixed(0)} A 140 140 0 0 1 ${(800 + Math.cos(b) * 140).toFixed(0)} ${(170 + Math.sin(b) * 140).toFixed(0)} Z" fill="${JEWELS[i % JEWELS.length]}" stroke="#0a0610" stroke-width="6"/>`
    rose += `<circle cx="${(800 + Math.cos(a + 0.26) * 96).toFixed(0)}" cy="${(170 + Math.sin(a + 0.26) * 96).toFixed(0)}" r="20" fill="${JEWELS[(i + 3) % JEWELS.length]}" stroke="#0a0610" stroke-width="5"/>`
  }
  out += `<g class="lg1"><g class="rose">${rose}</g></g><circle cx="800" cy="170" r="150" fill="none" stroke="#2a2030" stroke-width="14"/><circle cx="800" cy="170" r="32" fill="#e8c860" stroke="#0a0610" stroke-width="6"/>`

  // A slow beam of light crossing the glass.
  out += `<g class="sweep"><polygon points="0,0 160,0 60,900 -100,900" fill="url(#sw)"/></g>`

  // The stone floor.
  out += `<rect x="0" y="860" width="${W}" height="40" fill="#0a0610"/>`

  return svg(defs, CSS, out)
}
