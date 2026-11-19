// Constellations: an original scene of a star map. Rings and meridians of a
// celestial chart on deep blue, with constellations that draw themselves star to
// star, hold, and fade out, and a shooting star now and then.
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
.draw{stroke-dasharray:1;stroke-dashoffset:1;animation:draw var(--d,26s) ease-in-out infinite;animation-delay:var(--l,0s)}
.tw{animation:tw var(--d,4s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.turn{animation:turn 400s linear infinite;transform-origin:800px 450px}
.shoot{animation:shoot var(--d,18s) ease-in infinite;animation-delay:var(--l,0s)}
@keyframes draw{0%{stroke-dashoffset:1}30%{stroke-dashoffset:0}78%{stroke-dashoffset:0}100%{stroke-dashoffset:-1}}
@keyframes tw{from{opacity:.4}to{opacity:1}}
@keyframes turn{to{transform:rotate(360deg)}}
@keyframes shoot{0%{transform:translate(0,0);opacity:0}2%{opacity:1}8%{transform:translate(380px,200px);opacity:0}100%{transform:translate(380px,200px);opacity:0}}
@media (prefers-reduced-motion:reduce){.draw{animation:none;stroke-dashoffset:0}.tw,.turn,.shoot{animation:none}}
`

// Each constellation: its stars as [x, y, size] and the chains of stars joined by lines.
const SHAPES = [
  { s: [[160, 160, 4], [230, 200, 3], [300, 190, 3], [360, 240, 4], [350, 320, 3], [420, 360, 4], [260, 300, 3]], l: [[0, 1, 2, 3, 4, 5], [3, 6, 4]] },
  { s: [[1180, 130, 4], [1260, 170, 3], [1340, 120, 4], [1400, 190, 3], [1480, 150, 4]], l: [[0, 1, 2, 3, 4]] },
  { s: [[140, 520, 3], [210, 600, 4], [200, 700, 3], [280, 760, 4], [340, 690, 3], [380, 600, 3], [300, 540, 4]], l: [[0, 1, 2, 3, 4, 5, 6, 1]] },
  { s: [[1260, 560, 4], [1340, 640, 3], [1420, 600, 4], [1480, 700, 3], [1390, 760, 4], [1300, 740, 3]], l: [[0, 1, 2, 3, 4, 5, 1], [2, 4]] },
  { s: [[520, 80, 3], [580, 150, 4], [660, 120, 3], [700, 60, 3], [640, 200, 4]], l: [[0, 1, 2, 3], [1, 4]] },
  { s: [[1000, 800, 4], [1080, 760, 3], [1160, 800, 4], [1220, 850, 3], [1100, 850, 3]], l: [[0, 1, 2, 3], [1, 4, 0]] },
  { s: [[480, 780, 3], [540, 830, 4], [620, 800, 3], [680, 850, 4]], l: [[0, 1, 2, 3]] }
]

export function buildScene() {
  const rand = rng(41)
  const defs =
    vgrad('bg', [[0, '#050a1e'], [1, '#0d1a40']]) +
    rgrad('sg', '#fff6d0', 0.8)

  let out = `<rect width="${W}" height="${H}" fill="url(#bg)"/>`

  // The chart: slow-turning rings and meridians around a pole.
  let chart = ''

  for (const r of [120, 240, 360, 480, 600, 760]) {
    chart += `<circle cx="800" cy="450" r="${r}" fill="none" stroke="#3a5aa8" stroke-opacity=".35" stroke-width="1.5" stroke-dasharray="${r > 400 ? '2 8' : '1 0'}"/>`
  }
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2

    chart += `<line x1="800" y1="450" x2="${(800 + Math.cos(a) * 900).toFixed(0)}" y2="${(450 + Math.sin(a) * 900).toFixed(0)}" stroke="#3a5aa8" stroke-opacity=".25" stroke-width="1.2"/>`
  }
  out += `<g class="turn">${chart}</g>`

  // Faint background stars.
  let bg = ''

  for (let g = 0; g < 4; g++) {
    let st = ''

    for (let i = 0; i < 50; i++) {
      st += `<circle cx="${Math.round(rand() * W)}" cy="${Math.round(rand() * H)}" r="${(0.6 + rand() * 1.2).toFixed(1)}" fill="#cdd8ff" opacity="${(0.35 + rand() * 0.4).toFixed(2)}"/>`
    }
    bg += `<g class="tw" style="--d:${(3 + rand() * 4).toFixed(1)}s;--l:${(-rand() * 5).toFixed(1)}s">${st}</g>`
  }
  out += bg

  // Constellations drawing and fading out, each on its own offset.
  SHAPES.forEach((c, i) => {
    const l = (-i * 3.7).toFixed(1)

    for (const chain of c.l) {
      out += `<path class="draw" pathLength="1" d="M${chain.map(k => `${c.s[k][0]} ${c.s[k][1]}`).join(' L')}" fill="none" stroke="#9ab4ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="--l:${l}s"/>`
    }
    for (const [x, y, r] of c.s) {
      out += `<g class="tw" style="--d:${(2 + rand() * 2).toFixed(1)}s;--l:${(-rand() * 3).toFixed(1)}s"><circle cx="${x}" cy="${y}" r="${r * 7}" fill="url(#sg)"/><circle cx="${x}" cy="${y}" r="${r}" fill="#fff8e0"/></g>`
    }
  })

  // Shooting stars.
  for (const [x, y, d, l] of [[300, 60, 19, -4], [1100, 300, 27, -15], [200, 420, 23, -9]]) {
    out += `<g class="shoot" style="--d:${d}s;--l:${l}s"><line x1="${x}" y1="${y}" x2="${x - 90}" y2="${y - 48}" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-opacity=".8"/><circle cx="${x}" cy="${y}" r="3.5" fill="#fff"/></g>`
  }

  return svg(defs, CSS, out)
}
