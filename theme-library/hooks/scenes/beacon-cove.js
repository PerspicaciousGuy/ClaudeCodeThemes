// Beacon Cove: an original pixel-art scene, drawn as SVG on a 192x108 grid and
// tinted by the hour: night, dawn, day and dusk blend into one another, the sun
// and moon travel across the sky, and the lighthouse lamp comes on in the dark.
// Pure SVG + CSS animation: no script, nothing loaded.

const W = 192
const H = 108
const HORIZON = 72

// ---------- palettes, one per phase, blended by the hour ----------

const NIGHT = {
  sky: ['#060919', '#090e26', '#0c1331', '#10193c', '#151f48', '#1a2754', '#203160', '#273b6b', '#304776'],
  sea: ['#14265a', '#112150', '#0e1c45', '#0b173b', '#091331', '#070f29'],
  wave: '#2d4a86',
  far: '#0e1736',
  cape: '#060a18',
  rim: '#18274f',
  tree: '#04070f',
  cloudA: '#2b3a70',
  cloudB: '#33447c',
  cloudOp: 0.7,
  stars: 1,
  stripeA: '#7d849b',
  stripeB: '#4f2a44',
  lamp: 1,
  win: 1,
  fire: 1,
  lantern: '#ffd27a',
  sail: '#0a1024',
}

const DAWN = {
  sky: ['#1c2150', '#2e2a64', '#4a3478', '#6e4084', '#a14f86', '#d0627a', '#ea8470', '#f4a773', '#fbc98a'],
  sea: ['#5d4a86', '#4f4078', '#42366a', '#362c5c', '#2c244e', '#231c40'],
  wave: '#c88aa0',
  far: '#4a3a70',
  cape: '#1d1830',
  rim: '#8a5a7a',
  tree: '#120e20',
  cloudA: '#c47a96',
  cloudB: '#d890a0',
  cloudOp: 0.75,
  stars: 0.25,
  stripeA: '#b8a8b8',
  stripeB: '#7a3a4a',
  lamp: 0.6,
  win: 0.8,
  fire: 0.3,
  lantern: '#ffd9a0',
  sail: '#3a2a48',
}

const DAY = {
  sky: ['#2f78c8', '#3b88d4', '#4a97dd', '#5ba6e4', '#6eb4ea', '#84c2ee', '#9bcff1', '#b4dcf3', '#cbe8f4'],
  sea: ['#3a86c0', '#3279b3', '#2b6da6', '#256199', '#1f568c', '#1a4b7e'],
  wave: '#9fd0f0',
  far: '#6f8fb8',
  cape: '#2c5a40',
  rim: '#6fa05a',
  tree: '#173a2a',
  cloudA: '#ffffff',
  cloudB: '#eef6ff',
  cloudOp: 0.88,
  stars: 0,
  stripeA: '#f0ece0',
  stripeB: '#c0463d',
  lamp: 0.12,
  win: 0.15,
  fire: 0,
  lantern: '#c9d6e0',
  sail: '#f4f0e6',
}

const DUSK = {
  sky: ['#1b1a4a', '#2c2160', '#46286f', '#6a2f76', '#9a3d78', '#c85470', '#e47a5e', '#f2a05a', '#f8c273'],
  sea: ['#7a3f6e', '#683560', '#572c52', '#472444', '#381d37', '#2b162b'],
  wave: '#e9a07a',
  far: '#4a2a5e',
  cape: '#1d1228',
  rim: '#b06070',
  tree: '#120a1a',
  cloudA: '#d27a7a',
  cloudB: '#e29a86',
  cloudOp: 0.75,
  stars: 0.3,
  stripeA: '#c8a8a0',
  stripeB: '#7a3040',
  lamp: 0.9,
  win: 1,
  fire: 0.8,
  lantern: '#ffd27a',
  sail: '#4a2a3a',
}

const TIMELINE = [
  [0, NIGHT],
  [4.75, NIGHT],
  [6.25, DAWN],
  [8.25, DAY],
  [16.25, DAY],
  [17.75, DUSK],
  [19.25, NIGHT],
  [24, NIGHT],
]

function hex(c) {
  return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]
}

function mixHex(a, b, t) {
  const x = hex(a)
  const y = hex(b)

  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('')
}

function lerp(a, b, t) {
  if (typeof a === 'number') {
    return a + (b - a) * t
  }
  if (typeof a === 'string') {
    return mixHex(a, b, t)
  }
  if (Array.isArray(a)) {
    return a.map((v, i) => lerp(v, b[i], t))
  }

  const out = {}

  for (const k of Object.keys(a)) {
    out[k] = lerp(a[k], b[k], t)
  }

  return out
}

