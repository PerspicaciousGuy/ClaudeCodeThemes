// Winter Lights: an original scene of a snowy night decorated for the holidays.
// Strings of colored lights sag across the sky and twinkle in three phases, fir
// trees and a cottage wear lights of their own, and snow falls over deep drifts.
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

// A vertical gradient from a list of [offset, color] stops.
function vgrad(id, stops) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a === undefined ? '' : ` stop-opacity="${a}"`}/>`).join('')}</linearGradient>`
}

function rgrad(id, color, inner = 0.7) {
  return `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${inner}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`
}

const CSS = `
.b0{animation:bl 2.4s ease-in-out infinite alternate}
.b1{animation:bl 2.4s ease-in-out -.8s infinite alternate}
.b2{animation:bl 2.4s ease-in-out -1.6s infinite alternate}
.snow{animation:snow var(--d,16s) linear infinite;animation-delay:var(--l,0s)}
.tw{animation:bl var(--d,4s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.win{animation:bl 5s ease-in-out infinite alternate}
@keyframes bl{from{opacity:.3}to{opacity:1}}
@keyframes snow{0%{transform:translate(0,-30px)}50%{transform:translate(calc(var(--dx,40px) * -.5),480px)}100%{transform:translate(var(--dx,40px),960px)}}
@media (prefers-reduced-motion:reduce){.b0,.b1,.b2,.snow,.tw,.win{animation:none}}
`

const COLORS = ['#ff5a5a', '#ffd24a', '#5ad0ff', '#7aff8a', '#ff8ae0']

export function buildScene() {
  const rand = rng(99)
  const ph = ['', '', '']
  let k = 0
  const defs =
    vgrad('sky', [[0, '#080e28'], [0.6, '#16215a'], [1, '#2c3a7a']]) +
    vgrad('snow', [[0, '#e8f0ff'], [1, '#aebde4']]) +
    rgrad('mo', '#fff6dc', 0.7) +
    COLORS.map((c, i) => rgrad(`bg${i}`, c, 0.85)).join('')

  // A bulb with a soft glow, added to one of the three blinking phases.
  const bulb = (x, y, r = 1) => {
    const i = k++ % COLORS.length

    ph[k % 3] += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(15 * r).toFixed(0)}" fill="url(#bg${i})"/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(4 * r).toFixed(1)}" fill="${COLORS[i]}"/>`
  }

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  for (let g = 0; g < 6; g++) {
    let st = ''

    for (let i = 0; i < 14; i++) {
      st += `<circle cx="${Math.round(rand() * W)}" cy="${Math.round(rand() * rand() * 400)}" r="${(0.7 + rand() * 1.4).toFixed(1)}" fill="#e8ecff" opacity="${(0.5 + rand() * 0.4).toFixed(2)}"/>`
    }
    out += `<g class="tw" style="--d:${(3 + rand() * 3).toFixed(1)}s;--l:${(-rand() * 5).toFixed(1)}s">${st}</g>`
  }
  out += `<circle cx="1230" cy="200" r="260" fill="url(#mo)"/><circle cx="1230" cy="200" r="62" fill="#fff6dc"/>`

  // Distant hills of snow.
  out += `<path d="M0 640 C 240 580 480 630 760 600 C 1040 570 1300 630 1600 590 L1600 900 L0 900 Z" fill="#4a5a9a"/><path d="M0 700 C 300 660 560 710 860 686 C 1140 662 1400 706 1600 676 L1600 900 L0 900 Z" fill="#6a7ab4"/>`

  // Fir trees at the sides, each a stack of triangles with lights.
  const fir = (x, base, h) => {
    let t = `<rect x="${x - 10}" y="${base - 30}" width="20" height="40" fill="#3a2a2a"/>`

    for (let i = 0; i < 4; i++) {
      const w = h * (0.34 - i * 0.06)
      const y = base - 30 - i * h * 0.22

      t += `<polygon points="${x - w},${y} ${x},${(y - h * 0.34).toFixed(0)} ${x + w},${y}" fill="#12402e"/><path d="M${(x - w * 0.9).toFixed(0)} ${(y - 6).toFixed(0)} Q ${x} ${(y - 22).toFixed(0)} ${(x + w * 0.9).toFixed(0)} ${(y - 6).toFixed(0)}" stroke="#e8f0ff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".8"/>`
    }
    for (let i = 0; i < 18; i++) {
      const t0 = rand()
      const y = base - 60 - t0 * h * 0.7
      const w = (1 - t0) * h * 0.3

      bulb(x + (rand() * 2 - 1) * w, y, 1)
    }

    return t
  }

  out += fir(150, 800, 420) + fir(330, 830, 300) + fir(1450, 810, 440) + fir(1270, 840, 320)

  // A cottage at the left with a lit window and lights along the eaves.
  out += `<rect x="470" y="690" width="170" height="110" fill="#3a2a3e"/><polygon points="455,692 555,630 655,692" fill="#e8f0ff"/><polygon points="470,692 555,640 640,692" fill="#4a3050"/><g class="win"><rect x="500" y="725" width="40" height="40" fill="#ffc86a"/><rect x="570" y="725" width="40" height="40" fill="#ffc86a"/></g><rect x="544" y="755" width="26" height="45" fill="#2a1c2e"/>`
  for (let i = 0; i <= 8; i++) {
    bulb(458 + i * 24.4, 690 - Math.abs(i - 4) * -0 - 0, 0.8)
  }

  // Strings of lights across the top, each a gentle sag.
  const strand = (x0, y0, x1, y1, sag, n) => {
    const cx = (x0 + x1) / 2
    const cy = (y0 + y1) / 2 + sag

    out += `<path d="M${x0} ${y0} Q ${cx} ${cy} ${x1} ${y1}" fill="none" stroke="#1a1a2a" stroke-width="3"/>`
    for (let i = 1; i < n; i++) {
      const t = i / n
      const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1
      const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1

      bulb(x, y + 8, 1)
    }
  }

  strand(-20, 60, 520, 120, 80, 14)
  strand(520, 120, 1020, 40, 90, 14)
  strand(1020, 40, 1620, 130, 90, 16)
  strand(-20, 190, 380, 250, 60, 10)

  // The snowy ground over everything below.
  out += `<path d="M0 900 L0 800 C 280 770 560 815 860 796 C 1160 776 1420 812 1600 790 L1600 900 Z" fill="url(#snow)"/>`

  out += `<g class="b0">${ph[0]}</g><g class="b1">${ph[1]}</g><g class="b2">${ph[2]}</g>`

  // Falling snow.
  for (let i = 0; i < 60; i++) {
    out += `<g class="snow" style="--d:${(11 + rand() * 12).toFixed(1)}s;--l:${(-rand() * 22).toFixed(1)}s;--dx:${Math.round(rand() * 120 - 40)}px"><circle cx="${Math.round(rand() * W)}" cy="0" r="${(1.6 + rand() * 3.2).toFixed(1)}" fill="#ffffff" fill-opacity="${(0.6 + rand() * 0.4).toFixed(2)}"/></g>`
  }

  return svg(defs, CSS, out)
}
