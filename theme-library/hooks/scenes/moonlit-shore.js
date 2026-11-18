// Moonlit Shore: an original pixel-art beach at night, 192x108 grid. The night
// twin of Sunny Shore: a moon and its glitter on the water, stars, slow foam,
// palms in silhouette, a campfire with sparks, a lantern boat and a crab.
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

function disc(cx, cy, r, fill, extra = '') {
  let out = ''

  for (let dy = -r; dy <= r; dy++) {
    const half = Math.floor(Math.sqrt(r * r - dy * dy + 0.5))

    out += rect(cx - half, cy + dy, half * 2 + 1, 1, fill, extra)
  }

  return out
}

// A palm in silhouette: a leaning trunk and drooping fronds. `side` mirrors it.
function palm(x, base, h, side) {
  let out = ''
  const lean = 6 * side

  for (let i = 0; i < h; i++) {
    const t = i / h

    out += rect(Math.round(x + lean * t * t) - 1, base - i, 3, 1, i % 4 < 2 ? '#0e1830' : '#0a1226')
  }

  const tx = Math.round(x + lean)
  const ty = base - h
  const frond = (a, len) => {
    let f = ''

    for (let t = 1; t <= len; t++) {
      const fx = tx + Math.cos(a) * t
      const fy = ty + Math.sin(a) * t * 0.5 + t * t * 0.035

      f += rect(Math.round(fx), Math.round(fy), 2, 1, t % 3 ? '#0c2a30' : '#12403c')
      if (t > 3 && t % 2 === 0) {
        f += rect(Math.round(fx), Math.round(fy) + 1, 1, 1, '#081c24')
      }
    }

    return f
  }

  out += `<g class="sw">${frond(-2.7, 15)}${frond(-2.0, 13)}${frond(-1.1, 13)}${frond(-0.4, 15)}${frond(-3.1, 11)}${frond(0.0, 11)}</g>`
  out += rect(tx - 1, ty, 3, 2, '#0a1226') + rect(tx - 2, ty + 2, 2, 2, '#0e1830')

  return out
}

const CSS = `
.tw{opacity:var(--o,1);animation:tw 4s steps(1,end) infinite}
.glow{animation:glow 5s steps(1,end) infinite}
.c1{animation:drift 170s linear infinite}
.c2{animation:drift 230s linear infinite}
.gl{opacity:var(--o,1);animation:gl 3s steps(1,end) infinite}
.boat{animation:boat 140s linear infinite}
.wv{animation:wv 5s steps(1,end) infinite}
.wv2{animation:wv 5s steps(1,end) infinite -2.5s}
.sw{animation:sw 4s steps(1,end) infinite}
.fa{animation:fa .6s steps(1,end) infinite}
.fb{animation:fb .6s steps(1,end) infinite}
.sp{animation:spark 2.4s steps(1,end) infinite}
.fire{animation:fire 1.1s steps(1,end) infinite}
.crab{animation:crab 28s steps(48,end) infinite alternate}
@keyframes tw{0%,100%{opacity:var(--o,1)}50%{opacity:calc(var(--o,1)*.25)}}
@keyframes glow{0%,100%{opacity:1}50%{opacity:.7}}
@keyframes drift{from{transform:translateX(-50px)}to{transform:translateX(250px)}}
@keyframes gl{0%,100%{opacity:var(--o,1)}50%{opacity:calc(var(--o,1)*.2)}}
@keyframes boat{from{transform:translateX(-12px)}to{transform:translateX(206px)}}
@keyframes wv{0%{transform:translateY(0)}34%{transform:translateY(2px)}67%{transform:translateY(3px)}}
@keyframes sw{0%,100%{transform:translateX(0)}50%{transform:translateX(1px)}}
@keyframes fa{0%,100%{opacity:1}50%{opacity:0}}
@keyframes fb{0%,100%{opacity:0}50%{opacity:1}}
@keyframes spark{0%{opacity:0;transform:translate(0,0)}20%{opacity:1}100%{opacity:0;transform:translate(3px,-12px)}}
@keyframes fire{0%{opacity:.8}25%{opacity:1}50%{opacity:.7}75%{opacity:.95}}
@keyframes crab{from{transform:translateX(0)}to{transform:translateX(34px)}}
@media (prefers-reduced-motion:reduce){.tw,.glow,.c1,.c2,.gl,.boat,.wv,.wv2,.sw,.fa,.fb,.sp,.fire,.crab{animation:none}.fb{opacity:0}}
`

