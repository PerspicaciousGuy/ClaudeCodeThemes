// circuit-board-calm: the calm version of circuit-board. The same scene, slowed down and softened under a veil.
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
.pulse{stroke-dasharray:4 96;animation:pulse var(--d,6s) linear infinite;animation-delay:var(--l,0s)}
.led{animation:led var(--d,2.4s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
@keyframes pulse{from{stroke-dashoffset:0}to{stroke-dashoffset:-100}}
@keyframes led{from{opacity:.15}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.pulse,.led{animation:none}}
`

// An orthogonal trace: a walk on a 20px grid that turns now and then, with some 45 degree corners.
function trace(rand) {
  let x = 20 * Math.round(rand() * 80)
  let y = 20 * Math.round(rand() * 45)
  const pts = [[x, y]]
  let dir = rand() < 0.5 ? 0 : 1

  for (let i = 0; i < 4 + Math.floor(rand() * 4); i++) {
    const n = (2 + Math.floor(rand() * 6)) * 20 * (rand() < 0.5 ? -1 : 1)

    if (dir === 0) {
      x += n
    } else {
      y += n
    }
    dir = 1 - dir
    pts.push([x, y])
  }

  return pts
}

const inside = pts => pts.some(([x, y]) => x > 480 && x < 1120 && y > 220 && y < 680)
const bad = pts => pts.some(([x, y]) => x < 0 || x > 1600 || y < 0 || y > 900)

function baseScene() {
  const rand = rng(4)
  const defs =
    vgrad('bg', [[0, '#08301f'], [1, '#03150f']]) +
    rgrad('gl', '#7dffc8', 0.7) +
    `<pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1.5" fill="#1f6a4a" fill-opacity=".6"/></pattern>`

  let out = `<rect width="${W}" height="${H}" fill="url(#bg)"/><rect width="${W}" height="${H}" fill="url(#dots)"/>`
  let base = ''
  let pulses = ''
  let pads = ''
  let n = 0

  for (let t = 0; t < 400 && n < 64; t++) {
    const pts = trace(rand)

    if (inside(pts) || bad(pts)) {
      continue
    }

    const d = `M${pts.map(p => p.join(' ')).join(' L')}`

    n++
    base += `<path d="${d}" fill="none" stroke="#1d7a56" stroke-width="4" stroke-linejoin="round"/>`

    if (n % 2 === 0) {
      pulses += `<path class="pulse" pathLength="100" d="${d}" fill="none" stroke="#9dffd8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="--d:${(4 + rand() * 6).toFixed(1)}s;--l:${(-rand() * 8).toFixed(1)}s"/>`
    }
    for (const [x, y] of [pts[0], pts[pts.length - 1]]) {
      pads += `<circle cx="${x}" cy="${y}" r="9" fill="#0a2a1e" stroke="#2fa878" stroke-width="3"/><circle cx="${x}" cy="${y}" r="3" fill="#8affd0"/>`
    }
  }
  out += base + pads

  // Chips with pins on all four sides.
  for (const [x, y, w, h] of [[150, 120, 200, 140], [1300, 140, 180, 160], [120, 600, 170, 170], [1330, 600, 210, 130], [700, 40, 160, 90]]) {
    let pins = ''

    for (let i = 0; i < w / 24 - 1; i++) {
      pins += `<rect x="${x + 14 + i * 24}" y="${y - 12}" width="10" height="12" fill="#c9d8a0"/><rect x="${x + 14 + i * 24}" y="${y + h}" width="10" height="12" fill="#c9d8a0"/>`
    }
    for (let i = 0; i < h / 24 - 1; i++) {
      pins += `<rect x="${x - 12}" y="${y + 14 + i * 24}" width="12" height="10" fill="#c9d8a0"/><rect x="${x + w}" y="${y + 14 + i * 24}" width="12" height="10" fill="#c9d8a0"/>`
    }
    out += `${pins}<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#0b1411" stroke="#2a4a3c" stroke-width="3"/><circle cx="${x + 20}" cy="${y + 20}" r="6" fill="#2a4a3c"/><rect x="${x + 40}" y="${y + h / 2 - 3}" width="${w - 80}" height="6" rx="3" fill="#1c3a2e"/>`
  }

  // Pulses on top of everything.
  out += pulses

  // LEDs in three colors.
  const cols = ['#5dffb0', '#ffd24a', '#ff6a6a']

  for (let i = 0; i < 14; i++) {
    const x = rand() < 0.5 ? 40 + Math.round(rand() * 380) : 1180 + Math.round(rand() * 380)
    const y = 40 + Math.round(rand() * 820)

    out += `<rect x="${x - 7}" y="${y - 4}" width="14" height="8" fill="#0a1a14"/><g class="led" style="--d:${(1.4 + rand() * 2.4).toFixed(1)}s;--l:${(-rand() * 3).toFixed(1)}s"><circle cx="${x}" cy="${y}" r="26" fill="url(#gl)"/><rect x="${x - 6}" y="${y - 3}" width="12" height="6" rx="2" fill="${cols[i % 3]}"/></g>`
  }

  return svg(defs, CSS, out)
}

// ---------- calm ----------

const SLOW = 2.5
const VEIL = '#04130e'

// Make every time in a piece of CSS or an inline style slower.
const slow = css => css.replace(/(-?\d*\.?\d+)s\b/g, (_, n) => `${+(parseFloat(n) * SLOW).toFixed(2)}s`)

export function buildScene() {
  const svg = baseScene()
    .replace(/<style>([\s\S]*?)<\/style>/, (_, css) => `<style>${slow(css)}</style>`)
    .replace(/style="([^"]*)"/g, (_, s) => `style="${slow(s)}"`)

  return svg.replace('</svg>', `<rect width="${W}" height="${H}" fill="${VEIL}" fill-opacity=".4"/></svg>`)
}
