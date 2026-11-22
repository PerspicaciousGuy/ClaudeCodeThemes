// Windfarm Dusk: an original evening landscape. A peach and lilac sky with a low
// sun, rolling plum hills and a field of wind turbines turning at different
// speeds, with clouds and birds drifting past.
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

function hills(base, amp, seed, fill) {
  const r = rng(seed)
  const p1 = r() * 6.28
  const p2 = r() * 6.28
  let d = `M-10 ${H}`

  for (let x = -10; x <= W + 10; x += 16) {
    d += ` L${x} ${(base - amp * (0.6 * Math.sin(x / 230 + p1) + 0.4 * Math.sin(x / 97 + p2))).toFixed(0)}`
  }

  return `<path d="${d} L${W + 10} ${H} Z" fill="${fill}"/>`
}

// A turbine: tapering tower, hub and three blades that turn about the hub.
function turbine(x, y, h, tower, blade, dur, dir) {
  const hy = y - h
  const bw = Math.max(2.5, h * 0.028)
  const len = h * 0.6
  let blades = ''

  for (const a of [0, 120, 240]) {
    blades += `<polygon points="${x - bw},${hy} ${x},${hy - len} ${x + bw},${hy}" fill="${blade}" transform="rotate(${a} ${x} ${hy})"/>`
  }

  return (
    `<polygon points="${x - h * 0.03},${y} ${x + h * 0.03},${y} ${x + h * 0.012},${hy} ${x - h * 0.012},${hy}" fill="${tower}"/>` +
    `<g style="transform-origin:${x}px ${hy}px;animation:spin ${dur}s linear infinite ${dir}">${blades}</g>` +
    `<circle cx="${x}" cy="${hy}" r="${(h * 0.026).toFixed(1)}" fill="${tower}"/>`
  )
}

const CSS = `
.cl1{animation:drift 150s linear infinite}
.cl2{animation:drift 110s linear infinite}
.bd{animation:fly 46s linear infinite}
.sun{animation:sun 8s ease-in-out infinite alternate}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes drift{from{transform:translateX(-300px)}to{transform:translateX(1900px)}}
@keyframes fly{from{transform:translate(-100px,0)}to{transform:translate(1800px,-60px)}}
@keyframes sun{from{opacity:.8}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.cl1,.cl2,.bd,.sun,[style*="spin"]{animation:none!important}}
`

export function buildScene() {
  const defs =
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a98fd0"/><stop offset=".5" stop-color="#f0a9b8"/><stop offset="1" stop-color="#ffd7a6"/></linearGradient>' +
    '<radialGradient id="sg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff2cf" stop-opacity=".95"/><stop offset=".35" stop-color="#ffd9a0" stop-opacity=".5"/><stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/></radialGradient>'

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  out += '<g class="sun"><circle cx="420" cy="560" r="300" fill="url(#sg)"/></g><circle cx="420" cy="560" r="62" fill="#fff4d8"/>'

  // Clouds in two layers.
  const cloud = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><ellipse cx="0" cy="0" rx="120" ry="22"/><ellipse cx="-50" cy="-16" rx="60" ry="22"/><ellipse cx="30" cy="-24" rx="70" ry="26"/></g>`

  out += `<g class="cl1">${cloud(300, 170, 1.1, '#ffe6e8')}${cloud(900, 120, 0.8, '#fbd5e4')}</g>`
  out += `<g class="cl2">${cloud(100, 290, 0.9, '#ffd0c8')}${cloud(700, 330, 1.3, '#f8c3cf')}</g>`

  // Far turbines on the first ridge, then the middle and the edges.
  out += hills(620, 42, 4, '#c18fb0')
  for (let i = 0; i < 9; i++) {
    out += turbine(120 + i * 190, 636, 96, '#e9cfe0', '#f4e1ec', 9 + (i % 4) * 1.6, i % 2 ? 'reverse' : '')
  }

  out += hills(700, 40, 9, '#9c6f9a')
  for (const [x, h, d] of [[300, 170, 8], [640, 150, 10], [980, 190, 7.4], [1330, 160, 9.4]]) {
    out += turbine(x, 716, h, '#f3dfe9', '#fbeef4', d, '')
  }

  out += hills(790, 34, 15, '#7a5482')
  out += turbine(120, 850, 360, '#f6e8ef', '#fff6fa', 6.5, '')
  out += turbine(1500, 850, 400, '#f6e8ef', '#fff6fa', 7.6, 'reverse')
  out += hills(850, 20, 21, '#5a3f68')

  // Birds crossing.
  const bird = (x, y, s) => `<path d="M${x} ${y}q${8 * s} ${-9 * s} ${16 * s} 0q${8 * s} ${-9 * s} ${16 * s} 0" fill="none" stroke="#5a3f68" stroke-width="2.6" stroke-linecap="round"/>`

  out += `<g class="bd">${bird(0, 230, 1)}${bird(46, 252, 0.8)}${bird(92, 226, 0.9)}</g>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
