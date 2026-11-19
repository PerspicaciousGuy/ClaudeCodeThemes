// Art Deco: an original scene in the style of 1920s deco posters. A gold
// sunburst fans out over deep navy, stepped towers rise at the sides with
// gold-lined windows, scalloped arcs ripple below, and a slow shimmer of light
// travels across the gold.
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
.shine{animation:shine 14s ease-in-out infinite}
.pulse{animation:pulse 6s ease-in-out infinite alternate}
.tw{animation:pulse var(--d,3s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.ray{animation:ray 10s ease-in-out infinite alternate;transform-origin:800px 900px}
@keyframes shine{0%{transform:translateX(-600px)}60%,100%{transform:translateX(2200px)}}
@keyframes pulse{from{opacity:.65}to{opacity:1}}
@keyframes ray{from{transform:rotate(-1.5deg)}to{transform:rotate(1.5deg)}}
@media (prefers-reduced-motion:reduce){.shine,.pulse,.tw,.ray{animation:none}}
`

// A stepped tower: slabs that narrow as they rise, with gold bands and tall windows.
function tower(x, base, steps, w0, h0, flip) {
  let out = ''
  let w = w0
  let y = base

  for (let i = 0; i < steps; i++) {
    const h = h0 * (1 - i * 0.1)
    const x0 = flip ? x - w : x

    out += `<rect x="${x0}" y="${y - h}" width="${w}" height="${h}" fill="#0b1226" stroke="#c8a24a" stroke-width="4"/>`
    for (let k = 1; k < w / 36; k++) {
      out += `<line x1="${x0 + k * 36}" y1="${y - h + 14}" x2="${x0 + k * 36}" y2="${y - 14}" stroke="#c8a24a" stroke-width="3" opacity=".7"/>`
    }
    y -= h
    w *= 0.78
  }
  out += `<rect x="${flip ? x - w - 6 : x + (w0 - w) / 2 - 6}" y="${y - 60}" width="${12}" height="60" fill="#c8a24a"/>`

  return out
}

export function buildScene() {
  const rand = rng(9)
  const defs =
    vgrad('bg', [[0, '#080e22'], [1, '#13204a']]) +
    vgrad('gold', [[0, '#f4d982'], [1, '#b8892a']]) +
    `<linearGradient id="sh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff6cf" stop-opacity="0"/><stop offset=".5" stop-color="#fff6cf" stop-opacity=".7"/><stop offset="1" stop-color="#fff6cf" stop-opacity="0"/></linearGradient>`

  let out = `<rect width="${W}" height="${H}" fill="url(#bg)"/>`

  // Stars as small gold diamonds.
  for (let g = 0; g < 4; g++) {
    let st = ''

    for (let i = 0; i < 10; i++) {
      const x = Math.round(rand() * W)
      const y = Math.round(rand() * 300)

      st += `<path d="M${x} ${y - 5} L${x + 3} ${y} L${x} ${y + 5} L${x - 3} ${y} Z" fill="#f4d982"/>`
    }
    out += `<g class="tw" style="--d:${(3 + rand() * 3).toFixed(1)}s;--l:${(-rand() * 4).toFixed(1)}s">${st}</g>`
  }

  // The sunburst: tapering rays fanning from the bottom centre.
  let rays = ''

  for (let i = 0; i < 25; i++) {
    const a = Math.PI + 0.12 + (i / 24) * (Math.PI - 0.24)
    const a2 = a + 0.045

    rays += `<polygon points="800,900 ${(800 + Math.cos(a) * 1500).toFixed(0)},${(900 + Math.sin(a) * 1500).toFixed(0)} ${(800 + Math.cos(a2) * 1500).toFixed(0)},${(900 + Math.sin(a2) * 1500).toFixed(0)}" fill="${i % 2 ? '#c8a24a' : '#8a6a24'}" opacity="${i % 2 ? 0.55 : 0.4}"/>`
  }
  out += `<g class="pulse"><g class="ray">${rays}</g></g>`

  // Concentric scalloped arcs, like a fan.
  for (let r = 560; r >= 160; r -= 80) {
    out += `<path d="M${800 - r} 900 A ${r} ${r} 0 0 1 ${800 + r} 900" fill="none" stroke="url(#gold)" stroke-width="${r > 400 ? 5 : 7}"/>`
  }
  out += `<path d="M640 900 A 160 160 0 0 1 960 900 Z" fill="#0b1226" stroke="url(#gold)" stroke-width="8"/>`

  // The towers at the sides.
  out += tower(40, 900, 5, 220, 200, false) + tower(1560, 900, 5, 220, 200, true)

  // A shimmer crossing the gold.
  out += `<g class="shine"><polygon points="0,0 120,0 40,900 -80,900" fill="url(#sh)"/></g>`

  // A gold border frame.
  out += `<rect x="22" y="22" width="${W - 44}" height="${H - 44}" fill="none" stroke="url(#gold)" stroke-width="5"/><rect x="38" y="38" width="${W - 76}" height="${H - 76}" fill="none" stroke="url(#gold)" stroke-width="2"/>`

  return svg(defs, CSS, out)
}
