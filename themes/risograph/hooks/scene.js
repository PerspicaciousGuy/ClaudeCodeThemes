// Risograph: an original scene in the manner of a two- and three-ink riso print.
// Fluorescent pink, teal and yellow shapes overprint on warm paper with halftone
// dots and slight misregistration: a sun, rolling hills, waves, stars and a
// little cloud, drifting a few pixels as if the ink were still wet.
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
.d1{animation:d1 14s ease-in-out infinite alternate}
.d2{animation:d2 17s ease-in-out infinite alternate}
.d3{animation:d3 21s ease-in-out infinite alternate}
.spin{animation:spin 90s linear infinite;transform-origin:1240px 250px}
.twk{animation:twk var(--d,4s) ease-in-out infinite alternate;animation-delay:var(--l,0s);transform-box:fill-box;transform-origin:center}
@keyframes d1{from{transform:translate(0,0)}to{transform:translate(6px,-4px)}}
@keyframes d2{from{transform:translate(0,0)}to{transform:translate(-5px,5px)}}
@keyframes d3{from{transform:translate(0,0)}to{transform:translate(4px,6px)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes twk{from{transform:scale(.8) rotate(0deg)}to{transform:scale(1.15) rotate(20deg)}}
@media (prefers-reduced-motion:reduce){.d1,.d2,.d3,.spin,.twk{animation:none}}
`

export function buildScene() {
  const rand = rng(77)
  const defs =
    `<pattern id="dp" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="8" cy="8" r="4.2" fill="#ff5a96"/></pattern>` +
    `<pattern id="dt" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-15)"><circle cx="7" cy="7" r="3.6" fill="#1fb4a8"/></pattern>` +
    `<pattern id="dy" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="3" fill="#ffc82e"/></pattern>`

  let out = `<rect width="${W}" height="${H}" fill="#f3ecd8"/>`

  // Paper speckle.
  for (let i = 0; i < 160; i++) {
    out += `<circle cx="${Math.round(rand() * W)}" cy="${Math.round(rand() * H)}" r="${(0.6 + rand() * 1.2).toFixed(1)}" fill="#c8bfa4" opacity="${(0.3 + rand() * 0.3).toFixed(2)}"/>`
  }

  // The pink ink: a big sun with a halftone disc inside, and a ray burst.
  let pink = `<circle cx="1240" cy="250" r="150" fill="#ff5a96"/><circle cx="1240" cy="250" r="190" fill="url(#dp)"/>`

  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2

    pink += `<line x1="${(1240 + Math.cos(a) * 230).toFixed(0)}" y1="${(250 + Math.sin(a) * 230).toFixed(0)}" x2="${(1240 + Math.cos(a) * 290).toFixed(0)}" y2="${(250 + Math.sin(a) * 290).toFixed(0)}" stroke="#ff5a96" stroke-width="10" stroke-linecap="round"/>`
  }
  out += `<g class="d1"><g class="spin">${pink}</g></g>`

  // The teal ink: hills and waves, with halftone shading.
  let teal = `<path d="M-40 640 C 200 540 420 580 620 640 C 820 700 1040 600 1260 620 C 1420 636 1520 660 1640 640 L1640 900 L-40 900 Z" fill="#1fb4a8"/>`

  teal += `<path d="M-40 760 C 220 700 460 750 700 740 C 940 730 1180 700 1640 760 L1640 900 L-40 900 Z" fill="url(#dt)"/>`
  for (let i = 0; i < 6; i++) {
    teal += `<path d="M${-20 + i * 290} 820 q 36 -36 72 0 t 72 0 t 72 0 t 72 0" fill="none" stroke="#0d6a64" stroke-width="7" stroke-linecap="round"/>`
  }
  out += `<g class="d2">${teal}</g>`

  // The yellow ink: a cloud, stars and a moon dot field, overprinting.
  let yellow = `<g fill="#ffc82e"><ellipse cx="420" cy="220" rx="130" ry="46"/><ellipse cx="350" cy="244" rx="100" ry="40"/><ellipse cx="500" cy="242" rx="110" ry="38"/></g><circle cx="420" cy="260" r="120" fill="url(#dy)"/>`

  for (const [x, y, s] of [[160, 120, 22], [700, 160, 16], [900, 90, 20], [180, 420, 14], [1480, 520, 18]]) {
    yellow += `<g class="twk" style="--d:${(3 + rand() * 3).toFixed(1)}s;--l:${(-rand() * 3).toFixed(1)}s"><path d="M${x} ${y - s} L${x + s * 0.3} ${y - s * 0.3} L${x + s} ${y} L${x + s * 0.3} ${y + s * 0.3} L${x} ${y + s} L${x - s * 0.3} ${y + s * 0.3} L${x - s} ${y} L${x - s * 0.3} ${y - s * 0.3} Z" fill="#ffc82e"/></g>`
  }
  out += `<g class="d3">${yellow}</g>`

  // Misregistration: a faint pink offset outline of the hills.
  out += `<path d="M-34 646 C 206 546 426 586 626 646 C 826 706 1046 606 1266 626 C 1426 642 1526 666 1646 646" fill="none" stroke="#ff5a96" stroke-width="5" opacity=".55"/>`

  return svg(defs, CSS, out)
}
