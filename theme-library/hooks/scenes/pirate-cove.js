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


// A galleon drawn around its waterline centre (0,0): bow to the left, raised stern to the right.
// P gives the colours; it rocks on the swell, the skull flag waves and a stern lantern flickers.
function sailPath(x, yT, yB, w) {
  const m = (yT + yB) / 2

  return `M${x - w} ${yT} L${x + w} ${yT} Q${x + w + 12} ${m} ${x + w - 8} ${yB} Q${x} ${yB + 16} ${x - w + 8} ${yB} Q${x - w - 12} ${m} ${x - w} ${yT} Z`
}

function sailSet(P, x, yT, yB, w) {
  const seams = [-0.45, 0.05, 0.5].map(k => `<path d="M${r1(x + w * k)} ${yT + 4} Q${r1(x + w * k + 3)} ${(yT + yB) / 2} ${r1(x + w * k - 2)} ${yB + 6}" fill="none" stroke="${P.sailShade}" stroke-width="1.4" opacity=".55"/>`).join('')

  return `<path d="${sailPath(x, yT, yB, w)}" fill="url(#sail)"/>${seams}<line x1="${x - w - 6}" y1="${yT}" x2="${x + w + 6}" y2="${yT}" stroke="${P.mast}" stroke-width="5" stroke-linecap="round"/>`
}

function ship(P) {
  const hull = 'M-208 -44 C-200 2 -150 30 -90 34 L120 34 C175 30 205 4 214 -52 L214 -96 L150 -96 L150 -44 Z'
  const guns = [-130, -90, -50, -10, 30, 70, 110].map(x => `<rect x="${x}" y="-22" width="14" height="10" rx="1.5" fill="${P.hull}" opacity=".9"/>`).join('')
  const ports = [166, 190].map(x => `<circle cx="${x}" cy="-72" r="5.5" fill="${P.port}" class="${P.lantern ? 'flick' : ''}"/>`).join('')
  const lantern = P.lantern
    ? `<circle cx="206" cy="-112" r="70" fill="url(#lglow)" class="flick"/><rect x="200" y="-122" width="12" height="16" rx="3" fill="${P.port}"/><line x1="206" y1="-96" x2="206" y2="-122" stroke="${P.mast}" stroke-width="2"/>`
    : ''
  const rig = [
    [0, -348, -205, -48],
    [0, -348, 214, -98],
    [-120, -300, -290, -86],
    [105, -250, 214, -98],
    [-120, -300, -205, -48],
    [0, -348, -120, -300],
  ].map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${P.rig}" stroke-width="1.6" opacity=".75"/>`).join('')

  return `<g class="rock">
<line x1="-205" y1="-50" x2="-292" y2="-88" stroke="${P.mast}" stroke-width="6" stroke-linecap="round"/>
<line x1="-120" y1="-44" x2="-120" y2="-302" stroke="${P.mast}" stroke-width="7" stroke-linecap="round"/>
<line x1="0" y1="-44" x2="0" y2="-350" stroke="${P.mast}" stroke-width="8" stroke-linecap="round"/>
<line x1="105" y1="-44" x2="105" y2="-252" stroke="${P.mast}" stroke-width="7" stroke-linecap="round"/>
${sailSet(P, -120, -286, -224, 44)}${sailSet(P, -120, -214, -92, 58)}
${sailSet(P, 0, -334, -252, 50)}${sailSet(P, 0, -238, -92, 72)}
${sailSet(P, 105, -236, -112, 46)}
${rig}
<path d="${hull}" fill="${P.hull}"/>
<path d="M-206 -44 L150 -44 L150 -30 L-196 -30 Z" fill="${P.hullLight}" opacity=".55"/>
<path d="M150 -96 L214 -96 L214 -86 L150 -86 Z" fill="${P.hullLight}" opacity=".6"/>
${guns}${ports}${lantern}
<line x1="0" y1="-350" x2="0" y2="-384" stroke="${P.mast}" stroke-width="3"/>
<g transform="translate(0 -350)"><g class="flag"><path d="M0 -32 Q14 -37 28 -32 T56 -32 L56 2 Q42 7 28 2 T0 2 Z" fill="${P.flag}"/><circle cx="28" cy="-17" r="6.5" fill="${P.skull}"/><rect x="24.5" y="-12" width="7" height="5" rx="1" fill="${P.skull}"/><circle cx="25.8" cy="-18" r="1.6" fill="${P.flag}"/><circle cx="30.2" cy="-18" r="1.6" fill="${P.flag}"/><path d="M14 -6 L42 -28 M42 -6 L14 -28" stroke="${P.skull}" stroke-width="2.4" stroke-linecap="round"/></g></g>
</g>`
}