export function paletteAt(hour) {
  const h = ((hour % 24) + 24) % 24

  for (let i = 0; i < TIMELINE.length - 1; i++) {
    const [h0, p0] = TIMELINE[i]
    const [h1, p1] = TIMELINE[i + 1]

    if (h >= h0 && h <= h1) {
      return lerp(p0, p1, h1 === h0 ? 0 : (h - h0) / (h1 - h0))
    }
  }

  return NIGHT
}

// ---------- drawing ----------

let rand = rng(11)

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

// A silhouette from a top-edge function, merged into runs of equal height.
function ridge(top, bottom, fill) {
  let out = ''
  let x = 0

  while (x < W) {
    const t = top(x)
    let x2 = x + 1

    while (x2 < W && top(x2) === t) {
      x2++
    }
    if (t < bottom) {
      out += rect(x, t, x2 - x, bottom - t, fill)
    }
    x = x2
  }

  return out
}

function disc(cx, cy, r, fill, extra = '') {
  let out = ''

  for (let dy = -r; dy <= r; dy++) {
    const hw = Math.floor(Math.sqrt(r * r - dy * dy) + 0.5)

    out += rect(cx - hw, cy + dy, hw * 2 + 1, 1, fill, extra)
  }

  return out
}

function sky(P) {
  return P.sky.map((c, i) => rect(0, i * 8, W, 8, c)).join('')
}

function stars(P) {
  let out = ''

  for (let i = 0; i < 90; i++) {
    const x = Math.floor(rand() * W)
    const y = Math.floor(rand() * rand() * 62)
    const c = rand() < 0.2 ? '#fff0c4' : '#cdd8ff'
    const twinkle = rand() < 0.3
    const extra = twinkle ? ` class="tw" style="animation-delay:${(-rand() * 6).toFixed(1)}s"` : ' opacity=".75"'

    out += rect(x, y, 1, 1, c, extra)
  }

  for (const [x, y] of [[22, 9], [74, 17], [118, 8], [170, 40]]) {
    out += `<g class="tw" style="animation-delay:${(-rand() * 6).toFixed(1)}s">`
    out += rect(x, y - 1, 1, 3, '#ffffff') + rect(x - 1, y, 3, 1, '#ffffff')
    out += '</g>'
  }

  return `<g opacity="${P.stars.toFixed(2)}">${out}</g>`
}

// Where a body is on its arc across the sky, 0 at the left horizon, 1 at the right.
function arc(t) {
  const lift = Math.sin(Math.PI * t)

  return { x: Math.round(16 + 160 * t), y: Math.round(70 - 52 * lift), lift }
}

function sunAndMoon(hour) {
  const ts = (hour - 6) / 12
  const tm = ((hour + 6) % 24) / 12
  let out = ''
  let body = null

  if (ts > -0.1 && ts < 1.1) {
    const { x, y, lift } = arc(ts)
    const warm = mixHex('#ff8a3d', '#fff1b8', Math.min(1, Math.max(0, lift * 1.6)))
    const glow = mixHex('#ff9a4a', '#ffe9a8', Math.min(1, Math.max(0, lift * 1.6)))

    out += disc(x, y, 26, glow, ' opacity=".07"') + disc(x, y, 19, glow, ' opacity=".10"') + disc(x, y, 14, glow, ' opacity=".16"')
    out += disc(x, y, 8, warm)
    body = { x, lift, color: warm }
  }
  if (tm > -0.1 && tm < 1.1) {
    const { x, y, lift } = arc(tm)

    out += disc(x, y, 24, '#9fb4ff', ' opacity=".05"') + disc(x, y, 18, '#9fb4ff', ' opacity=".07"') + disc(x, y, 14, '#b9c6ff', ' opacity=".10"')
    out += disc(x, y, 10, '#ece6c6')
    out += rect(x - 4, y - 4, 3, 2, '#cfc8a4') + rect(x + 2, y + 1, 3, 3, '#cfc8a4') + rect(x - 5, y + 3, 2, 2, '#d9d2b0')
    body = { x, lift, color: '#e8e2b8' }
  }

  return { svg: out, body }
}

function cloud(x, y, len, fill) {
  return rect(x + 2, y, len - 4, 1, fill) + rect(x, y + 1, len, 1, fill) + rect(x + 3, y + 2, len - 6, 1, fill)
}

function clouds(P) {
  const a = cloud(6, 30, 26, P.cloudA) + cloud(70, 46, 20, P.cloudA) + cloud(150, 52, 18, P.cloudA)
  const b = cloud(40, 14, 22, P.cloudB) + cloud(112, 38, 28, P.cloudB)

  return `<g opacity="${P.cloudOp.toFixed(2)}"><g class="c1">${a}</g><g class="c2">${b}</g></g>`
}

