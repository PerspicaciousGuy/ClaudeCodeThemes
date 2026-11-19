// Night Market: an original pixel-art night market, 192x108 grid. Strings of
// paper lanterns swing over a lane, two food stalls glow with steam rising,
// puddles carry the light, and a cat sits on a crate. Dark.
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
.fl{animation:fl 2.6s steps(1,end) infinite}
.fl2{animation:fl 3.1s steps(1,end) infinite -1s}
.s1{animation:sw 3.4s steps(1,end) infinite}
.s2{animation:sw 3.4s steps(1,end) infinite -1.7s}
.st{animation:st 4.5s steps(9,end) infinite}
.rf{animation:rf 3s steps(1,end) infinite}
.tail{animation:tail 3.6s steps(1,end) infinite}
.blink{animation:blink 6s steps(1,end) infinite}
@keyframes tw{0%,100%{opacity:var(--o,1)}50%{opacity:calc(var(--o,1)*.3)}}
@keyframes fl{0%,100%{opacity:1}30%{opacity:.78}60%{opacity:.92}}
@keyframes sw{0%,100%{transform:translateX(0)}50%{transform:translateX(1px)}}
@keyframes st{0%{opacity:0;transform:translateY(0)}20%{opacity:.7}100%{opacity:0;transform:translateY(-14px)}}
@keyframes rf{0%,100%{transform:translateX(0)}50%{transform:translateX(1px)}}
@keyframes tail{0%,100%{transform:translateX(0)}50%{transform:translateX(1px)}}
@keyframes blink{0%,94%,100%{opacity:1}95%,99%{opacity:0}}
@media (prefers-reduced-motion:reduce){.tw,.fl,.fl2,.s1,.s2,.st,.rf,.tail,.blink{animation:none}}
`

function awning(x, y, w, c1, c2) {
  let out = rect(x + 3, y - 3, w - 6, 3, c1) + rect(x + 1, y - 1, w - 2, 1, c1)

  for (let i = 0; i < w; i += 4) {
    const c = (i / 4) % 2 ? c1 : c2

    out += rect(x + i, y, 4, 5, c) + rect(x + i + 1, y + 5, 2, 1, c)
  }

  return out + rect(x, y + 4, w, 1, '#00000030')
}

export function buildScene() {
  const rand = rng(31)
  let out = bands(['#080510', '#0d0818', '#140b22', '#1d1030', '#2a1738', '#3a2040'], 9)

  for (let i = 0; i < 40; i++) {
    out += rect(Math.floor(rand() * W), Math.floor(rand() * rand() * 36), 1, 1, '#d8cce8', ` class="tw" style="--o:.7;animation-delay:${(-rand() * 4).toFixed(1)}s"`)
  }

  // Far rooftops with a few lit windows.
  let x = 0

  while (x < W) {
    const w = 10 + Math.floor(rand() * 14)
    const h = 14 + Math.floor(rand() * 18)

    out += rect(x, 66 - h, w, h + 14, '#170d22') + rect(x, 66 - h, w, 1, '#24143a')
    for (let k = 0; k < 3; k++) {
      if (rand() < 0.55) {
        out += rect(x + 2 + Math.floor(rand() * (w - 4)), 66 - h + 3 + Math.floor(rand() * (h - 6)), 2, 2, rand() < 0.5 ? '#ffb85a' : '#ff8a5a', ' opacity=".7"')
      }
    }
    x += w + 1
  }

  // The lane: dark cobbles, banded toward us.
  out += rect(0, 78, W, 30, '#21131f') + rect(0, 90, W, 18, '#1b0f1a') + rect(0, 100, W, 8, '#160b15')
  for (let i = 0; i < 120; i++) {
    out += rect(Math.floor(rand() * (W - 3)), 79 + Math.floor(rand() * 28), 2 + Math.floor(rand() * 2), 1, '#2d1a2a', ' opacity=".8"')
  }

  // A distant stall in the middle, small and dim.
  out += rect(86, 64, 22, 14, '#1a0e20') + awning(85, 62, 24, '#6a2a3a', '#3a2038')
  out += `<g class="fl2">${rect(90, 69, 14, 6, '#ffb347', ' opacity=".25"')}${rect(95, 70, 4, 3, '#ffd88a')}</g>`

  // Left stall.
  out += rect(6, 60, 2, 20, '#2a1620') + rect(52, 60, 2, 20, '#2a1620')
  out += `<g class="fl">${rect(2, 56, 60, 34, '#ff8a3c', ' opacity=".08"')}${rect(10, 64, 44, 14, '#ffb347', ' opacity=".12"')}</g>`
  out += awning(4, 54, 52, '#b3342e', '#f0dcc0')
  out += rect(4, 76, 52, 3, '#5a3622') + rect(4, 79, 52, 12, '#2c1822') + rect(4, 79, 52, 1, '#3c2230')
  out += sprite(12, 70, ['.dddd.', 'dwwwwd', 'dwwwwd', '.dddd.'], { d: '#7a4a2a', w: '#e8c070' }) + sprite(24, 71, ['.rrrr.', 'rrrrrr', '.rrrr.'], { r: '#c0503e' })
  out += sprite(36, 69, ['.gg.', 'gggg', 'gggg', 'gggg', '.gg.'], { g: '#5a9a6a' }) + sprite(44, 72, ['yyyy', 'yyyy', '.yy.'], { y: '#e8b040' })
  out += rect(10, 64, 1, 6, '#3a2418') + rect(11, 64, 3, 5, '#f0dcc0', ' opacity=".8"')
  for (let i = 0; i < 3; i++) {
    out += `<g class="st" style="animation-delay:${(-i * 1.5).toFixed(1)}s">${rect(14 + i * 12, 66, 1, 3, '#e8d8e8')}${rect(15 + i * 12, 63, 1, 2, '#e8d8e8')}</g>`
  }

  // Right stall.
  out += rect(138, 56, 2, 24, '#2a1620') + rect(184, 56, 2, 24, '#2a1620')
  out += `<g class="fl2">${rect(134, 50, 58, 42, '#ffa04a', ' opacity=".08"')}${rect(142, 62, 42, 16, '#ffc46a', ' opacity=".12"')}</g>`
  out += awning(136, 50, 52, '#1f7a78', '#f0dcc0')
  out += rect(136, 76, 52, 3, '#5a3622') + rect(136, 79, 52, 12, '#2c1822') + rect(136, 79, 52, 1, '#3c2230')
  for (let i = 0; i < 5; i++) {
    out += rect(144 + i * 8, 62, 1, 6 + (i % 2) * 3, '#4a2a2a') + sprite(142 + i * 8, 68 + (i % 2) * 3, ['.rr.', 'rrrr', 'rrrr', '.rr.'], { r: i % 2 ? '#e0a040' : '#c0503e' })
  }
  out += sprite(146, 70, ['.dddddd.', 'dwwwwwwd', '.dddddd.'], { d: '#7a4a2a', w: '#f0dcc0' }) + sprite(170, 69, ['.dddd.', 'dwwwwd', 'dwwwwd', '.dddd.'], { d: '#7a4a2a', w: '#e8c070' })
  for (let i = 0; i < 3; i++) {
    out += `<g class="st" style="animation-delay:${(-i * 1.5 - 0.5).toFixed(1)}s">${rect(149 + i * 12, 66, 1, 3, '#e8d8e8')}${rect(150 + i * 12, 63, 1, 2, '#e8d8e8')}</g>`
  }

  // Two strings of lanterns across the top.
  const colors = ['#e0402e', '#ff8a2a', '#f4c43a', '#e0402e', '#ff8a2a']
  const strings = [[5, 7, 14], [9, 3, 11]]

  strings.forEach(([y0, sag, step], s) => {
    let halos = ''
    let wire = ''
    let bodies = ''

    for (let px = 0; px < W; px += 2) {
      const t = (px - 96) / 96

      wire += rect(px, Math.round(y0 + sag * (1 - t * t)), 2, 1, '#2a1a2a')
    }
    for (let px = 4 + s * 6; px < W; px += step) {
      const t = (px - 96) / 96
      const y = Math.round(y0 + sag * (1 - t * t)) + 1
      const c = colors[Math.floor(px / step) % colors.length]

      halos += disc(px + 1, y + 3, 5, c, ' opacity=".13"')
      bodies += rect(px, y, 3, 1, '#3a2418') + rect(px, y + 1, 3, 3, c) + rect(px + 1, y + 1, 1, 2, '#ffe9a0') + rect(px, y + 4, 3, 1, '#3a2418')
    }
    out += wire + `<g class="${s ? 'fl2' : 'fl'}">${halos}</g><g class="${s ? 's2' : 's1'}">${bodies}</g>`
  })

  // Puddles under the stalls carry the light.
  out += rect(10, 94, 40, 3, '#ff9a4a', ' opacity=".12"') + rect(142, 96, 40, 3, '#ffb85a', ' opacity=".12"') + rect(70, 98, 24, 2, '#6a8ac8', ' opacity=".12"')
  out += `<g class="rf">${rect(16, 96, 14, 1, '#ffd08a', ' opacity=".3"')}${rect(150, 98, 18, 1, '#ffd08a', ' opacity=".3"')}</g>`

  // A cat on a crate between the stalls.
  out += rect(64, 84, 14, 10, '#4a3022') + rect(64, 84, 14, 1, '#6a4a32') + rect(64, 88, 14, 1, '#3a2418') + rect(66, 90, 10, 1, '#3a2418')
  out += sprite(68, 76, ['.b..b.', '.bbbbb', 'bbbbbbb', 'bbbbbb.', 'bbbbbb.', 'bbbbbb.'], { b: '#1c1420' })
  out += `<g class="blink">${rect(70, 79, 1, 1, '#f4d84a')}${rect(73, 79, 1, 1, '#f4d84a')}</g>`
  out += `<g class="tail">${rect(75, 82, 2, 5, '#1c1420')}${rect(77, 85, 1, 2, '#1c1420')}</g>`

  return svg(CSS, out)
}
