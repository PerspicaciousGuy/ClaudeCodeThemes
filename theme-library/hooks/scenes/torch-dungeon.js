// Torch Dungeon: an original pixel-art dungeon wall, 192x108 grid. Brick wall
// lit by two flickering torches, a dark doorway with watching eyes, bats, a
// slime hopping along the flagstones, a treasure chest and a pile of bones.
// Pure SVG + CSS animation: no script, nothing loaded.

const W = 192
const H = 108
const FLOOR = 84

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

// Draws a sprite from rows of characters; '.' is clear.
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

const BRICKS = ['#1c1b28', '#1f1e2d', '#232235', '#191824', '#262439']

function torch(x, y) {
  const flame = (cls, rows) => `<g class="${cls}">${sprite(x - 2, y - 7, rows, { o: '#ff7a1f', y: '#ffd23d', w: '#fff3c0' })}</g>`

  return (
    `<g class="gl"><circle cx="${x}" cy="${y - 4}" r="34" fill="#ff8a2a" opacity=".07"/><circle cx="${x}" cy="${y - 4}" r="24" fill="#ff8a2a" opacity=".09"/><circle cx="${x}" cy="${y - 4}" r="14" fill="#ffb347" opacity=".12"/></g>` +
    rect(x - 1, y, 3, 1, '#5a5a6e') + rect(x, y + 1, 1, 6, '#3c3c4e') + rect(x - 2, y - 1, 5, 1, '#6a6a80') +
    flame('fa', ['..o..', '.ooo.', '.oyo.', 'ooyoo', 'oywyo', '.oyo.']) +
    flame('fb', ['.....', '..o..', '.ooo.', 'ooyoo', 'oywyo', '.oyo.'])
  )
}

const CSS = `
.gl{animation:gl .9s steps(1,end) infinite}
.fa{animation:fa .5s steps(1,end) infinite}
.fb{animation:fb .5s steps(1,end) infinite}
.eye{animation:eye 7s steps(1,end) infinite}
.bat{animation:bat 22s linear infinite}
.bat2{animation:bat 31s linear infinite}
.wing{animation:wing .4s steps(1,end) infinite}
.slime{animation:slime 36s linear infinite}
.hop{animation:hop 1.2s steps(1,end) infinite}
.sp{animation:sp 3s steps(1,end) infinite}
@keyframes gl{0%{opacity:1}30%{opacity:.8}60%{opacity:.95}80%{opacity:.75}}
@keyframes fa{0%,100%{opacity:1}50%{opacity:0}}
@keyframes fb{0%,100%{opacity:0}50%{opacity:1}}
@keyframes eye{0%,70%,100%{opacity:1}74%,80%{opacity:0}}
@keyframes bat{from{transform:translateX(-14px)}to{transform:translateX(206px)}}
@keyframes wing{0%,100%{transform:scaleY(1)}50%{transform:scaleY(-1)}}
@keyframes slime{from{transform:translateX(-12px)}to{transform:translateX(204px)}}
@keyframes hop{0%{transform:translateY(0)}20%{transform:translateY(-3px)}40%{transform:translateY(-4px)}60%{transform:translateY(-2px)}80%{transform:translateY(0)}}
@keyframes sp{0%,100%{opacity:0}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){.gl,.fa,.fb,.eye,.bat,.bat2,.wing,.slime,.hop,.sp{animation:none}.fb{opacity:0}}
`

