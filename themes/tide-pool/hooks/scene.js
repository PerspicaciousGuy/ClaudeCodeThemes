// Tide Pool: an original look straight down into a rock pool. Dark rocks ring
// clear water; anemones breathe, starfish rest, light nets ripple over the
// bottom, drops make rings and small fish cross. Vector art on a 1600x900 canvas.
// Pure SVG + CSS animation: no script, nothing loaded.

const W = 1600
const H = 900
const CX = 800
const CY = 450
const TAU = Math.PI * 2

function rng(seed) {
  let s = seed >>> 0

  return () => {
    s = (s * 1664525 + 1013904223) >>> 0

    return s / 4294967296
  }
}

// A lumpy closed shape around a center.
function blob(cx, cy, r, rand, lumps = 9, wobble = 0.22) {
  const phase = rand() * TAU
  const pts = []

  for (let i = 0; i < lumps * 2; i++) {
    const a = (i / (lumps * 2)) * TAU
    const rr = r * (1 + wobble * Math.sin(a * 3 + phase) * 0.6 + (rand() - 0.5) * wobble)

    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr])
  }

  let d = `M${((pts[0][0] + pts[pts.length - 1][0]) / 2).toFixed(0)} ${((pts[0][1] + pts[pts.length - 1][1]) / 2).toFixed(0)}`

  for (let i = 0; i < pts.length; i++) {
    const [x, y] = pts[i]
    const [nx, ny] = pts[(i + 1) % pts.length]

    d += ` Q${x.toFixed(0)} ${y.toFixed(0)} ${((x + nx) / 2).toFixed(0)} ${((y + ny) / 2).toFixed(0)}`
  }

  return d + 'Z'
}

function star(cx, cy, r, fill, spots, rot) {
  const pts = []

  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * TAU - Math.PI / 2
    const rr = i % 2 === 0 ? r : r * 0.42

    pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`)
  }

  let out = `<g class="sf" style="transform-origin:${cx}px ${cy}px;transform:rotate(${rot}deg)"><polygon points="${pts.join(' ')}" fill="${fill}" stroke="${fill}" stroke-width="10" stroke-linejoin="round"/>`

  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * TAU - Math.PI / 2

    for (const k of [0.38, 0.62, 0.84]) {
      out += `<circle cx="${(cx + Math.cos(a) * r * k).toFixed(1)}" cy="${(cy + Math.sin(a) * r * k).toFixed(1)}" r="${(r * 0.035 * (1.4 - k * 0.6)).toFixed(1)}" fill="${spots}" opacity=".7"/>`
    }
  }

  return out + '</g>'
}

function anemone(cx, cy, r, body, tip) {
  let out = `<g class="an" style="transform-origin:${cx}px ${cy}px"><circle cx="${cx}" cy="${cy}" r="${r}" fill="${body}" opacity=".55"/>`

  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * TAU
    const x1 = cx + Math.cos(a) * r * 0.3
    const y1 = cy + Math.sin(a) * r * 0.3
    const x2 = cx + Math.cos(a) * r * (0.95 + (i % 3) * 0.05)
    const y2 = cy + Math.sin(a) * r * (0.95 + (i % 3) * 0.05)

    out += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${body}" stroke-width="${(r * 0.1).toFixed(1)}" stroke-linecap="round"/><circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="${(r * 0.06).toFixed(1)}" fill="${tip}"/>`
  }

  return out + `<circle cx="${cx}" cy="${cy}" r="${(r * 0.22).toFixed(1)}" fill="${tip}" opacity=".85"/></g>`
}

function fish(y, dur, delay, dir) {
  const body = '<ellipse rx="26" ry="9" fill="#b9d6d6"/><polygon points="-22,0 -42,-11 -42,11" fill="#9cc2c4"/><circle cx="14" cy="-2" r="2" fill="#0c2a30"/>'
  const shadow = '<g transform="translate(10 22)" opacity=".28"><ellipse rx="26" ry="9" fill="#021014"/><polygon points="-22,0 -42,-11 -42,11" fill="#021014"/></g>'

  return `<g class="sw" style="animation-duration:${dur}s;animation-delay:${delay}s${dir < 0 ? ';animation-name:swimback' : ''}"><g transform="translate(0 ${y}) scale(${dir} 1)">${shadow}<g class="wig">${body}</g></g></g>`
}

const CSS = `
.n1{animation:n1 11s ease-in-out infinite alternate}
.n2{animation:n2 14s ease-in-out infinite alternate}
.an{animation:breathe 5s ease-in-out infinite alternate}
.sf{animation:sfs 14s ease-in-out infinite alternate}
.rg{animation:ring 7s ease-out infinite;transform-box:fill-box;transform-origin:center}
.sw{animation:swim 30s linear infinite}
.wig{animation:wig .7s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:left center}
@keyframes n1{from{transform:translate(-26px,-12px)}to{transform:translate(30px,16px)}}
@keyframes n2{from{transform:translate(24px,14px) scale(1.04)}to{transform:translate(-30px,-10px) scale(.98)}}
@keyframes breathe{from{transform:scale(.96)}to{transform:scale(1.08)}}
@keyframes sfs{from{transform:rotate(-6deg)}to{transform:rotate(6deg)}}
@keyframes ring{0%{opacity:.6;transform:scale(.1)}100%{opacity:0;transform:scale(1)}}
@keyframes swim{from{transform:translate(-120px,0)}to{transform:translate(1760px,-90px)}}
@keyframes swimback{from{transform:translate(1760px,0)}to{transform:translate(-120px,70px)}}
@keyframes wig{from{transform:skewY(-5deg)}to{transform:skewY(5deg)}}
@media (prefers-reduced-motion:reduce){.n1,.n2,.an,.sf,.rg,.sw,.wig{animation:none}}
`

