// Sunny Shore: an original pixel-art beach on a bright day, 192x108 grid. A
// pulsing sun, drifting clouds, a sparkling sea with a sailboat, foam rolling
// up the sand, two palms, a beach umbrella, gulls and a crab.
// Pure SVG + CSS animation: no script, nothing loaded.

const W = 192
const H = 108
const SEA = 52
const SAND = 78

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

// A filled pixel disc.
function disc(cx, cy, r, fill, extra = '') {
  let out = ''

  for (let dy = -r; dy <= r; dy++) {
    const half = Math.floor(Math.sqrt(r * r - dy * dy + 0.5))

    out += rect(cx - half, cy + dy, half * 2 + 1, 1, fill, extra)
  }

  return out
}

// A palm: a leaning trunk of segments and drooping fronds. `side` mirrors it.
function palm(x, base, h, side) {
  let out = ''
  const lean = 6 * side

  for (let i = 0; i < h; i++) {
    const t = i / h

    out += rect(Math.round(x + lean * t * t) - 1, base - i, 3, 1, i % 4 < 2 ? '#8a5a30' : '#6e4524')
  }

  const tx = Math.round(x + lean)
  const ty = base - h
  const frond = (a, len) => {
    let f = ''

    for (let t = 1; t <= len; t++) {
      const fx = tx + Math.cos(a) * t
      const fy = ty + Math.sin(a) * t * 0.5 + t * t * 0.035

      f += rect(Math.round(fx), Math.round(fy), 2, 1, t % 3 ? '#2f9a4a' : '#47b45c')
      if (t > 3 && t % 2 === 0) {
        f += rect(Math.round(fx), Math.round(fy) + 1, 1, 1, '#237a3a')
      }
    }

    return f
  }

  out += `<g class="sw">${frond(-2.7, 15)}${frond(-2.0, 13)}${frond(-1.1, 13)}${frond(-0.4, 15)}${frond(-3.1, 11)}${frond(0.0, 11)}</g>`
  out += rect(tx - 1, ty, 3, 2, '#5a3a1c') + rect(tx - 2, ty + 2, 2, 2, '#6e4524')

  return out
}

const CSS = `
.ray{animation:ray 2s steps(1,end) infinite}
.c1{animation:drift 150s linear infinite}
.c2{animation:drift 210s linear infinite}
.tw{animation:tw 3s steps(1,end) infinite}
.boat{animation:boat 120s linear infinite}
.wv{animation:wv 4s steps(1,end) infinite}
.wv2{animation:wv 4s steps(1,end) infinite -2s}
.sw{animation:sw 3s steps(1,end) infinite}
.gull{animation:gull 46s linear infinite}
.fa{animation:fa .7s steps(1,end) infinite}
.fb{animation:fb .7s steps(1,end) infinite}
.crab{animation:crab 24s steps(48,end) infinite alternate}
@keyframes ray{0%,100%{opacity:.9}50%{opacity:.35}}
@keyframes drift{from{transform:translateX(-50px)}to{transform:translateX(250px)}}
@keyframes tw{0%,100%{opacity:0}50%{opacity:1}}
@keyframes boat{from{transform:translateX(-12px)}to{transform:translateX(206px)}}
@keyframes wv{0%{transform:translateY(0)}34%{transform:translateY(2px)}67%{transform:translateY(3px)}}
@keyframes sw{0%,100%{transform:translateX(0)}50%{transform:translateX(1px)}}
@keyframes gull{from{transform:translate(-14px,0)}to{transform:translate(206px,-6px)}}
@keyframes fa{0%,100%{opacity:1}50%{opacity:0}}
@keyframes fb{0%,100%{opacity:0}50%{opacity:1}}
@keyframes crab{from{transform:translateX(0)}to{transform:translateX(34px)}}
@media (prefers-reduced-motion:reduce){.ray,.c1,.c2,.tw,.boat,.wv,.wv2,.sw,.gull,.fa,.fb,.crab{animation:none}.fb{opacity:0}}
`

