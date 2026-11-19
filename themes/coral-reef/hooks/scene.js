// Coral Reef: an original scene of a sunlit coral reef. Caustic light ripples
// over branching corals and sea fans, schools of bright fish turn together, a
// clownfish peeks from an anemone, a turtle glides by and bubbles rise.
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
.ray{animation:ray 12s ease-in-out infinite alternate}
.caus{animation:caus var(--d,7s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.sw{animation:sw var(--d,6s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.school{animation:school var(--d,60s) linear infinite;animation-delay:var(--l,0s)}
.bobf{animation:bobf var(--e,5s) ease-in-out infinite alternate;animation-delay:var(--m,0s)}
.turtle{animation:turtle 110s linear infinite}
.flip{animation:flip 1.6s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:left center}
.bub{animation:bub var(--d,14s) linear infinite;animation-delay:var(--l,0s)}
.tent{animation:tent var(--d,3s) ease-in-out infinite alternate}
@keyframes ray{from{transform:rotate(-3deg);opacity:.5}to{transform:rotate(3deg);opacity:1}}
@keyframes caus{from{transform:translate(-30px,0) scale(1)}to{transform:translate(30px,10px) scale(1.12)}}
@keyframes sw{from{transform:rotate(-2deg)}to{transform:rotate(2.5deg)}}
@keyframes school{from{transform:translateX(-300px)}to{transform:translateX(1900px)}}
@keyframes bobf{from{transform:translateY(-14px)}to{transform:translateY(14px)}}
@keyframes turtle{from{transform:translateX(-300px)}to{transform:translateX(1900px)}}
@keyframes flip{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}
@keyframes bub{0%{transform:translate(0,0);opacity:0}10%{opacity:.8}100%{transform:translate(var(--dx,20px),-900px);opacity:0}}
@keyframes tent{from{transform:rotate(-6deg)}to{transform:rotate(6deg)}}
@media (prefers-reduced-motion:reduce){.ray,.caus,.sw,.school,.bobf,.turtle,.flip,.bub,.tent{animation:none}}
`

// A branching coral: forks that thin out, drawn as rounded strokes.
function branch(x, y, len, ang, depth, c, rand) {
  const x2 = x + Math.cos(ang) * len
  const y2 = y + Math.sin(ang) * len
  let out = `<line x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${x2.toFixed(0)}" y2="${y2.toFixed(0)}" stroke="${c}" stroke-width="${(3 + depth * 4).toFixed(0)}" stroke-linecap="round"/>`

  if (depth > 0) {
    out += branch(x2, y2, len * 0.74, ang - 0.45 - rand() * 0.25, depth - 1, c, rand) + branch(x2, y2, len * 0.74, ang + 0.45 + rand() * 0.25, depth - 1, c, rand)
  }

  return out
}

// A sea fan: ribs spreading from a stalk, with fine cross lines.
function fan(x, y, h, c) {
  let out = ''

  for (let i = -6; i <= 6; i++) {
    out += `<line x1="${x}" y1="${y}" x2="${x + i * h * 0.16}" y2="${y - h}" stroke="${c}" stroke-width="3"/>`
  }
  for (let k = 1; k < 6; k++) {
    out += `<path d="M${x - k * h * 0.17} ${y - h * k * 0.17} Q ${x} ${y - h * k * 0.17 - 16} ${x + k * h * 0.17} ${y - h * k * 0.17}" fill="none" stroke="${c}" stroke-width="2" opacity=".7"/>`
  }

  return out
}

function fish(c1, c2) {
  return `<ellipse rx="22" ry="9" fill="${c1}"/><polygon points="-18,0 -34,-9 -34,9" fill="${c2}"/><circle cx="12" cy="-2" r="2" fill="#0a1a24"/><path d="M-4 -9 Q 0 -16 6 -9 Z" fill="${c2}"/>`
}

export function buildScene() {
  const rand = rng(52)
  let defs =
    vgrad('water', [[0, '#1a86a8'], [0.45, '#0c4a6a'], [1, '#04202f']]) +
    vgrad('ray', [[0, '#d6faff', 0.4], [1, '#d6faff', 0]]) +
    vgrad('sand', [[0, '#5e8294'], [1, '#2c4a5a']]) +
    rgrad('cg', '#e8fcff', 0.5)

  let out = `<rect width="${W}" height="${H}" fill="url(#water)"/>`

  // Sun shafts from the surface.
  for (let i = 0; i < 7; i++) {
    const x = 60 + i * 240 + Math.round(rand() * 80)
    const w = 50 + Math.round(rand() * 70)

    out += `<g class="ray" style="transform-origin:${x}px 0;animation-delay:${(-rand() * 12).toFixed(1)}s"><polygon points="${x},0 ${x + w},0 ${x + w * 2.4},820 ${x - w},820" fill="url(#ray)"/></g>`
  }

  // Caustics on the reef floor: soft bright shapes sliding about.
  for (let i = 0; i < 16; i++) {
    out += `<ellipse class="caus" cx="${Math.round(rand() * W)}" cy="${700 + Math.round(rand() * 160)}" rx="${70 + Math.round(rand() * 110)}" ry="${10 + Math.round(rand() * 16)}" fill="url(#cg)" style="--d:${(5 + rand() * 6).toFixed(1)}s;--l:${(-rand() * 8).toFixed(1)}s"/>`
  }

  // Far fish schools, in three colors, crossing slowly.
  const schools = [['#f4d03a', '#e8a21a', 330, 70, 0], ['#3aa0f0', '#1a6ac0', 520, 90, -30], ['#ff7aa0', '#e0507a', 250, 80, -15]]

  schools.forEach(([c1, c2, y, d, l], k) => {
    let f = ''

    for (let i = 0; i < 12; i++) {
      f += `<g transform="translate(${Math.round(rand() * 130)} ${Math.round(rand() * 80)}) scale(${(0.7 + rand() * 0.4).toFixed(2)})"><g class="bobf" style="--e:${(3 + rand() * 3).toFixed(1)}s;--m:${(-rand() * 4).toFixed(1)}s">${fish(c1, c2)}</g></g>`
    }
    out += `<g class="school" style="--d:${d}s;--l:${l}s"><g transform="translate(0 ${y})">${f}</g></g>`
  })

  // A turtle gliding through the open water.
  out += `<g class="turtle"><g transform="translate(0 470)"><ellipse rx="70" ry="48" fill="#4a7a4e"/><ellipse rx="52" ry="34" fill="#6a9a5e"/><path d="M-30 -16 L0 -26 L30 -16 M-34 6 L0 0 L34 6 M-24 24 L0 16 L24 24" stroke="#3a5a3a" stroke-width="3" fill="none"/><ellipse cx="82" cy="0" rx="22" ry="16" fill="#7aaa6a"/><circle cx="90" cy="-5" r="2.5" fill="#0a1a24"/><g class="flip"><ellipse cx="20" cy="-48" rx="48" ry="12" transform="rotate(-20 20 -48)" fill="#5a8a5a"/></g><g class="flip" style="animation-delay:-.8s"><ellipse cx="20" cy="48" rx="48" ry="12" transform="rotate(20 20 48)" fill="#5a8a5a"/></g><ellipse cx="-76" cy="0" rx="16" ry="8" fill="#4a7a4e"/></g></g>`

  // The sandy floor.
  out += `<path d="M-10 900 L-10 800 C 260 770 520 820 800 800 C 1080 780 1340 830 1610 790 L1610 900 Z" fill="url(#sand)"/>`

  // Corals at the sides: branching in warm colors, fans, domes.
  const cols = ['#ff7a5a', '#ff9a6a', '#e0508a', '#b060d0', '#ffb04a']

  for (const [bx, n] of [[130, 5], [1460, 5]]) {
    for (let i = 0; i < n; i++) {
      const x = bx + (i - 2) * 70 + rand() * 30
      const ang = -Math.PI / 2 + (rand() - 0.5) * 0.4

      out += `<g class="sw" style="transform-origin:${Math.round(x)}px 840px;--d:${(5 + rand() * 3).toFixed(1)}s;--l:${(-rand() * 5).toFixed(1)}s">${branch(x, 840, 80 + rand() * 50, ang, 3, cols[i % cols.length], rand)}</g>`
    }
  }
  out += `<g class="sw" style="transform-origin:420px 840px">${fan(420, 840, 200, '#e05a8a')}</g><g class="sw" style="transform-origin:1190px 840px;--d:7s">${fan(1190, 840, 220, '#b060d0')}</g>`
  out += `<ellipse cx="560" cy="850" rx="90" ry="46" fill="#d08a4a"/><ellipse cx="560" cy="838" rx="76" ry="32" fill="#e0a060"/><path d="M500 838 Q 560 800 620 838 M515 852 Q 560 820 605 852" stroke="#a86a30" stroke-width="3" fill="none" opacity=".6"/>`
  out += `<ellipse cx="1040" cy="855" rx="80" ry="40" fill="#8a60c0"/><ellipse cx="1040" cy="844" rx="66" ry="28" fill="#a880d8"/>`

  // Tube sponges.
  for (const [x, h, c] of [[240, 110, '#f4c04a'], [270, 80, '#ff9a4a'], [1330, 120, '#f4c04a'], [1362, 86, '#e0508a']]) {
    out += `<rect x="${x}" y="${840 - h}" width="26" height="${h}" rx="10" fill="${c}"/><ellipse cx="${x + 13}" cy="${840 - h}" rx="13" ry="6" fill="#3a1a1a" opacity=".6"/>`
  }

  // An anemone with a clownfish.
  let tents = ''

  for (let i = -6; i <= 6; i++) {
    tents += `<path class="tent" style="transform-origin:${i * 8}px 0;--d:${(2.4 + rand() * 1.6).toFixed(1)}s;animation-delay:${(-rand() * 3).toFixed(1)}s" d="M${i * 8} 0 Q ${i * 14} -30 ${i * 12} -64" stroke="${i % 2 ? '#ff7ab0' : '#ffb0d0'}" stroke-width="7" stroke-linecap="round" fill="none"/>`
  }
  out += `<g transform="translate(820 845)"><ellipse cx="0" cy="6" rx="60" ry="16" fill="#8a3a5a"/>${tents}</g>`
  out += `<g class="bobf" style="--e:4s"><g transform="translate(838 782)"><ellipse rx="26" ry="14" fill="#ff7a2a"/><polygon points="-22,0 -38,-9 -38,9" fill="#ff7a2a"/><rect x="-4" y="-14" width="6" height="28" fill="#fff"/><rect x="12" y="-12" width="5" height="24" fill="#fff"/><circle cx="16" cy="-3" r="2.5" fill="#0a1a24"/></g></g>`

  // Bubbles.
  for (let i = 0; i < 24; i++) {
    out += `<circle class="bub" cx="${Math.round(rand() * W)}" cy="${830 + Math.round(rand() * 60)}" r="${(3 + rand() * 8).toFixed(1)}" fill="none" stroke="#d6faff" stroke-width="1.5" style="--dx:${Math.round((rand() - 0.5) * 120)}px;--d:${(11 + rand() * 12).toFixed(1)}s;--l:${(-rand() * 22).toFixed(1)}s"/>`
  }

  return svg(defs, CSS, out)
}
