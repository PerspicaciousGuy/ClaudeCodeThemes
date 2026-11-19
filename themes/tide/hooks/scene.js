// Tide: a beach at dusk whose tide follows your 5-hour usage window. High tide
// means plenty is left; as you use the window the sea draws back and leaves wet
// sand, rocks, tide pools and a stranded boat. Level 5 is high water, 0 is low.
// Vector art on a 1600x900 canvas.
// Pure SVG + CSS animation: no script, nothing loaded.

const W = 1600
const H = 900
const HORIZON = 470

function rng(seed) {
  let s = seed >>> 0

  return () => {
    s = (s * 1664525 + 1013904223) >>> 0

    return s / 4294967296
  }
}

const CSS = `
.drift{animation:drift var(--d,100s) ease-in-out infinite alternate}
.wave{animation:wave var(--d,9s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.foam{animation:foam 5s ease-in-out infinite alternate}
.glint{animation:glint var(--d,3s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.gull{animation:gull var(--d,60s) linear infinite;animation-delay:var(--l,0s)}
.flap{animation:flap .7s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center}
.bob{animation:bob 6s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}
.tw{animation:glint var(--d,4s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
@keyframes drift{from{transform:translateX(-100px)}to{transform:translateX(120px)}}
@keyframes wave{from{transform:translateX(-40px)}to{transform:translateX(40px)}}
@keyframes foam{from{transform:translateY(-6px)}to{transform:translateY(6px)}}
@keyframes glint{from{opacity:.25}to{opacity:1}}
@keyframes gull{from{transform:translateX(-120px)}to{transform:translateX(1760px)}}
@keyframes flap{from{transform:scaleY(1)}to{transform:scaleY(.4)}}
@keyframes bob{from{transform:rotate(-2deg) translateY(0)}to{transform:rotate(2deg) translateY(-5px)}}
@media (prefers-reduced-motion:reduce){.drift,.wave,.foam,.glint,.gull,.flap,.bob,.tw{animation:none}}
`

// Where the sand begins at each level, 0 (low tide) to 5 (high tide).
const SAND = [520, 585, 650, 710, 760, 815]

const edge = y => `M-20 ${y} C 200 ${y - 18} 400 ${y + 18} 600 ${y} S 1000 ${y + 16} 1200 ${y - 4} S 1500 ${y + 14} 1620 ${y}`