export function buildScene() {
  const rand = rng(7)
  let out = ''

  // Sky in bands.
  ;['#78c4ee', '#86cbf0', '#96d3f2', '#a8dbf5', '#bce4f7', '#d2edf9'].forEach((c, i) => {
    out += rect(0, i * 9, W, 9, c)
  })

  // The sun and its rays.
  out += disc(152, 17, 12, '#fff6b8', ' opacity=".35"') + disc(152, 17, 8, '#ffe97a') + disc(152, 17, 6, '#fff6b8')
  out += `<g class="ray">${[[152, 2, 1, 3], [152, 31, 1, 3], [137, 17, 3, 1], [166, 17, 3, 1], [141, 6, 2, 2], [161, 6, 2, 2], [141, 28, 2, 2], [161, 28, 2, 2]].map(([x, y, w, h]) => rect(x, y, w, h, '#ffe97a')).join('')}</g>`

  // Clouds.
  const cloud = rows => sprite(0, 0, rows, { w: '#fff', s: '#e2f0fa' })

  out += `<g class="c1"><g transform="translate(8 14)">${cloud(['....www.....', '..wwwwwww...', '.wwwwwwwwww.', 'wwwwwwwwwwww', '.ssssssssss.'])}</g></g>`
  out += `<g class="c2"><g transform="translate(-60 28)">${cloud(['...www....', '.wwwwwww..', 'wwwwwwwwww', '.sssssss..'])}</g></g>`
  out += `<g class="c1" style="animation-delay:-70s"><g transform="translate(60 8)">${cloud(['..ww....', '.wwwww..', 'wwwwwwww', '.ssssss.'])}</g></g>`

  // Gulls.
  const gull = (y, delay) =>
    `<g class="gull" style="animation-delay:${delay}s"><g transform="translate(0 ${y})"><g class="fa">${rect(0, 1, 1, 1, '#fff')}${rect(1, 0, 1, 1, '#fff')}${rect(2, 1, 1, 1, '#fff')}${rect(3, 0, 1, 1, '#fff')}${rect(4, 1, 1, 1, '#fff')}</g><g class="fb">${rect(0, 0, 1, 1, '#fff')}${rect(1, 1, 1, 1, '#fff')}${rect(2, 1, 1, 1, '#fff')}${rect(3, 1, 1, 1, '#fff')}${rect(4, 0, 1, 1, '#fff')}</g></g></g>`

  out += gull(30, 0) + gull(38, -20)

  // The sea, banded darker toward us, with sparkles and a sailboat.
  ;['#4cb8de', '#42acd8', '#3aa0d0', '#3294c8', '#2c88bf'].forEach((c, i) => {
    out += rect(0, SEA + i * 5, W, 5, c)
  })
  out += rect(0, SEA, W, 1, '#8fdcf0')
  for (let i = 0; i < 40; i++) {
    out += rect(Math.floor(rand() * (W - 3)), SEA + 2 + Math.floor(rand() * 22), 2, 1, '#e8fbff', ` class="tw" style="animation-delay:${(-rand() * 3).toFixed(1)}s;animation-duration:${(2 + rand() * 3).toFixed(1)}s"`)
  }
  out += `<g class="boat"><g transform="translate(0 41)">${sprite(0, 0, ['...w....', '..ww....', '.www..r.', 'wwww..rr', 'wwww....', 'dddddddd', '.dddddd.'], { w: '#fff', d: '#7a4a28', r: '#e0503a' })}</g></g>`

  // Sand, then foam rolling up it in two rows.
  out += rect(0, SAND, W, H - SAND, '#f3dc9c') + rect(0, SAND + 10, W, H - SAND - 10, '#ecd08a') + rect(0, SAND + 20, W, H - SAND - 20, '#e4c47a')
  out += rect(0, SAND, W, 3, '#d9bf84', ' opacity=".7"')
  out += `<g class="wv">${rect(0, SAND - 2, W, 2, '#f4fcff')}${rect(0, SAND - 4, W, 1, '#bfe9f4')}</g><g class="wv2">${rect(0, SAND - 6, W, 1, '#e0f6fb', ' opacity=".8"')}${rect(0, SAND - 3, W, 1, '#f4fcff', ' opacity=".6"')}</g>`
  for (let i = 0; i < 50; i++) {
    out += rect(Math.floor(rand() * (W - 1)), SAND + 4 + Math.floor(rand() * 24), 1, 1, '#c8a566', ' opacity=".6"')
  }

  // Palms at the sides.
  out += palm(14, 102, 44, 1) + palm(176, 100, 34, -1)

  // An umbrella, a towel and a bucket at the right.
  out += rect(146, 84, 1, 14, '#e8e0d0')
  out += sprite(136, 78, ['....rrrwwwrrr....', '..rrrwwwrrrwww..', '.rrwwwrrrwwwrr..', 'rwwwrrrwwwrrrwwr'], { r: '#e0503a', w: '#fff' })
  out += rect(132, 98, 22, 5, '#33aadd') + rect(132, 99, 22, 1, '#fff', ' opacity=".7"') + rect(132, 101, 22, 1, '#fff', ' opacity=".7"')
  out += sprite(160, 100, ['.yyyy.', 'yrrrry', '.rrrr.', '.rrrr.'], { y: '#ffd23d', r: '#e0503a' })

  // Shells, a starfish and the crab.
  out += sprite(26, 98, ['..o..', 'ooooo', '.ooo.', 'oo.oo'], { o: '#ff8a4d' }) + rect(48, 102, 2, 1, '#fff0e0') + rect(104, 99, 2, 1, '#fff0e0')
  out += `<g class="crab"><g transform="translate(60 96)">${sprite(0, 0, ['r.rrr.r', '.rrrrr.', 'r.r.r.r'], { r: '#e0503a' })}${rect(1, -1, 1, 1, '#fff')}${rect(5, -1, 1, 1, '#fff')}</g></g>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges"><style>${CSS}</style>${out}</svg>`
}