export function buildScene() {
  const rand = rng(19)
  let out = ''

  // The night sky in bands, then stars.
  ;['#070b1e', '#0a1030', '#0f1a42', '#162556', '#1f3366', '#2a4378'].forEach((c, i) => {
    out += rect(0, i * 9, W, 9, c)
  })
  for (let i = 0; i < 80; i++) {
    const x = Math.floor(rand() * W)
    const y = Math.floor(rand() * rand() * 50)
    const c = rand() < 0.2 ? '#fff0c4' : '#cdd8ff'

    out += rand() < 0.3 ? rect(x, y, 1, 1, c, ` class="tw" style="--o:.8;animation-delay:${(-rand() * 4).toFixed(1)}s"`) : rect(x, y, 1, 1, c, ' opacity=".7"')
  }

  // The moon, with a soft halo.
  out += `<g class="glow">${disc(152, 17, 15, '#9fb4ff', ' opacity=".10"')}${disc(152, 17, 11, '#b9c6ff', ' opacity=".14"')}</g>` + disc(152, 17, 8, '#ece6c6') + rect(149, 13, 3, 2, '#cfc8a4') + rect(155, 18, 3, 3, '#cfc8a4') + rect(148, 20, 2, 2, '#d9d2b0')

  // Dark clouds, edged by the moon.
  const cloud = rows => sprite(0, 0, rows, { w: '#26346a', s: '#1a2552' })

  out += `<g class="c1"><g transform="translate(8 14)">${cloud(['....www.....', '..wwwwwww...', '.wwwwwwwwww.', 'wwwwwwwwwwww', '.ssssssssss.'])}</g></g>`
  out += `<g class="c2"><g transform="translate(-60 30)">${cloud(['...www....', '.wwwwwww..', 'wwwwwwwwww', '.sssssss..'])}</g></g>`

  // The sea, banded darker toward us, with the moon's path of glitter.
  ;['#12306a', '#0f2a5e', '#0c2452', '#0a1f48', '#081a3e'].forEach((c, i) => {
    out += rect(0, SEA + i * 5, W, 5, c)
  })
  out += rect(0, SEA, W, 1, '#4a6cb0')
  out += rect(142, SEA + 1, 20, 24, '#9fb4ff', ' opacity=".06"')
  for (let i = 0; i < 46; i++) {
    const near = i < 30
    const x = near ? 140 + Math.floor(rand() * 24) : Math.floor(rand() * (W - 3))
    const y = SEA + 2 + Math.floor(rand() * 22)

    out += rect(x, y, near ? 3 : 2, 1, near ? '#f4f0d0' : '#8aa4e0', ` class="gl" style="--o:${near ? 0.9 : 0.5};animation-delay:${(-rand() * 3).toFixed(1)}s;animation-duration:${(2 + rand() * 3).toFixed(1)}s"`)
  }

  // A boat with a lantern.
  out += `<g class="boat"><g transform="translate(0 41)">${sprite(0, 0, ['...w....', '..ww....', '.www..r.', 'wwww..rr', 'wwww....', 'dddddddd', '.dddddd.'], { w: '#9fb0d8', d: '#20182a', r: '#6a2a3a' })}${rect(0, 3, 1, 1, '#ffd870')}${rect(-1, 2, 3, 3, '#ffd870', ' opacity=".25"')}</g></g>`

  // Sand under the moon, then slow foam in two rows.
  out += rect(0, SAND, W, H - SAND, '#4a4c6a') + rect(0, SAND + 10, W, H - SAND - 10, '#42445f') + rect(0, SAND + 20, W, H - SAND - 20, '#3a3c56')
  out += rect(0, SAND, W, 3, '#5a5c7e', ' opacity=".7"')
  out += `<g class="wv">${rect(0, SAND - 2, W, 2, '#a8c0ea')}${rect(0, SAND - 4, W, 1, '#5a78b0')}</g><g class="wv2">${rect(0, SAND - 6, W, 1, '#7a96c8', ' opacity=".7"')}${rect(0, SAND - 3, W, 1, '#a8c0ea', ' opacity=".5"')}</g>`
  for (let i = 0; i < 50; i++) {
    out += rect(Math.floor(rand() * (W - 1)), SAND + 4 + Math.floor(rand() * 24), 1, 1, '#2a2c44', ' opacity=".7"')
  }

  // Palms in silhouette at the sides.
  out += palm(14, 102, 44, 1) + palm(176, 100, 34, -1)

  // A campfire at the right, with its glow on the sand and rising sparks.
  out += `<g class="fire">${rect(120, 92, 54, 12, '#ff8a2a', ' opacity=".07"')}${rect(130, 94, 34, 8, '#ffb347', ' opacity=".09"')}</g>`
  out += rect(142, 99, 12, 2, '#3a2418') + rect(144, 98, 8, 1, '#4a2e1c') + rect(140, 100, 4, 2, '#2a1810') + rect(152, 100, 4, 2, '#2a1810')
  out += `<g class="fa">${sprite(144, 91, ['..o..', '.ooo.', '.oyo.', 'ooyoo', 'oywyo', '.oyo.'], { o: '#ff7a1f', y: '#ffd23d', w: '#fff3c0' })}</g>`
  out += `<g class="fb">${sprite(144, 91, ['.....', '..o..', '.ooo.', 'ooyoo', 'oywyo', '.oyo.'], { o: '#ff7a1f', y: '#ffd23d', w: '#fff3c0' })}</g>`
  for (let i = 0; i < 5; i++) {
    out += `<g class="sp" style="animation-delay:${(-i * 0.5).toFixed(1)}s">${rect(146 + (i % 3) * 2, 90, 1, 1, '#ffd23d')}</g>`
  }
  out += rect(128, 100, 8, 2, '#1a1c30') + rect(129, 99, 6, 1, '#1a1c30') + rect(160, 101, 7, 2, '#1a1c30')

  // Shells, a starfish and the crab.
  out += sprite(26, 98, ['..o..', 'ooooo', '.ooo.', 'oo.oo'], { o: '#c0623a' }) + rect(48, 102, 2, 1, '#8a8ca8') + rect(104, 99, 2, 1, '#8a8ca8')
  out += `<g class="crab"><g transform="translate(60 96)">${sprite(0, 0, ['r.rrr.r', '.rrrrr.', 'r.r.r.r'], { r: '#c0503e' })}${rect(1, -1, 1, 1, '#e8ecff')}${rect(5, -1, 1, 1, '#e8ecff')}</g></g>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges"><style>${CSS}</style>${out}</svg>`
}
