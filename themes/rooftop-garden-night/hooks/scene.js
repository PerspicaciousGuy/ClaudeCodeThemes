// Rooftop Garden Night: an original pixel-art rooftop after dark, 192x108 grid.
// The night twin of Rooftop Garden: a deep-blue sky with a moon and stars, a
// skyline full of lit windows, glowing string lights, planters swaying in the
// breeze, fireflies and a lantern on the table.
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
  let out = rect(x, DECK - 8, w, 8, '#4a2a30') + rect(x, DECK - 8, w, 1, '#6a4046') + rect(x, DECK - 1, w, 1, '#2e1a1e')
  let bush = ''

  for (let i = 0; i < w * 2; i++) {
    const bx = x + 1 + Math.floor(rand() * (w - 2))
    const by = DECK - 9 - Math.floor(rand() * (tall ? 20 : 11))

    bush += rect(bx, by, 2, 2, rand() < 0.5 ? '#1f5a3a' : '#17482e')
  }
  for (let i = 0; i < Math.ceil(w / 5); i++) {
    const bx = x + 2 + Math.floor(rand() * (w - 4))
    const by = DECK - 11 - Math.floor(rand() * (tall ? 20 : 9))

    bush += fruit === 'sun' ? rect(bx - 1, by - 1, 3, 3, '#c8a02e') + rect(bx, by, 1, 1, '#3a2410') : rect(bx, by, 2, 2, '#b03a2e')
  }

  return out + `<g class="sw" style="animation-delay:${(-rand() * 4).toFixed(1)}s">${bush}</g>`
}

const CSS = `
.sw{animation:sw 4s steps(1,end) infinite}
.bulb{opacity:var(--o,1);animation:bulb 3s steps(1,end) infinite}
.tw{opacity:var(--o,1);animation:tw 4s steps(1,end) infinite}
.ff{animation:ff 7s steps(1,end) infinite}
.lamp{animation:lamp 2.2s steps(1,end) infinite}
.moon{animation:moon 6s steps(1,end) infinite}
@keyframes sw{0%,100%{transform:translateX(0)}50%{transform:translateX(1px)}}
@keyframes bulb{0%,100%{opacity:var(--o,1)}50%{opacity:calc(var(--o,1)*.55)}}
@keyframes tw{0%,100%{opacity:var(--o,1)}50%{opacity:calc(var(--o,1)*.25)}}
@keyframes ff{0%{opacity:0;transform:translate(0,0)}20%{opacity:1}60%{opacity:.4;transform:translate(3px,-4px)}100%{opacity:0;transform:translate(-2px,-8px)}}
@keyframes lamp{0%,100%{opacity:1}50%{opacity:.8}}
@keyframes moon{0%,100%{opacity:1}50%{opacity:.75}}
@media (prefers-reduced-motion:reduce){.sw,.bulb,.tw,.ff,.lamp,.moon{animation:none}}
`

