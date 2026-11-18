// Desert Noon: an original midday desert. Red mesas, a pale sun, saguaros,
// heat shimmer, drifting dust and a tumbleweed. Vector art on a 1600x900 canvas.
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

// A flat-topped mesa with a sloping skirt, plus a few strata lines.
function mesa(cx, w, h, base, fill, strata) {
  const l = cx - w / 2
  const r = cx + w / 2
  const pts = [
    [l - w * 0.28, base],
    [l - w * 0.04, base - h * 0.42],
    [l + w * 0.02, base - h * 0.5],
    [l + w * 0.03, base - h],
    [r - w * 0.06, base - h],
    [r - w * 0.04, base - h * 0.52],
    [r + w * 0.05, base - h * 0.44],
    [r + w * 0.3, base],
  ]
  let out = `<polygon points="${pts.map(([x, y]) => `${x.toFixed(0)},${y.toFixed(0)}`).join(' ')}" fill="${fill}"/>`

  for (let i = 1; i <= 4; i++) {
    const y = base - h * (0.12 + i * 0.17)

    out += `<rect x="${(l + w * 0.03).toFixed(0)}" y="${y.toFixed(0)}" width="${(w * 0.93).toFixed(0)}" height="${i % 2 ? 4 : 2}" fill="${strata}" opacity=".16"/>`
  }

  return out
}

function saguaro(x, base, h, color, light) {
  const w = h * 0.1
  const arm = (side, y, reach, up) =>
    `<path d="M${x} ${base - h * y} H${x + side * reach} V${base - h * (y + up)}" fill="none" stroke="${color}" stroke-width="${(w * 0.78).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round"/>`

  return (
    `<path d="M${x} ${base} V${base - h}" stroke="${color}" stroke-width="${w.toFixed(1)}" stroke-linecap="round" fill="none"/>` +
    arm(-1, 0.4, w * 1.9, 0.3) +
    arm(1, 0.55, w * 2.2, 0.26) +
    `<path d="M${x - w * 0.18} ${base - h * 0.02} V${base - h * 0.96}" stroke="${light}" stroke-width="${(w * 0.22).toFixed(1)}" stroke-linecap="round" fill="none" opacity=".55"/>`
  )
}

const CSS = `
.halo{animation:halo 9s ease-in-out infinite alternate;transform-origin:1290px 170px}
.cir{animation:drift 80s ease-in-out infinite alternate}
.cir2{animation:drift 110s ease-in-out infinite alternate-reverse}
.shim{animation:shim 4.5s ease-in-out infinite alternate}
.dust{animation:dust 16s linear infinite}
.weed{animation:roll 34s linear infinite}
.spin{animation:spin 3.2s linear infinite;transform-box:fill-box;transform-origin:center}
.hawk{animation:glide 70s linear infinite}
@keyframes halo{from{transform:scale(.94);opacity:.8}to{transform:scale(1.06);opacity:1}}
@keyframes drift{from{transform:translateX(-90px)}to{transform:translateX(90px)}}
@keyframes shim{from{transform:translateX(-14px) scaleY(.7);opacity:.1}to{transform:translateX(14px) scaleY(1.3);opacity:.3}}
@keyframes dust{0%{opacity:0;transform:translate(0,0)}15%{opacity:.6}100%{opacity:0;transform:translate(380px,-34px)}}
@keyframes roll{from{transform:translateX(-160px)}to{transform:translateX(1760px)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes glide{from{transform:translate(-120px,14px)}50%{transform:translate(600px,-26px)}to{transform:translate(1320px,10px)}}
@media (prefers-reduced-motion:reduce){.halo,.cir,.cir2,.shim,.dust,.weed,.spin,.hawk{animation:none}}
`

