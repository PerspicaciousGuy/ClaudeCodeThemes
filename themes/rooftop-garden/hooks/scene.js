// Rooftop Garden: an original pixel-art rooftop at golden hour, 192x108 grid.
// A pastel skyline behind a parapet, planters of tomatoes and sunflowers
// swaying in the breeze, string lights, birds on a wire and a drifting kite.
// Pure SVG + CSS animation: no script, nothing loaded.

const W = 192
const H = 108
const DECK = 88

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

// A planter box with a bush of leaves and a few fruits or flowers above it.
function planter(x, w, fruit, rand, tall) {
  let out = rect(x, DECK - 8, w, 8, '#b5643c') + rect(x, DECK - 8, w, 1, '#d98a5a') + rect(x, DECK - 1, w, 1, '#8a4a2a')
  let bush = ''

  for (let i = 0; i < w * 2; i++) {
    const bx = x + 1 + Math.floor(rand() * (w - 2))
    const by = DECK - 9 - Math.floor(rand() * (tall ? 20 : 11))

    bush += rect(bx, by, 2, 2, rand() < 0.5 ? '#3f9a4a' : '#2f7a3c')
  }
  for (let i = 0; i < Math.ceil(w / 5); i++) {
    const bx = x + 2 + Math.floor(rand() * (w - 4))
    const by = DECK - 11 - Math.floor(rand() * (tall ? 20 : 9))

    bush += fruit === 'sun' ? rect(bx - 1, by - 1, 3, 3, '#ffd23d') + rect(bx, by, 1, 1, '#7a4a18') : rect(bx, by, 2, 2, '#e0452f')
  }

  return out + `<g class="sw" style="animation-delay:${(-rand() * 4).toFixed(1)}s">${bush}</g>`
}

const CSS = `
.sw{animation:sw 4s steps(1,end) infinite}
.bulb{animation:bulb 3s steps(1,end) infinite}
.kite{animation:kite 60s linear infinite}
.tail{animation:tail 1.2s steps(1,end) infinite}
.bird{animation:bird 2.6s steps(1,end) infinite}
.sun{animation:sun 5s steps(1,end) infinite}
.sm{animation:sm 8s steps(1,end) infinite}
@keyframes sw{0%,100%{transform:translateX(0)}50%{transform:translateX(1px)}}
@keyframes bulb{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes kite{from{transform:translate(-14px,6px)}50%{transform:translate(100px,-4px)}to{transform:translate(206px,6px)}}
@keyframes tail{0%,100%{transform:translateX(0)}50%{transform:translateX(1px)}}
@keyframes bird{0%,90%,100%{transform:translateY(0)}93%{transform:translateY(-1px)}}
@keyframes sun{0%,100%{opacity:.35}50%{opacity:.55}}
@keyframes sm{0%{transform:translate(0,0);opacity:0}20%{opacity:.7}100%{transform:translate(4px,-14px);opacity:0}}
@media (prefers-reduced-motion:reduce){.sw,.bulb,.kite,.tail,.bird,.sun,.sm{animation:none}}
`

