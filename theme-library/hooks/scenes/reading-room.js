// Reading Room: an original cozy library at night. Tall shelves of books at the
// sides, a floor lamp with dust turning in its light, a candle, a cup of tea
// and a sleeping cat. Vector art on a 1600x900 canvas.
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

const SPINES = ['#7a2e34', '#2f4a3a', '#26395c', '#b08a3a', '#d8c9a4', '#3c6a6a', '#5a3560', '#a2523a', '#46301f', '#8a8f5a']

// One shelf unit: a frame and rows of books. `cat` leaves the lowest row bare for the cat.
function shelf(x0, width, top, rows, rand, bare) {
  const rowH = 168
  let out = `<rect x="${x0}" y="${top}" width="${width}" height="${rows * rowH + 24}" fill="#24140b"/>`

  for (let r = 0; r < rows; r++) {
    const base = top + 12 + (r + 1) * rowH
    let x = x0 + 14

    if (r === bare) {
      out += `<rect x="${x0 + 10}" y="${base - 14}" width="${width - 20}" height="14" fill="#3d2616"/><rect x="${x0 + 10}" y="${base - 14}" width="${width - 20}" height="3" fill="#6a4426" opacity=".7"/>`
      continue
    }
    while (x < x0 + width - 40) {
      const w = 18 + rand() * 18
      const h = 104 + rand() * 50
      const c = SPINES[Math.floor(rand() * SPINES.length)]
      const lean = rand() < 0.07

      if (x + w > x0 + width - 14) {
        break
      }
      out += `<g${lean ? ` transform="rotate(-11 ${(x + w).toFixed(0)} ${base - 14})"` : ''}><rect x="${x.toFixed(0)}" y="${(base - 14 - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" rx="2" fill="${c}"/><rect x="${x.toFixed(0)}" y="${(base - 14 - h + 14).toFixed(0)}" width="${w.toFixed(0)}" height="3" fill="#f0e2bc" opacity=".35"/><rect x="${x.toFixed(0)}" y="${(base - 14 - 18).toFixed(0)}" width="${w.toFixed(0)}" height="3" fill="#f0e2bc" opacity=".3"/></g>`
      x += w + (lean ? 26 : rand() < 0.06 ? 20 : 1)
    }
    out += `<rect x="${x0 + 10}" y="${base - 14}" width="${width - 20}" height="14" fill="#3d2616"/><rect x="${x0 + 10}" y="${base - 14}" width="${width - 20}" height="3" fill="#6a4426" opacity=".7"/>`
  }

  return out
}

const CSS = `
.lamp{animation:glow 8s ease-in-out infinite alternate}
.fl{animation:flick 2.6s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}
.cg{animation:glow 3s ease-in-out infinite alternate}
.mote{animation:mote 17s ease-in-out infinite}
.br{animation:breathe 4.6s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}
.tail{animation:tail 6s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:0 50%}
.st{animation:steam 5s ease-in infinite}
@keyframes glow{from{opacity:.78}to{opacity:1}}
@keyframes flick{0%{transform:scale(1,1) skewX(0)}35%{transform:scale(.94,1.08) skewX(-4deg)}70%{transform:scale(1.04,.95) skewX(3deg)}100%{transform:scale(.98,1.05) skewX(-2deg)}}
@keyframes mote{0%{opacity:0;transform:translate(0,0)}20%{opacity:.8}80%{opacity:.7}100%{opacity:0;transform:translate(18px,-90px)}}
@keyframes breathe{from{transform:scaleY(1)}to{transform:scaleY(1.07)}}
@keyframes tail{from{transform:rotate(-4deg)}to{transform:rotate(7deg)}}
@keyframes steam{0%{opacity:0;transform:translate(0,0)}25%{opacity:.5}100%{opacity:0;transform:translate(8px,-46px)}}
@media (prefers-reduced-motion:reduce){.lamp,.fl,.cg,.mote,.br,.tail,.st{animation:none}}
`

