// Aurora Field: an original night scene of northern lights over a frozen lake
// ringed by pines. Vector art on a 1600x900 canvas.
// Pure SVG + CSS animation: no script, nothing loaded.

const W = 1600
const H = 900
const LAKE = 700

function rng(seed) {
  let s = seed >>> 0

  return () => {
    s = (s * 1664525 + 1013904223) >>> 0

    return s / 4294967296
  }
}

// One curtain of light: a wavy top edge, a wavy hanging hem. `topAt(x)` gives
// the top edge's height so rays can hang from it.
function ribbon(y0, amp, h, phase) {
  const n = 56
  const top = []
  const hem = []
  const at = i => y0 + amp * Math.sin(i * 0.33 + phase) + amp * 0.45 * Math.sin(i * 0.85 + phase * 2)

  for (let i = 0; i <= n; i++) {
    const x = (i * (W + 200)) / n - 100
    const y = at(i)

    top.push([x, y])
    hem.push([x, y + h * (0.9 + 0.22 * Math.sin(i * 0.5 + phase * 1.3))])
  }

  const p = a => a.map(([x, y]) => `${x.toFixed(0)} ${y.toFixed(0)}`).join(' L')

  return { d: `M${p(top)} L${p(hem.reverse())} Z`, topAt: x => at(((x + 100) * n) / (W + 200)) }
}

// Mountain ridges: ridged value noise, so the peaks are sharp.
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

  return x => 0.45 * p(a(x / 120)) + 0.35 * p(b(x / 46)) + 0.2 * p(c(x / 17))
}

function pine(x, y, h, fill) {
  const w = h * 0.42
  let out = ''

  for (let i = 0; i < 4; i++) {
    const ty = y - h + (h * i) / 4.6
    const tw = w * (0.4 + i * 0.22)

    out += `<polygon points="${x},${(ty - h * 0.26).toFixed(0)} ${(x - tw).toFixed(0)},${(ty + h * 0.2).toFixed(0)} ${(x + tw).toFixed(0)},${(ty + h * 0.2).toFixed(0)}" fill="${fill}"/>`
  }

  return out + `<rect x="${x - 4}" y="${y - h * 0.1}" width="8" height="${h * 0.12}" fill="${fill}"/>`
}

const CSS = `
.tw{opacity:var(--o,1);animation:tw 5s ease-in-out infinite}
.a1{transform-origin:800px 320px;animation:s1 17s ease-in-out infinite alternate}
.a2{transform-origin:800px 320px;animation:s2 23s ease-in-out infinite alternate}
.a3{transform-origin:800px 320px;animation:s1 29s ease-in-out infinite alternate-reverse}
.shoot{animation:shoot 13s linear infinite}
.sh{animation:sh 6s ease-in-out infinite}
@keyframes tw{0%,100%{opacity:var(--o,1)}50%{opacity:calc(var(--o,1)*.25)}}
@keyframes s1{from{transform:translateX(-60px) skewX(-4deg);opacity:.7}to{transform:translateX(60px) skewX(4deg);opacity:1}}
@keyframes s2{from{transform:translateX(50px) skewX(3deg);opacity:1}to{transform:translateX(-50px) skewX(-3deg);opacity:.65}}
@keyframes shoot{0%,92%{opacity:0;transform:translate(0,0)}93%{opacity:1}100%{opacity:0;transform:translate(-340px,160px)}}
@keyframes sh{0%,100%{opacity:.08}50%{opacity:.3}}
@media (prefers-reduced-motion:reduce){.tw,.a1,.a2,.a3,.shoot,.sh{animation:none}}
`

