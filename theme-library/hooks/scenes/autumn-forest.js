// Autumn Forest: an original scene of a forest in autumn at golden dusk. Trees
// in layers wear red, orange and gold, leaves spiral down, light shafts slant
// through the haze and fallen leaves carpet the ground.
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
.shaft{animation:shaft 13s ease-in-out infinite alternate}
.shaft2{animation:shaft 18s ease-in-out infinite alternate-reverse}
.mist{animation:mist 80s ease-in-out infinite alternate}
.fall{animation:fall var(--d,16s) linear infinite;animation-delay:var(--l,0s)}
.spin{animation:spin var(--e,3s) ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center}
@keyframes sway{from{transform:rotate(-.6deg)}to{transform:rotate(.8deg)}}
@keyframes shaft{from{opacity:.4}to{opacity:1}}
@keyframes mist{from{transform:translateX(-140px)}to{transform:translateX(160px)}}
@keyframes fall{0%{transform:translate(0,-40px)}25%{transform:translate(calc(var(--dx,80px) * .6),230px)}50%{transform:translate(calc(var(--dx,80px) * .2),470px)}75%{transform:translate(calc(var(--dx,80px) * .9),700px)}100%{transform:translate(var(--dx,80px),960px)}}
@keyframes spin{from{transform:rotate(-50deg) scaleX(1)}to{transform:rotate(50deg) scaleX(.5)}}
@media (prefers-reduced-motion:reduce){.sway,.shaft,.shaft2,.mist,.fall,.spin{animation:none}}
`

const LEAF = 'M0 -12 C 10 -10 12 4 0 14 C -12 4 -10 -10 0 -12 Z'

// A tree: trunk, a few boughs and a canopy of overlapping blobs in autumn colors.
function tree(x, base, h, w, trunk, cols, rand, blobs) {
  let out = `<path d="M${x - w * 0.5} ${base} Q ${x - w * 0.3} ${base - h * 0.5} ${x - w * 0.18} ${base - h} L${x + w * 0.18} ${base - h} Q ${x + w * 0.3} ${base - h * 0.5} ${x + w * 0.5} ${base} Z" fill="${trunk}"/>`

  out += `<path d="M${x} ${base - h * 0.6} l ${-h * 0.25} ${-h * 0.2} M${x} ${base - h * 0.7} l ${h * 0.28} ${-h * 0.22}" stroke="${trunk}" stroke-width="${(w * 0.16).toFixed(0)}" stroke-linecap="round" fill="none"/>`

  for (let i = 0; i < blobs; i++) {
    const a = rand() * Math.PI * 2
    const r = rand() * h * 0.5

    out += `<ellipse cx="${(x + Math.cos(a) * r * 1.2).toFixed(0)}" cy="${(base - h - h * 0.12 + Math.sin(a) * r * 0.7).toFixed(0)}" rx="${(h * (0.16 + rand() * 0.12)).toFixed(0)}" ry="${(h * (0.12 + rand() * 0.1)).toFixed(0)}" fill="${cols[Math.floor(rand() * cols.length)]}"/>`
  }

  return out
}

export function buildScene() {
  const rand = rng(33)
  const defs =
    `<path id="lf" d="${LEAF}"/>` +
    vgrad('sky', [[0, '#3a2438'], [0.4, '#8a4a3c'], [0.75, '#e08a4a'], [1, '#f2b45a']]) +
    rgrad('sun', '#ffd890', 0.95) +
    vgrad('shaft', [[0, '#ffd48a', 0.55], [1, '#ffd48a', 0]]) +
    vgrad('ground', [[0, '#5a2e1a'], [1, '#2a140e']]) +
    rgrad('mi', '#f0b890', 0.5)

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/><circle cx="800" cy="470" r="520" fill="url(#sun)" opacity=".8"/>`
  const far = ['#b0522c', '#c8702e', '#a04030', '#d8902e']
  const mid = ['#c4401e', '#e0701c', '#e8a02a', '#a83020', '#d85a1a']
  const near = ['#9a2a18', '#c8481a', '#d88a1e', '#7a2014', '#e06a16']

  // Far trees, hazy.
  let g = ''

  for (let i = 0; i < 14; i++) {
    g += tree(40 + i * 118 + rand() * 40, 640, 150 + rand() * 60, 14, '#5a3a40', far, rand, 9)
  }
  out += `<g opacity=".7">${g}</g><g class="mist"><ellipse cx="800" cy="600" rx="1000" ry="120" fill="url(#mi)"/></g>`

  // Slanting light.
  out += `<g class="shaft"><polygon points="760,0 900,0 1200,900 780,900" fill="url(#shaft)"/></g><g class="shaft2"><polygon points="420,0 520,0 640,900 380,900" fill="url(#shaft)" opacity=".7"/><polygon points="1100,0 1180,0 1500,900 1240,900" fill="url(#shaft)" opacity=".6"/></g>`

  // Mid trees.
  for (let i = 0; i < 8; i++) {
    const x = 60 + i * 210 + rand() * 60

    out += `<g class="sway" style="transform-origin:${Math.round(x)}px 760px;--d:${(8 + rand() * 4).toFixed(1)}s;--l:${(-rand() * 8).toFixed(1)}s">${tree(x, 760, 280 + rand() * 80, 30, '#3a2024', mid, rand, 16)}</g>`
  }

  out += `<path d="M0 900 L0 760 C 300 735 600 775 900 752 C 1200 730 1450 770 1600 748 L1600 900 Z" fill="url(#ground)"/>`

  // Near trees frame the sides.
  for (const [x, h] of [[80, 560], [300, 440], [1290, 440], [1500, 560]]) {
    out += `<g class="sway" style="transform-origin:${x}px 900px;--d:${(10 + rand() * 4).toFixed(1)}s;--l:${(-rand() * 8).toFixed(1)}s">${tree(x, 900, h, 60, '#1e0f12', near, rand, 22)}</g>`
  }

  // Fallen leaves on the ground.
  for (let i = 0; i < 90; i++) {
    out += `<use href="#lf" transform="translate(${Math.round(rand() * W)} ${790 + Math.round(rand() * 100)}) rotate(${Math.round(rand() * 360)}) scale(${(0.5 + rand() * 0.6).toFixed(2)})" fill="${near[i % near.length]}" opacity=".85"/>`
  }

  // Leaves coming down, turning as they fall.
  const lc = ['#e05a1a', '#f0a02a', '#c8381c', '#f2c040', '#d87020']

  for (let i = 0; i < 40; i++) {
    out += `<g class="fall" style="--d:${(13 + rand() * 12).toFixed(1)}s;--l:${(-rand() * 24).toFixed(1)}s;--dx:${Math.round(rand() * 260 - 110)}px"><g transform="translate(${Math.round(rand() * W)} 0)"><g class="spin" style="--e:${(1.8 + rand() * 2).toFixed(1)}s;animation-delay:${(-rand() * 3).toFixed(1)}s"><use href="#lf" transform="scale(${(0.7 + rand() * 0.8).toFixed(2)})" fill="${lc[i % lc.length]}"/></g></g></g>`
  }

  return svg(defs, CSS, out)
}
