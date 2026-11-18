// Meadow Hours: an original rolling meadow that follows your clock. Night,
// dawn, day and dusk blend into one another; the sun and moon cross the sky,
// and the meadow fills with fireflies after dark and butterflies by day.
// Vector art on a 1600x900 canvas. `buildScene(hour)` takes the local hour
// (0 up to 24, so 14.5 is half past two).
// Pure SVG + CSS animation: no script, nothing loaded.

const W = 1600
const H = 900

// ---------- palettes, one per phase, blended by the hour ----------

const NIGHT = {
  sky: ['#060a1e', '#101a3c', '#243a64'],
  far: '#1a2a4a',
  mid: '#14213e',
  near: '#0e1a30',
  front: '#0a1424',
  tree: '#08101e',
  cloud: '#2a3a62',
  haze: '#2a3c68',
  stars: 1,
  fire: 1,
  bfly: 0,
  flower: 0.35,
}
const DAWN = {
  sky: ['#4a5c92', '#d69aa0', '#ffd0a0'],
  far: '#8a7aa0',
  mid: '#6a6a88',
  near: '#46547a',
  front: '#2f4260',
  tree: '#243450',
  cloud: '#f0b8b0',
  haze: '#f0c0a8',
  stars: 0.15,
  fire: 0.4,
  bfly: 0,
  flower: 0.7,
}
const DAY = {
  sky: ['#4a9ee0', '#8cc8f0', '#d8f0fa'],
  far: '#8fb8c8',
  mid: '#6aa878',
  near: '#4a9560',
  front: '#357a48',
  tree: '#2a6a3a',
  cloud: '#ffffff',
  haze: '#e4f4f4',
  stars: 0,
  fire: 0,
  bfly: 1,
  flower: 1,
}
const DUSK = {
  sky: ['#3a3a7a', '#c8607a', '#ffb070'],
  far: '#7a5a88',
  mid: '#5a4a72',
  near: '#3a3a60',
  front: '#2a2a4a',
  tree: '#201e3c',
  cloud: '#f0a0a0',
  haze: '#f0a080',
  stars: 0.3,
  fire: 0.6,
  bfly: 0,
  flower: 0.6,
}

const TIMELINE = [
  [0, NIGHT],
  [5, NIGHT],
  [6.5, DAWN],
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

function rng(seed) {
  let s = seed >>> 0

  return () => {
    s = (s * 1664525 + 1013904223) >>> 0

    return s / 4294967296
  }
}

function hill(base, amp, seed, fill) {
  const r = rng(seed)
  const p1 = r() * 6.28
  const p2 = r() * 6.28
  const at = x => base - amp * (0.6 * Math.sin(x / 230 + p1) + 0.4 * Math.sin(x / 97 + p2))
  let d = `M-10 ${H}`

  for (let x = -10; x <= W + 10; x += 16) {
    d += ` L${x} ${at(x).toFixed(0)}`
  }

  return { at, svg: `<path d="${d} L${W + 10} ${H} Z" fill="${fill}"/>` }
}

function cloud(x, y, s, fill) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}"><ellipse cx="0" cy="0" rx="70" ry="22"/><ellipse cx="-44" cy="8" rx="44" ry="18"/><ellipse cx="46" cy="9" rx="50" ry="17"/><ellipse cx="6" cy="-14" rx="40" ry="20"/></g>`
}

// Where a body is on its arc across the sky, 0 at the left horizon, 1 at the right.
function arc(t) {
  const lift = Math.sin(Math.PI * t)

  return { x: Math.round(140 + 1320 * t), y: Math.round(620 - 470 * lift), lift }
}

