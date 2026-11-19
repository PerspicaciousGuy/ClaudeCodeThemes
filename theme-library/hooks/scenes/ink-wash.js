// Ink Wash: an original scene in the manner of a sumi-e painting. Mountains in
// grey washes fade into mist on rice paper, a pine branch reaches in from the
// side, a lone boat rests on still water, birds cross and a red seal marks the
// corner.
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

function svg(defs, css, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${css}</style>${body}</svg>`
}

// A vertical gradient from a list of [offset, color] stops.
function vgrad(id, stops) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a === undefined ? '' : ` stop-opacity="${a}"`}/>`).join('')}</linearGradient>`
}

function rgrad(id, color, inner = 0.7) {
  return `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${inner}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`
}

const CSS = `
.mist1{animation:mist 90s ease-in-out infinite alternate}
.mist2{animation:mist 120s ease-in-out infinite alternate-reverse}
.bird{animation:bird var(--d,70s) linear infinite;animation-delay:var(--l,0s)}
.bob{animation:bob 7s ease-in-out infinite alternate}
.sway{animation:sway 9s ease-in-out infinite alternate;transform-origin:0px 330px}
.rip{animation:rip var(--d,6s) ease-out infinite;animation-delay:var(--l,0s);transform-box:fill-box;transform-origin:center}
@keyframes mist{from{transform:translateX(-140px)}to{transform:translateX(160px)}}
@keyframes bird{from{transform:translateX(-120px)}to{transform:translateX(1760px)}}
@keyframes bob{from{transform:translateY(-3px)}to{transform:translateY(3px)}}
@keyframes sway{from{transform:rotate(-.5deg)}to{transform:rotate(.7deg)}}
@keyframes rip{0%{transform:scale(.3);opacity:.7}100%{transform:scale(1.5);opacity:0}}
@media (prefers-reduced-motion:reduce){.mist1,.mist2,.bird,.bob,.sway,.rip{animation:none}}
`

// A ridge line: a soft jagged outline filled down to the bottom.
function ridge(y, amp, step, rand, fill) {
  const pts = []

  for (let x = -60; x <= W + step + 60; x += step) {
    pts.push([x, y - rand() * amp])
  }

  let d = `M-60 ${H} L${pts[0][0]} ${pts[0][1].toFixed(0)}`

  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1]
    const [x, yy] = pts[i]

    d += ` Q ${px} ${py.toFixed(0)} ${((px + x) / 2).toFixed(0)} ${((py + yy) / 2).toFixed(0)}`
  }

  const last = pts[pts.length - 1]

  return `<path d="${d} L${last[0]} ${last[1].toFixed(0)} L${W + 60} ${H} Z" fill="${fill}"/>`
}

// A tuft of pine needles: lines spreading from a point.
function tuft(x, y, rand, s) {
  let out = ''

  for (let i = 0; i < 11; i++) {
    const a = -Math.PI * 0.95 + (i / 10) * Math.PI * 0.9
    const l = (34 + rand() * 20) * s

    out += `<line x1="${x}" y1="${y}" x2="${(x + Math.cos(a) * l).toFixed(0)}" y2="${(y + Math.sin(a) * l).toFixed(0)}"/>`
  }

  return out
}

export function buildScene() {
  const rand = rng(12)
  const defs =
    vgrad('paper', [[0, '#f3eddd'], [1, '#e6dfcb']]) +
    vgrad('far', [[0, '#a8a8a2'], [1, '#d4d2c8']]) +
    vgrad('mid', [[0, '#7b7a74'], [1, '#c2c0b6']]) +
    vgrad('near', [[0, '#4a4945'], [1, '#9c9a90']]) +
    rgrad('mi', '#f6f1e4', 0.9)

  let out = `<rect width="${W}" height="${H}" fill="url(#paper)"/><circle cx="1130" cy="230" r="96" fill="#e2c9a4"/>`

  out += ridge(520, 190, 90, rand, 'url(#far)')
  out += `<g class="mist1"><ellipse cx="760" cy="560" rx="1000" ry="90" fill="url(#mi)"/></g>`
  out += ridge(640, 170, 110, rand, 'url(#mid)')
  out += `<g class="mist2"><ellipse cx="900" cy="650" rx="1000" ry="80" fill="url(#mi)"/></g>`
  out += ridge(740, 120, 130, rand, 'url(#near)')

  // The water: pale, with a few long brush strokes.
  out += `<rect x="0" y="760" width="${W}" height="140" fill="#e9e3d2"/>`
  for (let i = 0; i < 16; i++) {
    const y = 775 + rand() * 110
    const x = rand() * 1300

    out += `<line x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x + 120 + rand() * 260).toFixed(0)}" y2="${y.toFixed(0)}" stroke="#7d7b74" stroke-opacity="${(0.15 + rand() * 0.2).toFixed(2)}" stroke-width="${(2 + rand() * 3).toFixed(1)}" stroke-linecap="round"/>`
  }
  for (const [x, y, d, l] of [[1180, 830, 6, 0], [1180, 830, 6, -3], [420, 850, 8, -2]]) {
    out += `<ellipse class="rip" cx="${x}" cy="${y}" rx="60" ry="8" fill="none" stroke="#6e6c66" stroke-width="2" style="--d:${d}s;--l:${l}s"/>`
  }

  // A boat with a fisherman in a hat.
  out += `<g class="bob"><path d="M1090 800 Q 1180 830 1290 796 Q 1200 812 1090 800 Z" fill="#2c2b28"/><path d="M1190 802 V744 M1168 744 Q 1190 722 1212 744 Z" stroke="#2c2b28" stroke-width="4" fill="#2c2b28"/><line x1="1215" y1="750" x2="1290" y2="700" stroke="#2c2b28" stroke-width="2"/></g>`

  // A pine branch from the left, dark and loose.
  let br = ''

  br += `<path d="M-20 300 Q 120 280 230 330 T 420 300" fill="none" stroke="#1f1e1c" stroke-width="12" stroke-linecap="round"/><path d="M110 296 Q 200 240 300 250" fill="none" stroke="#1f1e1c" stroke-width="8" stroke-linecap="round"/>`
  br += `<g stroke="#26251f" stroke-width="2" stroke-linecap="round">`
  for (const [x, y, s] of [[230, 330, 1.1], [330, 330, 1], [420, 300, 1.1], [300, 250, 0.9], [200, 268, 0.9], [150, 300, 1], [260, 345, 0.8]]) {
    br += tuft(x, y, rand, s)
  }
  br += `</g>`
  out += `<g class="sway">${br}</g>`

  // Birds crossing.
  for (let i = 0; i < 3; i++) {
    const y = 120 + Math.round(rand() * 120)

    out += `<g class="bird" style="--d:${(60 + rand() * 40).toFixed(0)}s;--l:${(-rand() * 70).toFixed(0)}s"><path d="M0 ${y} q 12 -12 24 0 q 12 -12 24 0" fill="none" stroke="#3a3935" stroke-width="3" stroke-linecap="round"/></g>`
  }

  // The red seal in the corner.
  out += `<g transform="translate(1440 770) rotate(-4)"><rect width="64" height="64" rx="4" fill="#b3261e"/><path d="M14 16 H50 M32 16 V50 M14 34 H50 M16 50 H48" stroke="#f3eddd" stroke-width="5" stroke-linecap="round" fill="none"/></g>`

  return svg(defs, CSS, out)
}
