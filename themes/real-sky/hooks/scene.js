// Real Sky: a lakeside view whose sky is the sky outside right now. The sun
// crosses from sunrise at 6:00 to sunset at 18:00 by your clock; at night the
// moon crosses in its real phase for today's date, with stars and its reflection
// in the lake. A slot is half an hour of the day, 0 to 47, and the phase is 0 to 7.
// Vector art on a 1600x900 canvas.
// Pure SVG + CSS animation: no script, nothing loaded.

const W = 1600
const H = 900

function rng(seed) {
  let s = seed >>> 0

  return () => {
    s = (s * 1664525 + 1013904223) >>> 0

    return s / 4294967296
  }
}

const CSS = `
.tw{animation:tw var(--d,4s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.drift{animation:drift var(--d,110s) ease-in-out infinite alternate}
.ripple{animation:ripple var(--d,6s) ease-in-out infinite alternate;animation-delay:var(--l,0s);transform-box:fill-box;transform-origin:center}
.bird{animation:bird var(--d,70s) linear infinite;animation-delay:var(--l,0s)}
@keyframes tw{from{opacity:.35}to{opacity:1}}
@keyframes drift{from{transform:translateX(-120px)}to{transform:translateX(140px)}}
@keyframes ripple{from{transform:scaleX(.85)}to{transform:scaleX(1.1)}}
@keyframes bird{from{transform:translateX(-120px)}to{transform:translateX(1760px)}}
@media (prefers-reduced-motion:reduce){.tw,.drift,.ripple,.bird{animation:none}}
`

// Sky colors across the day: [hour, top, bottom].
const KEYS = [
  [0, '#050818', '#0d1535'],
  [4.5, '#0a1236', '#2a2050'],
  [6, '#5a4a8a', '#f09a6a'],
  [7.5, '#5a9ad8', '#f6d8a8'],
  [12, '#3a8ae0', '#c4e6f8'],
  [16.5, '#4a8ad0', '#f4d8a0'],
  [18, '#4a3a7a', '#f08a5a'],
  [19.5, '#0f1840', '#503a6a'],
  [21, '#060a22', '#101a3c'],
  [24, '#050818', '#0d1535'],
]

const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16))
const toHex = rgb => '#' + rgb.map(n => Math.round(n).toString(16).padStart(2, '0')).join('')
const mix = (a, b, k) => toHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * k))

function sky(h) {
  for (let i = 1; i < KEYS.length; i++) {
    if (h <= KEYS[i][0]) {
      const [h0, a0, b0] = KEYS[i - 1]
      const [h1, a1, b1] = KEYS[i]
      const k = (h - h0) / (h1 - h0)

      return [mix(a0, a1, k), mix(b0, b1, k)]
    }
  }

  return [KEYS[0][1], KEYS[0][2]]
}

// The moon in a phase 0 (new) to 7 (waning crescent), as a lit shape over a dark disc.
function moon(cx, cy, r, phase) {
  const a = (phase / 8) * Math.PI * 2
  const rx = Math.max(1, Math.abs(Math.cos(a)) * r)
  const dark = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#2a3252"/>`

  if (phase === 0) {
    return dark
  }
  if (phase === 4) {
    return `${dark}<circle cx="${cx}" cy="${cy}" r="${r}" fill="#eef2ff"/>`
  }

  const waxing = a < Math.PI
  const crescent = Math.cos(a) > 0
  const limb = waxing ? 1 : 0
  const term = waxing ? (crescent ? 0 : 1) : crescent ? 1 : 0

  return `${dark}<path d="M${cx} ${cy - r} A ${r} ${r} 0 0 ${limb} ${cx} ${cy + r} A ${rx.toFixed(1)} ${r} 0 0 ${term} ${cx} ${cy - r} Z" fill="#eef2ff"/>`
}

/**
 * @param {number} slot half hours since midnight, 0 to 47
 * @param {number} phase the moon's phase, 0 (new) to 7
 */
