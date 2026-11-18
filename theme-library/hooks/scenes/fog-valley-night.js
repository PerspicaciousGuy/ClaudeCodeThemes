// Fog Valley Night: an original misty mountain night. The night twin of Fog
// Valley: a moon over deep-blue ridges with pale fog drifting between them,
// moonbeams, stars, fireflies in the pines and a sky lantern rising.
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
.tw{opacity:var(--o,1);animation:tw 5s ease-in-out infinite}
.ray{animation:ray 12s ease-in-out infinite alternate}
.f1{animation:fog 52s ease-in-out infinite alternate}
.f2{animation:fog 74s ease-in-out infinite alternate-reverse}
.f3{animation:fog 63s ease-in-out infinite alternate}
.ff{animation:ff 9s ease-in-out infinite}
.lantern{animation:rise 48s linear infinite}
.lg{animation:lg 2.4s ease-in-out infinite alternate}
.shoot{animation:shoot 19s linear infinite}
@keyframes tw{0%,100%{opacity:var(--o,1)}50%{opacity:calc(var(--o,1)*.25)}}
@keyframes ray{from{opacity:.2}to{opacity:.8}}
@keyframes fog{from{transform:translateX(-170px)}to{transform:translateX(170px)}}
@keyframes ff{0%{opacity:0;transform:translate(0,0)}25%{opacity:1}70%{opacity:.5;transform:translate(14px,-18px)}100%{opacity:0;transform:translate(-8px,-34px)}}
@keyframes rise{from{transform:translate(0,40px)}to{transform:translate(-160px,-420px)}}
@keyframes lg{from{opacity:.75}to{opacity:1}}
@keyframes shoot{0%,92%{opacity:0;transform:translate(0,0)}93%{opacity:1}100%{opacity:0;transform:translate(-320px,150px)}}
@media (prefers-reduced-motion:reduce){.tw,.ray,.f1,.f2,.f3,.ff,.lantern,.lg,.shoot{animation:none}}
`

export function buildScene() {
  const rand = rng(15)
  const defs =
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b20"/><stop offset=".55" stop-color="#16224a"/><stop offset="1" stop-color="#2c3c6a"/></linearGradient>' +
    '<radialGradient id="moon" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#e8f0ff" stop-opacity=".55"/><stop offset=".35" stop-color="#cfdcff" stop-opacity=".22"/><stop offset="1" stop-color="#cfdcff" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dce8ff" stop-opacity=".4"/><stop offset="1" stop-color="#dce8ff" stop-opacity="0"/></linearGradient>' +
    '<radialGradient id="mist" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#8aa0d0" stop-opacity=".5"/><stop offset=".6" stop-color="#8aa0d0" stop-opacity=".2"/><stop offset="1" stop-color="#8aa0d0" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="warm" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffc874" stop-opacity=".6"/><stop offset="1" stop-color="#ffc874" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1226" stop-opacity="0"/><stop offset="1" stop-color="#0a1226" stop-opacity=".85"/></linearGradient>' +
    '<linearGradient id="sg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".9"/></linearGradient>'

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  for (let i = 0; i < 140; i++) {
    const cx = Math.round(rand() * W)
    const cy = Math.round(rand() * 420)
    const r = (0.5 + rand() * 1.2).toFixed(1)
    const o = (0.35 + rand() * 0.55).toFixed(2)

    out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#e8ecff"${rand() < 0.3 ? ` class="tw" style="--o:${o};animation-delay:${(-rand() * 5).toFixed(1)}s"` : ` opacity="${o}"`}/>`
  }
  out += '<g class="shoot"><g transform="translate(1000 70) rotate(24)"><rect width="110" height="2" fill="url(#sg)"/></g></g>'

  // The moon and its beams.
  out += '<circle cx="1210" cy="230" r="360" fill="url(#moon)"/><circle cx="1210" cy="230" r="50" fill="#f4f8ff"/><circle cx="1196" cy="218" r="9" fill="#d8e2f4"/><circle cx="1226" cy="244" r="12" fill="#d8e2f4"/>'
  out += '<g class="ray">'
  for (const [x1, x2] of [[1100, 560], [1180, 760], [1260, 960], [1030, 380]]) {
    out += `<polygon points="1210,230 ${x1},900 ${x2},900" fill="url(#beam)" opacity=".3"/>`
  }
  out += '</g>'

  // Ridges, far to near, with fog between them.
  out += ridge(430, 210, 2, '#1c2a52')
  out += '<g class="f1"><ellipse cx="500" cy="450" rx="620" ry="58" fill="url(#mist)"/><ellipse cx="1250" cy="470" rx="520" ry="50" fill="url(#mist)"/></g>'
  out += ridge(510, 230, 9, '#18244a')
  out += '<g class="f2"><ellipse cx="900" cy="540" rx="760" ry="66" fill="url(#mist)"/></g>'
  out += ridge(600, 250, 21, '#131d3e')
  out += '<g class="f3"><ellipse cx="400" cy="620" rx="640" ry="62" fill="url(#mist)"/><ellipse cx="1300" cy="640" rx="560" ry="56" fill="url(#mist)"/></g>'
  out += ridge(700, 260, 33, '#0f1832')
  out += '<g class="f1"><ellipse cx="800" cy="730" rx="900" ry="70" fill="url(#mist)"/></g>'
  out += ridge(820, 250, 47, '#0a1226')

  // A sky lantern, rising slowly at the right.
  out += '<g class="lantern"><g transform="translate(1390 560)"><g class="lg"><circle r="46" fill="url(#warm)"/><rect x="-11" y="-14" width="22" height="26" rx="4" fill="#ffb460"/><rect x="-11" y="-14" width="22" height="6" rx="3" fill="#ffd48a"/><rect x="-5" y="12" width="10" height="3" fill="#7a3a1a"/></g></g></g>'

  // Pines at the edges.
  const tree = '#060c1c'

  out += pine(70, 920, 420, tree) + pine(200, 900, 290, tree) + pine(-20, 880, 330, tree) + pine(310, 910, 180, '#0a1226')
  out += pine(1530, 920, 440, tree) + pine(1400, 900, 300, tree) + pine(1630, 880, 340, tree) + pine(1290, 910, 190, '#0a1226')

  // Fireflies among the trees.
  for (let i = 0; i < 26; i++) {
    const left = i % 2 === 0
    const x = (left ? 30 + rand() * 330 : 1240 + rand() * 330).toFixed(0)
    const y = (560 + rand() * 280).toFixed(0)

    out += `<g class="ff" style="animation-delay:${(-rand() * 9).toFixed(1)}s;animation-duration:${(6 + rand() * 6).toFixed(1)}s"><circle cx="${x}" cy="${y}" r="7" fill="#d8ff7a" opacity=".2"/><circle cx="${x}" cy="${y}" r="2" fill="#f0ffb0"/></g>`
  }

  // Mist on the ground in front.
  out += `<rect x="0" y="720" width="${W}" height="180" fill="url(#floor)"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
