// Woodcut Cabin: an original winter print. Two inks on cream paper, in the
// manner of a woodblock print: a cut-line sky, hatched hills, black pines, a
// log cabin with one orange window, smoke and falling snow.
// Vector art on a 1600x900 canvas. The still art is roughened by a filter;
// the moving parts sit outside it.
// Pure SVG + CSS animation: no script, nothing loaded.

const W = 1600
const H = 900
const INK = '#1b1712'
const PAPER = '#efe5cf'
const RED = '#d8572f'

function rng(seed) {
  let s = seed >>> 0

  return () => {
    s = (s * 1664525 + 1013904223) >>> 0

    return s / 4294967296
  }
}

function hills(base, amp, seed, fill, extra = '') {
  const r = rng(seed)
  const p1 = r() * 6.28
  const p2 = r() * 6.28
  let d = `M-10 ${H}`

  for (let x = -10; x <= W + 10; x += 16) {
    d += ` L${x} ${(base - amp * (0.6 * Math.sin(x / 190 + p1) + 0.4 * Math.sin(x / 83 + p2))).toFixed(0)}`
  }

  return `<path d="${d} L${W + 10} ${H} Z" fill="${fill}" ${extra}/>`
}

// A pine cut as four black tiers with a trunk.
function pine(x, y, h) {
  const w = h * 0.4
  let out = ''

  for (let i = 0; i < 4; i++) {
    const ty = y - h + (h * i) / 4.4
    const tw = w * (0.42 + i * 0.22)
    const top = ty - h * 0.24
    const bot = ty + h * 0.2

    out += `<polygon points="${x},${top.toFixed(0)} ${(x - tw).toFixed(0)},${bot.toFixed(0)} ${(x + tw).toFixed(0)},${bot.toFixed(0)}" fill="${INK}"/>`
  }

  return out + `<rect x="${x - 4}" y="${y - h * 0.1}" width="8" height="${h * 0.12}" fill="${INK}"/>`
}

const CSS = `
.sun{animation:sun 9s ease-in-out infinite alternate}
.fl{animation:flick 3.4s ease-in-out infinite alternate}
.sm{animation:smoke 9s ease-out infinite}
.s1{animation:fall 24s linear infinite}
.s2{animation:fall 15s linear infinite}
.s3{animation:fall 9s linear infinite}
@keyframes sun{from{opacity:.82}to{opacity:1}}
@keyframes flick{0%{opacity:.78}40%{opacity:1}70%{opacity:.88}100%{opacity:.96}}
@keyframes smoke{0%{opacity:0;transform:translate(0,0) scale(.5)}15%{opacity:.9}100%{opacity:0;transform:translate(70px,-190px) scale(2.6)}}
@keyframes fall{from{transform:translate(0,-30px)}to{transform:translate(-70px,960px)}}
@media (prefers-reduced-motion:reduce){.sun,.fl,.sm,.s1,.s2,.s3{animation:none}}
`

