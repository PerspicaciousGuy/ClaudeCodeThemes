// Halloween Night: an original scene of a haunted hill on Halloween. A huge
// orange moon, a crooked manor with flickering windows, a bare tree, bats
// crossing the sky, ghosts drifting, jack-o'-lanterns glowing along the ground
// and fog rolling between the gravestones.
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
.bat{animation:bat var(--d,40s) linear infinite;animation-delay:var(--l,0s)}
.flap{animation:flap .5s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center}
.ghost{animation:ghost var(--d,9s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.flick{animation:flick var(--d,1.8s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.fog{animation:fog var(--d,80s) ease-in-out infinite alternate}
.cloud{animation:fog 100s ease-in-out infinite alternate-reverse}
.tw{animation:flick var(--d,4s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
@keyframes bat{from{transform:translateX(-120px)}to{transform:translateX(1760px)}}
@keyframes flap{from{transform:scaleY(1)}to{transform:scaleY(.35)}}
@keyframes ghost{from{transform:translate(-30px,0)}to{transform:translate(30px,-26px)}}
@keyframes flick{from{opacity:.55}to{opacity:1}}
@keyframes fog{from{transform:translateX(-150px)}to{transform:translateX(170px)}}
@media (prefers-reduced-motion:reduce){.bat,.flap,.ghost,.flick,.fog,.cloud,.tw{animation:none}}
`

// A jack-o'-lantern: a ribbed orange body, a stalk and a lit face.
function pumpkin(x, y, s, rand) {
  const face = `<polygon points="-26,-6 -12,-24 -4,-6" fill="#ffe060"/><polygon points="26,-6 12,-24 4,-6" fill="#ffe060"/><polygon points="-6,6 6,6 0,16" fill="#ffe060"/><path d="M-30 20 L-22 30 L-12 20 L-2 32 L8 20 L18 30 L30 20 Q 0 44 -30 20 Z" fill="#ffe060"/>`

  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="58" ry="46" fill="#ee6a14"/><ellipse cx="-26" cy="0" rx="26" ry="45" fill="#ff8a24"/><ellipse cx="26" cy="0" rx="26" ry="45" fill="#d8560e"/><ellipse cx="0" cy="0" rx="22" ry="46" fill="#f87a1c"/><path d="M-6 -46 Q 0 -66 12 -62 L8 -46 Z" fill="#3a5a1a"/><g class="flick" style="--d:${(1.2 + rand() * 1.4).toFixed(1)}s;--l:${(-rand() * 2).toFixed(1)}s"><circle r="70" fill="url(#pg)"/>${face}</g></g>`
}

export function buildScene() {
  const rand = rng(31)
  const defs =
    vgrad('sky', [[0, '#0a0618'], [0.5, '#2a1040'], [0.85, '#6a2440'], [1, '#a8442c']]) +
    rgrad('halo', '#ff9a3a', 0.8) +
    rgrad('pg', '#ffa028', 0.7) +
    rgrad('mi', '#9a8ac0', 0.4) +
    vgrad('hill', [[0, '#150c24'], [1, '#08040f']])

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  for (let g = 0; g < 5; g++) {
    let st = ''

    for (let i = 0; i < 12; i++) {
      st += `<circle cx="${Math.round(rand() * W)}" cy="${Math.round(rand() * rand() * 400)}" r="${(0.7 + rand() * 1.2).toFixed(1)}" fill="#f4e8ff" opacity="${(0.45 + rand() * 0.4).toFixed(2)}"/>`
    }
    out += `<g class="tw" style="--d:${(3 + rand() * 3).toFixed(1)}s;--l:${(-rand() * 5).toFixed(1)}s">${st}</g>`
  }

  // The moon: huge, with craters and a halo.
  out += `<circle cx="1120" cy="300" r="440" fill="url(#halo)" opacity=".55"/><circle cx="1120" cy="300" r="170" fill="#ffa43a"/><circle cx="1070" cy="260" r="34" fill="#e8841e" opacity=".55"/><circle cx="1170" cy="340" r="44" fill="#e8841e" opacity=".45"/><circle cx="1150" cy="240" r="20" fill="#e8841e" opacity=".5"/>`

  // Dark clouds crossing the moon.
  out += `<g class="cloud"><g fill="#1a0c2a" opacity=".7"><ellipse cx="900" cy="250" rx="300" ry="24"/><ellipse cx="1300" cy="380" rx="240" ry="20"/><ellipse cx="500" cy="160" rx="260" ry="20"/></g></g>`

  // Bats.
  for (let i = 0; i < 6; i++) {
    const y = 90 + Math.round(rand() * 300)
    const s = 0.7 + rand() * 0.8

    out += `<g class="bat" style="--d:${(32 + rand() * 30).toFixed(0)}s;--l:${(-rand() * 50).toFixed(0)}s"><g transform="translate(0 ${y}) scale(${s.toFixed(2)})"><g class="flap" style="animation-delay:${(-rand() * 0.5).toFixed(2)}s"><path d="M-30 -4 Q -18 -22 -8 -4 Q -4 -10 0 -6 Q 4 -10 8 -4 Q 18 -22 30 -4 Q 18 0 12 10 Q 6 2 0 8 Q -6 2 -12 10 Q -18 0 -30 -4 Z" fill="#0a0414"/></g></g></g>`
  }

  // The far hill, with the manor on it.
  out += `<path d="M0 700 C 200 650 380 690 560 660 C 700 636 760 690 900 700 C 1100 730 1300 780 1620 760 L1620 900 L0 900 Z" fill="url(#hill)"/>`
  out += `<g fill="#0c0618"><rect x="130" y="470" width="260" height="190"/><polygon points="110,472 260,380 410,472"/><rect x="170" y="330" width="40" height="120"/><polygon points="160,332 190,296 220,332"/><rect x="320" y="360" width="34" height="100"/><polygon points="312,362 337,330 362,362"/><rect x="95" y="520" width="45" height="140"/><polygon points="88,522 118,480 148,522"/></g>`
  out += `<g class="flick" style="--d:1.4s"><rect x="160" y="520" width="26" height="40" fill="#ffc860"/></g><g class="flick" style="--d:2.1s;--l:-.7s"><rect x="236" y="500" width="26" height="40" fill="#ffc860"/></g><g class="flick" style="--d:1.7s;--l:-1.2s"><rect x="320" y="530" width="26" height="40" fill="#ff9a3a"/></g><g class="flick" style="--d:2.6s;--l:-.3s"><rect x="253" y="396" width="14" height="22" fill="#ffc860"/></g>`

  // A bare, crooked tree on the right.
  out += `<g stroke="#0a0414" stroke-width="14" stroke-linecap="round" fill="none"><path d="M1380 760 Q 1370 640 1400 560 Q 1420 480 1380 400"/><path d="M1396 580 Q 1460 540 1500 470 M1400 520 Q 1330 490 1300 420 M1384 440 Q 1430 400 1440 340 M1390 640 Q 1330 610 1290 590 M1398 560 Q 1480 590 1540 560"/></g><g stroke="#0a0414" stroke-width="6" stroke-linecap="round" fill="none"><path d="M1500 470 q 20 -20 20 -50 M1300 420 q -20 -20 -16 -50 M1440 340 q 20 -14 30 -40"/></g>`

  // Ground, fog, tombstones.
  out += `<path d="M0 900 L0 790 C 300 770 600 805 900 788 C 1200 770 1450 800 1600 780 L1600 900 Z" fill="#08040f"/>`
  out += `<g class="fog"><ellipse cx="800" cy="790" rx="1000" ry="60" fill="url(#mi)"/></g>`

  for (const [x, y, h] of [[1060, 800, 70], [1130, 812, 54], [1210, 806, 80], [1270, 818, 50]]) {
    out += `<path d="M${x - 22} ${y} V${y - h + 18} Q ${x - 22} ${y - h} ${x} ${y - h} Q ${x + 22} ${y - h} ${x + 22} ${y - h + 18} V${y} Z" fill="#1a1228"/><path d="M${x - 10} ${y - h + 24} H${x + 10} M${x} ${y - h + 14} V${y - h + 36}" stroke="#2c2040" stroke-width="3"/>`
  }

  // Ghosts floating.
  for (const [x, y, s, l] of [[560, 520, 1, 0], [760, 640, 0.7, -3], [1000, 470, 0.85, -6]]) {
    out += `<g class="ghost" style="--d:${(7 + rand() * 4).toFixed(1)}s;--l:${l}s"><g transform="translate(${x} ${y}) scale(${s})"><path d="M-40 60 V-10 Q -40 -60 0 -60 Q 40 -60 40 -10 V60 Q 28 46 20 60 Q 10 46 0 60 Q -10 46 -20 60 Q -28 46 -40 60 Z" fill="#f0eaff" opacity=".75"/><ellipse cx="-14" cy="-16" rx="7" ry="11" fill="#2a1c3a"/><ellipse cx="14" cy="-16" rx="7" ry="11" fill="#2a1c3a"/><ellipse cx="0" cy="12" rx="8" ry="11" fill="#2a1c3a"/></g></g>`
  }

  // Jack-o'-lanterns along the bottom.
  for (const [x, y, s] of [[130, 850, 1.1], [330, 872, 0.8], [600, 860, 0.7], [1120, 868, 0.75], [1330, 850, 1.2], [1500, 870, 0.85]]) {
    out += pumpkin(x, y, s, rand)
  }

  return svg(defs, CSS, out)
}