const SHIP_CSS = `
.rock{animation:rock 7s ease-in-out infinite alternate;transform-origin:0 34px}
.flag{animation:flag 1.7s ease-in-out infinite alternate;transform-origin:0 0}
.flick{animation:flick 2.3s ease-in-out infinite alternate}
@keyframes rock{from{transform:rotate(-1.4deg)}to{transform:rotate(1.4deg)}}
@keyframes flag{from{transform:skewY(-6deg) scaleX(1)}to{transform:skewY(5deg) scaleX(.93)}}
@keyframes flick{from{opacity:.72}to{opacity:1}}
`

function shipDefs(P) {
  return vgrad('sail', [[0, P.sail], [1, P.sailShade]]) + rgrad('lglow', P.port, 0.55)
}

// A band of wave crests that slides sideways forever: one wavelength per loop.
function waveLine(y, amp, len, color, op, sw, dur, delay = 0) {
  let d = `M${-len} ${y}`

  for (let x = -len; x < W + len; x += len) {
    d += ` q${len / 4} ${-amp} ${len / 2} 0 t${len / 2} 0`
  }

  return `<g style="--len:${len}px"><path class="wv" d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" opacity="${op}" style="animation-duration:${dur}s;animation-delay:${delay}s"/></g>`
}

const WAVE_CSS = `
.wv{animation:wv 14s linear infinite}
@keyframes wv{from{transform:translateX(0)}to{transform:translateX(var(--len))}}
`


// A palm: a leaning trunk and a crown of drooping fronds that sway.
function palm(x, y, h, lean, trunk, leaf, leaf2, seed = 1, speed = 6) {
  const rnd = rng(seed)
  const tx = x + lean
  const ty = y - h
  const L = h * 0.55
  let fronds = ''

  for (let i = 0; i < 9; i++) {
    const a = (-175 + i * (170 / 8) + (rnd() - 0.5) * 12) * (Math.PI / 180)
    const len = L * (0.75 + rnd() * 0.45)
    const ex = Math.cos(a) * len
    const ey = Math.sin(a) * len * 0.55 + len * 0.42
    const mx = Math.cos(a) * len * 0.55
    const my = Math.sin(a) * len * 0.55 - len * 0.18
    const nx = -Math.sin(a) * len * 0.12
    const ny = Math.cos(a) * len * 0.12

    fronds += `<path d="M0 0 Q${r1(mx + nx)} ${r1(my + ny)} ${r1(ex)} ${r1(ey)} Q${r1(mx - nx)} ${r1(my - ny + 6)} 0 0 Z" fill="${i % 2 ? leaf : leaf2}"/>`
  }

  return `<path d="M${x} ${y} Q${r1(x + lean * 0.15)} ${r1(y - h * 0.55)} ${tx} ${ty}" fill="none" stroke="${trunk}" stroke-width="${r1(h * 0.055)}" stroke-linecap="round"/><g transform="translate(${tx} ${ty})"><g class="sway" style="animation-duration:${speed}s">${fronds}<circle r="${r1(h * 0.035)}" fill="${trunk}"/></g></g>`
}

const PALM_CSS = `
.sway{animation:sway 6s ease-in-out infinite alternate;transform-origin:0 0}
@keyframes sway{from{transform:rotate(-3deg)}to{transform:rotate(3deg)}}
`