export function buildScene() {
  const rand = rng(43)
  let out = ''

  // The night sky, then stars and a moon.
  ;['#0a1030', '#0e1740', '#14204e', '#1c2a5a', '#283868', '#37477a', '#4a5a8a', '#5c6c98'].forEach((c, i) => {
    out += rect(0, i * 8, W, 8, c)
  })
  for (let i = 0; i < 70; i++) {
    const x = Math.floor(rand() * W)
    const y = Math.floor(rand() * rand() * 44)
    const c = rand() < 0.2 ? '#fff0c4' : '#cdd8ff'

    out += rand() < 0.3 ? rect(x, y, 1, 1, c, ` class="tw" style="--o:.8;animation-delay:${(-rand() * 4).toFixed(1)}s"`) : rect(x, y, 1, 1, c, ' opacity=".7"')
  }
  out += `<g class="moon">${disc(96, 28, 14, '#9fb4ff', ' opacity=".10"')}${disc(96, 28, 10, '#b9c6ff', ' opacity=".14"')}</g>` + disc(96, 28, 7, '#ece6c6') + rect(93, 25, 3, 2, '#cfc8a4') + rect(98, 29, 3, 3, '#cfc8a4')

  // Far skyline, then the near one with lit windows, a water tank and antennas.
  for (let x = 0; x < W; ) {
    const w = 8 + Math.floor(rand() * 10)
    const h = 14 + Math.floor(rand() * 22)

    out += rect(x, DECK - 6 - h, w, h + 6, '#2a3868')
    x += w
  }
  for (let x = -2; x < W; ) {
    const w = 12 + Math.floor(rand() * 10)
    const h = 12 + Math.floor(rand() * 26)
    const top = DECK - 6 - h

    out += rect(x, top, w, h + 6, '#1a2448') + rect(x, top, 1, h + 6, '#26325e')
    for (let wy = top + 3; wy < DECK - 7; wy += 4) {
      for (let wx = x + 2; wx < x + w - 2; wx += 3) {
        if (rand() < 0.42) {
          out += rect(wx, wy, 2, 2, rand() < 0.7 ? '#ffd27a' : '#ffe9b0', ' opacity=".9"')
        }
      }
    }
    if (rand() < 0.3) {
      out += rect(x + 3, top - 5, 1, 5, '#10183a') + rect(x + 1, top - 4, 5, 1, '#10183a') + rect(x + 3, top - 6, 1, 1, '#ff4a5a', ' class="tw" style="animation-delay:-1s"')
    } else if (rand() < 0.2) {
      out += sprite(x + 2, top - 7, ['.rrrr.', 'rrrrrr', 'rrrrrr', '.l..l.', '.l..l.'], { r: '#1c2650', l: '#141c3e' })
    }
    x += w + (rand() < 0.35 ? 2 + Math.floor(rand() * 5) : 0)
  }

  // The parapet and the deck.
  out += rect(0, DECK - 6, W, 6, '#3a4068') + rect(0, DECK - 6, W, 1, '#566090') + rect(0, DECK, W, H - DECK, '#3a2a30')
  for (let x = 0; x < W; x += 12) {
    out += rect(x, DECK + 1, 1, H - DECK - 1, '#2a1c22')
  }
  for (let y = DECK + 8; y < H; y += 8) {
    out += rect(0, y, W, 1, '#2a1c22', ' opacity=".6"')
  }

  // Planters at both sides, taller toward the edges.
  out += planter(4, 26, 'sun', rand, true) + planter(34, 18, 'tom', rand, false) + planter(56, 12, 'tom', rand, false)
  out += planter(162, 26, 'sun', rand, true) + planter(140, 18, 'tom', rand, false) + planter(124, 12, 'tom', rand, false)

  // String lights from the corners, each bulb with a little halo.
  for (const [x0, x1, y0] of [[0, 62, 4], [130, 192, 4]]) {
    for (let x = x0; x <= x1; x += 4) {
      const t = (x - x0) / (x1 - x0)
      const y = Math.round(y0 + Math.sin(t * Math.PI) * 9)
      const c = x % 8 === 0 ? '#ffd86a' : '#ff9ab4'

      out += rect(x, y, 1, 1, '#10183a')
      out += `<g class="bulb" style="--o:1;animation-delay:${(-rand() * 3).toFixed(1)}s">${rect(x - 1, y, 3, 4, c, ' opacity=".18"')}${rect(x, y + 1, 1, 2, c)}</g>`
    }
  }

  // Fireflies drifting above the planters.
  for (let i = 0; i < 18; i++) {
    const side = i % 2 ? 0 : 130
    const x = side + Math.floor(rand() * 62)

    out += `<g class="ff" style="animation-delay:${(-rand() * 7).toFixed(1)}s;animation-duration:${(5 + rand() * 5).toFixed(1)}s">${rect(x, 52 + Math.floor(rand() * 26), 1, 1, '#d8ff7a')}</g>`
  }

  // A table with a lantern, at the lower right of the middle.
  out += rect(112, DECK + 6, 1, 8, '#20141a') + rect(122, DECK + 6, 1, 8, '#20141a') + rect(111, DECK + 4, 13, 2, '#4a343c')
  out += `<g class="lamp">${rect(106, DECK - 8, 24, 14, '#ffb347', ' opacity=".10"')}${rect(110, DECK - 5, 16, 9, '#ffb347', ' opacity=".12"')}</g>`
  out += sprite(115, DECK - 1, ['.yyy.', 'yooov', 'yooov', '.yyy.'], { y: '#6a5a30', o: '#ffc86a', v: '#6a5a30' })

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges"><style>${CSS}</style>${out}</svg>`
}