export function buildLive(level) {
  const rand = rng(8)
  const lv = Math.max(0, Math.min(5, Math.round(level)))
  const y0 = SAND[lv]
  let out = ''

  out += `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2050"/><stop offset=".55" stop-color="#7a4a7a"/><stop offset="1" stop-color="#f09a6a"/></linearGradient>`
  out += `<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e08a7a"/><stop offset=".25" stop-color="#5a5a9a"/><stop offset="1" stop-color="#1a2a5a"/></linearGradient>`
  out += `<linearGradient id="sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a7a78"/><stop offset=".3" stop-color="#b09a86"/><stop offset="1" stop-color="#7a6a58"/></linearGradient>`
  out += `<radialGradient id="sun"><stop offset="0" stop-color="#ffd8a0" stop-opacity=".9"/><stop offset="1" stop-color="#ff9a5a" stop-opacity="0"/></radialGradient>`
  out += `<linearGradient id="wet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4c8a8" stop-opacity=".5"/><stop offset="1" stop-color="#f4c8a8" stop-opacity="0"/></linearGradient></defs>`
  out += `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  // A few early stars at the top.
  let st = ''

  for (let i = 0; i < 30; i++) {
    st += `<circle cx="${Math.round(rand() * W)}" cy="${Math.round(rand() * 220)}" r="${(0.7 + rand() * 1.2).toFixed(1)}" fill="#e8ecff" opacity="${(0.4 + rand() * 0.4).toFixed(2)}"/>`
  }
  out += `<g class="tw">${st}</g>`

  // The setting sun, half hidden by the sea, and slow clouds.
  out += `<circle cx="1120" cy="${HORIZON}" r="320" fill="url(#sun)"/><circle cx="1120" cy="${HORIZON}" r="84" fill="#ffd8a0"/>`
  out += `<g class="drift"><g fill="#c0709a" opacity=".6"><ellipse cx="420" cy="250" rx="220" ry="26"/><ellipse cx="520" cy="280" rx="180" ry="20"/><ellipse cx="1260" cy="200" rx="240" ry="24"/></g></g>`

  // The beach underneath, then the sea over the top of it down to the tide line.
  out += `<rect x="0" y="${HORIZON}" width="${W}" height="${H - HORIZON}" fill="url(#sand)"/>`
  out += `<path d="M-20 ${HORIZON} H1620 L1620 ${y0} C 1500 ${y0 + 14} 1350 ${y0 - 4} 1200 ${y0 - 4} C 1000 ${y0 + 16} 800 ${y0} 600 ${y0} C 400 ${y0 + 18} 200 ${y0 - 18} -20 ${y0} Z" fill="url(#sea)"/>`

  // The sun's path on the water: glints.
  for (let i = 0; i < 18; i++) {
    const y = HORIZON + 14 + i * ((y0 - HORIZON - 24) / 18)

    out += `<g class="glint" style="--d:${(2 + rand() * 3).toFixed(1)}s;--l:${(-rand() * 3).toFixed(1)}s"><ellipse cx="${(1120 + (rand() - 0.5) * (60 + i * 14)).toFixed(0)}" cy="${y.toFixed(0)}" rx="${(40 + i * 5).toFixed(0)}" ry="3" fill="#ffe0b0"/></g>`
  }

  // Long wave lines drifting across the sea.
  for (let i = 0; i < 5; i++) {
    const y = HORIZON + 40 + i * ((y0 - HORIZON - 60) / 5)

    if (y < y0 - 10) {
      out += `<g class="wave" style="--d:${(7 + i * 1.5).toFixed(1)}s;--l:${(-i * 2).toFixed(1)}s"><path d="M-60 ${y.toFixed(0)} q 100 -10 200 0 t 200 0 t 200 0 t 200 0 t 200 0 t 200 0 t 200 0 t 200 0 t 200 0" fill="none" stroke="#e8f0ff" stroke-width="2" stroke-opacity=".35"/></g>`
    }
  }

  // A boat: afloat at high water, aground and leaning at low tide.
  const aground = y0 < 600
  const by = aground ? y0 + 70 : y0 - 40

  out += `<g class="bob"><g transform="translate(430 ${by}) rotate(${aground ? 9 : 0})"><path d="M-80 0 Q 0 40 90 -6 L84 -16 L-70 -12 Z" fill="#3a2418"/><path d="M-70 -12 L84 -16" stroke="#7a5030" stroke-width="5"/><line x1="0" y1="-14" x2="0" y2="-84" stroke="#3a2418" stroke-width="4"/><path d="M0 -84 L50 -24 L0 -22 Z" fill="#e8d8b8"/></g></g>`

  // The tide line: wet sheen and foam.
  out += `<path d="${edge(y0 + 36)}" fill="none" stroke="url(#wet)" stroke-width="64"/>`
  out += `<g class="foam"><path d="${edge(y0)}" fill="none" stroke="#f8f4ec" stroke-width="7" stroke-linecap="round" stroke-opacity=".85"/><path d="${edge(y0 + 12)}" fill="none" stroke="#f8f4ec" stroke-width="3" stroke-opacity=".5"/></g>`

  // What the sea leaves behind: rocks and weed, tide pools, shells and a starfish.
  const left = Math.max(0, 5 - lv)

  if (left >= 2) {
    const k = left - 1

    for (const [x, y, s] of [[180, y0 + 40, 1.2], [300, y0 + 80, 0.8], [1380, y0 + 50, 1.3], [1250, y0 + 100, 0.7]]) {
      out += `<g transform="translate(${x} ${y}) scale(${(s * (0.6 + k * 0.12)).toFixed(2)})"><path d="M-70 40 Q -60 -30 0 -40 Q 70 -34 80 40 Z" fill="#2a2630"/><path d="M-40 -2 q 8 -16 24 -12" stroke="#4a4654" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-50 40 q -4 -34 6 -52 M-30 40 q 6 -30 -2 -46" stroke="#3a6a3a" stroke-width="4" fill="none" stroke-linecap="round"/></g>`
    }
    for (const [x, y, w] of [[640, y0 + 120, 120], [980, y0 + 150, 160], [820, y0 + 210, 90], [1100, y0 + 220, 110]]) {
      if (y < 880) {
        out += `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${(w * 0.16).toFixed(0)}" fill="#7a96c8" fill-opacity=".7"/><ellipse cx="${x}" cy="${y - 2}" rx="${(w * 0.8).toFixed(0)}" ry="${(w * 0.08).toFixed(0)}" fill="#c0d4f0" fill-opacity=".5"/>`
      }
    }
  }
  if (left >= 3) {
    out += `<path d="M720 ${y0 + 60} l 8 -22 l 8 22 l 22 -8 l -16 18 l 12 20 l -26 -8 l -14 22 l -4 -26 l -26 -4 l 22 -12 Z" fill="#d86a4a"/>`
    for (const [x, y] of [[520, y0 + 90], [900, y0 + 70], [1180, y0 + 130]]) {
      out += `<path d="M${x} ${y} q 12 -16 26 0 q -12 8 -26 0 Z" fill="#f0dcc0"/>`
    }
  }

  // Gulls crossing.
  for (let i = 0; i < 3; i++) {
    out += `<g class="gull" style="--d:${(50 + rand() * 30).toFixed(0)}s;--l:${(-rand() * 50).toFixed(0)}s"><g transform="translate(0 ${150 + i * 60})"><g class="flap" style="animation-delay:${(-rand()).toFixed(2)}s"><path d="M-16 0 Q -8 -10 0 0 Q 8 -10 16 0" fill="none" stroke="#2a2438" stroke-width="3" stroke-linecap="round"/></g></g></g>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><style>${CSS}</style>${out}</svg>`
}

// The still picture the gallery and the previews use: a rising tide.
export function buildScene() {
  return buildLive(3)
}