// A treasure chest with a lid thrown open and a heap of coins. Origin at its base centre.
function chest(x, y, s, wood, band, gold, glow) {
  const coins = [[-14, -34], [-4, -38], [7, -36], [16, -33], [-9, -30], [3, -31], [11, -29]].map(([cx, cy], i) => `<ellipse cx="${cx}" cy="${cy}" rx="5.2" ry="2.8" fill="${i % 2 ? gold : glow}"/>`).join('')

  return `<g transform="translate(${x} ${y}) scale(${s})">
<path d="M-28 -2 L28 -2 L28 -28 L-28 -28 Z" fill="${wood}"/>
<path d="M-28 -16 L28 -16" stroke="${band}" stroke-width="3"/><rect x="-4" y="-22" width="8" height="10" rx="1.5" fill="${gold}"/>
<path d="M-28 -28 L28 -28 L24 -40 L-24 -40 Z" fill="${gold}"/>
${coins}
<path d="M-28 -30 L-24 -58 Q0 -66 24 -58 L28 -30 Z" fill="${wood}" transform="translate(0 -4) rotate(-6 0 -30)"/>
<g class="spk"><path d="M-30 -54 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 z" fill="${glow}"/></g>
<g class="spk" style="animation-delay:1.3s"><path d="M26 -62 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 z" fill="${glow}"/></g>
</g>`
}

const CHEST_CSS = `
.spk{animation:spk 2.6s ease-in-out infinite}
@keyframes spk{0%,100%{opacity:0;transform:scale(.4)}50%{opacity:1;transform:scale(1)}}
`

// A fluffy cloud from overlapping circles.
function cloud(x, y, s, o, d) {
  return `<g class="cl" style="--d:${d}s"><g transform="translate(${x} ${y}) scale(${s})" opacity="${o}" fill="#ffffff"><ellipse cx="0" cy="0" rx="130" ry="26"/><circle cx="-50" cy="-16" r="34"/><circle cx="10" cy="-30" r="42"/><circle cx="60" cy="-12" r="30"/></g></g>`
}

// A gull: two curved wings that flap while it flies a long line across the sky.
function gull(y, d, delay, s) {
  return `<g class="fly" style="--d:${d}s;--l:${delay}s"><g transform="translate(0 ${y}) scale(${s})"><path class="flap" d="M-16 0 Q-8 -9 0 0 Q8 -9 16 0" fill="none" stroke="#33414a" stroke-width="2.4" stroke-linecap="round" style="animation-delay:${delay}s"/></g></g>`
}

