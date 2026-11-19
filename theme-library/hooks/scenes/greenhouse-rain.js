// Greenhouse Rain: an original scene of a glass greenhouse at dusk in the rain.
// Streaks and drops run down the panes, big leaves and ferns sway among pots,
// warm lamps hang from the iron frame and mist drifts along the floor.
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
.rn{animation:rn var(--d,1.4s) linear infinite;animation-delay:var(--l,0s)}
.dr{animation:dr var(--d,9s) ease-in infinite;animation-delay:var(--l,0s)}
.sw{animation:sw var(--d,6s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.lamp{animation:lamp 5s ease-in-out infinite alternate}
.mist1{animation:mist 60s ease-in-out infinite alternate}
.mist2{animation:mist 80s ease-in-out infinite alternate-reverse}
@keyframes rn{from{transform:translate(0,-120px)}to{transform:translate(-50px,1060px)}}
@keyframes dr{0%{transform:translateY(0);opacity:0}10%{opacity:1}85%{opacity:1}100%{transform:translateY(var(--dy,160px));opacity:0}}
@keyframes sw{from{transform:rotate(-2.5deg)}to{transform:rotate(3deg)}}
@keyframes lamp{from{opacity:.8}to{opacity:1}}
@keyframes mist{from{transform:translateX(-80px)}to{transform:translateX(120px)}}
@media (prefers-reduced-motion:reduce){.rn,.dr,.sw,.lamp,.mist1,.mist2{animation:none}.dr{opacity:1}}
`

// A big heart-shaped leaf on a stem, rotated about its base.
function leaf(x, y, len, ang, fill, rib) {
  const s = len / 180

  return `<g transform="translate(${x} ${y}) rotate(${ang}) scale(${s})"><path d="M0 0 C 30 -70 150 -90 190 -10 C 150 60 40 70 0 0 Z" fill="${fill}"/><path d="M0 0 C 60 -8 130 -10 186 -10" fill="none" stroke="${rib}" stroke-width="3" opacity=".6"/><path d="M60 -8 L 100 -48 M100 -9 L 140 -42 M60 -8 L 96 32 M100 -9 L 138 26" stroke="${rib}" stroke-width="2" opacity=".4" fill="none"/></g>`
}

// A fern frond: a curved spine with paired leaflets.
function frond(x, y, len, ang, fill) {
  let out = ''

  for (let i = 1; i <= 14; i++) {
    const t = i / 14
    const px = t * len
    const py = -Math.sin(t * 1.4) * len * 0.35
    const l = (1 - t * 0.7) * len * 0.16

    out += `<ellipse cx="${px.toFixed(1)}" cy="${(py - l * 0.3).toFixed(1)}" rx="${(l * 0.3).toFixed(1)}" ry="${l.toFixed(1)}" transform="rotate(-25 ${px.toFixed(1)} ${py.toFixed(1)})"/>` + `<ellipse cx="${px.toFixed(1)}" cy="${(py + l * 0.3).toFixed(1)}" rx="${(l * 0.3).toFixed(1)}" ry="${l.toFixed(1)}" transform="rotate(25 ${px.toFixed(1)} ${py.toFixed(1)})"/>`
  }

  return `<g transform="translate(${x} ${y}) rotate(${ang})" fill="${fill}"><path d="M0 0 Q ${len * 0.5} ${-len * 0.3} ${len} ${-Math.sin(1.4) * len * 0.35}" fill="none" stroke="${fill}" stroke-width="4"/>${out}</g>`
}

function pot(x, y, w, h) {
  return `<path d="M${x} ${y} L${x + w} ${y} L${x + w * 0.82} ${y + h} L${x + w * 0.18} ${y + h} Z" fill="#8a4a30"/><rect x="${x - 6}" y="${y - 12}" width="${w + 12}" height="18" rx="4" fill="#a45a3a"/><path d="M${x} ${y} L${x + w} ${y} L${x + w * 0.97} ${y + 24} L${x + w * 0.03} ${y + 24} Z" fill="#000" opacity=".12"/>`
}

export function buildScene() {
  const rand = rng(88)
  const defs =
    vgrad('sky', [[0, '#2c5a58'], [0.45, '#15393b'], [1, '#07140f']]) +
    rgrad('warm', '#ffb45a', 0.85) +
    vgrad('mi', [[0, '#cfe8df', 0], [0.5, '#cfe8df', 0.18], [1, '#cfe8df', 0]]) +
    `<clipPath id="arch"><path d="M120 900 V340 A680 330 0 0 1 1480 340 V900 Z"/></clipPath>`

  // Dusk through the glass: sky, then dark trees outside.
  let out = `<rect width="${W}" height="${H}" fill="#06110e"/><g clip-path="url(#arch)"><rect width="${W}" height="${H}" fill="url(#sky)"/>`

  for (let i = 0; i < 26; i++) {
    out += `<circle cx="${Math.round(rand() * W)}" cy="${380 + Math.round(rand() * 360)}" r="${60 + Math.round(rand() * 110)}" fill="${rand() < 0.5 ? '#0c2a26' : '#0a2220'}" opacity=".8"/>`
  }
  out += '</g>'

  // The iron frame: an arch, mullions and bars.
  let frame = ''

  for (let i = 1; i < 11; i++) {
    const x = 120 + i * 124

    frame += `<line x1="${x}" y1="${Math.max(10, 340 - Math.sqrt(Math.max(0, 1 - ((x - 800) / 680) ** 2)) * 330)}" x2="${x}" y2="900"/>`
  }
  for (const y of [250, 430, 610]) {
    frame += `<line x1="120" y1="${y}" x2="1480" y2="${y}"/>`
  }
  out += `<g clip-path="url(#arch)" stroke="#07120f" stroke-width="7" opacity=".9">${frame}</g><path d="M120 900 V340 A680 330 0 0 1 1480 340 V900" fill="none" stroke="#07120f" stroke-width="16"/>`
  out += `<path d="M0 0 H1600 V900 H0 Z M120 900 V340 A680 330 0 0 1 1480 340 V900 Z" fill="#050d0a" fill-rule="evenodd"/>`

  // Warm lamps hanging from the frame.
  for (const [x, y] of [[420, 330], [800, 190], [1180, 330]]) {
    out += `<g class="lamp" style="animation-delay:${(-rand() * 5).toFixed(1)}s"><circle cx="${x}" cy="${y + 20}" r="150" fill="url(#warm)" opacity=".55"/></g><line x1="${x}" y1="${y - 120}" x2="${x}" y2="${y - 14}" stroke="#07120f" stroke-width="3"/><path d="M${x - 24} ${y - 12} Q ${x} ${y - 36} ${x + 24} ${y - 12} Z" fill="#26413a"/><circle cx="${x}" cy="${y + 8}" r="17" fill="#ffd89a"/>`
  }

  // The floor, a shelf of pots and plants at each side.
  out += `<rect x="0" y="800" width="${W}" height="100" fill="#0a1713"/><rect x="0" y="796" width="${W}" height="10" fill="#14281f"/>`
  const sides = [[200, 1], [1400, -1]]

  for (const [bx, dir] of sides) {
    out += pot(bx - 55, 780, 110, 100) + pot(bx + dir * 150 - 40, 820, 80, 70)
    const g = []

    for (let i = 0; i < 6; i++) {
      g.push(leaf(bx, 780, 150 + rand() * 90, -90 + (i - 2.5) * 26 + dir * 6, i % 2 ? '#2f7a52' : '#3b9060', '#0c2c1e'))
    }
    for (let i = 0; i < 5; i++) {
      g.push(frond(bx + dir * 150, 826, 150 + rand() * 60, -100 + dir * (i * 18 - 20), i % 2 ? '#3f9a5e' : '#2f7a4e'))
    }
    out += `<g class="sw" style="transform-origin:${bx}px 780px;--d:${(5 + rand() * 3).toFixed(1)}s;--l:${(-rand() * 5).toFixed(1)}s">${g.slice(0, 6).join('')}</g><g class="sw" style="transform-origin:${bx + dir * 150}px 826px;--d:${(6 + rand() * 3).toFixed(1)}s;--l:${(-rand() * 5).toFixed(1)}s">${g.slice(6).join('')}</g>`
  }

  // Mist drifting along the floor.
  out += `<g class="mist1"><ellipse cx="500" cy="790" rx="520" ry="70" fill="url(#mi)"/></g><g class="mist2"><ellipse cx="1100" cy="810" rx="560" ry="60" fill="url(#mi)"/></g>`

  // Rain on the glass: streaks, and drops that slide.
  for (let i = 0; i < 80; i++) {
    const x = Math.round(rand() * 1700)
    const l = 40 + Math.round(rand() * 50)

    out += `<line class="rn" x1="${x}" y1="0" x2="${x - 6}" y2="${l}" stroke="#cfeee6" stroke-width="${(1 + rand()).toFixed(1)}" stroke-linecap="round" opacity="${(0.18 + rand() * 0.25).toFixed(2)}" style="--d:${(0.9 + rand() * 0.9).toFixed(2)}s;--l:${(-rand() * 2).toFixed(2)}s"/>`
  }
  for (let i = 0; i < 22; i++) {
    out += `<g class="dr" style="--d:${(7 + rand() * 8).toFixed(1)}s;--l:${(-rand() * 12).toFixed(1)}s;--dy:${Math.round(80 + rand() * 200)}px"><ellipse cx="${Math.round(160 + rand() * 1280)}" cy="${Math.round(120 + rand() * 520)}" rx="4" ry="6" fill="#dff7f0" opacity=".45"/></g>`
  }

  return svg(defs, CSS, out)
}
