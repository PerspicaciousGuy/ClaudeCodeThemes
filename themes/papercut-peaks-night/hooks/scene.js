// Papercut Peaks: an original layered paper-cut landscape. Five sheets of
// colored paper, each with a soft shadow on the one behind, drifting a little
// against each other. The valley dips under the reading column.
// Vector art on a 1600x900 canvas. Pure SVG + CSS animation: no script.

const NIGHT = true

const W = 1600
const H = 900

const PAL = NIGHT
  ? { sky: ['#141a38', '#2a2d58'], layers: ['#3a3a72', '#2e2e64', '#232356', '#1a1a47', '#11112f'], shadow: 0.38, body: '#f7ebc8', cloud: '#4a4a86', bird: '#c9c6e8' }
  : { sky: ['#f8efdc', '#f4dcc0'], layers: ['#f3cba4', '#ec9f80', '#d0777f', '#92607e', '#524366'], shadow: 0.17, body: '#fff6e2', cloud: '#ffffff', bird: '#524366' }

function rng(seed) {
  let s = seed >>> 0

  return () => {
    s = (s * 1664525 + 1013904223) >>> 0

    return s / 4294967296
  }
}

function smooth(a, b, v) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)))

  return t * t * (3 - 2 * t)
}

const away = x => Math.max(1 - smooth(300, 560, x), smooth(1040, 1300, x))

// A ridge from a few sines, valley-shaped under the column.
function ridge(base, amp, seed, dip) {
  const r = rng(seed)
  const f = [0, 1, 2].map(() => [r() * 6, 0.004 + r() * 0.012])

  return x => {
    let v = 0

    f.forEach(([p, k], i) => {
      v += Math.sin(x * k * (i + 1) + p) / (i + 1)
    })

    return base - amp * (0.55 + 0.45 * v) * (0.4 + 0.6 * away(x)) + dip * (1 - away(x))
  }
}

function sheet(fn, fill, shadow, cls) {
  let d = `M-40 ${H + 40}`

  for (let x = -40; x <= W + 40; x += 20) {
    d += ` L${x} ${Math.round(fn(x))}`
  }
  d += ` L${W + 40} ${H + 40} Z`

  return `<g class="${cls}"><path d="${d}" fill="#000" opacity="${shadow}" transform="translate(0 9)"/><path d="${d}" fill="${fill}"/></g>`
}

function cloud(x, y, s) {
  const puff = `<circle cx="0" cy="0" r="${30 * s}"/><circle cx="${34 * s}" cy="${-14 * s}" r="${38 * s}"/><circle cx="${72 * s}" cy="${2 * s}" r="${30 * s}"/><rect x="${-30 * s}" y="0" width="${132 * s}" height="${30 * s}" rx="${15 * s}"/>`

  return `<g transform="translate(${x} ${y})"><g fill="#000" opacity="${PAL.shadow * 0.7}" transform="translate(0 6)">${puff}</g><g fill="${PAL.cloud}" opacity=".92">${puff}</g></g>`
}

const CSS = `
.l0{animation:sway 17s ease-in-out infinite alternate;--a:6px}
.l1{animation:sway 14s ease-in-out infinite alternate-reverse;--a:9px}
.l2{animation:sway 12s ease-in-out infinite alternate;--a:13px}
.l3{animation:sway 10s ease-in-out infinite alternate-reverse;--a:18px}
.l4{animation:sway 9s ease-in-out infinite alternate;--a:24px}
.c1{animation:drift 120s linear infinite alternate}
.c2{animation:drift 170s linear infinite alternate-reverse}
.bird{animation:fly 38s linear infinite}
.wing{animation:flap .7s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center}
.tw{animation:tw 5s ease-in-out infinite}
@keyframes sway{from{transform:translateX(calc(var(--a) * -1))}to{transform:translateX(var(--a))}}
@keyframes drift{from{transform:translateX(-60px)}to{transform:translateX(140px)}}
@keyframes fly{from{transform:translate(-120px,0)}to{transform:translate(1760px,-80px)}}
@keyframes flap{from{transform:scaleY(1)}to{transform:scaleY(.35)}}
@keyframes tw{0%,100%{opacity:1}50%{opacity:.2}}
@media (prefers-reduced-motion:reduce){.l0,.l1,.l2,.l3,.l4,.c1,.c2,.bird,.wing,.tw{animation:none}}
`

export function buildScene() {
  const r = rng(8)
  let out = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${PAL.sky[0]}"/><stop offset="1" stop-color="${PAL.sky[1]}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#sky)"/>`

  // Sun or moon, as a cut disc with a ring.
  out += `<circle cx="1240" cy="230" r="124" fill="none" stroke="${PAL.body}" stroke-width="3" opacity=".45"/><circle cx="1240" cy="230" r="92" fill="${PAL.body}"/>`
  if (NIGHT) {
    out += `<circle cx="1272" cy="212" r="78" fill="${PAL.sky[1]}" opacity=".0"/>`
    for (let i = 0; i < 40; i++) {
      const x = Math.round(r() * W)
      const y = Math.round(r() * 420)

      out += `<g class="tw" style="animation-delay:${(-r() * 5).toFixed(1)}s" fill="${PAL.body}"><rect x="${x - 1}" y="${y - 5}" width="2" height="10"/><rect x="${x - 5}" y="${y - 1}" width="10" height="2"/></g>`
    }
  } else {
    out += `<g class="c1">${cloud(140, 250, 1.1)}${cloud(680, 160, 0.8)}</g><g class="c2">${cloud(980, 330, 0.9)}${cloud(1380, 120, 0.7)}</g>`
  }

  const layers = [ridge(470, 150, 2, 40), ridge(560, 170, 5, 55), ridge(650, 150, 9, 70), ridge(740, 130, 14, 80), ridge(830, 100, 21, 60)]

  layers.forEach((fn, i) => {
    out += sheet(fn, PAL.layers[i], PAL.shadow, `l${i}`)
  })

  // Birds gliding across.
  for (let i = 0; i < 4; i++) {
    out += `<g class="bird" style="animation-delay:${-i * 9}s"><g transform="translate(0 ${190 + i * 46})"><path class="wing" d="M0 0 Q 9 -9 18 0 Q 27 -9 36 0" fill="none" stroke="${PAL.bird}" stroke-width="3.2" stroke-linecap="round" style="animation-delay:${-i * 0.2}s"/></g></g>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><style>${CSS}</style>${out}</svg>`
}
