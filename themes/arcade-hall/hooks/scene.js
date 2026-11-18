// Arcade Hall: an original pixel-art arcade at night, 192x108 grid. A row of
// cabinets on each side, screens playing little games of their own, neon tubes
// and a patterned carpet; the middle stays open.
// Pure SVG + CSS animation: no script, nothing loaded.

const W = 192
const H = 108
const FLOOR = 74

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

const PINK = '#ff4fa8'
const CYAN = '#33e6ff'
const YELLOW = '#ffd23d'

// One cabinet, 18 wide and 46 tall, standing on the carpet at y 92.
function cabinet(x, c, kind, rand) {
  const y = 46
  const sx = x + 3
  const sy = y + 10
  let o = rect(x, 92, 18, 1, '#000', ' opacity=".4"')

  o += `<g class="nz">${rect(x - 1, 92, 20, 7, c, ' opacity=".09"')}</g>`
  o += rect(x, y, 18, 46, '#14112a') + rect(x, y, 1, 46, c, ' opacity=".7"') + rect(x + 17, y, 1, 46, '#0a0816')
  o += `<g class="nz">${rect(x + 1, y - 1, 16, 9, c, ' opacity=".14"')}</g>` + rect(x + 2, y + 2, 14, 5, '#0a0816') + rect(x + 3, y + 3, 12, 3, c, ' class="nz"')
  for (let i = 0; i < 5; i++) {
    o += rect(x + 4 + i * 2, y + 4, 1, rand() < 0.5 ? 1 : 2, '#0a0816')
  }
  o += rect(x + 2, y + 9, 14, 13, '#050410') + rect(sx, sy, 12, 11, '#02020a')

  if (kind === 'invaders') {
    let rows = ''

    for (let r = 0; r < 2; r++) {
      for (let k = 0; k < 3; k++) {
        const ix = sx + 1 + k * 4
        const iy = sy + 1 + r * 3

        rows += rect(ix, iy, 3, 1, r ? '#3be8b0' : c) + rect(ix, iy + 1, 1, 1, r ? '#3be8b0' : c) + rect(ix + 2, iy + 1, 1, 1, r ? '#3be8b0' : c)
      }
    }
    o += `<g class="inv">${rows}</g>` + rect(sx + 5, sy + 9, 3, 1, '#fff') + rect(sx + 6, sy + 8, 1, 1, '#fff') + `<g class="shot">${rect(sx + 6, sy + 6, 1, 2, YELLOW)}</g>`
  } else if (kind === 'pong') {
    for (let i = 0; i < 5; i++) {
      o += rect(sx + 6, sy + 1 + i * 2, 1, 1, '#4a4a6a')
    }
    o += `<g class="pad">${rect(sx + 1, sy + 3, 1, 4, '#fff')}</g><g class="pad2">${rect(sx + 10, sy + 4, 1, 4, '#fff')}</g><g class="ball">${rect(sx + 2, sy + 5, 1, 1, YELLOW)}</g>`
  } else {
    for (let i = 0; i < 6; i++) {
      o += rect(sx + 1 + i * 2, sy + 5, 1, 1, '#ffe9b0', ' opacity=".7"')
    }
    o += rect(sx, sy + 2, 12, 1, '#2a2aa0') + rect(sx, sy + 8, 12, 1, '#2a2aa0')
    o += `<g class="chm">${rect(sx + 1, sy + 4, 3, 3, YELLOW)}${rect(sx + 3, sy + 5, 1, 1, '#02020a')}</g><g class="gho">${rect(sx + 8, sy + 4, 3, 3, '#ff5470')}${rect(sx + 8, sy + 6, 1, 1, '#02020a')}${rect(sx + 10, sy + 6, 1, 1, '#02020a')}</g>`
  }

  // Control panel, stick and buttons, then the coin door.
  o += rect(x + 1, y + 24, 16, 5, '#2a2446') + rect(x + 1, y + 24, 16, 1, '#3a3260')
  o += rect(x + 4, y + 22, 1, 3, '#d8d8ee') + rect(x + 3, y + 21, 3, 1, c)
  o += rect(x + 9, y + 26, 2, 1, c) + rect(x + 13, y + 26, 2, 1, YELLOW)
  o += rect(x + 2, y + 31, 14, 13, '#0e0b20') + rect(x + 7, y + 34, 4, 6, '#1f1a38') + rect(x + 8, y + 35, 2, 1, YELLOW) + rect(x, y + 44, 18, 2, '#080614')

  return o
}

