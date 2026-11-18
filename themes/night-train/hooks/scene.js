// Night Train: an original view from a carriage window on a night run.
// Layers of hills, town lights and telegraph poles slide past at different
// speeds. Vector art on a 1600x900 canvas; every moving layer is drawn twice
// side by side, so it loops without a seam.
// Pure SVG + CSS animation: no script, nothing loaded.

const W = 1600
const H = 900
const TAU = Math.PI * 2

function rng(seed) {
  let s = seed >>> 0

  return () => {
    s = (s * 1664525 + 1013904223) >>> 0

    return s / 4294967296
  }
}

// A height line that repeats every W, so a layer drawn over 2W has no seam.
function loop(seed, base, amp) {
  const r = rng(seed)
  const parts = [1, 2, 3, 5, 8, 13].map((k, i) => ({ k, a: (amp * 0.55) / (1 + i * 0.7), p: r() * TAU }))

  return x => base - parts.reduce((sum, { k, a, p }) => sum + a * Math.sin((TAU * k * x) / W + p), 0)
}

function band(f, fill) {
  let d = `M0 ${H}`

  for (let x = 0; x <= 2 * W; x += 16) {
    d += ` L${x} ${f(x).toFixed(1)}`
  }

  return `<path d="${d} L${2 * W} ${H} Z" fill="${fill}"/>`
}

// A crescent: a circle (cx, cy, r) with a second circle (offset dx, dy, radius r2) bitten out of it.
function crescent(cx, cy, r, dx, dy, r2) {
  const d = Math.hypot(dx, dy)
  const a = (r * r - r2 * r2 + d * d) / (2 * d)
  const h = Math.sqrt(r * r - a * a)
  const mx = cx + (a * dx) / d
  const my = cy + (a * dy) / d
  const p1 = [mx - (h * dy) / d, my + (h * dx) / d]
  const p2 = [mx + (h * dy) / d, my - (h * dx) / d]
  const f = p => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`

  return `M${f(p1)} A${r} ${r} 0 1 0 ${f(p2)} A${r2} ${r2} 0 0 1 ${f(p1)}Z`
}

const CSS = `
.l1,.l2,.l3{will-change:transform}
.l1{animation:slide 150s linear infinite}
.l2{animation:slide 70s linear infinite}
.l3{animation:slide 11s linear infinite}
.tw{animation:tw 5s ease-in-out infinite}
.lt{animation:tw 3.4s ease-in-out infinite}
.sway{animation:sway 9s ease-in-out infinite alternate}
@keyframes slide{from{transform:translateX(0)}to{transform:translateX(-1600px)}}
@keyframes tw{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes sway{from{opacity:.5}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.l1,.l2,.l3,.tw,.lt,.sway{animation:none}}
`

export function buildScene() {
  const rand = rng(8)
  const defs =
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070a1c"/><stop offset=".55" stop-color="#1a1f4a"/><stop offset=".78" stop-color="#4a2f5e"/><stop offset="1" stop-color="#8a4a5c"/></linearGradient>' +
    '<radialGradient id="moon" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6dc" stop-opacity=".5"/><stop offset="1" stop-color="#fff6dc" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="warm" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffb866" stop-opacity=".34"/><stop offset="1" stop-color="#ffb866" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="glare" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  for (let i = 0; i < 120; i++) {
    out += `<circle cx="${Math.round(rand() * W)}" cy="${Math.round(rand() * 480)}" r="${(0.5 + rand() * 1.2).toFixed(1)}" fill="#e8ecff" opacity="${(0.35 + rand() * 0.5).toFixed(2)}"${rand() < 0.3 ? ` class="tw" style="animation-delay:${(-rand() * 5).toFixed(1)}s"` : ''}/>`
  }

  // A thin moon.
  out += `<circle cx="1260" cy="170" r="130" fill="url(#moon)"/><path d="${crescent(1260, 170, 32, 15, -9, 27)}" fill="#fff4d6"/>`

  // Far hills, very slow.
  const far = loop(3, 610, 70)

  out += `<g class="l1">${band(far, '#171b44')}</g>`

  // Middle hills with the lights of small towns.
  const mid = loop(11, 670, 46)
  let lights = ''

  for (let i = 0; i < 46; i++) {
    const x = Math.round(rand() * W)
    const y = Math.round(mid(x) + 8 + rand() * 40)
    const c = rand() < 0.75 ? '#ffd27a' : '#ffa86b'
    const tw = rand() < 0.4 ? ` class="lt" style="animation-delay:${(-rand() * 3).toFixed(1)}s"` : ''

    for (const dx of [0, W]) {
      lights += `<rect x="${x + dx}" y="${y}" width="${rand() < 0.3 ? 3 : 2}" height="2" fill="${c}"${tw}/>`
    }
  }
  out += `<g class="l2">${band(mid, '#0d1131')}${lights}</g>`

  // Near: a low bank, bushes, and the poles with their wires.
  const bank = loop(23, 790, 10)
  let near = band(bank, '#05070f')

  for (let i = 0; i < 18; i++) {
    const x = Math.round(rand() * W)
    const rx = 28 + Math.round(rand() * 40)

    for (const dx of [0, W]) {
      near += `<ellipse cx="${x + dx}" cy="${(bank(x) + 4).toFixed(0)}" rx="${rx}" ry="${(rx * 0.45).toFixed(0)}" fill="#05070f"/>`
    }
  }

  let wires = ''

  for (let k = 0; k <= 8; k++) {
    const x = k * 400

    near += `<rect x="${x - 4}" y="520" width="8" height="${280}" fill="#04060d"/><rect x="${x - 34}" y="540" width="68" height="6" fill="#04060d"/>`
    if (k < 8) {
      for (const [dy, sag] of [[0, 70], [22, 62]]) {
        wires += `M${x - 28} ${544 + dy} Q${x + 200} ${544 + dy + sag} ${x + 428} ${544 + dy} `
      }
    }
  }
  near += `<path d="${wires}" stroke="#04060d" stroke-width="2" fill="none"/>`
  out += `<g class="l3">${near}</g>`

  // The carriage: a dark frame around the glass, a sill, soft reflections.
  out += `<g class="sway"><ellipse cx="220" cy="760" rx="420" ry="220" fill="url(#warm)"/></g>`
  out += `<polygon points="420,0 620,0 300,900 100,900" fill="url(#glare)"/><polygon points="1120,0 1230,0 980,900 870,900" fill="url(#glare)"/>`
  out += `<path fill-rule="evenodd" fill="#0b0907" d="M0 0H${W}V${H}H0Z M110 70 Q110 40 140 40 H${W - 140} Q${W - 110} 40 ${W - 110} 70 V${H - 110} H110Z"/>`
  out += `<rect x="96" y="28" width="${W - 192}" height="${H - 124}" rx="44" fill="none" stroke="#3a2c20" stroke-width="3" opacity=".7"/>`
  out += `<rect x="0" y="${H - 96}" width="${W}" height="96" fill="#17110c"/><rect x="0" y="${H - 96}" width="${W}" height="4" fill="#4a3826"/>`

  // Fog of breath on the corners of the glass.
  for (let i = 0; i < 22; i++) {
    const left = rand() < 0.5

    out += `<circle cx="${(left ? 135 + rand() * 90 : W - 135 - rand() * 90).toFixed(0)}" cy="${(H - 160 - rand() * 130).toFixed(0)}" r="${(2 + rand() * 4).toFixed(1)}" fill="#cfd8ff" opacity="${(0.1 + rand() * 0.15).toFixed(2)}"/>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
