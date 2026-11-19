// Lantern Festival: an original scene of a lantern festival on a lake at night.
// Paper lanterns rise into a starry sky, their warm light shimmers on the water,
// and a pagoda and hills stand in silhouette on the far shore.
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
.tw{animation:tw var(--d,4s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.rise{animation:rise var(--d,50s) linear infinite;animation-delay:var(--l,0s)}
.drift{animation:drift var(--e,7s) ease-in-out infinite alternate;animation-delay:var(--m,0s)}
.glint{animation:glint var(--d,5s) ease-in-out infinite alternate;animation-delay:var(--l,0s);transform-box:fill-box;transform-origin:center}
.win{animation:win 6s ease-in-out infinite alternate}
@keyframes tw{from{opacity:.25}to{opacity:1}}
@keyframes rise{from{transform:translateY(0)}to{transform:translateY(-1320px)}}
@keyframes drift{from{transform:translateX(-22px)}to{transform:translateX(22px)}}
@keyframes glint{from{transform:scaleX(.8)}to{transform:scaleX(1.15)}}
@keyframes win{from{opacity:.6}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.tw,.rise,.drift,.glint,.win{animation:none}}
`

// A paper lantern: a glow, a rounded body with ribs, and caps.
function lantern(x, y, s, c) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><circle r="120" fill="url(#lg-${c.slice(1)})" opacity=".85"/><rect x="-26" y="-36" width="52" height="68" rx="20" fill="${c}"/><rect x="-26" y="-36" width="52" height="68" rx="20" fill="url(#body)" opacity=".7"/><path d="M-9 -34 Q -16 0 -9 30 M9 -34 Q 16 0 9 30 M0 -36 V 32" stroke="#7a2a10" stroke-width="2" fill="none" opacity=".5"/><rect x="-18" y="-42" width="36" height="9" rx="3" fill="#7a3a1a"/><rect x="-15" y="31" width="30" height="8" rx="3" fill="#7a3a1a"/><path d="M0 39 V 62" stroke="#7a3a1a" stroke-width="2"/><circle cx="0" cy="66" r="4" fill="#e8b04a"/></g>`
}

export function buildScene() {
  const rand = rng(77)
  const cols = ['#ff9a3a', '#ff7a3a', '#ffc24a', '#ff6a4a']
  let defs =
    vgrad('sky', [[0, '#070a1c'], [0.5, '#161c46'], [0.85, '#3a2a54'], [1, '#6a3a56']]) +
    vgrad('lake', [[0, '#16183c'], [1, '#05071a']]) +
    vgrad('body', [[0, '#ffffff', 0.45], [0.5, '#ffffff', 0], [1, '#000000', 0.2]])

  for (const c of cols) {
    defs += rgrad(`lg-${c.slice(1)}`, c, 0.55)
  }

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  // Stars, in groups that twinkle together.
  for (let g = 0; g < 8; g++) {
    let stars = ''

    for (let i = 0; i < 16; i++) {
      stars += `<circle cx="${Math.round(rand() * W)}" cy="${Math.round(rand() * rand() * 520)}" r="${(0.7 + rand() * 1.5).toFixed(1)}" fill="#e8ecff" opacity="${(0.5 + rand() * 0.4).toFixed(2)}"/>`
    }
    out += `<g class="tw" style="--d:${(3 + rand() * 3).toFixed(1)}s;--l:${(-rand() * 5).toFixed(1)}s">${stars}</g>`
  }

  // Far hills and a pagoda on the shore.
  out += `<path d="M0 640 C 150 560 330 600 520 575 C 720 548 900 610 1100 585 C 1300 560 1460 600 1600 570 L1600 660 L0 660 Z" fill="#12163a"/>`
  out += `<path d="M0 660 C 220 620 420 650 640 632 C 880 612 1060 660 1280 640 C 1420 628 1520 640 1600 636 L1600 680 L0 680 Z" fill="#0c0f2b"/>`

  const tier = (cx, y, w, h) => `<path d="M${cx - w} ${y + h} L${cx - w * 0.7} ${y} L${cx + w * 0.7} ${y} L${cx + w} ${y + h} Q ${cx} ${y + h - 14} ${cx - w} ${y + h} Z" fill="#070920"/><rect x="${cx - w * 0.55}" y="${y + h}" width="${w * 1.1}" height="${h * 0.6}" fill="#0a0c26"/>`

  out += `<g>${tier(1210, 410, 90, 26)}${tier(1210, 470, 78, 24)}${tier(1210, 526, 66, 22)}<rect x="1208" y="360" width="4" height="52" fill="#070920"/><rect x="1195" y="410" width="30" height="3" fill="#070920"/>`
  out += `<g class="win"><rect x="1200" y="488" width="8" height="12" fill="#ffc86a"/><rect x="1214" y="488" width="8" height="12" fill="#ffc86a"/><rect x="1203" y="545" width="6" height="10" fill="#ffc86a"/><rect x="1214" y="545" width="6" height="10" fill="#ffc86a"/></g></g>`

  // The lake, with lantern light reflected in it.
  out += `<rect x="0" y="650" width="${W}" height="250" fill="url(#lake)"/>`

  const spots = []

  for (let i = 0; i < 26; i++) {
    const side = rand() < 0.5
    const x = side ? 60 + rand() * 520 : 1020 + rand() * 520
    const s = 0.5 + rand() * 0.9
    const c = cols[i % cols.length]

    spots.push([x, s, c])
  }
  for (const [x, s, c] of spots.slice(0, 14)) {
    out += `<ellipse class="glint" cx="${Math.round(x)}" cy="${720 + Math.round(rand() * 150)}" rx="${(60 + 70 * s).toFixed(0)}" ry="${(5 + 4 * s).toFixed(0)}" fill="${c}" opacity="${(0.1 + 0.1 * s).toFixed(2)}" style="--d:${(4 + rand() * 4).toFixed(1)}s;--l:${(-rand() * 6).toFixed(1)}s"/>`
  }

  // Lanterns rising, each on its own slow climb with a sideways drift. Far ones are small and slow.
  for (const [x, s, c] of spots) {
    const dur = (95 - s * 40).toFixed(0)

    out += `<g class="rise" style="--d:${dur}s;--l:${(-rand() * 90).toFixed(0)}s"><g class="drift" style="--e:${(6 + rand() * 5).toFixed(1)}s;--m:${(-rand() * 6).toFixed(1)}s">${lantern(Math.round(x), 960, s.toFixed(2), c)}</g></g>`
  }

  // The nearest bank, dark.
  out += `<path d="M0 900 L0 840 C 200 820 360 850 560 838 L560 900 Z M1100 900 L1100 846 C 1300 828 1460 856 1600 836 L1600 900 Z" fill="#04051a"/>`

  return svg(defs, CSS, out)
}