const CSS = `
.nz{animation:nz 3.2s ease-in-out infinite}
.inv{animation:inv 2.4s steps(1,end) infinite}
.shot{animation:shot 1.2s steps(1,end) infinite}
.pad{animation:pad 1.6s steps(1,end) infinite}
.pad2{animation:pad 1.3s steps(1,end) infinite reverse}
.ball{animation:ball 1.6s steps(1,end) infinite}
.chm{animation:chm 3s steps(1,end) infinite}
.gho{animation:gho 3s steps(1,end) infinite}
.sp{animation:sp 4s steps(1,end) infinite}
@keyframes nz{0%,100%{opacity:1}46%{opacity:.6}50%{opacity:.95}54%{opacity:.5}}
@keyframes inv{0%{transform:translateX(0)}25%{transform:translateX(1px)}50%{transform:translateX(2px)}75%{transform:translateX(1px)}}
@keyframes shot{0%{transform:translateY(0)}25%{transform:translateY(-2px)}50%{transform:translateY(-4px)}75%{opacity:0}}
@keyframes pad{0%{transform:translateY(0)}33%{transform:translateY(2px)}66%{transform:translateY(-1px)}}
@keyframes ball{0%{transform:translate(0,0)}25%{transform:translate(2px,2px)}50%{transform:translate(4px,-1px)}75%{transform:translate(6px,1px)}}
@keyframes chm{0%{transform:translateX(0)}20%{transform:translateX(2px)}40%{transform:translateX(4px)}60%{transform:translateX(6px)}80%{transform:translateX(7px)}}
@keyframes gho{0%{transform:translateX(0)}20%{transform:translateX(-1px)}40%{transform:translateX(-2px)}60%{transform:translateX(-4px)}80%{transform:translateX(-6px)}}
@keyframes sp{0%,100%{opacity:0}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){.nz,.inv,.shot,.pad,.pad2,.ball,.chm,.gho,.sp{animation:none}}
`

export function buildScene() {
  const rand = rng(12)
  let out = rect(0, 0, W, FLOOR, '#0c0920')

  for (let x = 0; x < W; x += 8) {
    out += rect(x, 0, 1, FLOOR, '#120e2c')
  }
  // Neon tubes along the wall.
  out += rect(30, 8, 132, 1, CYAN, ' class="nz"') + rect(30, 7, 132, 3, CYAN, ' opacity=".1"')
  out += rect(46, 14, 100, 1, PINK, ' class="nz" style="animation-delay:-1.4s"') + rect(46, 13, 100, 3, PINK, ' opacity=".1"')
  out += rect(0, 70, W, 1, PINK, ' class="nz" style="animation-delay:-2s"') + rect(0, 71, W, 3, '#2a1a4a')

  // The carpet: dark with a scatter of little shapes.
  out += rect(0, FLOOR, W, H - FLOOR, '#150c28')
  for (let i = 0; i < 70; i++) {
    const c = [PINK, CYAN, YELLOW][Math.floor(rand() * 3)]
    const x = Math.floor(rand() * (W - 4))
    const y = FLOOR + 3 + Math.floor(rand() * (H - FLOOR - 5))

    out += rect(x, y, 2, 1, c, ' opacity=".3"') + rect(x + 1, y + 1, 1, 1, c, ' opacity=".3"')
  }

  // Cabinets, three at each side.
  const left = [[2, PINK, 'invaders'], [22, CYAN, 'pong'], [42, YELLOW, 'chomp']]
  const right = [[132, CYAN, 'invaders'], [152, PINK, 'chomp'], [172, YELLOW, 'pong']]

  for (const [x, c, kind] of [...left, ...right]) {
    out += cabinet(x, c, kind, rand)
  }

  // Light from the screens along the carpet, and a few blinking sparks.
  for (let i = 0; i < 10; i++) {
    out += rect(Math.floor(rand() * W), 96 + Math.floor(rand() * 10), 1, 1, '#fff', ` class="sp" style="animation-delay:${(-rand() * 4).toFixed(1)}s;animation-duration:${(3 + rand() * 3).toFixed(1)}s"`)
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges"><style>${CSS}</style>${out}</svg>`
}