export function buildScene() {
  const rand = rng(33)
  const defs =
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#040913"/><stop offset=".55" stop-color="#0a2236"/><stop offset="1" stop-color="#14495a"/></linearGradient>' +
    '<linearGradient id="gA" gradientUnits="userSpaceOnUse" x1="0" y1="130" x2="0" y2="560"><stop offset="0" stop-color="#3ddc97" stop-opacity="0"/><stop offset=".25" stop-color="#3ddc97" stop-opacity=".6"/><stop offset=".7" stop-color="#2bd4c7" stop-opacity=".28"/><stop offset="1" stop-color="#2bd4c7" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="gB" gradientUnits="userSpaceOnUse" x1="0" y1="250" x2="0" y2="580"><stop offset="0" stop-color="#9b87f5" stop-opacity="0"/><stop offset=".3" stop-color="#9b87f5" stop-opacity=".42"/><stop offset=".8" stop-color="#5aa8ff" stop-opacity=".16"/><stop offset="1" stop-color="#5aa8ff" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="gRay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9dffd0" stop-opacity=".0"/><stop offset=".2" stop-color="#9dffd0" stop-opacity=".5"/><stop offset="1" stop-color="#9dffd0" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="gC" gradientUnits="userSpaceOnUse" x1="0" y1="100" x2="0" y2="380"><stop offset="0" stop-color="#7dffb0" stop-opacity="0"/><stop offset=".3" stop-color="#7dffb0" stop-opacity=".4"/><stop offset="1" stop-color="#7dffb0" stop-opacity="0"/></linearGradient>' +
    `<linearGradient id="lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#17505e"/><stop offset="1" stop-color="#050f18"/></linearGradient>` +
    '<linearGradient id="sg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".9"/></linearGradient>'

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  for (let i = 0; i < 140; i++) {
    const r = 0.6 + rand() * 1.3
    const tw = rand() < 0.3

    const cx = Math.round(rand() * W)
    const cy = Math.round(rand() * 520)
    const o = (0.4 + rand() * 0.5).toFixed(2)

    out += `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" fill="#e8f0ff"${tw ? ` class="tw" style="--o:${o};animation-delay:${(-rand() * 5).toFixed(1)}s"` : ` opacity="${o}"`}/>`
  }
  out += '<g class="shoot"><g transform="translate(1250 90) rotate(25)"><rect width="110" height="2" fill="url(#sg)"/></g></g>'

  const A = ribbon(210, 46, 250, 0.4)
  const B = ribbon(300, 38, 210, 2.2)
  const C = ribbon(150, 30, 170, 4.1)
  let rays = ''

  for (let x = -20; x < W + 20; x += 26) {
    rays += `<rect x="${x}" y="${A.topAt(x).toFixed(0)}" width="${(4 + rand() * 6).toFixed(0)}" height="${(130 + rand() * 190).toFixed(0)}" fill="url(#gRay)" class="sh" style="animation-duration:${(4 + rand() * 5).toFixed(1)}s;animation-delay:${(-rand() * 6).toFixed(1)}s"/>`
  }

  const curtains = `<g class="a3"><path d="${C.d}" fill="url(#gC)"/></g><g class="a2"><path d="${B.d}" fill="url(#gB)"/></g><g class="a1"><path d="${A.d}" fill="url(#gA)"/>${rays}</g>`

  out += curtains

  // Far ridge, nearer hills, the lake.
  const ridge = (base, amp, seed, fill) => {
    const f = ridged(seed)
    let d = `M-10 ${H}`

    for (let x = -10; x <= W + 10; x += 14) {
      d += ` L${x} ${(base - amp * f(x)).toFixed(0)}`
    }

    return `<path d="${d} L${W + 10} ${H} Z" fill="${fill}"/>`
  }

  out += ridge(LAKE - 6, 230, 7, '#0a2736') + ridge(LAKE + 6, 120, 19, '#0f3547')
  out += `<rect x="0" y="${LAKE}" width="${W}" height="${H - LAKE}" fill="url(#lake)"/>`
  out += `<g opacity=".2" transform="translate(0 ${LAKE + 150}) scale(1 -0.4)">${curtains}</g>`
  for (let i = 0; i < 14; i++) {
    out += `<rect x="${Math.round(rand() * (W - 200))}" y="${LAKE + 14 + Math.round(rand() * 170)}" width="${60 + Math.round(rand() * 160)}" height="2" fill="#bdf5e6" class="sh" style="animation-delay:${(-rand() * 6).toFixed(1)}s"/>`
  }

  // Pines: small along the far shore, big at the edges.
  for (let i = 0; i < 26; i++) {
    const x = Math.round(rand() * W)

    if (x > 520 && x < 1080) {
      continue
    }
    out += pine(x, LAKE + 4, 70 + rand() * 70, '#06161f')
  }
  out += pine(70, 900, 360, '#030c13') + pine(210, 880, 250, '#040f17') + pine(1520, 900, 380, '#030c13') + pine(1390, 870, 240, '#040f17') + pine(-10, 840, 300, '#030c13')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