export function buildLive(slot, phase = 4) {
  const rand = rng(29)
  const h = Math.max(0, Math.min(47, Math.round(slot))) / 2
  const [top, bot] = sky(h)
  const isDay = h >= 6 && h <= 18
  const dayT = (h - 6) / 12
  const nightT = ((h - 18 + 24) % 24) / 12
  // Stars show when the sky is dark.
  const dark = h < 5 || h > 20 ? 1 : h < 6.5 ? (6.5 - h) / 1.5 : h > 18.5 ? (h - 18.5) / 1.5 : 0
  let out = ''

  out += `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient>`
  out += `<radialGradient id="sun"><stop offset="0" stop-color="#fff2c8" stop-opacity=".95"/><stop offset="1" stop-color="#ffc878" stop-opacity="0"/></radialGradient>`
  out += `<radialGradient id="mg"><stop offset="0" stop-color="#e8eeff" stop-opacity=".55"/><stop offset="1" stop-color="#e8eeff" stop-opacity="0"/></radialGradient></defs>`
  out += `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  if (dark > 0) {
    let stars = ''

    for (let i = 0; i < 80; i++) {
      stars += `<circle cx="${Math.round(rand() * W)}" cy="${Math.round(rand() * rand() * 540)}" r="${(0.7 + rand() * 1.4).toFixed(1)}" fill="#eef0ff"/>`
    }
    out += `<g opacity="${dark.toFixed(2)}"><g class="tw">${stars}</g></g>`
  }

  // The sun by day, or the moon by night, on an arc from the left horizon to the right.
  let bx = 0
  let by = 9999

  if (isDay) {
    bx = 140 + dayT * 1320
    by = 580 - Math.sin(dayT * Math.PI) * 430
    out += `<circle cx="${bx.toFixed(0)}" cy="${by.toFixed(0)}" r="300" fill="url(#sun)"/><circle cx="${bx.toFixed(0)}" cy="${by.toFixed(0)}" r="58" fill="#fff6d8"/>`
  } else if (nightT >= 0 && nightT <= 1) {
    bx = 140 + nightT * 1320
    by = 580 - Math.sin(nightT * Math.PI) * 430
    out += `<circle cx="${bx.toFixed(0)}" cy="${by.toFixed(0)}" r="210" fill="url(#mg)"/>${moon(Math.round(bx), Math.round(by), 44, phase)}`
  }

  // Clouds, thinner at night.
  out += `<g class="drift"><g fill="${mix('#ffffff', bot, 0.4)}" opacity="${(0.5 - dark * 0.3).toFixed(2)}"><ellipse cx="360" cy="200" rx="230" ry="28"/><ellipse cx="500" cy="232" rx="180" ry="22"/><ellipse cx="1180" cy="160" rx="260" ry="26"/></g></g>`

  // Hills tinted by the sky, a lake and pines.
  const far = mix(bot, '#1a2a3a', 0.55)
  const near = mix(bot, '#0c1a22', 0.75)

  out += `<path d="M0 640 C 220 560 420 600 640 590 C 880 580 1060 520 1300 560 C 1440 584 1540 570 1600 560 L1600 700 L0 700 Z" fill="${far}"/>`
  out += `<path d="M0 690 C 300 640 600 690 900 676 C 1160 664 1400 690 1600 666 L1600 900 L0 900 Z" fill="${near}"/>`
  out += `<rect x="0" y="700" width="${W}" height="200" fill="${mix(bot, '#102030', 0.6)}"/>`

  // The reflection of whatever is up there.
  if (by < 640) {
    for (let i = 0; i < 9; i++) {
      out += `<g class="ripple" style="--d:${(4 + rand() * 4).toFixed(1)}s;--l:${(-rand() * 4).toFixed(1)}s"><ellipse cx="${(bx + (rand() - 0.5) * 80).toFixed(0)}" cy="${716 + i * 20}" rx="${40 + i * 8}" ry="3" fill="${isDay ? '#ffe8b8' : '#cdd8f4'}" fill-opacity="${isDay ? 0.4 : 0.3}"/></g>`
    }
  }

  const pine = (x, base, ph, c) => {
    let p = `<rect x="${x - 7}" y="${base - 20}" width="14" height="30" fill="${c}"/>`

    for (let i = 0; i < 5; i++) {
      const w = ph * (0.32 - i * 0.05)
      const y = base - 16 - i * ph * 0.18

      p += `<polygon points="${x - w},${y} ${x},${(y - ph * 0.28).toFixed(0)} ${x + w},${y}" fill="${c}"/>`
    }

    return p
  }

  for (const [x, b, ph] of [[110, 770, 380], [260, 780, 270], [400, 770, 200], [1500, 780, 340], [1380, 790, 230]]) {
    out += pine(x, b, ph, mix(bot, '#06100c', 0.88))
  }

  // Birds in the day.
  if (isDay) {
    for (let i = 0; i < 3; i++) {
      out += `<g class="bird" style="--d:${(60 + rand() * 30).toFixed(0)}s;--l:${(-rand() * 60).toFixed(0)}s"><path d="M0 ${230 + i * 40} q 10 -10 20 0 q 10 -10 20 0" fill="none" stroke="#2a2a3a" stroke-width="3" stroke-linecap="round"/></g>`
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><style>${CSS}</style>${out}</svg>`
}

// The still picture the gallery and the previews use: a waxing gibbous moon at 21:00.
export function buildScene() {
  return buildLive(42, 3)
}