export function buildScene() {
  const rand = rng(41)
  let out = ''

  // Golden-hour sky.
  ;['#9ab4e0', '#b2bce2', '#cac4e0', '#e2cadc', '#f4d0cc', '#fbd8c0', '#ffe2b8', '#ffeab8'].forEach((c, i) => {
    out += rect(0, i * 8, W, 8, c)
  })
  out += `<g class="sun">${disc(96, 52, 30, '#fff2c8', ' opacity=".35"')}</g>` + disc(96, 52, 11, '#ffd97a') + disc(96, 52, 8, '#fff0b0')

  // Far skyline, then the near one with lit windows, a water tank and antennas.
  for (let x = 0; x < W; ) {
    const w = 8 + Math.floor(rand() * 10)
    const h = 14 + Math.floor(rand() * 22)

    out += rect(x, DECK - 6 - h, w, h + 6, '#c4a8cc')
    x += w
  }
  for (let x = -2; x < W; ) {
    const w = 12 + Math.floor(rand() * 10)
    const h = 12 + Math.floor(rand() * 26)
    const top = DECK - 6 - h

    out += rect(x, top, w, h + 6, '#a58cb8') + rect(x, top, 1, h + 6, '#b8a0c8')
    for (let wy = top + 3; wy < DECK - 7; wy += 4) {
      for (let wx = x + 2; wx < x + w - 2; wx += 3) {
        if (rand() < 0.3) {
          out += rect(wx, wy, 2, 2, rand() < 0.7 ? '#ffe9a0' : '#fff6d0', ' opacity=".9"')
        }
      }
    }
    if (rand() < 0.3) {
      out += rect(x + 3, top - 5, 1, 5, '#8a7098') + rect(x + 1, top - 4, 5, 1, '#8a7098')
    } else if (rand() < 0.2) {
      out += sprite(x + 2, top - 7, ['.rrrr.', 'rrrrrr', 'rrrrrr', '.l..l.', '.l..l.'], { r: '#8a6a78', l: '#6a5468' })
    }
    x += w + (rand() < 0.35 ? 2 + Math.floor(rand() * 5) : 0)
  }

  // A kite drifting over the city.
  out += `<g class="kite"><g transform="translate(0 20)">${sprite(0, 0, ['..r..', '.rrr.', 'rrwrr', '.rrr.', '..r..'], { r: '#e0527a', w: '#fff' })}<g class="tail">${rect(2, 5, 1, 1, '#e0527a')}${rect(3, 6, 1, 1, '#ffd23d')}${rect(2, 7, 1, 1, '#e0527a')}${rect(3, 8, 1, 1, '#ffd23d')}</g></g></g>`

  // The parapet and the deck.
  out += rect(0, DECK - 6, W, 6, '#d9b59a') + rect(0, DECK - 6, W, 1, '#f0d4bc') + rect(0, DECK, W, H - DECK, '#b8845a')
  for (let x = 0; x < W; x += 12) {
    out += rect(x, DECK + 1, 1, H - DECK - 1, '#9a6a44')
  }
  for (let y = DECK + 8; y < H; y += 8) {
    out += rect(0, y, W, 1, '#9a6a44', ' opacity=".6"')
  }

  // Planters at both sides, taller toward the edges.
  out += planter(4, 26, 'sun', rand, true) + planter(34, 18, 'tom', rand, false) + planter(56, 12, 'tom', rand, false)
  out += planter(162, 26, 'sun', rand, true) + planter(140, 18, 'tom', rand, false) + planter(124, 12, 'tom', rand, false)

  // Birds on a wire, string lights hung from the corners.
  out += rect(0, 20, 60, 1, '#6a5468', ' opacity=".6"') + rect(132, 20, 60, 1, '#6a5468', ' opacity=".6"')
  for (const bx of [8, 22, 150, 166]) {
    out += `<g class="bird" style="animation-delay:${(-rand() * 2.6).toFixed(1)}s">${sprite(bx, 16, ['.bb.', 'bbbb', '.bb.'], { b: '#4a3a52' })}${rect(bx + 3, 17, 1, 1, '#ffb44a')}</g>`
  }
  for (const [x0, x1, y0] of [[0, 62, 4], [130, 192, 4]]) {
    for (let x = x0; x <= x1; x += 4) {
      const t = (x - x0) / (x1 - x0)
      const y = Math.round(y0 + Math.sin(t * Math.PI) * 9)

      out += rect(x, y, 1, 1, '#6a5468')
      out += rect(x, y + 1, 1, 2, x % 8 === 0 ? '#ffd86a' : '#ff9ab4', ` class="bulb" style="animation-delay:${(-rand() * 3).toFixed(1)}s"`)
    }
  }

  // A chair and a small table with a steaming cup, at the lower right of centre.
  out += rect(112, DECK + 6, 1, 8, '#6a4a30') + rect(122, DECK + 6, 1, 8, '#6a4a30') + rect(111, DECK + 4, 13, 2, '#8a6a48')
  out += sprite(116, DECK + 1, ['wwww.', 'wwwwww', '.wwww.'], { w: '#fff' })
  out += `<g class="sm">${rect(118, DECK - 2, 1, 2, '#fff', ' opacity=".8"')}</g>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges"><style>${CSS}</style>${out}</svg>`
}