export function buildScene() {
  const rand = rng(17)
  const defs =
    `<radialGradient id="water" cx="${CX}" cy="${CY}" r="760" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#37b8ad"/><stop offset=".55" stop-color="#1b7b80"/><stop offset="1" stop-color="#0a3d48"/></radialGradient>` +
    '<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#021218" stop-opacity="0"/><stop offset="1" stop-color="#021218" stop-opacity=".6"/></radialGradient>'

  let out = `<rect width="${W}" height="${H}" fill="#041a22"/>`

  // The pool floor: lit water, with pebbles on the bottom.
  out += `<ellipse cx="${CX}" cy="${CY}" rx="860" ry="500" fill="url(#water)"/>`
  for (let i = 0; i < 90; i++) {
    const a = rand() * TAU
    const d = Math.sqrt(rand())

    out += `<ellipse cx="${(CX + Math.cos(a) * d * 700).toFixed(0)}" cy="${(CY + Math.sin(a) * d * 380).toFixed(0)}" rx="${(3 + rand() * 7).toFixed(1)}" ry="${(2 + rand() * 4).toFixed(1)}" fill="#a8d6cc" opacity="${(0.1 + rand() * 0.2).toFixed(2)}"/>`
  }

  // Light nets rippling over the bottom, in two layers.
  const net = (n, cls, stroke) => {
    let g = `<g class="${cls}" fill="none" stroke="${stroke}" stroke-width="2.2" stroke-linejoin="round">`

    for (let i = 0; i < n; i++) {
      const cx = rand() * (W + 200) - 100
      const cy = rand() * (H + 100) - 50

      g += `<path d="${blob(cx, cy, 36 + rand() * 54, rand, 5, 0.5)}" opacity="${(0.1 + rand() * 0.16).toFixed(2)}"/>`
    }

    return g + '</g>'
  }

  out += net(46, 'n1', '#c8fff2') + net(38, 'n2', '#9ff0e0')

  // Rocks around the rim, with barnacles and weed.
  const tones = ['#2a2937', '#36334a', '#222634', '#2f3040']

  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * TAU + (rand() - 0.5) * 0.18
    const k = 1 + (rand() - 0.5) * 0.1
    const x = CX + Math.cos(a) * 800 * k
    const y = CY + Math.sin(a) * 470 * k
    const r = 100 + rand() * 80

    out += `<path d="${blob(x, y, r + 14, rand)}" fill="#04141a" opacity=".5"/><path d="${blob(x, y, r, rand)}" fill="${tones[i % tones.length]}"/>`
    for (let b = 0; b < 12; b++) {
      const ba = rand() * TAU
      const bd = rand() * r * 0.7

      out += `<circle cx="${(x + Math.cos(ba) * bd).toFixed(0)}" cy="${(y + Math.sin(ba) * bd).toFixed(0)}" r="${(2 + rand() * 3.5).toFixed(1)}" fill="#c9c6d6" opacity="${(0.25 + rand() * 0.3).toFixed(2)}"/>`
    }
    if (rand() < 0.5) {
      out += `<path d="${blob(x + (rand() - 0.5) * r * 0.5, y + (rand() - 0.5) * r * 0.5, r * 0.4, rand, 6, 0.5)}" fill="#3f8a55" opacity=".6"/>`
    }
  }
  out += `<rect width="${W}" height="${H}" fill="url(#vig)"/>`

  // Life along the sides, kept away from the middle.
  out += anemone(250, 600, 78, '#ec6f8f', '#ffd0dc') + anemone(1370, 290, 70, '#7fe0a8', '#e6ffee') + anemone(1330, 650, 54, '#ec6f8f', '#ffd0dc') + anemone(330, 270, 48, '#9be8c0', '#eafff2')
  out += star(190, 430, 66, '#ff8a4d', '#ffd6a8', 14) + star(1430, 500, 58, '#e8574a', '#ffc0a8', -22) + star(420, 740, 40, '#ffa24d', '#ffe0b0', 40)
  out += `<g><circle cx="290" cy="760" r="30" fill="#6a4a9a"/>${Array.from({ length: 22 }, (_, i) => {
    const a = (i / 22) * TAU

    return `<path d="M${(290 + Math.cos(a) * 28).toFixed(1)} ${(760 + Math.sin(a) * 28).toFixed(1)} L${(290 + Math.cos(a) * 46).toFixed(1)} ${(760 + Math.sin(a) * 46).toFixed(1)}" stroke="#8a66c0" stroke-width="3" stroke-linecap="round"/>`
  }).join('')}</g>`

  // Fish crossing, and drops making rings.
  out += fish(300, 31, -6, 1) + fish(620, 38, -22, -1) + fish(440, 46, -33, 1)
  for (const [x, y, d] of [[470, 260, 0], [1160, 700, -3], [1000, 190, -5.5]]) {
    out += `<g class="rg" style="animation-delay:${d}s"><circle cx="${x}" cy="${y}" r="120" fill="none" stroke="#e8fffa" stroke-width="2.4"/><circle cx="${x}" cy="${y}" r="80" fill="none" stroke="#e8fffa" stroke-width="1.6"/></g>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