export function buildScene() {
  const rand = rng(31)
  const defs =
    '<filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7"/></filter>' +
    `<pattern id="hz" width="14" height="11" patternUnits="userSpaceOnUse"><rect width="14" height="2.6" fill="${INK}"/></pattern>` +
    `<pattern id="hz2" width="22" height="14" patternUnits="userSpaceOnUse"><rect width="22" height="2.5" fill="${INK}"/></pattern>` +
    `<pattern id="dg" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="12" height="3.5" fill="${INK}"/></pattern>`

  const cx = 1170
  const cy = 690
  let art = ''

  // Sky: horizontal cut lines, sparser near the top where the words sit.
  art += `<rect width="${W}" height="640" fill="url(#hz)"/>`

  // Hills: hatched far ridge, solid black middle ridge, paper foreground.
  art += hills(610, 70, 3, PAPER, `stroke="${INK}" stroke-width="6"`) + hills(610, 70, 3, 'url(#dg)')
  art += hills(680, 55, 8, INK) + hills(760, 38, 13, PAPER, `stroke="${INK}" stroke-width="6"`)

  // The cabin: paper logs, black roof with a paper snow edge, one orange window.
  art += `<rect x="${cx - 100}" y="${cy - 92}" width="200" height="98" fill="${PAPER}" stroke="${INK}" stroke-width="5"/>`
  art += `<rect x="${cx - 100}" y="${cy - 92}" width="200" height="98" fill="url(#hz2)" opacity=".55"/>`
  art += `<polygon points="${cx - 126},${cy - 88} ${cx},${cy - 168} ${cx + 126},${cy - 88}" fill="${INK}"/>`
  art += `<polygon points="${cx - 126},${cy - 88} ${cx},${cy - 168} ${cx + 126},${cy - 88} ${cx + 108},${cy - 88} ${cx},${cy - 150} ${cx - 108},${cy - 88}" fill="${PAPER}"/>`
  art += `<rect x="${cx + 52}" y="${cy - 186}" width="26" height="64" fill="${PAPER}" stroke="${INK}" stroke-width="5"/>`
  art += `<rect x="${cx + 12}" y="${cy - 62}" width="46" height="68" fill="${INK}"/>`
  art += `<path d="M0 840 Q300 790 640 830 T1300 822 T1600 800 V900 H0Z" fill="${PAPER}" stroke="${INK}" stroke-width="6"/>`

  // Trees, small along the far ridge and large at the edges.
  for (let i = 0; i < 16; i++) {
    const x = Math.round(rand() * W)

    if (x > 520 && x < 1330) {
      continue
    }
    art += pine(x, 666 + Math.round(rand() * 12), 50 + Math.round(rand() * 30))
  }
  art += pine(90, 905, 400) + pine(230, 890, 270) + pine(-20, 870, 320) + pine(1500, 905, 430) + pine(1640, 870, 330)

  let out = `<rect width="${W}" height="${H}" fill="${PAPER}"/><g filter="url(#rough)">${art}</g>`

  // The sun: a ring on the paper, pulsing a little.
  out += `<g class="sun"><circle cx="330" cy="200" r="86" fill="${PAPER}" stroke="${INK}" stroke-width="6"/><circle cx="330" cy="200" r="60" fill="none" stroke="${INK}" stroke-width="4" stroke-dasharray="6 10"/></g>`

  // The window, glowing orange with its cross-bars.
  out += `<g class="fl"><rect x="${cx - 78}" y="${cy - 66}" width="52" height="42" fill="${RED}" stroke="${INK}" stroke-width="4"/><path d="M${cx - 52} ${cy - 66}v42M${cx - 78} ${cy - 45}h52" stroke="${INK}" stroke-width="3"/></g>`

  // Smoke: paper puffs outlined in ink.
  for (let i = 0; i < 6; i++) {
    out += `<circle class="sm" cx="${cx + 65}" cy="${cy - 196}" r="10" fill="${PAPER}" stroke="${INK}" stroke-width="3" style="animation-delay:${(-i * 1.5).toFixed(1)}s"/>`
  }

  // Snow: paper flakes with an ink edge, in three layers.
  const flakes = (n, rMin, rMax, cls, dur, op) => {
    for (let i = 0; i < n; i++) {
      out += `<circle class="${cls}" cx="${Math.round(rand() * (W + 120))}" cy="0" r="${(rMin + rand() * (rMax - rMin)).toFixed(1)}" fill="${PAPER}" stroke="${INK}" stroke-width="1.4" opacity="${op}" style="animation-delay:${(-rand() * dur).toFixed(1)}s"/>`
    }
  }

  flakes(50, 1.8, 2.6, 's1', 24, 0.85)
  flakes(28, 2.6, 3.6, 's2', 15, 0.9)
  flakes(12, 4, 5.4, 's3', 9, 0.95)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
