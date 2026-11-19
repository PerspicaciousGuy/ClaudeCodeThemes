// Blueprint: an original scene of an architect's blueprint. A fine grid on deep
// blue paper, with a gear, a house elevation, a beam section and a compass
// drawing that trace themselves in white line, then fade and start again.
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
.draw{stroke-dasharray:1;stroke-dashoffset:1;animation:draw var(--d,24s) ease-in-out infinite;animation-delay:var(--l,0s)}
.turn{animation:turn 70s linear infinite;transform-box:fill-box;transform-origin:center}
.blink{animation:blink 3s ease-in-out infinite alternate}
@keyframes draw{0%{stroke-dashoffset:1}35%{stroke-dashoffset:0}80%{stroke-dashoffset:0}100%{stroke-dashoffset:-1}}
@keyframes turn{to{transform:rotate(360deg)}}
@keyframes blink{from{opacity:.35}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.draw{animation:none;stroke-dashoffset:0}.turn,.blink{animation:none}}
`

// A path or shape that draws itself.
const D = (tag, attrs, l) => `<${tag} ${attrs} pathLength="1" class="draw" style="--l:${l}s"/>`

// A gear outline: teeth around a circle.
function gearPath(cx, cy, r, teeth, depth) {
  const pts = []

  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2
    const w = (Math.PI * 2) / teeth

    for (const [k, rr] of [[0, r], [0.25, r], [0.4, r + depth], [0.65, r + depth], [0.8, r]]) {
      const t = a + w * k

      pts.push(`${(cx + Math.cos(t) * rr).toFixed(1)} ${(cy + Math.sin(t) * rr).toFixed(1)}`)
    }
  }

  return `M${pts.join(' L')} Z`
}

// A dimension line with end ticks and a gap for the figure.
function dim(x1, y1, x2, y2, l) {
  const tick = (x, y) => `M${x - 8} ${y - 8} L${x + 8} ${y + 8}`

  return D('path', `d="M${x1} ${y1} L${x2} ${y2} ${tick(x1, y1)} ${tick(x2, y2)}" fill="none" stroke="#bfe0ff" stroke-width="1.5"`, l)
}

export function buildScene() {
  const rand = rng(7)
  const defs =
    vgrad('bg', [[0, '#14468a'], [1, '#0b2c5a']]) +
    `<pattern id="g1" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#ffffff" stroke-opacity=".08" stroke-width="1"/></pattern>` +
    `<pattern id="g2" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M100 0H0V100" fill="none" stroke="#ffffff" stroke-opacity=".2" stroke-width="1.5"/></pattern>`

  let out = `<rect width="${W}" height="${H}" fill="url(#bg)"/><rect width="${W}" height="${H}" fill="url(#g1)"/><rect width="${W}" height="${H}" fill="url(#g2)"/>`
  const S = 'fill="none" stroke="#e8f4ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"'
  const T = 'fill="none" stroke="#bfe0ff" stroke-width="1.5" stroke-dasharray="1"'

  // Left: a gear with its centre lines and a dimension.
  out += `<g class="turn">${D('path', `d="${gearPath(260, 300, 100, 14, 24)}" ${S}`, 0)}${D('circle', `cx="260" cy="300" r="56" ${S}`, 1)}${D('circle', `cx="260" cy="300" r="22" ${S}`, 2)}</g>`
  out += D('path', 'd="M110 300 H410 M260 150 V450" fill="none" stroke="#bfe0ff" stroke-width="1.5"', 3)
  out += dim(150, 470, 370, 470, 4) + dim(430, 190, 430, 410, 5)

  // Bottom left: a compass drawing, circles and radii.
  out += D('circle', `cx="300" cy="720" r="110" ${S}`, 6) + D('circle', `cx="300" cy="720" r="70" ${S}`, 7) + D('path', 'd="M300 720 L378 642 M300 720 L190 720 M300 720 L260 820" fill="none" stroke="#bfe0ff" stroke-width="1.5"', 8)

  // Right: the elevation of a house.
  out += D('path', `d="M1180 640 V460 L1330 360 L1480 460 V640 Z M1180 460 H1480 M1300 640 V540 H1360 V640 M1210 500 H1270 V560 H1210 Z M1390 500 H1450 V560 H1390 Z" ${S}`, 9)
  out += D('path', `d="M1160 640 H1500" ${S}`, 10) + dim(1180, 690, 1480, 690, 11) + dim(1540, 360, 1540, 640, 12)

  // Top right: an I-beam in section.
  out += D('path', `d="M1260 130 H1440 V160 H1366 V270 H1440 V300 H1260 V270 H1334 V160 H1260 Z" ${S}`, 13) + dim(1260, 330, 1440, 330, 14)

  // The title block, always there, with a blinking mark.
  out += `<rect x="1180" y="770" width="360" height="90" fill="none" stroke="#bfe0ff" stroke-width="2"/><path d="M1180 800 H1540 M1330 770 V860" stroke="#bfe0ff" stroke-width="1.5"/><g class="blink"><rect x="1196" y="780" width="14" height="14" fill="#ffd866"/></g>`

  // Small marks scattered on the paper: crosses where a drafter placed points.
  for (let i = 0; i < 18; i++) {
    const x = 560 + Math.round(rand() * 480)
    const y = 120 + Math.round(rand() * 680)

    out += `<path d="M${x - 5} ${y} H${x + 5} M${x} ${y - 5} V${y + 5}" stroke="#bfe0ff" stroke-opacity=".5" stroke-width="1.2"/>`
  }

  return svg(defs, CSS, out)
}
