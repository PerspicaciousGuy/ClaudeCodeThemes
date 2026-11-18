// Fog Valley: an original misty mountain morning. Soft blue ridges, bands of
// fog drifting between them, low sun rays, a flock of birds and a far balloon.
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

// Ridged value noise, so the peaks are sharp.
function ridged(seed) {
  const r = rng(seed)
  const make = n => {
    const v = Array.from({ length: n + 1 }, () => r())

    return t => {
      const i = ((Math.floor(t) % n) + n) % n
      const f = t - Math.floor(t)
      const s = f * f * (3 - 2 * f)

      return v[i] + (v[i + 1] - v[i]) * s
    }
  }
  const a = make(40)
  const b = make(40)
  const c = make(40)
  const p = v => 1 - Math.abs(2 * v - 1)

  return x => 0.5 * p(a(x / 150)) + 0.32 * p(b(x / 52)) + 0.18 * p(c(x / 19))
}

function ridge(base, amp, seed, fill) {
  const f = ridged(seed)
  let d = `M-10 ${H}`

  for (let x = -10; x <= W + 10; x += 12) {
    d += ` L${x} ${(base - amp * f(x)).toFixed(0)}`
  }

  return `<path d="${d} L${W + 10} ${H} Z" fill="${fill}"/>`
}

function pine(x, y, h, fill) {
  const w = h * 0.38
  let out = ''

  for (let i = 0; i < 5; i++) {
    const ty = y - h + (h * i) / 5.2
    const tw = w * (0.32 + i * 0.2)

    out += `<polygon points="${x},${(ty - h * 0.22).toFixed(0)} ${(x - tw).toFixed(0)},${(ty + h * 0.18).toFixed(0)} ${(x + tw).toFixed(0)},${(ty + h * 0.18).toFixed(0)}" fill="${fill}"/>`
  }

  return out + `<rect x="${x - 3}" y="${y - h * 0.1}" width="6" height="${h * 0.12}" fill="${fill}"/>`
}

const CSS = `
.ray{animation:ray 11s ease-in-out infinite alternate}
.f1{animation:fog 52s ease-in-out infinite alternate}
.f2{animation:fog 74s ease-in-out infinite alternate-reverse}
.f3{animation:fog 63s ease-in-out infinite alternate}
.flock{animation:fly 58s linear infinite}
.fl{animation:flap .9s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center}
.air{animation:air 16s ease-in-out infinite alternate}
@keyframes ray{from{opacity:.25}to{opacity:.9}}
@keyframes fog{from{transform:translateX(-170px)}to{transform:translateX(170px)}}
@keyframes fly{from{transform:translate(-260px,0)}to{transform:translate(1900px,-70px)}}
@keyframes flap{from{transform:scaleY(1)}to{transform:scaleY(.25)}}
@keyframes air{from{transform:translate(0,10px)}to{transform:translate(-26px,-16px)}}
@media (prefers-reduced-motion:reduce){.ray,.f1,.f2,.f3,.flock,.fl,.air{animation:none}}
`

export function buildScene() {
  const rand = rng(14)
  const defs =
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bdd1de"/><stop offset=".55" stop-color="#e8e9e2"/><stop offset="1" stop-color="#f7ebd2"/></linearGradient>' +
    '<radialGradient id="sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffaf0" stop-opacity=".95"/><stop offset=".3" stop-color="#ffefc8" stop-opacity=".5"/><stop offset="1" stop-color="#ffefc8" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6dc" stop-opacity=".55"/><stop offset="1" stop-color="#fff6dc" stop-opacity="0"/></linearGradient>' +
    '<radialGradient id="mist" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".78"/><stop offset=".6" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef3f4" stop-opacity="0"/><stop offset="1" stop-color="#eef3f4" stop-opacity=".9"/></linearGradient>'

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  out += '<circle cx="1210" cy="230" r="360" fill="url(#sun)"/><circle cx="1210" cy="230" r="52" fill="#fffdf6"/>'

  // Low light slanting down through the haze.
  out += '<g class="ray">'
  for (const [x1, x2] of [[1100, 560], [1180, 760], [1260, 960], [1030, 380]]) {
    out += `<polygon points="1210,230 ${x1},900 ${x2},900" fill="url(#beam)" opacity=".32"/>`
  }
  out += '</g>'

  // Ridges, far to near, with fog between them.
  out += ridge(430, 210, 2, '#c8d5de')
  out += '<g class="f1"><ellipse cx="500" cy="450" rx="620" ry="58" fill="url(#mist)"/><ellipse cx="1250" cy="470" rx="520" ry="50" fill="url(#mist)"/></g>'
  out += ridge(510, 230, 9, '#aec0cd')
  out += '<g class="f2"><ellipse cx="900" cy="540" rx="760" ry="66" fill="url(#mist)"/></g>'
  out += ridge(600, 250, 21, '#94aab9')
  out += '<g class="f3"><ellipse cx="400" cy="620" rx="640" ry="62" fill="url(#mist)"/><ellipse cx="1300" cy="640" rx="560" ry="56" fill="url(#mist)"/></g>'
  out += ridge(700, 260, 33, '#7b95a6')
  out += '<g class="f1"><ellipse cx="800" cy="730" rx="900" ry="70" fill="url(#mist)"/></g>'
  out += ridge(820, 250, 47, '#5f7d8f')

  // A far balloon.
  out += '<g class="air"><g transform="translate(1390 360)"><ellipse rx="26" ry="32" fill="#d9876a"/><path d="M-26 0 Q0 52 26 0" fill="#e8b08a" opacity=".6"/><path d="M-12 40 L-7 62 M12 40 L7 62" stroke="#6a5a52" stroke-width="1.5"/><rect x="-8" y="62" width="16" height="10" fill="#6a4a3a"/></g></g>'

  // A flock of birds crossing the valley.
  out += '<g class="flock">'
  for (let i = 0; i < 8; i++) {
    const x = Math.round(i * 46 + rand() * 20)
    const y = 300 + Math.round(rand() * 80 + Math.abs(i - 3) * 14)

    out += `<path class="fl" d="M${x - 11} ${y} Q${x - 5} ${y - 8} ${x} ${y} Q${x + 5} ${y - 8} ${x + 11} ${y}" fill="none" stroke="#4a5a68" stroke-width="2.2" stroke-linecap="round" style="animation-delay:${(-rand()).toFixed(2)}s"/>`
  }
  out += '</g>'

  // Pines at the edges.
  const tree = '#2f4a58'

  out += pine(70, 920, 420, tree) + pine(200, 900, 290, tree) + pine(-20, 880, 330, tree) + pine(310, 910, 180, '#3a5664')
  out += pine(1530, 920, 440, tree) + pine(1400, 900, 300, tree) + pine(1630, 880, 340, tree) + pine(1290, 910, 190, '#3a5664')

  // Mist on the ground in front.
  out += `<rect x="0" y="720" width="${W}" height="180" fill="url(#floor)"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
