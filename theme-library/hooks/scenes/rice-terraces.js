// Rice Terraces: an original misty morning over stepped rice paddies. Pale
// mountains, a low sun, curved terraces alternating green and sky-colored water,
// mist drifting between the steps, a small hut and egrets in flight.
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

function band(base, amp, seed, fill, bottom = H) {
  const r = rng(seed)
  const p1 = r() * 6.28
  const p2 = r() * 6.28
  let d = `M-10 ${bottom}`

  for (let x = -10; x <= W + 10; x += 16) {
    d += ` L${x} ${(base - amp * (0.65 * Math.sin(x / 260 + p1) + 0.35 * Math.sin(x / 110 + p2))).toFixed(0)}`
  }

  return `<path d="${d} L${W + 10} ${bottom} Z" fill="${fill}"/>`
}

const CSS = `
.ms1{animation:mist 60s linear infinite alternate}
.ms2{animation:mist 90s linear infinite alternate-reverse}
.eg{animation:fly 40s linear infinite}
.eg2{animation:fly 58s linear infinite}
.sun{animation:sun 9s ease-in-out infinite alternate}
.wt{animation:wt 6s ease-in-out infinite alternate}
@keyframes mist{from{transform:translateX(-110px)}to{transform:translateX(110px)}}
@keyframes fly{from{transform:translate(-160px,40px)}to{transform:translate(1760px,-80px)}}
@keyframes sun{from{opacity:.78}to{opacity:1}}
@keyframes wt{from{opacity:.75}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.ms1,.ms2,.eg,.eg2,.sun,.wt{animation:none}}
`

export function buildScene() {
  const defs =
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe4dc"/><stop offset=".55" stop-color="#f4ecd0"/><stop offset="1" stop-color="#fbe6b8"/></linearGradient>' +
    '<radialGradient id="sg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffbe6" stop-opacity=".95"/><stop offset=".4" stop-color="#fff0b8" stop-opacity=".45"/><stop offset="1" stop-color="#fff0b8" stop-opacity="0"/></radialGradient>' +
    '<filter id="mb" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="22"/></filter>'

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  out += '<g class="sun"><circle cx="1180" cy="250" r="260" fill="url(#sg)"/></g><circle cx="1180" cy="250" r="50" fill="#fffbea"/>'

  // Mountains, pale and layered.
  out += band(380, 70, 3, '#b8d3cc') + band(430, 60, 8, '#9cc2b6') + band(480, 44, 14, '#82ae9f')

  // A drift of mist behind the terraces.
  out += '<g class="ms1" filter="url(#mb)"><ellipse cx="500" cy="470" rx="620" ry="40" fill="#ffffff" fill-opacity=".55"/><ellipse cx="1250" cy="500" rx="520" ry="34" fill="#ffffff" fill-opacity=".5"/></g>'

  // Terraces: each step a green band with a thin strip of water on top.
  const greens = ['#7fb06a', '#6ea25f', '#8cbc72', '#5e9355', '#98c47c', '#4f8450']

  for (let i = 0; i < 6; i++) {
    const base = 520 + i * 62
    const amp = 40 - i * 4

    out += band(base - 8, amp, 20 + i, '#cfe8e0')
    out += band(base, amp, 20 + i, greens[i])
  }

  // A small hut on the third step, left of centre.
  out += '<g transform="translate(250 650)"><rect x="-34" y="-26" width="68" height="40" fill="#8a6a4a"/><polygon points="-46,-26 0,-62 46,-26" fill="#5a4030"/><rect x="-8" y="-12" width="16" height="26" fill="#3a2a20"/><rect x="14" y="-16" width="12" height="12" fill="#ffd88a"/></g>'

  // Mist between the steps, moving the other way.
  out += '<g class="ms2" filter="url(#mb)"><ellipse cx="800" cy="640" rx="760" ry="30" fill="#ffffff" fill-opacity=".4"/><ellipse cx="300" cy="760" rx="500" ry="26" fill="#ffffff" fill-opacity=".32"/></g>'

  // Sky glints on the water of the lower terraces.
  out += '<g class="wt"><path d="M900 700q40 -6 80 0M1180 730q50 -7 100 0M640 770q40 -6 90 0M1400 700q30 -5 60 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-opacity=".7"/></g>'

  // Egrets crossing.
  const egret = (x, y, s) => `<path d="M${x} ${y}q${10 * s} ${-12 * s} ${22 * s} ${-2 * s}q${12 * s} ${-12 * s} ${22 * s} ${2 * s}" fill="none" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round"/><path d="M${x + 22 * s} ${y - 2 * s}l${10 * s} ${4 * s}" stroke="#e8a64a" stroke-width="2.4" stroke-linecap="round"/>`

  out += `<g class="eg">${egret(0, 300, 1)}${egret(70, 330, 0.8)}</g><g class="eg2">${egret(-80, 220, 0.9)}${egret(-20, 250, 0.7)}${egret(40, 205, 0.6)}</g>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
