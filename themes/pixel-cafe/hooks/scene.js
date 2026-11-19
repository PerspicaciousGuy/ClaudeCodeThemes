// Pixel Cafe: an original pixel-art cafe on a rainy night, 192x108 grid. Rain
// runs down a big window over blurred city lights, pendant lamps glow warm,
// a cup steams on the counter and a cat sleeps on the sill. Dark.
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
.tw{opacity:var(--o,1);animation:tw 4s steps(1,end) infinite}
.rn{animation:rn var(--d,1.2s) linear infinite;animation-delay:var(--l,0s)}
.dr{animation:dr var(--d,9s) steps(12,end) infinite;animation-delay:var(--l,0s)}
.fl{animation:fl 3.4s steps(1,end) infinite}
.st{animation:st 4s steps(8,end) infinite}
.br{animation:br 4s steps(1,end) infinite}
@keyframes tw{0%,100%{opacity:var(--o,1)}50%{opacity:calc(var(--o,1)*.35)}}
@keyframes rn{from{transform:translate(0,-10px)}to{transform:translate(-3px,60px)}}
@keyframes dr{from{transform:translateY(0)}to{transform:translateY(44px)}}
@keyframes fl{0%,100%{opacity:1}50%{opacity:.85}}
@keyframes st{0%{opacity:0;transform:translateY(0)}25%{opacity:.7}100%{opacity:0;transform:translateY(-12px)}}
@keyframes br{0%,100%{transform:translateY(0)}50%{transform:translateY(1px)}}
@media (prefers-reduced-motion:reduce){.tw,.rn,.dr,.fl,.st,.br{animation:none}}
`

export function buildScene() {
  const rand = rng(52)
  let out = rect(0, 0, W, H, '#2a1a12') + rect(0, 0, W, 6, '#1c110c') + rect(0, 70, W, 14, '#34211a')
  const WX = 36
  const WY = 8
  const WW = 120
  const WH = 56

  // The window: a night street with blurred lights, clipped to the glass.
  out += `<defs><clipPath id="glass"><rect x="${WX}" y="${WY}" width="${WW}" height="${WH}"/></clipPath></defs>`
  out += rect(WX - 3, WY - 3, WW + 6, WH + 6, '#160d09')
  out += `<g clip-path="url(#glass)">${bands(['#0a1024', '#101a38', '#16244a', '#1e2f5a', '#263a68', '#2e446e'], 10, WY)}`

  let x = WX - 4

  while (x < WX + WW) {
    const w = 8 + Math.floor(rand() * 12)
    const h = 12 + Math.floor(rand() * 18)

    out += rect(x, WY + WH - h - 6, w, h + 6, '#0c142c') + rect(x, WY + WH - h - 6, w, 1, '#1c2c54')
    for (let k = 0; k < 3; k++) {
      if (rand() < 0.6) {
        out += rect(x + 1 + Math.floor(rand() * (w - 3)), WY + WH - h - 3 + Math.floor(rand() * (h - 4)), 2, 2, rand() < 0.5 ? '#ffb85a' : '#7ad0e8', ' opacity=".6"')
      }
    }
    x += w + 1
  }
  out += rect(WX, WY + WH - 6, WW, 6, '#080e20')

  // Bokeh: soft discs of street light.
  const bokeh = ['#ff9a4a', '#ff7aa8', '#5ad0e0', '#ffd270']

  for (let i = 0; i < 16; i++) {
    const r = 2 + Math.floor(rand() * 3)

    out += `<g class="tw" style="--o:.5;animation-delay:${(-rand() * 4).toFixed(1)}s;animation-duration:${(3 + rand() * 4).toFixed(1)}s">${disc(WX + 4 + Math.floor(rand() * (WW - 8)), WY + 22 + Math.floor(rand() * 32), r, bokeh[i % 4], ' opacity=".5"')}</g>`
  }

  // Rain on the glass, and a few slow drops running down it.
  for (let i = 0; i < 46; i++) {
    out += `<g class="rn" style="--d:${(0.8 + rand() * 0.9).toFixed(2)}s;--l:${(-rand() * 2).toFixed(2)}s">${rect(WX + Math.floor(rand() * (WW - 2)), WY, 1, 3 + Math.floor(rand() * 3), '#a8c0f0', ' opacity=".45"')}</g>`
  }
  for (let i = 0; i < 9; i++) {
    out += `<g class="dr" style="--d:${(8 + rand() * 8).toFixed(1)}s;--l:${(-rand() * 12).toFixed(1)}s">${rect(WX + 4 + Math.floor(rand() * (WW - 8)), WY + 2, 1, 2, '#dce8ff', ' opacity=".6"')}</g>`
  }
  out += '</g>'

  // The frame, with mullions, and the sill.
  out += rect(WX - 3, WY - 3, WW + 6, 3, '#4a2e1c') + rect(WX - 3, WY + WH, WW + 6, 3, '#4a2e1c') + rect(WX - 3, WY - 3, 3, WH + 6, '#4a2e1c') + rect(WX + WW, WY - 3, 3, WH + 6, '#4a2e1c')
  out += rect(WX + 38, WY, 2, WH, '#4a2e1c') + rect(WX + 78, WY, 2, WH, '#4a2e1c') + rect(WX, WY + 26, WW, 2, '#4a2e1c')
  out += rect(WX - 6, WY + WH + 3, WW + 12, 4, '#6a4428') + rect(WX - 6, WY + WH + 3, WW + 12, 1, '#8a5c38')

  // A cat asleep on the sill, and a small plant.
  out += `<g class="br">${sprite(126, 63, ['..bb........', '.bbbbbbbbb..', 'bbbbbbbbbbbb', 'bbbbbbbbbbbb'], { b: '#c8884a' })}${rect(128, 64, 2, 1, '#e8b078')}${rect(139, 66, 3, 1, '#a06a38')}${rect(127, 65, 2, 1, '#3a2418')}</g>`
  out += sprite(46, 61, ['..g.g...', '.ggggg..', '..ggg.g.', '.ggggg..', '..ppp...', '..ppp...'], { g: '#4a8a4a', p: '#a05a38' })

  // Pendant lamps: a cord, a shade and a warm cone.
  for (const lx of [16, 176]) {
    out += rect(lx, 6, 1, 14, '#120a07') + `<g class="fl">${rect(lx - 14, 22, 29, 44, '#ffa04a', ' opacity=".05"')}${rect(lx - 9, 22, 19, 30, '#ffb55e', ' opacity=".07"')}${disc(lx, 24, 7, '#ffc46a', ' opacity=".12"')}</g>`
    out += sprite(lx - 5, 19, ['..oooo..', '.oooooo.', 'oooooooo'], { o: '#c8602a' }) + rect(lx - 2, 22, 5, 2, '#ffe2a0')
  }

  // Side shelves: mugs on the left, books on the right.
  out += rect(2, 40, 30, 2, '#5a3a22') + rect(2, 42, 30, 1, '#2a180e')
  out += sprite(5, 34, ['.dddd.', 'dwwwwd', 'dwwwwd', '.dddd.'], { d: '#3a6a8a', w: '#cfe0e8' }) + sprite(15, 35, ['dddd', 'dddd', 'dddd'], { d: '#c0503e' }) + sprite(23, 34, ['dddd', 'dwwd', 'dwwd', 'dddd'], { d: '#d8a040', w: '#fff0c8' })
  out += rect(160, 40, 30, 2, '#5a3a22') + rect(160, 42, 30, 1, '#2a180e')
  const books = ['#3a6a8a', '#a8483a', '#d8a040', '#4a7a4a', '#7a4a8a', '#c8884a']

  books.forEach((c, i) => {
    out += rect(162 + i * 3, 32 + (i % 3), 3, 8 - (i % 3), c) + rect(162 + i * 3, 32 + (i % 3), 1, 8 - (i % 3), '#00000030')
  })
  out += sprite(182, 34, ['..gg..', '.gggg.', '..gg..', '.pppp.', '.pppp.'], { g: '#4a8a4a', p: '#a05a38' })

  // The counter: wood in planks, with a cup, a plate and a pot.
  out += rect(0, 84, W, 24, '#4a2e1c') + rect(0, 84, W, 2, '#8a5c38') + rect(0, 86, W, 1, '#2a180e')
  for (let i = 0; i < 6; i++) {
    out += rect(0, 92 + i * 3, W, 1, '#3a2316', ' opacity=".7"')
  }
  for (let i = 0; i < 40; i++) {
    out += rect(Math.floor(rand() * (W - 6)), 88 + Math.floor(rand() * 18), 2 + Math.floor(rand() * 4), 1, '#5a3a24', ' opacity=".7"')
  }
  out += sprite(24, 74, ['.dddddd.', 'dwwwwwwd.d', 'dwwwwwwd.d', 'dwwwwwwdd.', '.dddddd..'], { d: '#e8dcc8', w: '#5a3418' }) + rect(20, 84, 20, 2, '#e8dcc8') + rect(21, 86, 18, 1, '#b8a888')
  for (let i = 0; i < 3; i++) {
    out += `<g class="st" style="animation-delay:${(-i * 1.3).toFixed(1)}s">${rect(27 + i * 3, 68, 1, 3, '#f0e4d4')}${rect(28 + i * 3, 65, 1, 2, '#f0e4d4')}</g>`
  }
  out += sprite(48, 80, ['.cccc.', 'cccccc', '.cccc.'], { c: '#d89a4a' }) + rect(44, 83, 14, 2, '#e8dcc8') + rect(45, 85, 12, 1, '#b8a888')
  out += sprite(156, 70, ['...gg.g..', '..ggggg..', '.ggg.ggg.', '..ggggg..', '...ppp...', '..ppppp..', '..ppppp..'], { g: '#4a8a4a', p: '#a05a38' }) + rect(154, 83, 14, 1, '#8a4a28')
  out += rect(172, 76, 14, 3, '#a8483a') + rect(173, 79, 12, 3, '#3a6a8a') + rect(172, 82, 14, 2, '#d8a040')

  return svg(CSS, out)
}