function farLand(P) {
  const top = x => Math.round(HORIZON - 5 - 4 * Math.sin(x / 15 + 1) - 3 * Math.sin(x / 6 + 2) * (x > 70 ? 1 : 0.4))

  return ridge(top, HORIZON, P.far)
}

function sea(P, body) {
  let out = P.sea.map((c, i) => rect(0, HORIZON + i * 6, W, 6, c)).join('')

  for (let g = 0; g < 4; g++) {
    out += `<g class="w w${g}">`
    for (let i = 0; i < 16; i++) {
      const y = HORIZON + 2 + Math.floor(rand() * 33)
      const len = 3 + Math.floor(rand() * 6)

      out += rect(Math.floor(rand() * (W - len)), y, len, 1, P.wave, ` opacity="${(0.25 + rand() * 0.3).toFixed(2)}"`)
    }
    out += '</g>'
  }

  // The sun's or moon's broken reflection, under whichever is up.
  if (body && body.lift > 0.08) {
    out += `<g opacity="${Math.min(1, body.lift * 1.5).toFixed(2)}">`
    for (let i = 0; i < 14; i++) {
      const y = HORIZON + 1 + i * 2
      const w = 3 + Math.floor(rand() * 9) - Math.floor(i / 5)
      const x = body.x - Math.floor(w / 2) + Math.floor((rand() - 0.5) * 4)

      out += rect(x, y, Math.max(2, w), 1, body.color, ` class="sh" style="animation-delay:${(-rand() * 4).toFixed(1)}s"`)
    }
    out += '</g>'
  }

  return out
}

function boat(P) {
  const hull = rect(0, 0, 7, 1, '#05080f') + rect(1, 1, 5, 1, '#05080f')
  const mast = rect(3, -8, 1, 8, '#05080f')
  const sail = rect(4, -7, 1, 6, P.sail) + rect(5, -5, 1, 4, P.sail) + rect(6, -3, 1, 2, P.sail)
  const lamp = rect(0, -1, 1, 1, '#ffcf6a')

  return `<g class="boat"><g transform="translate(0 ${HORIZON - 1})">${hull}${mast}${sail}${lamp}</g></g>`
}

function seaStack(P) {
  return rect(112, 63, 4, 11, P.cape) + rect(110, 68, 8, 7, P.cape) + rect(111, 66, 1, 1, P.rim)
}

function pine(P, x, base, h) {
  let out = rect(x, base - 2, 1, 2, P.tree)

  for (let i = 0; i < h; i++) {
    const w = 2 * Math.floor(i / 2) + 1

    out += rect(x - Math.floor(w / 2), base - 2 - h + i, w, 1, P.tree)
  }

  return out
}

function capeTop(x) {
  if (x < 48) {
    return 64 + (x % 11 === 0 ? 1 : 0)
  }

  return Math.min(H, 64 + Math.round((x - 48) * 0.95))
}

function cape(P) {
  let out = ridge(capeTop, H, P.cape)

  for (let x = 0; x < W; x++) {
    if (capeTop(x) < H) {
      out += rect(x, capeTop(x), 1, 1, P.rim)
    }
  }

  return out
}

function lighthouse(P) {
  const cx = 34
  const base = 64
  const stripes = [P.stripeA, P.stripeB]
  const trim = '#1a2040'
  let out = ''

  for (let y = 0; y < 28; y++) {
    const w = 8 - Math.floor(y / 14) * 2
    const x = cx - Math.floor(w / 2)

    out += rect(x, base - 1 - y, w, 1, stripes[Math.floor(y / 4) % 2])
    out += rect(x + w - 1, base - 1 - y, 1, 1, '#05080f', ' opacity=".35"')
  }
  out += rect(cx - 1, base - 6, 2, 3, '#05080f')
  out += rect(cx - 5, base - 29, 10, 1, trim)
  out += rect(cx - 3, base - 33, 6, 4, P.lantern, ' class="lamp"')
  out += rect(cx - 3, base - 33, 1, 4, '#05080f', ' opacity=".5"')
  out += rect(cx - 4, base - 34, 8, 1, trim)
  out += rect(cx - 3, base - 35, 6, 1, trim) + rect(cx - 2, base - 36, 4, 1, trim) + rect(cx - 1, base - 37, 2, 1, trim)
  out += rect(cx, base - 38, 1, 1, trim)

  return out
}