export function buildScene() {
  const P = { hull: '#6a3d20', hullLight: '#8d5632', sail: '#fffaf0', sailShade: '#d9cba8', rig: '#3b2412', mast: '#4a2c16', flag: '#17171f', skull: '#ffffff', port: '#2a1a0e', lantern: false }
  const FAR = { hull: '#7a5a46', hullLight: '#7a5a46', sail: '#f4f1ea', sailShade: '#cfc8b6', rig: '#6a5a4a', mast: '#6a5a4a', flag: '#4a4a52', skull: '#ffffff', port: '#7a5a46', lantern: false }

  const defs =
    vgrad('sky', [[0, '#5fc3f4'], [0.6, '#b9e8fb'], [1, '#fff3cf']]) +
    vgrad('sea', [[0, '#35c4d2'], [0.4, '#1496bd'], [1, '#0a6a96']]) +
    vgrad('shallow', [[0, '#9cf0dc', 0.0], [1, '#9cf0dc', 0.75]]) +
    rgrad('sun', '#fff7c4', 0.95) +
    shipDefs(P)

  const css = SHIP_CSS + WAVE_CSS + PALM_CSS + CHEST_CSS + `
.cl{animation:cl var(--d,140s) ease-in-out infinite alternate}
.fly{animation:fly var(--d,40s) linear infinite;animation-delay:var(--l,0s)}
.flap{animation:flap .9s ease-in-out infinite alternate;transform-origin:0 0}
.sp{animation:sp var(--d,3s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.ray{animation:ray 24s linear infinite;transform-origin:330px 170px}
.foam{animation:foam 6s ease-in-out infinite alternate}
@keyframes cl{from{transform:translateX(-120px)}to{transform:translateX(180px)}}
@keyframes fly{from{transform:translateX(-120px)}to{transform:translateX(1720px)}}
@keyframes flap{from{transform:scaleY(1)}to{transform:scaleY(-.6)}}
@keyframes sp{from{opacity:.1}to{opacity:.95}}
@keyframes ray{to{transform:rotate(360deg)}}
@keyframes foam{from{transform:translateX(-10px)}to{transform:translateX(14px)}}
@media (prefers-reduced-motion:reduce){.rock,.flag,.flick,.wv,.sway,.spk,.cl,.fly,.flap,.sp,.ray,.foam{animation:none}.spk{opacity:1}}
`

  const rnd = rng(23)
  let rays = ''

  for (let i = 0; i < 12; i++) {
    const a = (i * 30 * Math.PI) / 180

    rays += `<path d="M330 170 L${r1(330 + Math.cos(a - 0.06) * 260)} ${r1(170 + Math.sin(a - 0.06) * 260)} L${r1(330 + Math.cos(a + 0.06) * 260)} ${r1(170 + Math.sin(a + 0.06) * 260)} Z" fill="#fff6c2" opacity=".22"/>`
  }

  let sparkles = ''

  for (let i = 0; i < 46; i++) {
    const y = 600 + rnd() * 280
    const x = rnd() * W

    sparkles += `<rect class="sp" x="${r1(x)}" y="${r1(y)}" width="${r1(6 + (y - 600) / 14)}" height="2.4" rx="1.2" fill="#ffffff" style="--d:${r1(1.6 + rnd() * 3)}s;--l:${r1(-rnd() * 4)}s"/>`
  }

  const waves =
    waveLine(612, 6, 180, '#ffffff', 0.4, 2, 18) +
    waveLine(668, 9, 250, '#ffffff', 0.34, 2.6, 22, -4) +
    waveLine(742, 12, 330, '#ffffff', 0.3, 3.2, 26, -9) +
    waveLine(830, 15, 430, '#ffffff', 0.28, 4, 32, -12)

  // The beach and the shallow water around it, at the left.
  const beach = `<path d="M-20 900 L-20 716 Q90 690 180 720 Q300 770 460 900 Z" fill="url(#shallow)" opacity=".8"/><path d="M0 900 L0 690 Q70 664 140 698 Q210 684 270 736 Q330 790 380 900 Z" fill="#f1d9a0"/><path d="M0 900 L0 740 Q90 720 180 760 Q250 800 292 900 Z" fill="#e7c887"/><path class="foam" d="M0 760 Q100 724 190 752 Q290 790 380 900" fill="none" stroke="#ffffff" stroke-width="5" opacity=".7" stroke-linecap="round"/>`
  const palms = palm(70, 706, 270, 30, '#7a4a26', '#1f8a4c', '#2fae62', 5, 7) + palm(190, 716, 190, -38, '#7a4a26', '#1f8a4c', '#2fae62', 9, 5.5)
  const flagpole = `<line x1="300" y1="770" x2="300" y2="660" stroke="#5a3a1e" stroke-width="4" stroke-linecap="round"/><g transform="translate(300 664)"><g class="flag"><path d="M0 0 Q10 -4 20 0 T40 0 L40 22 Q30 26 20 22 T0 22 Z" fill="#17171f"/><circle cx="20" cy="9" r="4.5" fill="#fff"/><path d="M10 17 L30 3 M30 17 L10 3" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></g></g>`

  const body =
    `<rect width="${W}" height="600" fill="url(#sky)"/>` +
    `<g class="ray">${rays}</g><circle cx="330" cy="170" r="190" fill="url(#sun)"/><circle cx="330" cy="170" r="62" fill="#fff9d6"/>` +
    cloud(760, 140, 1.1, 0.9, 150) + cloud(1220, 90, 0.9, 0.85, 170) + cloud(1450, 250, 1.2, 0.75, 130) + cloud(140, 330, 0.8, 0.7, 120) +
    gull(210, 44, 0, 1) + gull(150, 56, -18, 0.8) + gull(300, 70, -30, 0.7) +
    `<rect y="590" width="${W}" height="310" fill="url(#sea)"/>` +
    sparkles +
    `<g transform="translate(700 600) scale(.2)" opacity=".9">${ship(FAR)}</g>` +
    waves +
    `<g transform="translate(1260 652)">${ship(P)}</g>` +
    `<ellipse cx="1260" cy="690" rx="270" ry="10" fill="#ffffff" opacity=".35"/>` +
    beach + palms + flagpole + chest(250, 826, 1.1, '#7a4a26', '#c8962c', '#f2c14e', '#fff0a8')

  return svg(defs, css, body)
}
