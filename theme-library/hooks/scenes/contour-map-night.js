// Contour Map: an original topographic survey. Elevation contours are computed
// from a made-up landscape (marching squares) and draw themselves on the sheet
// one height at a time. A flat basin sits under the reading column, so the
// lines gather at the sides. Vector art on a 1600x900 canvas.
// Pure SVG + CSS animation: no script.

const NIGHT = true

const W = 1600
const H = 900
const CELL = 24
const COLS = Math.ceil(W / CELL) + 1
const ROWS = Math.ceil(H / CELL) + 1
const LEVELS = 15

const INK = NIGHT
  ? { paper: '#0f151e', line: '#6fb3a4', index: '#a8e6d4', water: '#4f8f9a', mark: '#e8c27a' }
  : { paper: '#f2ebd8', line: '#8d6e4c', index: '#5e4630', water: '#5f8fa6', mark: '#c2502e' }

const BUMPS = [
  [280, 250, 250, 1.0],
  [1290, 290, 290, 0.92],
  [1430, 730, 230, 0.66],
  [190, 720, 240, 0.72],
  [820, 90, 190, 0.38],
  [700, 860, 160, 0.3],
]

function field(x, y) {
  let v = 0

  for (const [bx, by, s, h] of BUMPS) {
    v += h * Math.exp(-((x - bx) ** 2 + (y - by) ** 2) / (2 * s * s))
  }
  v += 0.06 * Math.sin(x / 83 + 1) * Math.sin(y / 71) + 0.04 * Math.sin(x / 37 + y / 53)

  // A basin under the reading column.
  const basin = Math.exp(-(((x - 800) / 300) ** 2) - ((y - 470) / 340) ** 2)

  return Math.max(0, v * (1 - 0.92 * basin))
}

// Marching squares, with segments stitched into polylines so they can be drawn on.
function contour(grid, level) {
  const seg = []
  const val = (i, j) => grid[j * COLS + i]
  const key = { top: (i, j) => `h${i},${j}`, bottom: (i, j) => `h${i},${j + 1}`, left: (i, j) => `v${i},${j}`, right: (i, j) => `v${i + 1},${j}` }
  const table = {
    1: [['left', 'bottom']], 2: [['bottom', 'right']], 3: [['left', 'right']], 4: [['top', 'right']],
    5: [['top', 'left'], ['bottom', 'right']], 6: [['top', 'bottom']], 7: [['left', 'top']], 8: [['left', 'top']],
    9: [['top', 'bottom']], 10: [['top', 'right'], ['left', 'bottom']], 11: [['top', 'right']], 12: [['left', 'right']],
    13: [['bottom', 'right']], 14: [['left', 'bottom']],
  }

  for (let j = 0; j < ROWS - 1; j++) {
    for (let i = 0; i < COLS - 1; i++) {
      const c = (val(i, j) > level ? 8 : 0) | (val(i + 1, j) > level ? 4 : 0) | (val(i + 1, j + 1) > level ? 2 : 0) | (val(i, j + 1) > level ? 1 : 0)

      for (const [a, b] of table[c] ?? []) {
        seg.push([key[a](i, j), key[b](i, j)])
      }
    }
  }

  const point = k => {
    const horizontal = k[0] === 'h'
    const [i, j] = k.slice(1).split(',').map(Number)
    const a = val(i, j)
    const b = horizontal ? val(i + 1, j) : val(i, j + 1)
    const t = (level - a) / (b - a || 1)

    return horizontal ? [(i + t) * CELL, j * CELL] : [i * CELL, (j + t) * CELL]
  }

  const adj = new Map()

  seg.forEach(([a, b], n) => {
    for (const k of [a, b]) {
      adj.set(k, [...(adj.get(k) ?? []), n])
    }
  })

  const used = new Set()
  const lines = []
  const walk = (start, first) => {
    const pts = [point(start)]
    let k = start
    let n = first

    while (n !== undefined && !used.has(n)) {
      used.add(n)

      const [a, b] = seg[n]
      const next = a === k ? b : a

      pts.push(point(next))
      k = next
      n = (adj.get(k) ?? []).find(m => !used.has(m))
    }

    return pts
  }

  for (const [k, list] of adj) {
    if (list.length === 1 && !used.has(list[0])) {
      lines.push(walk(k, list[0]))
    }
  }
  for (const [k, list] of adj) {
    const n = list.find(m => !used.has(m))

    if (n !== undefined) {
      lines.push(walk(k, n))
    }
  }

  return lines
}

const CSS = `
.ln{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;opacity:var(--o,1);animation:draw 26s ease-in-out infinite}
.sv{animation:sv 4s ease-in-out infinite}
.sh{animation:sh 6s ease-in-out infinite}
@keyframes draw{0%{stroke-dashoffset:1;opacity:var(--o,1)}22%{stroke-dashoffset:0}88%{stroke-dashoffset:0;opacity:var(--o,1)}100%{stroke-dashoffset:0;opacity:0}}
@keyframes sv{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes sh{0%,100%{opacity:.15}50%{opacity:.5}}
@media (prefers-reduced-motion:reduce){.ln{animation:none;stroke-dashoffset:0}.sv,.sh{animation:none}}
`

export function buildScene() {
  const grid = new Float32Array(COLS * ROWS)

  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      grid[j * COLS + i] = field(i * CELL, j * CELL)
    }
  }

  let lines = ''

  for (let k = 1; k <= LEVELS; k++) {
    const level = 0.05 + (k * 0.9) / (LEVELS + 1)
    const isIndex = k % 5 === 0
    const delay = (-26 + k * 0.7).toFixed(1)

    for (const pts of contour(grid, level)) {
      if (pts.length < 3) {
        continue
      }
      lines += `<path class="ln" pathLength="1" stroke="${isIndex ? INK.index : INK.line}" stroke-width="${isIndex ? 2.4 : 1.2}" style="--o:${isIndex ? 0.95 : 0.7};animation-delay:${delay}s" d="M${pts.map(([x, y]) => `${Math.round(x)} ${Math.round(y)}`).join('L')}"/>`
    }
  }

  // Survey marks on the summits, and shimmer on the basin.
  let marks = ''

  for (const [bx, by] of BUMPS.slice(0, 4)) {
    marks += `<g class="sv" style="animation-delay:${(-bx % 4) / 2}s"><polygon points="${bx},${by - 9} ${bx - 8},${by + 6} ${bx + 8},${by + 6}" fill="none" stroke="${INK.mark}" stroke-width="2"/><circle cx="${bx}" cy="${by}" r="2" fill="${INK.mark}"/></g>`
  }
  for (let i = 0; i < 9; i++) {
    marks += `<rect class="sh" x="${640 + ((i * 97) % 320)}" y="${390 + i * 34}" width="${40 + ((i * 29) % 60)}" height="2" fill="${INK.water}" style="animation-delay:${-i * 0.7}s"/>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><style>${CSS}</style><rect width="${W}" height="${H}" fill="${INK.paper}"/>${lines}${marks}</svg>`
}