function beam(P) {
  const cy = 64 - 31
  const defs =
    '<linearGradient id="bm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff2c0" stop-opacity=".55"/><stop offset="1" stop-color="#fff2c0" stop-opacity="0"/></linearGradient>' +
    '<radialGradient id="gl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd27a" stop-opacity=".6"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>'
  const shape =
    `<g opacity="${P.lamp.toFixed(2)}"><g class="beam"><polygon points="34,${cy - 1} 200,${cy - 11} 200,${cy + 11} 34,${cy + 1}" fill="url(#bm)"/></g>` +
    `<circle class="halo" cx="34" cy="${cy}" r="12" fill="url(#gl)"/></g>`

  return { defs, shape }
}

function cabin(P) {
  let out = rect(8, 59, 9, 5, P.tree)

  for (let i = 0; i < 4; i++) {
    out += rect(7 + i, 58 - i, 11 - i * 2, 1, P.tree)
  }
  out += `<g opacity="${P.win.toFixed(2)}">${rect(10, 60, 2, 2, '#ffb84d', ' class="win"')}</g>` + rect(14, 61, 1, 3, P.cape)

  return out
}

function fireflies(P) {
  let out = ''

  for (let i = 0; i < 14; i++) {
    const x = 3 + Math.floor(rand() * 56)
    const y = 48 + Math.floor(rand() * 17)
    const dx = Math.round((rand() - 0.5) * 12)
    const dy = Math.round((rand() - 0.5) * 8)

    out += rect(x, y, 1, 1, '#d6f58a', ` class="ff" style="--dx:${dx}px;--dy:${dy}px;animation-duration:${(5 + rand() * 6).toFixed(1)}s;animation-delay:${(-rand() * 8).toFixed(1)}s"`)
  }

  return P.fire > 0.02 ? `<g opacity="${P.fire.toFixed(2)}">${out}</g>` : ''
}

const CSS = `
.tw{animation:tw 5s ease-in-out infinite}
.sh{animation:sh 3.4s ease-in-out infinite}
.w{animation:wv 6s ease-in-out infinite alternate}.w1{animation-duration:8s;animation-delay:-2s}.w2{animation-duration:5s;animation-delay:-1s}.w3{animation-duration:9s;animation-delay:-4s}
.c1{animation:cl 110s linear infinite alternate}.c2{animation:cl 160s linear infinite alternate-reverse}
.boat{animation:sail 150s linear infinite}
.beam{transform-origin:34px 33px;animation:beam 14s linear infinite}
.halo{animation:halo 3.5s ease-in-out infinite}
.lamp{animation:halo 3.5s ease-in-out infinite}
.win{animation:flick 4s steps(1,end) infinite}
.ff{animation:ff 7s ease-in-out infinite}
@keyframes tw{0%,100%{opacity:.95}50%{opacity:.2}}
@keyframes sh{0%,100%{opacity:.12}50%{opacity:.55}}
@keyframes wv{from{transform:translateX(-4px)}to{transform:translateX(4px)}}
@keyframes cl{from{transform:translateX(-12px)}to{transform:translateX(40px)}}
@keyframes sail{from{transform:translateX(-14px)}to{transform:translateX(206px)}}
@keyframes beam{0%{transform:scaleX(1)}25%{transform:scaleX(0)}50%{transform:scaleX(-1)}75%{transform:scaleX(0)}100%{transform:scaleX(1)}}
@keyframes halo{0%,100%{opacity:.75}50%{opacity:1}}
@keyframes flick{0%,100%{opacity:1}30%{opacity:.8}34%{opacity:1}72%{opacity:.88}}
@keyframes ff{0%,100%{opacity:0;transform:translate(0,0)}25%{opacity:.9}50%{opacity:.2;transform:translate(var(--dx),var(--dy))}75%{opacity:.9}}
@media (prefers-reduced-motion:reduce){.tw,.sh,.w,.c1,.c2,.boat,.beam,.halo,.lamp,.win,.ff{animation:none}}
`

/** The scene for a local hour, 0 up to 24 (14.5 is half past two). */
export function buildScene(hour) {
  rand = rng(11)

  const P = paletteAt(hour)
  const b = beam(P)
  const sm = sunAndMoon(hour)

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges">` +
    `<defs>${b.defs}</defs><style>${CSS}</style>` +
    sky(P) +
    stars(P) +
    sm.svg +
    clouds(P) +
    farLand(P) +
    sea(P, sm.body) +
    boat(P) +
    seaStack(P) +
    b.shape +
    cape(P) +
    cabin(P) +
    pine(P, 24, 64, 13) +
    pine(P, 2, 64, 11) +
    pine(P, 52, 69, 9) +
    lighthouse(P) +
    fireflies(P) +
    '</svg>'
  )
}
