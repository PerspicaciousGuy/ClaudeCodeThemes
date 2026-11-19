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
<circle cx="0" cy="-34" r="64" fill="url(#cglow)" class="pulse"/>
<path d="M-28 -2 L28 -2 L28 -28 L-28 -28 Z" fill="${wood}"/>
<path d="M-28 -16 L28 -16" stroke="${band}" stroke-width="3"/><rect x="-4" y="-22" width="8" height="10" rx="1.5" fill="${gold}"/>
<path d="M-28 -28 L28 -28 L24 -40 L-24 -40 Z" fill="${gold}" opacity=".9"/>
${coins}
<path d="M-28 -30 L-24 -58 Q0 -66 24 -58 L28 -30 Z" fill="${wood}" opacity=".95" transform="translate(0 -4) rotate(-6 0 -30)"/>
<g class="spk"><path d="M-30 -54 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 z" fill="${glow}"/></g>
<g class="spk" style="animation-delay:1.3s"><path d="M26 -62 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 z" fill="${glow}"/></g>
</g>`
}

const CHEST_CSS = `
.pulse{animation:pulse 3.4s ease-in-out infinite alternate}
.spk{animation:spk 2.6s ease-in-out infinite}
@keyframes pulse{from{opacity:.55}to{opacity:1}}
@keyframes spk{0%,100%{opacity:0;transform:scale(.4)}50%{opacity:1;transform:scale(1)}}
`

export function buildScene() {
  const P = { hull: '#1b1633', hullLight: '#2e2750', sail: '#d9d1ee', sailShade: '#7c72a6', rig: '#0b0919', mast: '#120e24', flag: '#05040b', skull: '#f3f0fa', port: '#ffd27a', lantern: true }
  const FAR = { hull: '#17142c', hullLight: '#17142c', sail: '#4b4678', sailShade: '#2c2850', rig: '#0b0919', mast: '#0f0c20', flag: '#05040b', skull: '#4b4678', port: '#4b4678', lantern: false }

  const defs =
    vgrad('sky', [[0, '#050818'], [0.5, '#141a46'], [0.85, '#33306a'], [1, '#5a4a86']]) +
    vgrad('sea', [[0, '#17285a'], [0.35, '#0b1738'], [1, '#040813']]) +
    vgrad('haze', [[0, '#7a68b0', 0], [1, '#7a68b0', 0.4]]) +
    rgrad('halo', '#cfd6ff', 0.34) +
    rgrad('cglow', '#ffc65a', 0.5) +
    shipDefs(P)

  const css = SHIP_CSS + WAVE_CSS + PALM_CSS + CHEST_CSS + `
.tw{animation:tw var(--d,4s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.cl{animation:cl var(--d,140s) ease-in-out infinite alternate}
.fog{animation:fog var(--d,90s) ease-in-out infinite alternate}
.gl{animation:gl var(--d,3s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
@keyframes tw{from{opacity:.25}to{opacity:1}}
@keyframes cl{from{transform:translateX(-90px)}to{transform:translateX(160px)}}
@keyframes fog{from{transform:translateX(-60px)}to{transform:translateX(80px)}}
@keyframes gl{from{opacity:.15}to{opacity:.8}}
@media (prefers-reduced-motion:reduce){.rock,.flag,.flick,.wv,.sway,.pulse,.spk,.tw,.cl,.fog,.gl{animation:none}.spk{opacity:1}}
`

  const rnd = rng(11)
  let stars = ''

  for (let i = 0; i < 90; i++) {
    const x = rnd() * W
    const y = rnd() * 430
    const bright = rnd() > 0.82

    stars += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${bright ? 1.9 : 1.1}" fill="#f4f0ff" class="tw" style="--d:${r1(2.5 + rnd() * 4)}s;--l:${r1(-rnd() * 6)}s" fill-opacity=".7"/>`
  }

  const cloud = (x, y, s, o, d) => `<g class="cl" style="--d:${d}s"><g transform="translate(${x} ${y}) scale(${s})" opacity="${o}" fill="#2a2a5e"><ellipse cx="0" cy="0" rx="150" ry="22"/><ellipse cx="-60" cy="-14" rx="80" ry="22"/><ellipse cx="50" cy="-18" rx="90" ry="24"/></g></g>`

  let glitter = ''

  for (let i = 0; i < 22; i++) {
    const y = 590 + i * 14
    const w = 14 + i * 5

    glitter += `<rect class="gl" x="${r1(470 - w / 2 + (rnd() - 0.5) * 24)}" y="${y}" width="${r1(w * (0.4 + rnd() * 0.6))}" height="3" rx="1.5" fill="#e6e9ff" style="--d:${r1(2 + rnd() * 3)}s;--l:${r1(-rnd() * 4)}s"/>`
  }

  const waves =
    waveLine(612, 6, 180, '#6f7fc4', 0.28, 2, 18) +
    waveLine(660, 8, 240, '#6f7fc4', 0.22, 2.4, 22, -4) +
    waveLine(730, 10, 320, '#5a6bb0', 0.2, 3, 26, -9) +
    waveLine(820, 14, 420, '#4a5a9c', 0.2, 4, 32, -12) +
    waveLine(880, 16, 520, '#3a4a88', 0.22, 5, 38, -7)

  const islet = `<path d="M0 900 L0 700 Q60 668 124 704 Q176 690 220 736 Q262 786 318 900 Z" fill="#090c1c"/><path d="M0 760 Q90 740 170 770 Q230 800 270 880" fill="none" stroke="#161b38" stroke-width="3" fill-opacity=".7"/>`
  const palms = palm(60, 716, 250, 26, '#07091a', '#07091a', '#0c1026', 5, 7) + palm(168, 724, 180, -34, '#07091a', '#07091a', '#0c1026', 9, 5.5)

  const body =
    `<rect width="${W}" height="590" fill="url(#sky)"/>` +
    stars +
    `<circle cx="470" cy="175" r="230" fill="url(#halo)"/><circle cx="470" cy="175" r="72" fill="#f6f1d8"/><ellipse cx="446" cy="156" rx="16" ry="12" fill="#e2dbbd" opacity=".6"/><ellipse cx="494" cy="196" rx="20" ry="14" fill="#e2dbbd" opacity=".55"/><ellipse cx="480" cy="146" rx="8" ry="6" fill="#e2dbbd" opacity=".5"/>` +
    cloud(300, 150, 1, 0.55, 150) + cloud(1050, 110, 0.9, 0.5, 170) + cloud(1380, 230, 1.1, 0.4, 130) +
    `<rect y="470" width="${W}" height="130" fill="url(#haze)"/>` +
    `<rect y="560" width="${W}" height="340" fill="url(#sea)"/>` +
    glitter +
    `<g transform="translate(640 574) scale(.2)" opacity=".85">${ship(FAR)}</g>` +
    `<ellipse cx="800" cy="586" rx="700" ry="22" fill="#7a68b0" opacity=".14" class="fog"/>` +
    waves +
    `<g transform="translate(1260 650)">${ship(P)}</g>` +
    `<ellipse cx="1260" cy="690" rx="260" ry="9" fill="#0a1230" opacity=".5"/>` +
    islet + palms + chest(150, 790, 1.15, '#4a2a14', '#b98a2c', '#f2c14e', '#ffe08a') +
    `<ellipse cx="800" cy="840" rx="900" ry="26" fill="#7a68b0" opacity=".1" class="fog" style="--d:110s"/>`

  return svg(defs, css, body)
}