function bodies(hour) {
  const ts = (hour - 6) / 12
  const tm = ((hour + 6) % 24) / 12
  let out = ''

  if (ts > -0.12 && ts < 1.12) {
    const { x, y, lift } = arc(ts)
    const k = Math.min(1, Math.max(0, lift * 1.6))
    const core = mixHex('#ff9a4a', '#fff6c8', k)
    const halo = mixHex('#ff8a3d', '#ffeeb0', k)

    out += `<radialGradient id="sunh"><stop offset="0" stop-color="${halo}" stop-opacity=".7"/><stop offset=".35" stop-color="${halo}" stop-opacity=".3"/><stop offset="1" stop-color="${halo}" stop-opacity="0"/></radialGradient>`
    out += `<circle cx="${x}" cy="${y}" r="${(380 - 100 * lift).toFixed(0)}" fill="url(#sunh)"/><circle cx="${x}" cy="${y}" r="46" fill="${core}"/>`
  }
  if (tm > -0.12 && tm < 1.12) {
    const { x, y } = arc(tm)

    out += `<radialGradient id="moonh"><stop offset="0" stop-color="#b9c6ff" stop-opacity=".45"/><stop offset="1" stop-color="#b9c6ff" stop-opacity="0"/></radialGradient>`
    out += `<circle cx="${x}" cy="${y}" r="240" fill="url(#moonh)"/><circle cx="${x}" cy="${y}" r="52" fill="#eef2ff"/><circle cx="${x - 14}" cy="${y - 12}" r="9" fill="#cfd8f0"/><circle cx="${x + 16}" cy="${y + 14}" r="12" fill="#cfd8f0"/>`
  }

  return out
}

const CSS = `
.tw{opacity:var(--o,1);animation:tw 5s ease-in-out infinite}
.c1{animation:drift 140s linear infinite}
.c2{animation:drift 200s linear infinite}
.sway{animation:sway 6s ease-in-out infinite alternate}
.fl{animation:sway2 5s ease-in-out infinite alternate}
.ff{animation:ff 9s ease-in-out infinite}
.bf{animation:fly 40s linear infinite}
.wing{animation:flap .5s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center}
@keyframes tw{0%,100%{opacity:var(--o,1)}50%{opacity:calc(var(--o,1)*.25)}}
@keyframes drift{from{transform:translateX(-260px)}to{transform:translateX(1900px)}}
@keyframes sway{from{transform:rotate(-1.4deg)}to{transform:rotate(1.4deg)}}
@keyframes sway2{from{transform:translateX(-3px)}to{transform:translateX(3px)}}
@keyframes ff{0%{opacity:0;transform:translate(0,0)}25%{opacity:1}70%{opacity:.5;transform:translate(16px,-20px)}100%{opacity:0;transform:translate(-10px,-40px)}}
@keyframes fly{0%{transform:translate(-60px,0)}25%{transform:translate(380px,-60px)}50%{transform:translate(800px,20px)}75%{transform:translate(1240px,-50px)}100%{transform:translate(1700px,10px)}}
@keyframes flap{from{transform:scaleX(1)}to{transform:scaleX(.2)}}
@media (prefers-reduced-motion:reduce){.tw,.c1,.c2,.sway,.fl,.ff,.bf,.wing{animation:none}}
`

