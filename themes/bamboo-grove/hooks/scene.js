// Bamboo Grove: an original scene of a bamboo grove in morning mist. Stalks
// stand in layers fading into haze, leaves sway at different speeds, slow
// shafts of light shift through, and a few leaves fall.
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
.sway{animation:sway var(--d,9s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.shaft{animation:shaft 14s ease-in-out infinite alternate}
.shaft2{animation:shaft 19s ease-in-out infinite alternate-reverse}
.mist1{animation:mist 70s ease-in-out infinite alternate}
.mist2{animation:mist 95s ease-in-out infinite alternate-reverse}
.fall{animation:fall var(--d,16s) linear infinite;animation-delay:var(--l,0s)}
@keyframes sway{from{transform:rotate(-.7deg)}to{transform:rotate(.9deg)}}
@keyframes shaft{from{opacity:.45}to{opacity:1}}
@keyframes mist{from{transform:translateX(-120px)}to{transform:translateX(160px)}}
@keyframes fall{0%{transform:translate(0,-40px) rotate(0deg)}50%{transform:translate(calc(var(--dx,60px) * .5),480px) rotate(140deg)}100%{transform:translate(var(--dx,60px),960px) rotate(300deg)}}
@media (prefers-reduced-motion:reduce){.sway,.shaft,.shaft2,.mist1,.mist2,.fall{animation:none}}
`

const LEAF = 'M0 0 C 18 -9 70 -12 118 0 C 70 12 18 9 0 0 Z'

// A spray of narrow leaves from one point.
function spray(x, y, n, size, c1, c2, rand) {
  let out = ''

  for (let i = 0; i < n; i++) {
    const side = i % 2 ? 1 : -1
    const ang = side * (10 + rand() * 60) + (side > 0 ? 0 : 180)

    out += `<use href="#lf" transform="translate(${x} ${y}) rotate(${ang.toFixed(0)}) scale(${(size * (0.7 + rand() * 0.5)).toFixed(2)})" fill="${i % 3 ? c1 : c2}"/>`
  }

  return out
}

// One stalk: a tall rounded bar with nodes and a pale highlight.
function stalk(x, w, c, hi, node, step, rand, leafy, lc1, lc2) {
  let out = `<rect x="${x - w / 2}" y="-20" width="${w}" height="960" rx="${w / 3}" fill="${c}"/><rect x="${x - w * 0.28}" y="-20" width="${w * 0.14}" height="960" fill="${hi}" opacity=".5"/>`

  for (let y = 60 + Math.round(rand() * 60); y < 900; y += step + Math.round(rand() * 40)) {
    out += `<rect x="${x - w / 2 - 3}" y="${y}" width="${w + 6}" height="${Math.max(4, w * 0.16).toFixed(1)}" rx="2" fill="${node}"/>`
  }
  if (leafy) {
    for (let k = 0; k < (leafy < 0.5 ? 2 : 4); k++) {
      out += spray(x, 40 + k * 90 + rand() * 40, 5, leafy, lc1, lc2, rand)
    }
  }

  return out
}

export function buildScene() {
  const rand = rng(61)
  const defs =
    `<path id="lf" d="${LEAF}"/>` +
    vgrad('bg', [[0, '#d6e6dc'], [0.5, '#eaf1dc'], [1, '#c8dcb8']]) +
    rgrad('sun', '#fff8d0', 0.95) +
    vgrad('shaft', [[0, '#fffbe0', 0.5], [1, '#fffbe0', 0]]) +
    rgrad('mi', '#f2f8ee', 0.75)

  let out = `<rect width="${W}" height="${H}" fill="url(#bg)"/><circle cx="1180" cy="120" r="420" fill="url(#sun)" opacity=".7"/>`

  // Slow shafts of light.
  out += `<g class="shaft"><polygon points="1000,0 1180,0 700,900 380,900" fill="url(#shaft)"/><polygon points="1220,0 1300,0 1130,900 960,900" fill="url(#shaft)"/></g>`
  out += `<g class="shaft2"><polygon points="820,0 900,0 420,900 260,900" fill="url(#shaft)" opacity=".7"/></g>`

  // Far stalks, pale in the haze.
  let far = ''

  for (let i = 0; i < 26; i++) {
    const fx = Math.round(30 + i * 62 + rand() * 30)

    far += `<g class="sway" style="transform-origin:${fx}px 900px;--d:${(10 + rand() * 6).toFixed(1)}s;--l:${(-rand() * 10).toFixed(1)}s">${stalk(fx, 16 + rand() * 6, '#b4cdae', '#e6f0dc', '#9bb896', 130, rand, 0.3, '#c0d8b4', '#b0cca6')}</g>`
  }
  out += `<g opacity=".8">${far}</g>`
  out += `<g class="mist1"><ellipse cx="700" cy="520" rx="900" ry="170" fill="url(#mi)"/></g>`

  // Middle stalks.
  let mid = ''

  for (let i = 0; i < 13; i++) {
    const mx = Math.round(60 + i * 122 + rand() * 50)

    mid += `<g class="sway" style="transform-origin:${mx}px 900px;--d:${(8 + rand() * 5).toFixed(1)}s;--l:${(-rand() * 8).toFixed(1)}s">${stalk(mx, 30 + rand() * 8, '#86ad7e', '#d4e6c6', '#6d9266', 150, rand, 0.55, '#7aa672', '#93bb88')}</g>`
  }
  out += mid
  out += `<g class="mist2"><ellipse cx="900" cy="640" rx="950" ry="150" fill="url(#mi)" opacity=".8"/></g>`

  // Near stalks frame the sides.
  let near = ''

  for (const x of [70, 210, 1400, 1540, 1330]) {
    near += `<g class="sway" style="transform-origin:${x}px 900px;--d:${(7 + rand() * 4).toFixed(1)}s;--l:${(-rand() * 7).toFixed(1)}s">${stalk(x, 52 + rand() * 12, '#4f8250', '#a8d09a', '#3a6a3c', 180, rand, 0.95, '#3f7a44', '#5b9a5a')}</g>`
  }
  out += near

  // Ground, with young shoots.
  out += `<path d="M0 900 L0 820 C 300 800 600 835 900 818 C 1200 800 1450 830 1600 812 L1600 900 Z" fill="#b8d0a2"/>`

  for (let i = 0; i < 20; i++) {
    const x = Math.round(rand() * W)
    const h = 40 + Math.round(rand() * 70)

    out += `<rect x="${x}" y="${900 - h}" width="9" height="${h}" rx="4" fill="#7ba56f" opacity=".9"/><rect x="${x - 2}" y="${900 - h * 0.5}" width="13" height="4" fill="#5f8a58"/>`
  }

  // A few leaves falling.
  for (let i = 0; i < 12; i++) {
    out += `<g class="fall" style="--d:${(14 + rand() * 12).toFixed(1)}s;--l:${(-rand() * 22).toFixed(1)}s;--dx:${Math.round(rand() * 200 - 70)}px"><use href="#lf" transform="translate(${Math.round(rand() * W)} 0) scale(.4)" fill="${i % 2 ? '#8db85a' : '#b4c85a'}"/></g>`
  }

  return svg(defs, CSS, out)
}
