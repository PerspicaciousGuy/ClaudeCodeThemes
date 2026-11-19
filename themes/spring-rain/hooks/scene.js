// Spring Rain: an original scene of a soft spring rain. Pale hills, blossoming
// trees with petals coming down, rain streaking through, puddles rippling and a
// pastel sky.
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
.rain{animation:rain var(--d,1.1s) linear infinite;animation-delay:var(--l,0s)}
.rip{animation:rip var(--d,3s) ease-out infinite;animation-delay:var(--l,0s);transform-box:fill-box;transform-origin:center}
.pet{animation:pet var(--d,14s) linear infinite;animation-delay:var(--l,0s)}
.sway{animation:sway var(--d,8s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.mist{animation:mist 90s ease-in-out infinite alternate}
.cloud{animation:mist 120s ease-in-out infinite alternate-reverse}
@keyframes rain{from{transform:translate(0,-80px)}to{transform:translate(-50px,980px)}}
@keyframes rip{0%{transform:scale(.2);opacity:.9}100%{transform:scale(1.4);opacity:0}}
@keyframes pet{0%{transform:translate(0,-30px) rotate(0)}50%{transform:translate(calc(var(--dx,60px) * .6),460px) rotate(180deg)}100%{transform:translate(var(--dx,60px),940px) rotate(360deg)}}
@keyframes sway{from{transform:rotate(-.7deg)}to{transform:rotate(.7deg)}}
@keyframes mist{from{transform:translateX(-120px)}to{transform:translateX(140px)}}
@media (prefers-reduced-motion:reduce){.rain,.rip,.pet,.sway,.mist,.cloud{animation:none}}
`

const PET = 'M0 -7 C 6 -6 7 3 0 8 C -7 3 -6 -6 0 -7 Z'

// A blossoming tree: a dark trunk with boughs and puffs of pink and white bloom.
function bloom(x, base, h, rand, cols) {
  let out = `<path d="M${x - 16} ${base} Q ${x - 10} ${base - h * 0.5} ${x - 5} ${base - h} L${x + 5} ${base - h} Q ${x + 12} ${base - h * 0.5} ${x + 16} ${base} Z" fill="#5a4650"/><path d="M${x} ${base - h * 0.55} l ${-h * 0.3} ${-h * 0.25} M${x} ${base - h * 0.7} l ${h * 0.32} ${-h * 0.2}" stroke="#5a4650" stroke-width="9" stroke-linecap="round" fill="none"/>`

  for (let i = 0; i < 30; i++) {
    const a = rand() * Math.PI * 2
    const r = rand() * h * 0.6

    out += `<circle cx="${(x + Math.cos(a) * r * 1.25).toFixed(0)}" cy="${(base - h - 10 + Math.sin(a) * r * 0.75).toFixed(0)}" r="${(h * (0.1 + rand() * 0.1)).toFixed(0)}" fill="${cols[Math.floor(rand() * cols.length)]}"/>`
  }

  return out
}

export function buildScene() {
  const rand = rng(21)
  const defs =
    `<path id="pt" d="${PET}"/>` +
    vgrad('sky', [[0, '#b8c8d8'], [0.6, '#d8e0e6'], [1, '#e8ece8']]) +
    vgrad('h1', [[0, '#a8c8a8'], [1, '#c8dcc0']]) +
    vgrad('h2', [[0, '#8cb890'], [1, '#aacca0']]) +
    vgrad('gr', [[0, '#7aa87a'], [1, '#5c8a64']]) +
    rgrad('mi', '#f4f6f4', 0.7)
  const pinks = ['#f4b6c8', '#f8cdd8', '#ffe4ea', '#eca0b8']

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  // Slow clouds.
  out += `<g class="cloud"><g fill="#f4f6f8" opacity=".85">`
  for (let i = 0; i < 6; i++) {
    out += `<ellipse cx="${(100 + i * 290 + rand() * 60).toFixed(0)}" cy="${(70 + rand() * 120).toFixed(0)}" rx="${(140 + rand() * 80).toFixed(0)}" ry="${(36 + rand() * 20).toFixed(0)}"/>`
  }
  out += `</g></g>`

  // Hills, soft in the wet air.
  out += `<path d="M0 560 C 260 480 520 540 800 500 C 1080 460 1340 540 1600 490 L1600 900 L0 900 Z" fill="url(#h1)"/>`
  out += `<g class="mist"><ellipse cx="800" cy="560" rx="1000" ry="90" fill="url(#mi)"/></g>`
  out += `<path d="M0 650 C 300 590 560 650 860 610 C 1120 575 1380 640 1600 600 L1600 900 L0 900 Z" fill="url(#h2)"/>`

  // Blossoming trees at the sides.
  for (const [x, h] of [[150, 330], [420, 220], [1180, 240], [1450, 340]]) {
    out += `<g class="sway" style="transform-origin:${x}px 800px;--d:${(7 + rand() * 4).toFixed(1)}s;--l:${(-rand() * 6).toFixed(1)}s">${bloom(x, 800, h, rand, pinks)}</g>`
  }

  // Grass with puddles.
  out += `<path d="M0 900 L0 800 C 300 780 600 815 900 798 C 1200 780 1450 810 1600 796 L1600 900 Z" fill="url(#gr)"/>`

  for (const [x, y, rx] of [[560, 840, 150], [900, 860, 190], [1100, 830, 120], [300, 870, 130]]) {
    out += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${(rx * 0.14).toFixed(0)}" fill="#c4d4e0" opacity=".7"/>`
    for (let k = 0; k < 4; k++) {
      out += `<ellipse class="rip" cx="${x + Math.round((rand() - 0.5) * rx)}" cy="${y + Math.round((rand() - 0.5) * 8)}" rx="${(22 + rand() * 20).toFixed(0)}" ry="5" fill="none" stroke="#f4f8fb" stroke-width="2" style="--d:${(2.4 + rand() * 1.6).toFixed(1)}s;--l:${(-rand() * 4).toFixed(1)}s"/>`
    }
  }

  // Petals coming down.
  for (let i = 0; i < 26; i++) {
    out += `<g class="pet" style="--d:${(12 + rand() * 12).toFixed(1)}s;--l:${(-rand() * 22).toFixed(1)}s;--dx:${Math.round(rand() * 160 - 40)}px"><use href="#pt" transform="translate(${Math.round(rand() * W)} 0) scale(${(0.7 + rand() * 0.7).toFixed(2)})" fill="${pinks[i % pinks.length]}"/></g>`
  }

  // Rain: thin slanted streaks.
  for (let i = 0; i < 90; i++) {
    const x = Math.round(rand() * (W + 200))
    const len = 30 + Math.round(rand() * 40)

    out += `<g class="rain" style="--d:${(0.8 + rand() * 0.7).toFixed(2)}s;--l:${(-rand() * 1.5).toFixed(2)}s"><line x1="${x}" y1="0" x2="${x - 8}" y2="${len}" stroke="#ffffff" stroke-width="${(1 + rand() * 1.2).toFixed(1)}" opacity="${(0.35 + rand() * 0.35).toFixed(2)}" stroke-linecap="round"/></g>`
  }

  return svg(defs, CSS, out)
}
