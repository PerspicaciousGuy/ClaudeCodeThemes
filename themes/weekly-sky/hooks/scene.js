// Weekly Sky: a lakeside cabin under a sky that crosses a whole day as your
// 7-day usage window is used up. At the start of the week the sun is rising on
// the left; it climbs to noon at the middle of the week and sets as you near
// the limit, and the night and its stars arrive when it is reached.
// Stage 0 is sunrise, 11 is night. Vector art on a 1600x900 canvas.
// Pure SVG + CSS animation: no script, nothing loaded.

const W = 1600
const H = 900
const STAGES = 12

function rng(seed) {
  let s = seed >>> 0

  return () => {
    s = (s * 1664525 + 1013904223) >>> 0

    return s / 4294967296
  }
}

const CSS = `
.drift{animation:drift var(--d,110s) ease-in-out infinite alternate}
.tw{animation:tw var(--d,4s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.smoke{animation:smoke var(--d,9s) ease-out infinite;animation-delay:var(--l,0s)}
.ripple{animation:ripple var(--d,6s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.win{animation:tw 5s ease-in-out infinite alternate}
.bird{animation:bird var(--d,70s) linear infinite;animation-delay:var(--l,0s)}
@keyframes drift{from{transform:translateX(-120px)}to{transform:translateX(140px)}}
@keyframes tw{from{opacity:.35}to{opacity:1}}
@keyframes smoke{0%{transform:translate(0,0) scale(.6);opacity:0}15%{opacity:.45}100%{transform:translate(50px,-200px) scale(1.6);opacity:0}}
@keyframes ripple{from{transform:scaleX(.85)}to{transform:scaleX(1.1)}}
@keyframes bird{from{transform:translateX(-120px)}to{transform:translateX(1760px)}}
@media (prefers-reduced-motion:reduce){.drift,.tw,.smoke,.ripple,.win,.bird{animation:none}}
`

// Sky colors over the week: [t, top, bottom].
const KEYS = [
  [0, '#2a3a7a', '#f4a064'],
  [0.12, '#5a8ad0', '#f6d09a'],
  [0.5, '#3a8ae0', '#c4e6f8'],
  [0.82, '#5a4a8a', '#f08a5a'],
  [0.93, '#1a1a4a', '#7a4a6a'],
  [1, '#080c28', '#1c2250'],
]

const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16))
const toHex = rgb => '#' + rgb.map(n => Math.round(n).toString(16).padStart(2, '0')).join('')
const mix = (a, b, k) => toHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * k))

function sky(t) {
  for (let i = 1; i < KEYS.length; i++) {
    if (t <= KEYS[i][0]) {
      const [t0, a0, b0] = KEYS[i - 1]
      const [t1, a1, b1] = KEYS[i]
      const k = (t - t0) / (t1 - t0)

      return [mix(a0, a1, k), mix(b0, b1, k)]
    }
  }

  return [KEYS[KEYS.length - 1][1], KEYS[KEYS.length - 1][2]]
}

/**
 * @param {number} stage 0 (the week begins) to 11 (the limit is reached)
 */
