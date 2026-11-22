// Chalk Observatory: an original night sky drawn in chalk on a slate board: a
// hilltop observatory whose telescope sweeps the sky, a crescent moon, twinkling
// chalk stars, a constellation that draws itself and the odd shooting star.
// Vector art on a 1600x900 canvas. The still chalk is roughened by a filter;
// the moving parts sit outside it.
// Pure SVG + CSS animation: no script, nothing loaded.

const W = 1600
const H = 900
const BOARD = '#1d2728'
const CHALK = '#eef0e6'
const YELLOW = '#f2d46b'

function rng(seed) {
  let s = seed >>> 0

  return () => {
    s = (s * 1664525 + 1013904223) >>> 0

    return s / 4294967296
  }
}

const CSS = `
.tw{animation:tw 4s ease-in-out infinite alternate}
.tl{transform-origin:1150px 592px;animation:sweep 16s ease-in-out infinite alternate}
.cn{stroke-dasharray:700;stroke-dashoffset:700;animation:draw 18s ease-in-out infinite}
.cd{animation:dot 18s ease-in-out infinite}
.ss{animation:shoot 11s linear infinite}
.ln{animation:lamp 3s ease-in-out infinite alternate}
@keyframes tw{from{opacity:.25}to{opacity:1}}
@keyframes sweep{from{transform:rotate(-14deg)}to{transform:rotate(10deg)}}
@keyframes draw{0%{stroke-dashoffset:700}35%,80%{stroke-dashoffset:0}100%{stroke-dashoffset:700}}
@keyframes dot{0%{opacity:0}30%,80%{opacity:1}100%{opacity:0}}
@keyframes shoot{0%,70%{opacity:0;transform:translate(0,0)}72%{opacity:1}90%{opacity:0;transform:translate(-340px,170px)}100%{opacity:0}}
@keyframes lamp{from{opacity:.7}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.tw,.tl,.ss,.ln,.cd{animation:none}.cn{animation:none;stroke-dashoffset:0}.cd{opacity:1}.ss{opacity:0}}
`

export function buildScene() {
  const rand = rng(77)
  const defs =
    '<filter id="ch" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4" result="d"/><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="8" result="g"/><feColorMatrix in="g" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -2.2 1.7" result="m"/><feComposite in="d" in2="m" operator="in"/></filter>' +
    '<filter id="smudge"><feGaussianBlur stdDeviation="46"/></filter>'

  let art = `<g fill="none" stroke="${CHALK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">`

  // The moon, a crescent with a dotted halo.
  art += `<circle cx="330" cy="190" r="54" fill="${CHALK}" stroke="none"/><circle cx="354" cy="176" r="48" fill="${BOARD}" stroke="none"/>`
  art += `<circle cx="330" cy="190" r="86" stroke-dasharray="3 12" stroke-opacity=".6"/>`

  // Static chalk stars.
  for (let i = 0; i < 46; i++) {
    const x = Math.round(rand() * W)
    const y = Math.round(rand() * 560)
    const r = 3 + Math.round(rand() * 4)

    art += `<path d="M${x - r} ${y}h${2 * r}M${x} ${y - r}v${2 * r}" stroke-width="2.4"/>`
  }

  // The hill, with chalk hatching on its slope.

  art += '<path d="M-10 740 Q300 650 640 710 T1230 686 Q1440 664 1610 720"/>'
  for (let i = 0; i < 30; i++) {
    const x = 20 + i * 54

    art += `<path d="M${x} ${790 + (i % 3) * 20}l40 -34" stroke-opacity=".55" stroke-width="4"/>`
  }
  art += '<path d="M-10 830 Q400 800 800 836 T1610 820" stroke-opacity=".5"/>'

  // The observatory: a drum, a dome with its slit, a door and a step.
  art += '<rect x="1070" y="606" width="160" height="82"/>'
  art += '<path d="M1070 606 A80 80 0 0 1 1230 606"/>'
  art += '<path d="M1138 536 V606 M1162 536 V606"/>'
  art += '<rect x="1136" y="640" width="28" height="48"/>'
  art += '<path d="M1110 622h14M1176 622h14" stroke-width="3"/>'
  art += '</g>'

  let out = `<ellipse cx="800" cy="300" rx="850" ry="300" fill="#26332f" filter="url(#smudge)"/><g filter="url(#ch)">${art}</g>`

  // Twinkling stars, outside the filter so they can fade.
  for (let i = 0; i < 26; i++) {
    const x = Math.round(rand() * W)
    const y = Math.round(rand() * 540)
    const r = 4 + Math.round(rand() * 4)

    out += `<path class="tw" d="M${x - r} ${y}h${2 * r}M${x} ${y - r}v${2 * r}" stroke="${rand() < 0.3 ? YELLOW : CHALK}" stroke-width="2.6" stroke-linecap="round" style="animation-delay:${(-rand() * 4).toFixed(1)}s"/>`
  }

  // A constellation that draws itself, then fades.
  const pts = [[690, 120], [790, 160], [880, 132], [980, 190], [1030, 290], [1160, 300], [1210, 205]]
  const d = 'M' + pts.map(p => p.join(' ')).join(' L')

  out += `<path class="cn" d="${d}" fill="none" stroke="${YELLOW}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-opacity=".8"/>`
  for (const [x, y] of pts) {
    out += `<circle class="cd" cx="${x}" cy="${y}" r="6" fill="${YELLOW}"/>`
  }

  // A shooting star.
  out += `<g class="ss"><path d="M620 70l-90 -44" stroke="${CHALK}" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="622" cy="71" r="5" fill="${CHALK}"/></g>`

  // The telescope sweeping the sky, and a lit window.
  out += `<g class="tl"><path d="M1150 592 L1150 470" stroke="${CHALK}" stroke-width="12" stroke-linecap="round"/><path d="M1150 592 L1150 470" stroke="${BOARD}" stroke-width="5" stroke-linecap="round"/></g>`
  out += `<g class="ln"><rect x="1100" y="652" width="22" height="18" fill="${YELLOW}"/></g>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style><rect width="${W}" height="${H}" fill="${BOARD}"/>${out}</svg>`
}
