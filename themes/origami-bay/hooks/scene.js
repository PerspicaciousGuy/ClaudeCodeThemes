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

// A vertical gradient from a list of [offset, color, opacity?] stops.
function vgrad(id, stops) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a === undefined ? '' : ` stop-opacity="${a}"`}/>`).join('')}</linearGradient>`
}

function rgrad(id, color, inner = 0.7) {
  return `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${inner}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`
}

const r1 = n => Math.round(n * 10) / 10


// A scalloped paper edge: one row of arcs, as a closed shape that runs down off the bottom of the canvas.
function scallop(y, r, offset = 0) {
  let d = `M${-2 * r + offset} ${y}`

  for (let x = -2 * r + offset; x < W + 2 * r; x += 2 * r) {
    d += ` a${r} ${r} 0 0 1 ${2 * r} 0`
  }

  return `${d} L${W + 4 * r} ${H + 40} L${-4 * r} ${H + 40} Z`
}

// One layer of paper: a soft shadow cut from the same shape, then the sheet, then a thin lit edge.
function sheet(y, r, color, edge, drift, dur, delay = 0) {
  const d = scallop(y, r)

  return `<g class="drift" style="--x:${drift}px;--d:${dur}s;--l:${delay}s"><path d="${d}" transform="translate(0 9)" fill="#3a2a10" opacity=".16"/><path d="${d}" fill="${color}"/><path d="${scallop(y + 2, r).replace(/ L.*$/, '')}" fill="none" stroke="${edge}" stroke-width="2.4" opacity=".7"/></g>`
}

// A paper cloud: rounded lumps of white paper with a shadow under them.
function cloud(x, y, s, d) {
  const shape = '<circle cx="-70" cy="6" r="34"/><circle cx="-20" cy="-8" r="46"/><circle cx="40" cy="0" r="38"/><rect x="-104" y="6" width="190" height="34" rx="17"/>'

  return `<g class="cl" style="--d:${d}s"><g transform="translate(${x} ${y}) scale(${s})"><g transform="translate(5 8)" fill="#3a2a10" opacity=".14">${shape}</g><g fill="#fffaf0">${shape}</g></g></g>`
}

// A folded paper crane about 120 wide, nose to the right, wings flapping.
function crane(c, light, dark) {
  return `<g>
<path d="M-34 4 L-60 -16 L-52 -2 L-30 8 Z" fill="${light}"/>
<path d="M-34 4 L0 -10 L30 6 L-2 22 Z" fill="${c}"/>
<path d="M-34 4 L-2 22 L-14 6 Z" fill="${dark}"/>
<path d="M30 6 L52 -24 L57 -19 L36 9 Z" fill="${light}"/>
<path d="M52 -24 L68 -22 L57 -17 Z" fill="${dark}"/>
<g class="wing"><path d="M-6 -4 L-34 -48 L26 -4 Z" fill="${light}"/><path d="M-6 -4 L-34 -48 L-8 -10 Z" fill="${dark}" opacity=".35"/></g>
</g>`
}

// A paper sailboat: a folded hull with two sails.
function boat() {
  return `<g class="bobb">
<g transform="translate(6 10)" fill="#3a2a10" opacity=".16"><path d="M-110 20 L110 20 L80 66 L-80 66 Z"/><path d="M-4 -150 L-4 14 L-96 14 Z M8 -118 L8 14 L84 14 Z"/></g>
<path d="M-110 20 L110 20 L80 66 L-80 66 Z" fill="#c8402f"/>
<path d="M-110 20 L0 20 L-8 66 L-80 66 Z" fill="#e8574b"/>
<path d="M-110 20 L110 20 L104 30 L-104 30 Z" fill="#fffaf0" opacity=".85"/>
<path d="M-4 -150 L-4 14 L-96 14 Z" fill="#fffaf0"/>
<path d="M-4 -150 L-4 14 L-50 14 Z" fill="#eadfc6"/>
<path d="M8 -118 L8 14 L84 14 Z" fill="#f6b89e"/>
<path d="M8 -118 L8 14 L46 14 Z" fill="#ee8f72"/>
<line x1="2" y1="-156" x2="2" y2="20" stroke="#8a6a3a" stroke-width="3" stroke-linecap="round"/>
</g>`
}