export function buildLive(stage) {
  const rand = rng(17)
  const st = Math.max(0, Math.min(STAGES - 1, Math.round(stage)))
  const t = st / (STAGES - 1)
  const [top, bot] = sky(t)
  const night = Math.max(0, Math.min(1, (t - 0.85) / 0.12))
  const day = Math.sin(Math.min(1, t / 0.9) * Math.PI)
  let out = ''

  out += `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient>`
  out += `<radialGradient id="sun"><stop offset="0" stop-color="#fff2c8" stop-opacity=".95"/><stop offset="1" stop-color="#ffc878" stop-opacity="0"/></radialGradient>`
  out += `<radialGradient id="moon"><stop offset="0" stop-color="#e8eeff" stop-opacity=".6"/><stop offset="1" stop-color="#e8eeff" stop-opacity="0"/></radialGradient>`
  out += `<radialGradient id="lamp"><stop offset="0" stop-color="#ffb860" stop-opacity=".85"/><stop offset="1" stop-color="#ffb860" stop-opacity="0"/></radialGradient></defs>`
  out += `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  // Stars come out as the limit nears.
  if (night > 0) {
    let stars = ''

    for (let i = 0; i < 70; i++) {
      stars += `<circle cx="${Math.round(rand() * W)}" cy="${Math.round(rand() * rand() * 520)}" r="${(0.7 + rand() * 1.4).toFixed(1)}" fill="#eef0ff"/>`
    }
    out += `<g opacity="${night.toFixed(2)}"><g class="tw">${stars}</g></g>`
  }

  // The sun crosses an arc from the left horizon to the right.
  const sx = 120 + t * 1360
  const sy = 560 - Math.sin(Math.min(1, t / 0.9) * Math.PI) * 420

  if (t < 0.93) {
    out += `<circle cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" r="300" fill="url(#sun)"/><circle cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" r="58" fill="#fff6d8"/>`
  }

  // The moon rises over the lake once the limit is reached.
  if (night > 0) {
    out += `<g opacity="${night.toFixed(2)}"><circle cx="1180" cy="200" r="220" fill="url(#moon)"/><path d="M1180 160 A 42 42 0 1 0 1198 240 A 32 42 0 1 1 1180 160 Z" fill="#eef2ff"/></g>`
  }

  // Cloud banks drift across, thinner at night.
  out += `<g class="drift"><g fill="${mix('#ffffff', bot, 0.35)}" opacity="${(0.55 - night * 0.35).toFixed(2)}"><ellipse cx="380" cy="190" rx="230" ry="28"/><ellipse cx="520" cy="222" rx="180" ry="22"/><ellipse cx="1180" cy="150" rx="260" ry="26"/></g></g>`

  // Hills, tinted by the sky.
  const far = mix(bot, '#1a2a3a', 0.55)
  const near = mix(bot, '#0c1a22', 0.75)

  out += `<path d="M0 640 C 220 560 420 600 640 590 C 880 580 1060 520 1300 560 C 1440 584 1540 570 1600 560 L1600 700 L0 700 Z" fill="${far}"/>`
  out += `<path d="M0 690 C 300 640 600 690 900 676 C 1160 664 1400 690 1600 666 L1600 900 L0 900 Z" fill="${near}"/>`

  // The lake with the sun's reflection.
  out += `<rect x="0" y="700" width="${W}" height="200" fill="${mix(bot, '#102030', 0.6)}"/>`
  for (let i = 0; i < 9; i++) {
    out += `<g class="ripple" style="--d:${(4 + rand() * 4).toFixed(1)}s;--l:${(-rand() * 4).toFixed(1)}s;transform-box:fill-box;transform-origin:center"><ellipse cx="${(sx + (rand() - 0.5) * 80).toFixed(0)}" cy="${(716 + i * 20).toFixed(0)}" rx="${(40 + i * 8).toFixed(0)}" ry="3" fill="${t > 0.93 ? '#cdd8f4' : '#ffe8b8'}" fill-opacity="${(0.35 * (1 - night * 0.5)).toFixed(2)}"/></g>`
  }

  // Pines on the left.
  const pine = (x, base, h, c) => {
    let p = `<rect x="${x - 7}" y="${base - 20}" width="14" height="30" fill="${c}"/>`

    for (let i = 0; i < 5; i++) {
      const w = h * (0.32 - i * 0.05)
      const y = base - 16 - i * h * 0.18

      p += `<polygon points="${x - w},${y} ${x},${(y - h * 0.28).toFixed(0)} ${x + w},${y}" fill="${c}"/>`
    }

    return p
  }

  for (const [x, b, h] of [[110, 770, 380], [260, 780, 270], [400, 770, 200], [1500, 780, 340]]) {
    out += pine(x, b, h, mix(bot, '#06100c', 0.88))
  }

  // A cabin on the right shore with a lit window and a thread of smoke.
  const lit = 0.25 + (1 - day) * 0.75

  out += `<g transform="translate(1180 760)"><rect x="-90" y="-80" width="180" height="80" fill="#2a1c18"/><polygon points="-106,-80 0,-150 106,-80" fill="#1a1210"/><rect x="40" y="-150" width="22" height="48" fill="#1a1210"/><g class="win"><circle cx="-34" cy="-40" r="${(60 * lit + 24).toFixed(0)}" fill="url(#lamp)"/><rect x="-52" y="-58" width="36" height="34" fill="#ffc870"/></g><rect x="20" y="-44" width="24" height="44" fill="#14100c"/>`
  for (let i = 0; i < 3; i++) {
    out += `<ellipse class="smoke" cx="52" cy="-158" rx="14" ry="10" fill="#aab0c0" fill-opacity=".4" style="--d:${(8 + i * 2).toFixed(0)}s;--l:${(-i * 3).toFixed(0)}s"/>`
  }
  out += `</g>`

  // A few birds in the day.
  if (day > 0.3) {
    for (let i = 0; i < 3; i++) {
      out += `<g class="bird" style="--d:${(60 + rand() * 30).toFixed(0)}s;--l:${(-rand() * 60).toFixed(0)}s"><path d="M0 ${220 + i * 40} q 10 -10 20 0 q 10 -10 20 0" fill="none" stroke="#2a2a3a" stroke-width="3" stroke-linecap="round"/></g>`
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><style>${CSS}</style>${out}</svg>`
}

// The still picture the gallery and the previews use: the middle of the week.
export function buildScene() {
  return buildLive(6)
}
