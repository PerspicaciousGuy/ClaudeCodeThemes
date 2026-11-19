// Forest Trail: an original pixel-art forest path on a bright morning, 192x108
// grid. Sunbeams slant through layered trees, mist drifts between them,
// butterflies follow the path and leaves fall. Light.
// Pure SVG + CSS animation: no script, nothing loaded.

const W = 192
const H = 108

function rng(seed) {
  let s = seed >>> 0

  return () => {
    s = (s * 1664525 + 1013904223) >>> 0

    return s / 4294967296
  }
}

function rect(x, y, w, h, fill, extra = '') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${extra}/>`
}

function sprite(x, y, rows, pal) {
  let out = ''

  rows.forEach((row, j) => {
    let i = 0

    while (i < row.length) {
      const ch = row[i]

      if (ch === '.') {
        i++
        continue
      }

      let k = i

      while (k < row.length && row[k] === ch) {
        k++
      }
      out += rect(x + i, y + j, k - i, 1, pal[ch])
      i = k
    }
  })

  return out
}

function disc(cx, cy, r, fill, extra = '') {
  let out = ''

  for (let dy = -r; dy <= r; dy++) {
    const half = Math.floor(Math.sqrt(r * r - dy * dy + 0.5))

    out += rect(cx - half, cy + dy, half * 2 + 1, 1, fill, extra)
  }

  return out
}

// A fir: stacked rows that widen toward the base.
function fir(x, top, h, dark, light) {
  let out = ''

  for (let i = 0; i < h; i++) {
    const w = 1 + Math.floor(i * 0.6) + (i % 5 === 4 ? 1 : 0)

    out += rect(x - Math.floor(w / 2), top + i, w, 1, i % 5 < 3 ? dark : light)
  }

  return out + rect(x, top + h, 1, 2, dark)
}

function bands(list, h, y0 = 0) {
  return list.map((c, i) => rect(0, y0 + i * h, W, h, c)).join('')
}

function svg(css, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges"><style>${css}</style>${body}</svg>`
}

const CSS = `
.sh{animation:sh 8s steps(1,end) infinite}
.sh2{animation:sh 11s steps(1,end) infinite -4s}
.mist1{animation:mist 90s linear infinite}
.mist2{animation:mist 140s linear infinite reverse}
.fa{animation:fa .6s steps(1,end) infinite}
.fb{animation:fb .6s steps(1,end) infinite}
.bf{animation:bf var(--d,30s) linear infinite;animation-delay:var(--l,0s)}
.bob{animation:bob 2.4s steps(1,end) infinite}
.lf{animation:lf var(--d,12s) linear infinite;animation-delay:var(--l,0s)}
.sway{animation:sway 5s steps(1,end) infinite}
@keyframes sh{0%,100%{opacity:1}50%{opacity:.6}}
@keyframes mist{from{transform:translateX(0)}to{transform:translateX(-192px)}}
@keyframes fa{0%,100%{opacity:1}50%{opacity:0}}
@keyframes fb{0%,100%{opacity:0}50%{opacity:1}}
@keyframes bf{from{transform:translateX(-10px)}to{transform:translateX(204px)}}
@keyframes bob{0%{transform:translateY(0)}25%{transform:translateY(-3px)}50%{transform:translateY(1px)}75%{transform:translateY(-2px)}}
@keyframes lf{from{transform:translate(0,-4px)}to{transform:translate(var(--dx,10px),112px)}}
@keyframes sway{0%,100%{transform:translateX(0)}50%{transform:translateX(1px)}}
@media (prefers-reduced-motion:reduce){.sh,.sh2,.mist1,.mist2,.fa,.fb,.bf,.bob,.lf,.sway{animation:none}.fb{opacity:0}}
`

// A round-crowned tree: a trunk and a lumpy canopy of discs.
function oak(x, base, h, trunk, leaf, lit) {
  const top = base - h

  return rect(x - 1, top + Math.floor(h * 0.45), 3, Math.ceil(h * 0.55), trunk) + disc(x, top + 6, 8, leaf) + disc(x - 6, top + 11, 6, leaf) + disc(x + 6, top + 11, 6, leaf) + disc(x - 2, top + 3, 4, lit) + disc(x + 4, top + 6, 3, lit)
}

