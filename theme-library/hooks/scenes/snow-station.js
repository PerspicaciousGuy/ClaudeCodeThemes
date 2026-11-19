// Snow Station: an original pixel-art train station in a snowfall at night,
// 192x108 grid. Snow drifts down past warm lamps, a slow night train crosses
// the far track, a clock glows on the station gable and a bench waits under
// the canopy. Dark.
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
.tw{opacity:var(--o,1);animation:tw 5s steps(1,end) infinite}
.fl{animation:fl 3s steps(1,end) infinite}
.fl2{animation:fl 3.7s steps(1,end) infinite -1.2s}
.snow{animation:fall var(--d,10s) linear infinite;animation-delay:var(--l,0s)}
.train{animation:train 110s linear infinite}
.puff{animation:puff 3.2s steps(8,end) infinite}
@keyframes tw{0%,100%{opacity:var(--o,1)}50%{opacity:calc(var(--o,1)*.3)}}
@keyframes fl{0%,100%{opacity:1}40%{opacity:.82}70%{opacity:.94}}
@keyframes fall{from{transform:translate(0,-6px)}to{transform:translate(var(--dx,6px),114px)}}
@keyframes train{from{transform:translateX(-120px)}to{transform:translateX(200px)}}
@keyframes puff{0%{opacity:0;transform:translate(0,0)}25%{opacity:.6}100%{opacity:0;transform:translate(4px,-12px)}}
@media (prefers-reduced-motion:reduce){.tw,.fl,.fl2,.snow,.train,.puff{animation:none}.snow{opacity:.6}}
`

function hills(base, amp, seed, fill, edge, bottom) {
  let out = ''

  for (let x = 0; x < W; x++) {
    const y = Math.round(base + amp * Math.sin(x / 17 + seed) + (amp / 2) * Math.sin(x / 6.3 + seed * 2))

    out += rect(x, y, 1, bottom - y, fill) + rect(x, y, 1, 1, edge)
  }

  return out
}

export function buildScene() {
  const rand = rng(44)
  let out = bands(['#060b18', '#0a1426', '#102038', '#182c4a', '#223a5a', '#2e4a68'], 9) + rect(0, 54, W, 30, '#344e6e')

  for (let i = 0; i < 36; i++) {
    out += rect(Math.floor(rand() * W), Math.floor(rand() * rand() * 40), 1, 1, '#b8c8e8', ` class="tw" style="--o:.6;animation-delay:${(-rand() * 5).toFixed(1)}s"`)
  }

  // Far hills with firs, then nearer ones.
  out += hills(46, 5, 1, '#1b2e4a', '#3c5578', 82)
  for (let i = 0; i < 9; i++) {
    out += fir(6 + i * 22 + Math.floor(rand() * 8), 36 + Math.floor(rand() * 6), 12 + Math.floor(rand() * 4), '#0e1a2e', '#16294a')
  }
  out += hills(58, 4, 3, '#142238', '#34496c', 84)

  // A night train on the far track.
  let train = ''
  const car = (x, lit) => rect(x, 0, 24, 9, '#2a3a5a') + rect(x, 0, 24, 1, '#7088b0') + rect(x, 8, 24, 1, '#1a2640') + [3, 9, 15].map(k => rect(x + k, 2, 4, 3, lit ? '#ffcf7a' : '#3a4a6a')).join('') + rect(x + 2, 9, 3, 2, '#101a2c') + rect(x + 19, 9, 3, 2, '#101a2c')

  train += rect(0, 2, 18, 7, '#1c2640') + rect(2, -3, 8, 5, '#1c2640') + rect(2, -4, 8, 1, '#7088b0') + rect(14, -6, 3, 8, '#141c30') + rect(14, -7, 3, 1, '#7088b0') + rect(0, 8, 18, 1, '#101a2c')
  train += rect(-2, 4, 2, 3, '#ffe9a0') + rect(-4, 3, 3, 5, '#ffe9a0', ' opacity=".25"') + rect(3, 9, 3, 2, '#0a1220') + rect(11, 9, 3, 2, '#0a1220')
  train += car(19, true) + car(44, true) + car(69, false) + car(94, true)
  out += `<g class="train"><g transform="translate(0 71)">${train}<g class="puff">${rect(14, -10, 3, 2, '#c8d4e8')}</g><g class="puff" style="animation-delay:-1.6s">${rect(13, -10, 4, 2, '#c8d4e8')}</g></g></g>`

  // The ground: snow in bands, the platform edge, the tracks.
  out += rect(0, 82, W, 26, '#3a4e72') + rect(0, 82, W, 1, '#7088b0') + rect(0, 96, W, 12, '#2e4062')
  out += rect(0, 86, W, 8, '#26344f') + rect(0, 86, W, 2, '#8aa0c8') + rect(0, 88, W, 1, '#5a7098')
  for (let x = 0; x < W; x += 8) {
    out += rect(x, 98, 5, 3, '#1c2840') + rect(x, 98, 5, 1, '#46608a')
  }
  out += rect(0, 97, W, 1, '#7c8cb0') + rect(0, 102, W, 1, '#7c8cb0')

  // The station: a gabled hall at the right, with a clock and warm windows.
  out += rect(120, 44, 72, 42, '#243050') + rect(120, 44, 72, 1, '#3a4a70')
  out += rect(116, 40, 80, 5, '#1a2440') + rect(114, 38, 84, 3, '#d8e2f8') + rect(118, 36, 76, 2, '#e8f0ff') + rect(130, 34, 52, 2, '#f4f8ff')
  out += disc(156, 52, 6, '#1a2440') + disc(156, 52, 5, '#e8e0c8') + rect(156, 48, 1, 5, '#2a2218') + rect(156, 52, 3, 1, '#2a2218')
  for (const wx of [126, 138, 174]) {
    out += `<g class="fl">${rect(wx - 3, 60, 16, 22, '#ffb347', ' opacity=".1"')}</g>`
    out += rect(wx, 64, 10, 14, '#ffcf7a') + rect(wx + 4, 64, 2, 14, '#7a4a22') + rect(wx, 70, 10, 1, '#7a4a22') + rect(wx, 63, 10, 1, '#d8e2f8')
  }
  out += rect(154, 66, 12, 20, '#16203a') + rect(156, 68, 8, 18, '#ffcf7a') + rect(159, 68, 2, 18, '#7a4a22') + rect(152, 64, 16, 2, '#d8e2f8')
  out += rect(122, 56, 20, 4, '#16203a') + rect(124, 57, 16, 2, '#c8b890', ' opacity=".5"')

  // The canopy over the platform, with hanging lamps and their light.
  out += rect(10, 58, 112, 4, '#1a2440') + rect(8, 54, 116, 4, '#e0e8f8') + rect(12, 52, 108, 2, '#f4f8ff') + rect(10, 62, 112, 1, '#0e1628')
  for (const px of [16, 52, 88, 116]) {
    out += rect(px, 62, 3, 24, '#16203a') + rect(px, 62, 1, 24, '#2a3a60')
  }
  for (const lx of [34, 70, 100]) {
    out += `<g class="${lx === 70 ? 'fl2' : 'fl'}">${rect(lx - 12, 66, 26, 20, '#ffb347', ' opacity=".07"')}${rect(lx - 7, 66, 16, 18, '#ffc86a', ' opacity=".09"')}${rect(lx - 3, 64, 8, 4, '#ffd88a', ' opacity=".3"')}</g>`
    out += rect(lx, 62, 1, 3, '#16203a') + rect(lx - 2, 64, 5, 3, '#ffe2a0') + rect(lx - 2, 63, 5, 1, '#16203a')
  }

  // A bench, a suitcase and a lamp post.
  out += rect(36, 78, 18, 2, '#5a3a22') + rect(36, 80, 18, 1, '#3a2414') + rect(37, 81, 2, 5, '#2a1a10') + rect(51, 81, 2, 5, '#2a1a10') + rect(36, 74, 18, 3, '#6a4a2c')
  out += rect(36, 73, 18, 1, '#e0e8f8') + rect(36, 77, 18, 1, '#e0e8f8', ' opacity=".5"')
  out += rect(60, 81, 8, 5, '#6a2a2a') + rect(61, 80, 6, 1, '#3a1a1a') + rect(62, 82, 4, 1, '#c8a050')
  out += rect(9, 58, 2, 28, '#16203a') + rect(8, 56, 4, 3, '#16203a') + `<g class="fl2">${disc(10, 58, 9, '#ffc86a', ' opacity=".08"')}${disc(10, 58, 5, '#ffd88a', ' opacity=".14"')}</g>` + rect(9, 57, 2, 2, '#fff0c0')

  // Snow, in front of everything.
  for (let i = 0; i < 90; i++) {
    const big = i % 7 === 0
    const d = (7 + rand() * 9).toFixed(1)

    out += rect(Math.floor(rand() * (W - 2)), 0, big ? 2 : 1, big ? 2 : 1, big ? '#ffffff' : '#dce6fa', ` class="snow" style="--d:${d}s;--l:${(-rand() * 14).toFixed(1)}s;--dx:${Math.floor(rand() * 14 - 4)}px"`)
  }

  return svg(CSS, out)
}
