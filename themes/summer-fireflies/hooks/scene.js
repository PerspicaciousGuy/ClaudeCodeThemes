// Summer Fireflies: an original scene of a meadow at dusk. Fireflies blink and
// drift over tall swaying grass, the sky fades from deep blue to a last orange
// glow, a thin moon hangs low and stars come out.
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
.tw{animation:tw var(--d,4s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.sway{animation:sway var(--d,6s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.ff{animation:ff var(--d,12s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.blink{animation:blink var(--e,3s) ease-in-out infinite;animation-delay:var(--m,0s)}
.mist{animation:mist 100s ease-in-out infinite alternate}
@keyframes tw{from{opacity:.25}to{opacity:1}}
@keyframes sway{from{transform:rotate(-1.6deg)}to{transform:rotate(2deg)}}
@keyframes ff{0%{transform:translate(0,0)}33%{transform:translate(var(--x1,40px),var(--y1,-30px))}66%{transform:translate(var(--x2,-30px),var(--y2,-60px))}100%{transform:translate(var(--x3,20px),var(--y3,-20px))}}
@keyframes blink{0%,100%{opacity:.05}40%,60%{opacity:1}}
@keyframes mist{from{transform:translateX(-120px)}to{transform:translateX(140px)}}
@media (prefers-reduced-motion:reduce){.tw,.sway,.ff,.blink,.mist{animation:none}}
`

// A blade of grass: a curved tapering shape from the ground up.
function blade(x, y, h, lean, w, c) {
  return `<path d="M${x - w} ${y} Q ${x + lean * 0.3} ${y - h * 0.6} ${x + lean} ${y - h} Q ${x + lean * 0.3 + w} ${y - h * 0.5} ${x + w} ${y} Z" fill="${c}"/>`
}

export function buildScene() {
  const rand = rng(88)
  const defs =
    vgrad('sky', [[0, '#080c26'], [0.45, '#1c2a5e'], [0.75, '#6a4a7a'], [1, '#e08a5a']]) +
    rgrad('glow', '#ffc87a', 0.7) +
    rgrad('fg', '#f4ff9a', 0.9) +
    rgrad('moon', '#fff4d0', 0.6) +
    vgrad('hill', [[0, '#152040'], [1, '#0a1226']]) +
    rgrad('mi', '#9a8ab8', 0.3)

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/><ellipse cx="800" cy="640" rx="900" ry="220" fill="url(#glow)" opacity=".6"/>`

  // Stars twinkle in groups.
  for (let g = 0; g < 8; g++) {
    let stars = ''

    for (let i = 0; i < 14; i++) {
      stars += `<circle cx="${Math.round(rand() * W)}" cy="${Math.round(rand() * rand() * 420)}" r="${(0.7 + rand() * 1.4).toFixed(1)}" fill="#eef0ff" opacity="${(0.5 + rand() * 0.4).toFixed(2)}"/>`
    }
    out += `<g class="tw" style="--d:${(3 + rand() * 3).toFixed(1)}s;--l:${(-rand() * 5).toFixed(1)}s">${stars}</g>`
  }

  // A thin low moon.
  out += `<circle cx="1210" cy="250" r="110" fill="url(#moon)"/><path d="M1210 214 a 36 36 0 1 0 22 62 a 30 30 0 1 1 -22 -62 Z" fill="#fff4d0"/>`

  // Far hills, a treeline and mist.
  out += `<path d="M0 640 C 220 590 440 625 700 600 C 960 575 1200 625 1420 595 C 1500 585 1560 595 1600 590 L1600 900 L0 900 Z" fill="url(#hill)"/>`

  for (let x = 20; x < 1600; x += 36 + Math.round(rand() * 40)) {
    const h = 40 + Math.round(rand() * 50)

    out += `<ellipse cx="${x}" cy="${(620 - h * 0.4).toFixed(0)}" rx="${(18 + rand() * 18).toFixed(0)}" ry="${h}" fill="#0a1128"/>`
  }
  out += `<g class="mist"><ellipse cx="800" cy="650" rx="1000" ry="70" fill="url(#mi)"/></g>`
  out += `<path d="M0 900 L0 700 C 300 670 600 710 900 690 C 1200 670 1450 705 1600 685 L1600 900 Z" fill="#0b1630"/>`

  // Fireflies: each drifts on its own wander and blinks on its own beat.
  const ffly = (n, y0, y1, s) => {
    let f = ''

    for (let i = 0; i < n; i++) {
      const x = Math.round(rand() * W)
      const y = y0 + Math.round(rand() * (y1 - y0))
      const v = () => Math.round((rand() - 0.5) * 140 * s)

      f += `<g class="ff" style="--d:${(9 + rand() * 9).toFixed(1)}s;--l:${(-rand() * 12).toFixed(1)}s;--x1:${v()}px;--y1:${v()}px;--x2:${v()}px;--y2:${v()}px;--x3:${v()}px;--y3:${v()}px"><g class="blink" style="--e:${(2.4 + rand() * 3).toFixed(1)}s;--m:${(-rand() * 5).toFixed(1)}s"><circle cx="${x}" cy="${y}" r="${(16 * s).toFixed(0)}" fill="url(#fg)"/><circle cx="${x}" cy="${y}" r="${(2.6 * s).toFixed(1)}" fill="#fcffd0"/></g></g>`
    }

    return f
  }

  out += ffly(16, 560, 760, 0.7)

  // Tall grass, two layers, swaying.
  out += `<rect x="0" y="798" width="${W}" height="110" fill="#0d1d36"/>`
  for (const [n, y, h0, hr, col, k] of [[70, 800, 90, 90, '#0d1d36', 1], [60, 900, 130, 140, '#06101e', 2]]) {
    for (let i = 0; i < n; i++) {
      const x = Math.round(rand() * (W + 40) - 20)

      out += `<g class="sway" style="transform-origin:${x}px ${y}px;--d:${(4 + rand() * 4).toFixed(1)}s;--l:${(-rand() * 6).toFixed(1)}s">${blade(x, y, h0 + rand() * hr, Math.round((rand() - 0.5) * 50), 5 + rand() * 4, col)}</g>`
    }
    if (k === 1) {
      out += ffly(12, 640, 840, 1)
    }
  }
  out += ffly(8, 700, 880, 1.3)

  return svg(defs, CSS, out)
}
