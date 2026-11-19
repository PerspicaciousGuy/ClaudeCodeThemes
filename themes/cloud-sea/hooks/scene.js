// Cloud Sea: an original scene of sunrise above a sea of clouds. Banks of cloud
// drift slowly between dark peaks, a low sun warms the tops, a few birds cross,
// and the sky fades from blue to peach.
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
.c1{animation:cd 160s ease-in-out infinite alternate}
.c2{animation:cd 120s ease-in-out infinite alternate-reverse}
.c3{animation:cd 90s ease-in-out infinite alternate}
.c4{animation:cd 70s ease-in-out infinite alternate-reverse}
.glow{animation:glow 12s ease-in-out infinite alternate}
.bird{animation:bird var(--d,60s) linear infinite;animation-delay:var(--l,0s)}
.flap{animation:flap .9s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center}
@keyframes cd{from{transform:translateX(-110px)}to{transform:translateX(110px)}}
@keyframes glow{from{opacity:.7}to{opacity:1}}
@keyframes bird{from{transform:translateX(-120px)}to{transform:translateX(1760px)}}
@keyframes flap{from{transform:scaleY(1)}to{transform:scaleY(.45)}}
@media (prefers-reduced-motion:reduce){.c1,.c2,.c3,.c4,.glow,.bird,.flap{animation:none}}
`

// A bank of cloud: overlapping puffs along a ridge, and solid below it.
function bank(y, fill, rand, r0, step, fillBelow, solid) {
  let out = ''

  for (let x = -260; x < 1900; x += step) {
    const r = r0 * (0.7 + rand() * 0.6)

    out += `<ellipse cx="${x + Math.round(rand() * 40)}" cy="${y - r * 0.25 + Math.round(rand() * 24)}" rx="${(r * 1.5).toFixed(0)}" ry="${r.toFixed(0)}"/>`
  }

  return `<g fill="${fill}">${out}<rect x="-300" y="${y + 70}" width="2200" height="${fillBelow + 200}" fill="${solid}"/></g>`
}

// A far peak: a jagged triangle with a lit side.
function peak(x, y, w, h, c1, c2) {
  return `<polygon points="${x - w},${y} ${x - w * 0.18},${y - h * 0.86} ${x - w * 0.06},${y - h * 0.78} ${x + w * 0.02},${y - h} ${x + w * 0.26},${y - h * 0.7} ${x + w},${y}" fill="${c1}"/><polygon points="${x + w * 0.02},${y - h} ${x + w * 0.26},${y - h * 0.7} ${x + w},${y} ${x + w * 0.1},${y}" fill="${c2}" opacity=".6"/>`
}

export function buildScene() {
  const rand = rng(14)
  const defs =
    vgrad('sky', [[0, '#8fb6e2'], [0.45, '#c8d4ec'], [0.72, '#f6d6c6'], [1, '#fbe6c4']]) +
    rgrad('sun', '#fff2c8', 0.95) +
    rgrad('warm', '#ffb48a', 0.55) +
    vgrad('c1', [[0, '#fbe3d4'], [1, '#e8c8c8']]) +
    vgrad('c2', [[0, '#fff0e6'], [1, '#e8d4dc']]) +
    vgrad('c3', [[0, '#ffffff'], [1, '#dcd8ee']]) +
    vgrad('c4', [[0, '#f4f2fc'], [1, '#c8cce4']])

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  // The low sun and its warm air.
  out += `<g class="glow"><circle cx="1090" cy="430" r="620" fill="url(#sun)" opacity=".7"/></g><circle cx="1090" cy="430" r="64" fill="#fffbe6"/><circle cx="1090" cy="430" r="90" fill="#ffe7b0" opacity=".35"/>`

  // Birds crossing the sky.
  for (let i = 0; i < 5; i++) {
    const y = 120 + Math.round(rand() * 260)
    const s = 0.7 + rand() * 0.8

    out += `<g class="bird" style="--d:${(55 + rand() * 40).toFixed(0)}s;--l:${(-rand() * 80).toFixed(0)}s"><g transform="translate(0 ${y}) scale(${s.toFixed(2)})"><g class="flap" style="animation-delay:${(-rand()).toFixed(2)}s"><path d="M-18 -2 Q -9 -12 0 0 Q 9 -12 18 -2" fill="none" stroke="#5a4a68" stroke-width="3" stroke-linecap="round"/></g></g></g>`
  }

  // Far peaks, hazy, then the first bank of cloud.
  out += peak(260, 560, 300, 320, '#8ea4c8', '#aebfdc') + peak(1330, 570, 260, 290, '#8ea4c8', '#aebfdc') + peak(700, 580, 200, 180, '#9fb2d2', '#bccade')
  out += `<g class="c1">${bank(560, 'url(#c1)', rand, 90, 130, 400, '#ecd0cc')}</g>`

  // Nearer peaks standing out of the sea.
  out += peak(120, 640, 280, 380, '#5a6c94', '#7e90b4') + peak(1500, 650, 300, 360, '#5a6c94', '#7e90b4') + peak(1000, 650, 160, 150, '#6f82a8', '#93a4c4')
  out += `<g class="c2">${bank(650, 'url(#c2)', rand, 110, 150, 300, '#eddcdf')}</g>`

  // Warm light caught on the cloud tops near the sun.
  out += `<ellipse cx="1090" cy="590" rx="700" ry="120" fill="url(#warm)"/>`
  out += `<g class="c3">${bank(740, 'url(#c3)', rand, 130, 170, 200, '#e2dff0')}</g>`
  out += `<g class="c4">${bank(830, 'url(#c4)', rand, 150, 200, 120, '#cfd2e8')}</g>`

  return svg(defs, CSS, out)
}