export function buildScene() {
  const rand = rng(31)
  let out = rect(0, 0, W, H, '#14131e')

  // Bricks: rows of 12x6, each row offset from the one above.
  for (let r = 0; r * 6 < FLOOR; r++) {
    const off = r % 2 ? -6 : 0

    for (let x = off; x < W; x += 12) {
      out += rect(x, r * 6, 11, 5, BRICKS[Math.floor(rand() * BRICKS.length)])
      if (rand() < 0.12) {
        out += rect(x + 2 + Math.floor(rand() * 6), r * 6 + 1, 2, 1, '#2f2d46')
      }
      if (rand() < 0.05) {
        out += rect(x + 2, r * 6 + 2, 1, 3, '#0f0e16')
      }
    }
  }

  // A dark doorway in the middle, with eyes.
  out += rect(72, 30, 48, 54, '#07060b') + rect(76, 26, 40, 4, '#07060b') + rect(80, 24, 32, 2, '#07060b')
  out += rect(70, 30, 2, 54, '#2a2840') + rect(120, 30, 2, 54, '#2a2840') + rect(74, 26, 2, 4, '#2a2840') + rect(116, 26, 2, 4, '#2a2840') + rect(78, 24, 2, 2, '#2a2840') + rect(112, 24, 2, 2, '#2a2840')
  out += `<g class="eye">${rect(88, 52, 3, 2, '#ff4a3a')}${rect(101, 52, 3, 2, '#ff4a3a')}</g>`

  // Chains and cobwebs at the edges.
  for (const x of [10, 22, 170, 182]) {
    const len = 14 + Math.floor(rand() * 20)

    for (let y = 0; y < len; y += 2) {
      out += rect(x, y, 1, 1, '#6a6a80')
    }
    out += rect(x - 1, len, 3, 2, '#7a7a90')
  }
  out += `<g opacity=".5">${sprite(0, 0, ['ccccccccc...', 'ccccccc....', 'ccccc.c....', 'cccc..c....', 'ccc...c....', 'cc....c....', 'c....c.....'], { c: '#4a4a62' })}</g>`

  // Torches.
  out += torch(40, 48) + torch(152, 48)

  // Flagstones.
  out += rect(0, FLOOR, W, H - FLOOR, '#201f2e')
  for (let r = 0; FLOOR + r * 6 < H; r++) {
    out += rect(0, FLOOR + r * 6, W, 1, '#12111a')
    for (let x = r % 2 ? 8 : 0; x < W; x += 16) {
      out += rect(x, FLOOR + r * 6, 1, 6, '#12111a')
    }
  }
  out += rect(0, FLOOR, W, 1, '#3a3852')
  out += `<g class="gl">${rect(10, FLOOR + 1, 60, 10, '#ff8a2a', ' opacity=".06"')}${rect(122, FLOOR + 1, 60, 10, '#ff8a2a', ' opacity=".06"')}</g>`

  // A chest at the left, with a glint; bones at the right.
  out += sprite(14, 90, ['.cccccccccc.', 'cddddddddddc', 'cdbbbbbbbbdc', 'ccccgggcccc.', 'cbbbbgbbbbc.', 'cbbbbbbbbbc.', 'cccccccccccc'].map(r => r), { c: '#4a2e18', d: '#7a4a24', b: '#6a3e1e', g: '#ffd23d' })
  out += rect(18, 88, 1, 1, '#fff6c0', ' class="sp"') + rect(24, 90, 1, 1, '#fff6c0', ' class="sp" style="animation-delay:-1.5s"')
  out += sprite(160, 93, ['..wwww....', '.wwwwww...', '.wkwwkw.ww', '.wwwwww.w.', '..wwww.www', '.ww.ww.w.w'], { w: '#cfcbb8', k: '#14131e' })

  // Bats near the ceiling and a slime on the floor.
  const bat = (cls, y, delay) =>
    `<g class="${cls}" style="animation-delay:${delay}s"><g transform="translate(0 ${y})"><g class="wing">${sprite(0, 0, ['b...b', 'bb.bb', 'bbbbb', '.b.b.'], { b: '#3a2a52' })}</g>${rect(2, 1, 1, 1, '#ff4a3a')}</g></g>`

  out += bat('bat', 10, -4) + bat('bat2', 18, -18)
  out += `<g class="slime"><g transform="translate(0 ${H - 11})"><g class="hop">${sprite(0, 0, ['..ggg..', '.ggggg.', 'gwgggwg', 'ggggggg'], { g: '#5ad06a', w: '#10260f' })}${rect(1, 1, 2, 1, '#a8f0a8')}</g></g></g>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges"><style>${CSS}</style>${out}</svg>`
}