export function buildScene() {
  const rand = rng(5)
  const defs =
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8cc4d8"/><stop offset=".5" stop-color="#c9e2e2"/><stop offset="1" stop-color="#f6e6c4"/></linearGradient>' +
    '<radialGradient id="sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffbe8" stop-opacity=".95"/><stop offset=".25" stop-color="#fff3cc" stop-opacity=".55"/><stop offset="1" stop-color="#fff3cc" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0d29c"/><stop offset="1" stop-color="#e2b878"/></linearGradient>' +
    '<linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6e6c4" stop-opacity="0"/><stop offset="1" stop-color="#f6e6c4" stop-opacity=".85"/></linearGradient>'

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  // The sun and its halo.
  out += '<g class="halo"><circle cx="1290" cy="170" r="330" fill="url(#sun)"/></g><circle cx="1290" cy="170" r="58" fill="#fffdf2"/>'

  // High thin cloud.
  out += '<g class="cir"><ellipse cx="420" cy="150" rx="260" ry="14" fill="#fff" opacity=".5"/><ellipse cx="560" cy="188" rx="180" ry="9" fill="#fff" opacity=".4"/></g>'
  out += '<g class="cir2"><ellipse cx="1000" cy="310" rx="300" ry="12" fill="#fff" opacity=".35"/><ellipse cx="260" cy="330" rx="150" ry="8" fill="#fff" opacity=".35"/></g>'

  // A hawk, gliding.
  out += '<g class="hawk"><path d="M-26 0 Q-13 -11 0 0 Q13 -11 26 0" transform="translate(120 230)" fill="none" stroke="#5a3a2a" stroke-width="3" stroke-linecap="round"/></g>'

  // Mesas, hazy to near. The middle stays low and pale.
  out += mesa(760, 360, 70, 612, '#e6c6a6', '#b8805c')
  out += mesa(1130, 300, 110, 622, '#dba886', '#a8643e')
  out += mesa(360, 420, 150, 640, '#d39070', '#9a5436')
  out += mesa(150, 360, 330, 700, '#b8694a', '#7a3a24')
  out += mesa(1500, 420, 380, 710, '#b0604a', '#6e3322')
  out += mesa(1310, 200, 160, 670, '#c47a58', '#8a4630')
  out += '<rect x="0" y="560" width="1600" height="140" fill="url(#haze)"/>'

  // Heat shimmer along the horizon.
  for (let i = 0; i < 4; i++) {
    out += `<rect class="shim" x="${Math.round(rand() * 900 + 200)}" y="${612 + i * 14}" width="${300 + Math.round(rand() * 300)}" height="5" rx="2" fill="#fff" style="animation-delay:${(-rand() * 4).toFixed(1)}s;animation-duration:${(3.5 + rand() * 3).toFixed(1)}s"/>`
  }

  // Sand: two dunes and ripple lines.
  out += `<path d="M0 700 Q300 660 640 700 T1300 690 T1600 680 V900 H0Z" fill="url(#sand)"/>`
  out += `<path d="M0 800 Q420 740 900 790 T1600 770 V900 H0Z" fill="#e8c78c"/>`
  for (let i = 0; i < 18; i++) {
    const y = 730 + Math.round(rand() * 150)
    const x = Math.round(rand() * 1400)

    out += `<path d="M${x} ${y} q40 -7 80 0 t80 0" fill="none" stroke="#c99a5c" stroke-width="2" opacity=".35" stroke-linecap="round"/>`
  }

  // Saguaros and low scrub at the sides.
  out += saguaro(250, 800, 150, '#58805a', '#a8c9a0') + saguaro(120, 830, 310, '#4f7852', '#a8c9a0')
  out += saguaro(1340, 810, 140, '#58805a', '#a8c9a0') + saguaro(1480, 840, 330, '#4f7852', '#a8c9a0')
  for (const x of [60, 330, 1230, 1560, 1410, 190]) {
    out += `<path d="M${x} 830 q-8 -26 -20 -34 M${x} 830 q0 -34 2 -44 M${x} 830 q10 -24 24 -30" fill="none" stroke="#9a9a5a" stroke-width="3" stroke-linecap="round"/>`
  }

  // Dust blowing across the sand.
  for (let i = 0; i < 26; i++) {
    out += `<circle class="dust" cx="${Math.round(rand() * 1300)}" cy="${700 + Math.round(rand() * 170)}" r="${(1 + rand() * 1.8).toFixed(1)}" fill="#c59a64" style="animation-delay:${(-rand() * 16).toFixed(1)}s;animation-duration:${(11 + rand() * 9).toFixed(1)}s"/>`
  }

  // A tumbleweed rolling past the foot of the dune.
  out += '<g class="weed"><g transform="translate(0 842)"><g class="spin"><g fill="none" stroke="#8a6a3e" stroke-width="2.4" stroke-linecap="round"><circle r="24"/><ellipse rx="24" ry="10"/><ellipse rx="10" ry="24" transform="rotate(28)"/><path d="M-20 -12 L18 14 M-14 18 L20 -10"/></g></g></g></g>'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