/** The scene for a local hour, 0 up to 24 (14.5 is half past two). */
export function buildScene(hour) {
  const rand = rng(6)
  const P = paletteAt(hour)
  const defs =
    `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.sky[0]}"/><stop offset=".55" stop-color="${P.sky[1]}"/><stop offset="1" stop-color="${P.sky[2]}"/></linearGradient>` +
    `<linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.haze}" stop-opacity="0"/><stop offset=".6" stop-color="${P.haze}" stop-opacity=".5"/><stop offset="1" stop-color="${P.haze}" stop-opacity="0"/></linearGradient>`

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  // Stars, as dim as the sky is bright.
  let stars = ''

  for (let i = 0; i < 130; i++) {
    const cx = Math.round(rand() * W)
    const cy = Math.round(rand() * rand() * 520)
    const r = (0.5 + rand() * 1.2).toFixed(1)
    const o = (0.4 + rand() * 0.5).toFixed(2)

    stars += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#e8ecff"${rand() < 0.3 ? ` class="tw" style="--o:${o};animation-delay:${(-rand() * 5).toFixed(1)}s"` : ` opacity="${o}"`}/>`
  }
  out += `<g opacity="${P.stars.toFixed(2)}">${stars}</g>`
  out += bodies(hour)

  // Clouds drift across the sky.
  out += `<g class="c1" opacity=".85">${cloud(0, 170, 1.2, P.cloud)}${cloud(-520, 260, 0.8, P.cloud)}</g><g class="c2" opacity=".7" style="animation-delay:-90s">${cloud(-200, 110, 0.9, P.cloud)}${cloud(-900, 300, 1.1, P.cloud)}</g>`

  // Hills, far to near, each paler in the haze.
  const far = hill(600, 70, 3, P.far)
  const mid = hill(660, 60, 8, P.mid)
  const near = hill(740, 52, 13, P.near)
  const front = hill(830, 40, 21, P.front)

  out += far.svg + `<rect x="0" y="480" width="${W}" height="200" fill="url(#haze)"/>` + mid.svg + near.svg

  // A lone tree and a fence on the near hill, at the right.
  const tx = 1330
  const ty = near.at(tx)

  out += `<rect x="${tx - 7}" y="${(ty - 120).toFixed(0)}" width="14" height="${(130).toFixed(0)}" fill="${P.tree}"/>`
  out += `<g class="sway" style="transform-origin:${tx}px ${(ty - 100).toFixed(0)}px"><circle cx="${tx}" cy="${(ty - 170).toFixed(0)}" r="70" fill="${P.tree}"/><circle cx="${tx - 56}" cy="${(ty - 135).toFixed(0)}" r="46" fill="${P.tree}"/><circle cx="${tx + 58}" cy="${(ty - 140).toFixed(0)}" r="48" fill="${P.tree}"/><circle cx="${tx + 8}" cy="${(ty - 218).toFixed(0)}" r="42" fill="${P.tree}"/></g>`
  for (let i = 0; i < 9; i++) {
    const fx = 140 + i * 44

    out += `<rect x="${fx}" y="${(near.at(fx) - 34).toFixed(0)}" width="5" height="34" fill="${P.tree}"/>`
  }
  out += `<path d="M130 ${(near.at(130) - 24).toFixed(0)} L${140 + 8 * 44 + 5} ${(near.at(140 + 8 * 44) - 24).toFixed(0)} M130 ${(near.at(130) - 10).toFixed(0)} L${140 + 8 * 44 + 5} ${(near.at(140 + 8 * 44) - 10).toFixed(0)}" stroke="${P.tree}" stroke-width="4" fill="none"/>`

  out += front.svg

  // Wildflowers in the foreground at both sides, dimmer after dark.
  let flowers = ''

  for (let i = 0; i < 90; i++) {
    const left = i % 2 === 0
    const x = Math.round(left ? rand() * 440 : 1160 + rand() * 440)
    const y = Math.round(front.at(x) + 8 + rand() * (H - front.at(x) - 20))
    const c = ['#ffb3c8', '#ffe27a', '#ffffff', '#c8b0ff'][Math.floor(rand() * 4)]

    flowers += `<g class="fl" style="animation-delay:${(-rand() * 5).toFixed(1)}s"><rect x="${x}" y="${y}" width="2" height="${(8 + rand() * 10).toFixed(0)}" fill="${P.tree}"/><circle cx="${x + 1}" cy="${y}" r="${(2.5 + rand() * 2).toFixed(1)}" fill="${c}"/></g>`
  }
  out += `<g opacity="${P.flower.toFixed(2)}">${flowers}</g>`

  // Butterflies by day.
  let bfly = ''

  for (let i = 0; i < 3; i++) {
    const c = ['#ffb347', '#ff8ab0', '#fff2a0'][i]

    bfly += `<g class="bf" style="animation-delay:${(-i * 13).toFixed(0)}s;animation-duration:${(34 + i * 7).toFixed(0)}s"><g transform="translate(0 ${560 + i * 40})"><g class="wing"><ellipse cx="-5" cy="0" rx="5" ry="4" fill="${c}"/><ellipse cx="5" cy="0" rx="5" ry="4" fill="${c}"/></g><rect x="-1" y="-3" width="2" height="7" fill="${P.tree}"/></g></g>`
  }
  out += `<g opacity="${P.bfly.toFixed(2)}">${bfly}</g>`

  // Fireflies after dark.
  let flies = ''

  for (let i = 0; i < 34; i++) {
    const x = (rand() * W).toFixed(0)
    const y = (560 + rand() * 300).toFixed(0)

    flies += `<g class="ff" style="animation-delay:${(-rand() * 9).toFixed(1)}s;animation-duration:${(6 + rand() * 6).toFixed(1)}s"><circle cx="${x}" cy="${y}" r="7" fill="#d8ff7a" opacity=".2"/><circle cx="${x}" cy="${y}" r="2" fill="#f0ffb0"/></g>`
  }
  out += `<g opacity="${P.fire.toFixed(2)}">${flies}</g>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