export function buildScene() {
  const rand = rng(77)
  let out = bands(['#bfe0d8', '#cfe8d0', '#e0f0cc', '#eef4c8', '#f6f4c4', '#f8f0c0'], 9) + rect(0, 54, W, 20, '#f8f0c0')

  // The sun, low at the left, with light falling through the trees.
  out += `<g class="sh">${disc(80, 18, 20, '#fff8c0', ' opacity=".18"')}${disc(80, 18, 14, '#fffbd8', ' opacity=".35"')}</g>` + disc(80, 18, 8, '#fffce8')
  out += `<g class="sh">${[0, 1, 2].map(i => `<polygon points="${74 + i * 16},22 ${88 + i * 16},22 ${118 + i * 30},100 ${78 + i * 30},100" fill="#fff8c0" opacity="${0.12 - i * 0.02}"/>`).join('')}</g>`
  out += `<g class="sh2"><polygon points="96,22 104,22 170,100 140,100" fill="#fffbd8" opacity=".1"/><polygon points="66,22 72,22 80,100 50,100" fill="#fffbd8" opacity=".09"/></g>`

  // Far trees in haze, then the middle rank.
  out += rect(0, 58, W, 20, '#a8c8b0')
  for (let i = 0; i < 14; i++) {
    out += fir(4 + i * 14 + Math.floor(rand() * 6), 38 + Math.floor(rand() * 8), 22 + Math.floor(rand() * 6), '#98bca4', '#aacbb2')
  }
  out += rect(0, 64, W, 14, '#8cb496')
  for (let i = 0; i < 7; i++) {
    out += fir(10 + i * 30 + Math.floor(rand() * 8), 36 + Math.floor(rand() * 8), 32 + Math.floor(rand() * 6), '#5a8a5e', '#6c9c6c')
  }
  out += oak(58, 72, 34, '#6a5238', '#4f8250', '#68a064') + oak(138, 72, 32, '#6a5238', '#4f8250', '#68a064')

  // Mist between the ranks, looping every 192 px.
  for (const [cls, y, o] of [['mist1', 62, 0.35], ['mist2', 70, 0.28]]) {
    let m = ''

    for (let k = 0; k < 2; k++) {
      const r = rng(11 + y)

      for (let i = 0; i < 8; i++) {
        m += rect(k * W + i * 24, y + Math.floor(r() * 4), 20 + Math.floor(r() * 20), 3 + Math.floor(r() * 3), '#ffffff', ` opacity="${o}"`)
      }
    }
    out += `<g class="${cls}">${m}</g>`
  }

  // Grass, then the path: it winds away toward the horizon and widens toward us.
  out += rect(0, 74, W, 34, '#7aa85a') + rect(0, 74, W, 1, '#9cc874') + rect(0, 88, W, 20, '#6a9a4a') + rect(0, 100, W, 8, '#5e8c42')
  for (let i = 0; i < 160; i++) {
    out += rect(Math.floor(rand() * W), 75 + Math.floor(rand() * 32), 1, 2, rand() < 0.5 ? '#8cba66' : '#5a8840', ' opacity=".8"')
  }
  for (let y = 74; y < H; y++) {
    const t = y - 74
    const cx = 96 + Math.round(16 * Math.sin(t / 8) * (1 - t / 52))
    const half = 3 + Math.round(t * 0.7)

    out += rect(cx - half - 1, y, half * 2 + 2, 1, '#a88a58') + rect(cx - half, y, half * 2, 1, t % 6 < 3 ? '#dcc088' : '#d4b67e')
  }
  for (let i = 0; i < 40; i++) {
    const y = 78 + Math.floor(rand() * 28)
    const t = y - 74
    const cx = 96 + Math.round(16 * Math.sin(t / 8) * (1 - t / 52))
    const half = 3 + Math.round(t * 0.7)

    out += rect(cx - half + 2 + Math.floor(rand() * (half * 2 - 4)), y, 2, 1, rand() < 0.5 ? '#b89a66' : '#ecd4a0')
  }

  // Near trees frame both sides, with ferns and mushrooms at their feet.
  out += rect(0, 0, 14, 100, '#4a3a2a') + rect(0, 0, 4, 100, '#3a2c20') + rect(10, 0, 2, 100, '#5e4a36')
  out += rect(176, 0, 16, 100, '#4a3a2a') + rect(188, 0, 4, 100, '#3a2c20') + rect(178, 0, 2, 100, '#5e4a36')
  for (let i = 0; i < 9; i++) {
    out += disc(4 + i * 4, 6 + (i % 3) * 5, 11, i % 2 ? '#2f5a2f' : '#3a6a38') + disc(190 - i * 4, 4 + (i % 3) * 6, 11, i % 2 ? '#2f5a2f' : '#3a6a38')
  }
  out += disc(16, 24, 7, '#4a7a44') + disc(176, 22, 7, '#4a7a44')
  for (const fx of [14, 20, 170, 178]) {
    out += `<g class="sway">${sprite(fx, 92, ['..g.g..', '.gg.gg.', 'gg.g.gg', '.ggggg.', '..ggg..'], { g: '#3f7a3a' })}</g>`
  }
  out += sprite(26, 98, ['..rrr..', '.rwrwr.', 'rrrrrrr', '..ccc..', '..ccc..'], { r: '#c8483a', w: '#fff4e0', c: '#f0e4cc' }) + sprite(32, 102, ['.rr.', 'rwrr', '.cc.', '.cc.'], { r: '#c8483a', w: '#fff4e0', c: '#f0e4cc' })

  // A signpost beside the path.
  out += rect(130, 84, 2, 18, '#6a4a2c') + rect(120, 86, 16, 5, '#a8784a') + rect(120, 86, 16, 1, '#c89860') + rect(124, 93, 14, 4, '#a8784a') + rect(124, 93, 14, 1, '#c89860') + rect(121, 88, 8, 1, '#6a4a2c') + rect(127, 95, 8, 1, '#6a4a2c')

  // Butterflies follow the path; leaves fall.
  const wingsA = ['y.y', '.b.', 'y.y']
  const wingsB = ['...', 'yby', '...']
  const fly = (y, d, l, c) => `<g class="bf" style="--d:${d}s;--l:${l}s"><g transform="translate(0 ${y})"><g class="bob"><g class="fa">${sprite(0, 0, wingsA, { y: c, b: '#3a2c20' })}</g><g class="fb">${sprite(0, 0, wingsB, { y: c, b: '#3a2c20' })}</g></g></g></g>`

  out += fly(74, 34, 0, '#f4c43a') + fly(86, 46, -20, '#e88aa8') + fly(66, 58, -33, '#8ac8e8')
  for (let i = 0; i < 14; i++) {
    out += `<g class="lf" style="--d:${(9 + rand() * 7).toFixed(1)}s;--l:${(-rand() * 14).toFixed(1)}s;--dx:${Math.floor(rand() * 24 - 8)}px">${rect(Math.floor(20 + rand() * 150), 0, 2, 1, ['#e8a030', '#d86a2a', '#c8c040'][i % 3])}</g>`
  }

  return svg(CSS, out)
}
