// Haunted Manor: an original pixel-art haunted house under a huge moon,
// 192x108 grid. Windows flicker, bats cross the sky, ground fog drifts, and a
// bare tree leans over an iron fence and a few tombstones. Dark.
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
.tw{opacity:var(--o,1);animation:tw 4.5s steps(1,end) infinite}
.glow{animation:glow 6s steps(1,end) infinite}
.w1{animation:w1 3.1s steps(1,end) infinite}
.w2{animation:w1 4.3s steps(1,end) infinite -1.4s}
.w3{animation:w1 2.3s steps(1,end) infinite -0.7s}
.fa{animation:fa .5s steps(1,end) infinite}
.fb{animation:fb .5s steps(1,end) infinite}
.bat{animation:bat var(--d,26s) linear infinite;animation-delay:var(--l,0s)}
.bob{animation:bob 1.6s steps(1,end) infinite}
.cl{animation:cl 150s linear infinite}
.fg1{animation:fg 70s linear infinite}
.fg2{animation:fg 110s linear infinite reverse}
@keyframes tw{0%,100%{opacity:var(--o,1)}50%{opacity:calc(var(--o,1)*.3)}}
@keyframes glow{0%,100%{opacity:1}50%{opacity:.75}}
@keyframes w1{0%,100%{opacity:1}20%{opacity:.35}25%{opacity:1}70%{opacity:.8}75%{opacity:.4}80%{opacity:1}}
@keyframes fa{0%,100%{opacity:1}50%{opacity:0}}
@keyframes fb{0%,100%{opacity:0}50%{opacity:1}}
@keyframes bat{from{transform:translateX(-14px)}to{transform:translateX(212px)}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(3px)}}
@keyframes cl{from{transform:translateX(-60px)}to{transform:translateX(250px)}}
@keyframes fg{from{transform:translateX(0)}to{transform:translateX(-192px)}}
@media (prefers-reduced-motion:reduce){.tw,.glow,.w1,.w2,.w3,.fa,.fb,.bat,.bob,.cl,.fg1,.fg2{animation:none}.fb{opacity:0}}
`

// A pointed roof: rows that widen toward the eaves.
function roof(cx, top, h, half, fill, edge) {
  let out = ''

  for (let i = 0; i < h; i++) {
    const w = Math.round(1 + (i * half * 2) / h)

    out += rect(cx - Math.floor(w / 2), top + i, w, 1, fill)
  }

  return out + rect(cx - half - 1, top + h, half * 2 + 3, 1, edge)
}

// A bare branch, forking as it grows.
function branch(rand, x, y, ang, len, depth, out) {
  for (let i = 0; i < len; i++) {
    x += Math.cos(ang)
    y += Math.sin(ang)
    out.push(rect(Math.round(x), Math.round(y), depth > 2 ? 2 : 1, 1, '#07040c'))
  }
  if (depth > 0) {
    branch(rand, x, y, ang - 0.5 - rand() * 0.3, len * 0.7, depth - 1, out)
    branch(rand, x, y, ang + 0.5 + rand() * 0.3, len * 0.7, depth - 1, out)
  }
}

export function buildScene() {
  const rand = rng(66)
  let out = bands(['#07040f', '#0c0818', '#150d2a', '#201440', '#2e1c52', '#3c2662'], 9) + rect(0, 54, W, 30, '#46306e')

  for (let i = 0; i < 70; i++) {
    out += rand() < 0.3 ? rect(Math.floor(rand() * W), Math.floor(rand() * rand() * 48), 1, 1, '#e8dcff', ` class="tw" style="--o:.8;animation-delay:${(-rand() * 4.5).toFixed(1)}s"`) : rect(Math.floor(rand() * W), Math.floor(rand() * rand() * 48), 1, 1, '#c8b8ee', ' opacity=".6"')
  }

  // The moon, huge and pale, with a halo.
  out += `<g class="glow">${disc(142, 26, 22, '#b8a8ff', ' opacity=".07"')}${disc(142, 26, 18, '#d8ccff', ' opacity=".10"')}</g>` + disc(142, 26, 14, '#f4efd8') + disc(142, 26, 14, '#ffffff', ' opacity=".08"')
  out += rect(136, 20, 4, 3, '#dcd4b8') + rect(145, 28, 5, 4, '#dcd4b8') + rect(139, 31, 3, 3, '#e6dfc4') + rect(148, 20, 2, 2, '#e6dfc4')

  // Clouds slide across.
  out += `<g class="cl"><g transform="translate(0 20)">${sprite(0, 0, ['....cccc......', '..cccccccc....', 'ccccccccccccc.', '.ccccccccccc..'], { c: '#1e1438' })}</g></g>`
  out += `<g class="cl" style="animation-delay:-80s"><g transform="translate(0 40)">${sprite(0, 0, ['..ccccc.....', '.ccccccccc..', 'ccccccccccc.'], { c: '#281a48' })}</g></g>`

  // Bats cross the moon.
  const bat = (a, b) => `<g class="fa">${sprite(0, 0, a, { b: '#05030a' })}</g><g class="fb">${sprite(0, 0, b, { b: '#05030a' })}</g>`
  const up = ['b..b.b..b', 'bb.bbb.bb', '.bbbbbbb.', '..b...b..']
  const down = ['..b...b..', '.bbbbbbb.', 'bb.bbb.bb', 'b..b.b..b']

  ;[[22, 24, 0], [44, 34, -9], [16, 46, -17]].forEach(([y, d, l], i) => {
    out += `<g class="bat" style="--d:${d}s;--l:${l}s"><g transform="translate(0 ${y + i * 3})"><g class="bob">${bat(up, down)}</g></g></g>`
  })

  // The hill.
  for (let x = 0; x < W; x++) {
    const y = Math.round(66 + 4 * Math.sin(x / 22 + 1) + 2 * Math.sin(x / 8))

    out += rect(x, y, 1, 108 - y, '#0b0716')
  }
  out += rect(0, 78, W, 30, '#09050f')

  // The manor: a tall central tower, a left tower, wings and chimneys.
  const M = '#0d0818'

  out += rect(20, 52, 70, 26, M) + rect(44, 34, 20, 44, M) + rect(18, 42, 14, 36, M) + rect(76, 44, 16, 34, M)
  out += roof(54, 18, 16, 12, M, '#150d26') + roof(25, 28, 14, 9, M, '#150d26') + roof(84, 32, 12, 9, M, '#150d26')
  out += rect(52, 12, 1, 6, M) + rect(50, 14, 5, 1, M)
  out += rect(34, 44, 3, 8, M) + rect(68, 46, 3, 6, M)
  out += rect(20, 51, 70, 1, '#191030') + rect(44, 33, 20, 1, '#191030')

  // Windows: some warm, some ghostly green, all flickering.
  const win = (x, y, c, cls, tall = 4) => `<g class="${cls}">${rect(x - 1, y - 1, 5, tall + 2, c, ' opacity=".15"')}${rect(x, y, 3, tall, c)}${rect(x + 1, y, 1, tall, '#0d0818')}</g>`

  out += win(50, 38, '#ffcf5a', 'w1', 5) + win(57, 38, '#7aff9a', 'w2', 5) + win(53, 48, '#ffcf5a', 'w3')
  out += win(22, 46, '#7aff9a', 'w3', 5) + win(27, 46, '#ffcf5a', 'w1', 5) + win(22, 58, '#ffcf5a', 'w2') + win(28, 62, '#7aff9a', 'w1')
  out += win(38, 58, '#ffcf5a', 'w1') + win(66, 58, '#7aff9a', 'w2') + win(74, 60, '#ffcf5a', 'w3') + win(80, 50, '#ffcf5a', 'w2', 5) + win(86, 52, '#7aff9a', 'w1')
  out += rect(50, 66, 8, 12, '#0a0612') + `<g class="w2">${rect(51, 67, 6, 11, '#ffcf5a', ' opacity=".8"')}${rect(54, 67, 1, 11, '#0a0612')}</g>`

  // A bare tree at the right, and its crooked branches.
  out += rect(168, 60, 3, 24, '#07040c') + rect(167, 76, 5, 8, '#07040c')
  const bits = []

  branch(rand, 169, 62, -1.9, 12, 3, bits)
  branch(rand, 170, 64, -1.1, 12, 3, bits)
  branch(rand, 169, 70, -2.6, 8, 2, bits)
  out += bits.join('')

  // Ground fog, drifting in two layers (each repeats every 192 px, so it loops without a seam).
  for (const [cls, y, o, c] of [['fg1', 80, 0.16, '#b8a8e0'], ['fg2', 90, 0.12, '#9a88cc']]) {
    let fog = ''

    for (let k = 0; k < 2; k++) {
      const r = rng(7 + y)

      for (let i = 0; i < 9; i++) {
        fog += rect(k * W + Math.floor(i * 21.3), y + Math.floor(r() * 6), 22 + Math.floor(r() * 24), 3 + Math.floor(r() * 3), c, ` opacity="${o}"`)
      }
    }
    out += `<g class="${cls}">${fog}</g>`
  }

  // The iron fence, tombstones and the dark ground in front.
  out += rect(0, 96, W, 12, '#06030b')
  for (let x = 0; x < W; x += 5) {
    out += rect(x, 86, 1, 14, '#05030a') + rect(x, 84, 1, 2, '#05030a') + rect(x - 1, 86, 3, 1, '#05030a')
  }
  out += rect(0, 90, W, 1, '#05030a') + rect(0, 97, W, 1, '#05030a')
  out += sprite(122, 82, ['..tt..', '.tttt.', 'tttttt', 'tttttt', 'tttttt'], { t: '#43386a' }) + sprite(138, 84, ['.tt.', 'tttt', 'tttt', 'tttt'], { t: '#392f5c' }) + sprite(152, 83, ['..t..', 'ttttt', '..t..', '..t..', '..t..'], { t: '#43386a' })

  return svg(CSS, out)
}
