// Cassette Futurism: an original scene of a 1980s idea of the future. An amber
// monochrome control console with a sweeping radar, scrolling data bars, two
// cassette reels turning, blinking status lights and a faint scanline glow.
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
.sweep{animation:turn 6s linear infinite;transform-origin:300px 450px}
.reel{animation:turn 8s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
.reel2{animation:turn 11s linear infinite reverse;transform-box:fill-box;transform-origin:50% 50%}
.bars{animation:bars var(--d,3s) ease-in-out infinite alternate;animation-delay:var(--l,0s);transform-box:fill-box;transform-origin:50% 100%}
.blink{animation:blink var(--d,2s) steps(1) infinite;animation-delay:var(--l,0s)}
.scan{animation:scan 8s linear infinite}
.data{animation:data 12s linear infinite}
@keyframes turn{to{transform:rotate(360deg)}}
@keyframes bars{from{transform:scaleY(.25)}to{transform:scaleY(1)}}
@keyframes blink{0%,49%{opacity:1}50%,100%{opacity:.15}}
@keyframes scan{from{transform:translateY(-60px)}to{transform:translateY(960px)}}
@keyframes data{from{transform:translateY(0)}to{transform:translateY(-120px)}}
@media (prefers-reduced-motion:reduce){.sweep,.reel,.reel2,.bars,.blink,.scan,.data{animation:none}}
`

const A = '#ffb030'
const D = '#7a5410'

export function buildScene() {
  const rand = rng(84)
  const defs =
    vgrad('bg', [[0, '#1a1006'], [1, '#0c0803']]) +
    `<linearGradient id="sw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${A}" stop-opacity="0"/><stop offset="1" stop-color="${A}" stop-opacity=".6"/></linearGradient>` +
    `<linearGradient id="sc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${A}" stop-opacity="0"/><stop offset=".5" stop-color="${A}" stop-opacity=".12"/><stop offset="1" stop-color="${A}" stop-opacity="0"/></linearGradient>` +
    `<pattern id="ln" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1.4" fill="#000" opacity=".28"/></pattern>`

  let out = `<rect width="${W}" height="${H}" fill="url(#bg)"/>`

  // The console frame.
  out += `<rect x="30" y="30" width="${W - 60}" height="${H - 60}" rx="26" fill="none" stroke="#3a2a10" stroke-width="10"/><rect x="50" y="50" width="${W - 100}" height="${H - 100}" rx="18" fill="none" stroke="${D}" stroke-width="3"/>`

  // The radar on the left: rings, a sweep and a few blips.
  out += `<g stroke="${D}" stroke-width="2" fill="none"><circle cx="300" cy="450" r="60"/><circle cx="300" cy="450" r="120"/><circle cx="300" cy="450" r="180"/><circle cx="300" cy="450" r="230" stroke="${A}" stroke-width="3"/><line x1="70" y1="450" x2="530" y2="450"/><line x1="300" y1="220" x2="300" y2="680"/></g>`
  out += `<g class="sweep"><path d="M300 450 L300 220 A 230 230 0 0 1 468 290 Z" fill="url(#sw)"/><line x1="300" y1="450" x2="300" y2="220" stroke="${A}" stroke-width="3"/></g>`
  for (let i = 0; i < 6; i++) {
    out += `<g class="blink" style="--d:${(3 + rand() * 3).toFixed(1)}s;--l:${(-rand() * 4).toFixed(1)}s"><circle cx="${(300 + (rand() - 0.5) * 380).toFixed(0)}" cy="${(450 + (rand() - 0.5) * 380).toFixed(0)}" r="6" fill="${A}"/></g>`
  }

  // A spectrum of bars at the top right.
  for (let i = 0; i < 28; i++) {
    out += `<rect class="bars" x="${1020 + i * 18}" y="${110 + (1 - 1) * 0}" width="11" height="${(60 + rand() * 90).toFixed(0)}" fill="${A}" style="--d:${(1.2 + rand() * 2.4).toFixed(1)}s;--l:${(-rand() * 3).toFixed(1)}s"/>`
  }
  out += `<line x1="1010" y1="274" x2="1530" y2="274" stroke="${D}" stroke-width="3"/>`

  // Columns of scrolling data blocks on the right.
  let cols = ''

  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 22; r++) {
      const w = 20 + Math.round(rand() * 70)

      cols += `<rect x="${1020 + c * 130}" y="${320 + r * 24}" width="${w}" height="9" fill="${rand() < 0.18 ? A : D}"/>`
    }
  }
  out += `<clipPath id="dc"><rect x="1010" y="310" width="520" height="290"/></clipPath><g clip-path="url(#dc)"><g class="data">${cols}</g></g>`

  // Two cassette reels at the bottom right.
  for (const [cx, k] of [[1130, 'reel'], [1380, 'reel2']]) {
    out += `<circle cx="${cx}" cy="720" r="70" fill="none" stroke="${A}" stroke-width="5"/><circle cx="${cx}" cy="720" r="24" fill="none" stroke="${D}" stroke-width="3"/><g class="${k}">`
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2

      out += `<line x1="${cx}" y1="720" x2="${(cx + Math.cos(a) * 58).toFixed(0)}" y2="${(720 + Math.sin(a) * 58).toFixed(0)}" stroke="${A}" stroke-width="5" stroke-linecap="round"/>`
    }
    out += `</g>`
  }
  out += `<path d="M1130 790 H1380" stroke="${D}" stroke-width="4"/><rect x="1070" y="640" width="370" height="170" rx="14" fill="none" stroke="${D}" stroke-width="3"/>`

  // Status lights along the bottom left.
  for (let i = 0; i < 8; i++) {
    out += `<g class="blink" style="--d:${(1.2 + rand() * 2.5).toFixed(1)}s;--l:${(-rand() * 3).toFixed(1)}s"><circle cx="${120 + i * 44}" cy="800" r="10" fill="${A}"/></g>`
  }

  // Scanlines over the whole screen, and a slow bright band rolling down.
  out += `<rect width="${W}" height="${H}" fill="url(#ln)"/><g class="scan"><rect x="0" y="0" width="${W}" height="60" fill="url(#sc)"/></g>`

  return svg(defs, CSS, out)
}