export function buildScene() {
  const defs =
    vgrad('sky', [[0, '#f9f2e0'], [1, '#f1e4c8']]) +
    rgrad('warm', '#ffd7b0', 0.55)

  const css = `
.drift{animation:drift var(--d,40s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.cl{animation:cl var(--d,150s) ease-in-out infinite alternate}
.bobb{animation:bobb 6s ease-in-out infinite alternate;transform-origin:0 66px}
.wing{animation:flap 1.3s ease-in-out infinite alternate;transform-origin:-6px -4px}
.fly{animation:fly var(--d,70s) linear infinite;animation-delay:var(--l,0s)}
.hov{animation:hov 5s ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.sun{animation:sun 9s ease-in-out infinite alternate;transform-origin:1230px 230px}
@keyframes drift{from{transform:translateX(calc(var(--x) * -1))}to{transform:translateX(var(--x))}}
@keyframes cl{from{transform:translateX(-120px)}to{transform:translateX(170px)}}
@keyframes bobb{from{transform:rotate(-2deg) translateY(-3px)}to{transform:rotate(2.2deg) translateY(4px)}}
@keyframes flap{from{transform:rotate(-8deg) scaleY(1)}to{transform:rotate(10deg) scaleY(.55)}}
@keyframes fly{from{transform:translateX(-160px)}to{transform:translateX(1780px)}}
@keyframes hov{from{transform:translateY(-8px) rotate(-2deg)}to{transform:translateY(8px) rotate(3deg)}}
@keyframes sun{from{transform:scale(1)}to{transform:scale(1.04)}}
@media (prefers-reduced-motion:reduce){.drift,.cl,.bobb,.wing,.fly,.hov,.sun{animation:none}}
`

  const fly = (y, s, d, l, c, light, dark) => `<g class="fly" style="--d:${d}s;--l:${l}s"><g transform="translate(0 ${y}) scale(${s})"><g class="hov" style="--l:${l}s"><g transform="translate(0 6) " fill="#3a2a10" opacity=".14"><path d="M-34 4 L0 -10 L30 6 L-2 22 Z"/></g>${crane(c, light, dark)}</g></g></g>`

  const sun = `<g class="sun"><circle cx="1230" cy="230" r="230" fill="url(#warm)"/><circle cx="1236" cy="240" r="136" fill="#3a2a10" opacity=".14"/><circle cx="1230" cy="230" r="150" fill="#f7c9a8"/><circle cx="1230" cy="230" r="108" fill="#ee7a5e"/><circle cx="1230" cy="230" r="108" fill="none" stroke="#fff3e0" stroke-width="3" opacity=".5"/></g>`

  const body =
    `<rect width="${W}" height="${H}" fill="url(#sky)"/>` +
    sun +
    cloud(330, 170, 1.15, 160) + cloud(820, 110, 0.85, 190) + cloud(1480, 380, 1, 140) + cloud(120, 420, 0.8, 170) +
    fly(300, 1.35, 78, -12, '#e8574b', '#f0775f', '#c8402f') +
    fly(190, 1.0, 96, -40, '#3f6fb0', '#6f98d0', '#2a4f86') +
    fly(430, 0.8, 110, -75, '#e0a82e', '#f0c455', '#b98618') +
    sheet(590, 34, '#8fd0cf', '#c9ecea', 40, 38) +
    `<g transform="translate(1200 548) scale(1.2)">${boat()}</g>` +
    sheet(650, 40, '#58aec0', '#a4dce6', 56, 44, -10) +
    sheet(730, 46, '#3a86a8', '#86c0d8', 64, 50, -22) +
    sheet(820, 54, '#235f86', '#6aa0c0', 72, 56, -30)

  return svg(defs, css, body)
}