export function buildScene() {
  const rand = rng(29)
  const defs =
    '<radialGradient id="wall" cx=".5" cy=".42" r=".8"><stop offset="0" stop-color="#2e1d14"/><stop offset=".6" stop-color="#1a110c"/><stop offset="1" stop-color="#0e0806"/></radialGradient>' +
    '<linearGradient id="cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd08a" stop-opacity=".34"/><stop offset="1" stop-color="#ffd08a" stop-opacity="0"/></linearGradient>' +
    '<radialGradient id="halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffc874" stop-opacity=".5"/><stop offset="1" stop-color="#ffc874" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#241810"/><stop offset="1" stop-color="#120b07"/></linearGradient>'

  let out = `<rect width="${W}" height="${H}" fill="url(#wall)"/>`

  // Faint wallpaper stripes.
  for (let x = 0; x < W; x += 44) {
    out += `<rect x="${x}" y="0" width="2" height="${H}" fill="#f0d8a8" opacity=".035"/>`
  }

  // The floor, then two shelf units at the sides, the right one with a bed for the cat.
  out += `<rect y="${H - 60}" width="${W}" height="60" fill="url(#floor)"/>`
  out += shelf(0, 360, 30, 5, rand, -1)
  out += shelf(1250, 350, 30, 5, rand, 4)

  // The cat, curled up on the lowest shelf of the right unit.
  out += '<g transform="translate(1420 866)"><ellipse cx="0" cy="-26" rx="70" ry="34" fill="#14100e"/><g class="br"><ellipse cx="-10" cy="-30" rx="58" ry="30" fill="#1c1613"/></g><circle cx="46" cy="-34" r="24" fill="#1c1613"/><polygon points="34,-52 38,-74 52,-54" fill="#1c1613"/><polygon points="52,-52 62,-72 66,-48" fill="#1c1613"/><path d="M-62 -14 Q-110 -6 -92 -42" fill="none" stroke="#1c1613" stroke-width="12" stroke-linecap="round"/><path d="M40 -32 q4 3 8 0 M54 -32 q4 3 8 0" stroke="#4a3a30" stroke-width="2" fill="none" stroke-linecap="round"/></g>'

  // The candle on a shelf at the right.
  out += '<g transform="translate(1344 346)"><ellipse class="cg" cx="0" cy="-30" rx="80" ry="80" fill="url(#halo)"/><ellipse cx="0" cy="18" rx="17" ry="4" fill="#b08a3a"/><rect x="-8" y="-24" width="16" height="42" rx="2" fill="#e8dcc0"/><path d="M0 -22 V-30" stroke="#2a1c10" stroke-width="2"/><path class="fl" d="M0 -58 Q-8 -42 -2 -30 Q0 -26 2 -30 Q8 -42 0 -58Z" fill="#ffc25a"/><path class="fl" d="M0 -46 Q-3 -38 0 -32 Q3 -38 0 -46Z" fill="#fff0b8"/></g>'

  // The floor lamp, its cone of light, and dust turning in it.
  out += '<g class="lamp"><polygon points="424,500 320,880 540,880" fill="url(#cone)"/><ellipse cx="424" cy="520" rx="170" ry="150" fill="url(#halo)"/></g>'
  out += '<rect x="421" y="520" width="6" height="360" fill="#16100b"/><ellipse cx="424" cy="880" rx="42" ry="8" fill="#16100b"/><polygon points="392,500 456,500 478,442 370,442" fill="#d9a85a"/><polygon points="392,500 456,500 478,442 370,442" fill="#ffd68a" opacity=".35"/>'
  for (let i = 0; i < 34; i++) {
    out += `<circle class="mote" cx="${(345 + rand() * 160).toFixed(0)}" cy="${(560 + rand() * 300).toFixed(0)}" r="${(0.8 + rand() * 1.5).toFixed(1)}" fill="#ffe2a8" style="animation-duration:${(12 + rand() * 10).toFixed(1)}s;animation-delay:${(-rand() * 20).toFixed(1)}s"/>`
  }

  // A small table with a cup of tea.
  out += '<rect x="470" y="826" width="96" height="8" rx="2" fill="#3a2414"/><rect x="512" y="834" width="8" height="46" fill="#2a190e"/><path d="M490 800 h40 v14 q0 14 -20 14 q-20 0 -20 -14Z" fill="#e8dcc8"/><path d="M530 804 q14 0 14 9 q0 9 -14 9" fill="none" stroke="#e8dcc8" stroke-width="4"/>'
  for (let i = 0; i < 3; i++) {
    out += `<path class="st" d="M${500 + i * 10} 796 q-7 -12 0 -24 q7 -12 0 -24" fill="none" stroke="#f4e8d0" stroke-width="2.4" stroke-linecap="round" style="animation-delay:${(-i * 1.7).toFixed(1)}s"/>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
