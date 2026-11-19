// Koi Pond: an original top-down scene of a koi pond at dusk. Koi glide in slow
// loops, lily pads and pink flowers float on dark water, ripples spread and
// petals drift, with stones along the edges.
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
.swim{animation:swim var(--d,60s) linear infinite;animation-delay:var(--l,0s);offset-rotate:auto}
.wig{animation:wig 1.6s ease-in-out infinite alternate;transform-origin:0 0}
.tail{animation:tail 1.1s ease-in-out infinite alternate;transform-origin:-95px 0}
.fin{animation:fin 2s ease-in-out infinite alternate}
.rip{animation:rip var(--d,9s) ease-out infinite;animation-delay:var(--l,0s)}
.bob{animation:bob var(--d,7s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.pet{animation:pet var(--d,60s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
@keyframes swim{from{offset-distance:0%}to{offset-distance:100%}}
@keyframes wig{from{transform:rotate(-4deg)}to{transform:rotate(4deg)}}
@keyframes tail{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}
@keyframes fin{from{transform:rotate(-8deg)}to{transform:rotate(8deg)}}
@keyframes rip{0%{transform:scale(.1);opacity:.7}100%{transform:scale(1);opacity:0}}
@keyframes bob{from{transform:translate(0,0) rotate(-2deg)}to{transform:translate(8px,6px) rotate(3deg)}}
@keyframes pet{from{transform:translate(0,0) rotate(0deg)}to{transform:translate(var(--dx,120px),var(--dy,60px)) rotate(40deg)}}
@media (prefers-reduced-motion:reduce){.swim,.wig,.tail,.fin,.rip,.bob,.pet{animation:none}.rip{opacity:0}}
`

// A koi facing right, about 290 long, in a base color with spots.
function koi(base, spots, fin) {
  const body = 'M100 0 C 90 -20 40 -28 -20 -22 C -60 -18 -85 -8 -100 0 C -85 8 -60 18 -20 22 C 40 28 90 20 100 0 Z'
  const tail = 'M-95 0 C -130 -26 -165 -32 -195 -10 C -175 0 -175 0 -195 10 C -165 32 -130 26 -95 0 Z'
  const sp = spots.map(([x, y, rx, ry, c]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}"/>`).join('')

  return (
    `<g class="tail"><path d="${tail}" fill="${fin}" opacity=".85"/></g>` +
    `<g class="fin" style="transform-origin:50px -18px"><ellipse cx="56" cy="-24" rx="24" ry="9" transform="rotate(-30 56 -24)" fill="${fin}" opacity=".8"/></g>` +
    `<g class="fin" style="transform-origin:50px 18px"><ellipse cx="56" cy="24" rx="24" ry="9" transform="rotate(30 56 24)" fill="${fin}" opacity=".8"/></g>` +
    `<path d="${body}" fill="${base}"/>${sp}<circle cx="82" cy="-9" r="3.5" fill="#101820"/><circle cx="82" cy="9" r="3.5" fill="#101820"/>`
  )
}

function pad(x, y, r, rot, c1, c2) {
  const a = (rot * Math.PI) / 180
  const nx = (x + Math.cos(a) * r).toFixed(1)
  const ny = (y + Math.sin(a) * r).toFixed(1)

  return `<g class="bob" style="--d:${(6 + (x % 5)).toFixed(1)}s;--l:${(-(y % 7)).toFixed(1)}s"><circle cx="${x}" cy="${y}" r="${r}" fill="${c1}"/><circle cx="${x}" cy="${y}" r="${(r * 0.62).toFixed(1)}" fill="${c2}" opacity=".5"/><path d="M${x} ${y} L${nx} ${ny}" stroke="#05161a" stroke-width="${(r * 0.12).toFixed(1)}"/></g>`
}

function lotus(x, y, s) {
  let out = ''

  for (let i = 0; i < 10; i++) {
    out += `<ellipse cx="0" cy="${-26 * s}" rx="${9 * s}" ry="${24 * s}" transform="rotate(${i * 36})" fill="${i % 2 ? '#f6a5c4' : '#fbc4d8'}"/>`
  }

  return `<g class="bob" style="--d:8s"><g transform="translate(${x} ${y})">${out}<circle r="${10 * s}" fill="#f2c94c"/></g></g>`
}

export function buildScene() {
  const rand = rng(23)
  const defs = rgrad('w1', '#1d5f6e', 1) + `<radialGradient id="w0" cx=".5" cy=".5" r=".75"><stop offset="0" stop-color="#17505c"/><stop offset=".6" stop-color="#0d333e"/><stop offset="1" stop-color="#051a22"/></radialGradient>`

  let out = `<rect width="${W}" height="${H}" fill="url(#w0)"/>`

  // Slow light patches on the water.
  for (let i = 0; i < 10; i++) {
    out += `<ellipse cx="${Math.round(rand() * W)}" cy="${Math.round(rand() * H)}" rx="${120 + Math.round(rand() * 200)}" ry="${50 + Math.round(rand() * 90)}" fill="#2a7f8c" opacity=".07"/>`
  }

  // Ripples, spreading from a few places.
  const rips = [[430, 300], [1150, 620], [760, 740], [1280, 230]]

  rips.forEach(([x, y], i) => {
    for (let k = 0; k < 3; k++) {
      out += `<g class="rip" style="transform-origin:${x}px ${y}px;--d:${(9 + i).toFixed(0)}s;--l:${(-i * 2.3 - k * 3).toFixed(1)}s"><circle cx="${x}" cy="${y}" r="150" fill="none" stroke="#9fe0e6" stroke-width="2.5"/></g>`
    }
  })

  // Lily pads and flowers.
  const pads = [[300, 640, 62, 20], [380, 700, 46, 200], [240, 560, 40, 110], [1320, 330, 66, 300], [1400, 410, 44, 60], [1240, 700, 58, 150], [640, 160, 50, 250], [1000, 120, 42, 10], [180, 250, 52, 330]]

  pads.forEach(([x, y, r, rot], i) => {
    out += pad(x, y, r, rot, i % 2 ? '#2f8a4f' : '#3f9a58', '#7fd18a')
  })
  out += lotus(300, 640, 1) + lotus(1320, 330, 1.1) + lotus(640, 160, 0.8)

  // Koi on closed loops (offset-path), each its own size, speed and pattern.
  const routes = [
    ['M300 450 C 380 220 700 120 980 170 C 1260 220 1450 330 1430 520 C 1410 720 1120 800 820 780 C 520 760 220 700 300 450 Z', 80, 0, 1, '#f4efe6', [[30, -6, 40, 14, '#ee5a2a'], [-40, 8, 34, 12, '#ee5a2a'], [60, 8, 14, 8, '#1a1a1a']], '#fbe8d6'],
    ['M1250 600 C 1330 500 1400 560 1380 680 C 1360 790 1180 820 1100 760 C 1020 700 1170 700 1250 600 Z', 55, -20, 0.8, '#ee6a2a', [[20, 0, 50, 14, '#f4efe6'], [-50, 0, 26, 10, '#1a1a1a']], '#f6a070'],
    ['M260 300 C 320 190 520 220 520 340 C 520 460 360 500 280 440 C 220 400 230 340 260 300 Z', 48, -10, 0.7, '#f2c46a', [[10, -4, 44, 12, '#ee5a2a'], [-50, 6, 22, 9, '#f4efe6']], '#f8dc9a'],
  ]

  routes.forEach(([d, dur, delay, scale, base, spots, fin]) => {
    out += `<g class="swim" style="offset-path:path('${d}');--d:${dur}s;--l:${delay}s"><g transform="scale(${scale})"><g class="wig">${koi(base, spots, fin)}</g></g></g>`
  })

  // Petals drifting.
  for (let i = 0; i < 14; i++) {
    out += `<g class="pet" style="--d:${(40 + rand() * 40).toFixed(0)}s;--l:${(-rand() * 40).toFixed(0)}s;--dx:${Math.round(rand() * 240 - 60)}px;--dy:${Math.round(rand() * 140 - 30)}px"><ellipse cx="${Math.round(rand() * W)}" cy="${Math.round(rand() * H)}" rx="9" ry="4.5" fill="#fbc4d8" opacity=".6"/></g>`
  }

  // Stones along the edges, mossy on top.
  const stone = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y + 8}" rx="${rx}" ry="${ry}" fill="#02080a" opacity=".5"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#4a5256"/><ellipse cx="${x - rx * 0.15}" cy="${y - ry * 0.25}" rx="${rx * 0.75}" ry="${ry * 0.6}" fill="#6a757a"/><ellipse cx="${x + rx * 0.2}" cy="${y - ry * 0.3}" rx="${rx * 0.4}" ry="${ry * 0.25}" fill="#3f7a4a" opacity=".75"/>`

  for (let i = 0; i < 12; i++) {
    out += stone(40 + rand() * 120, 40 + i * 78 + rand() * 30, 55 + rand() * 40, 38 + rand() * 24)
    out += stone(1560 - rand() * 120, 60 + i * 74 + rand() * 30, 55 + rand() * 40, 38 + rand() * 24)
  }
  for (let i = 0; i < 6; i++) {
    out += stone(300 + i * 220 + rand() * 60, 880 + rand() * 30, 70 + rand() * 40, 40 + rand() * 20)
  }

  return svg(defs, CSS, out)
}
