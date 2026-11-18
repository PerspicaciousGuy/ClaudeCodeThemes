// Abyss Lantern: an original deep-sea scene. Sun shafts fading into the dark,
// glowing jellyfish, swaying kelp, bubbles and a passing school of fish.
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

const CSS = `
.ray{animation:ray 11s ease-in-out infinite alternate}
.bub{animation:bub 16s linear infinite}
.snow{animation:snow 26s linear infinite}
.kelp{animation:kelp 6s ease-in-out infinite alternate}
.jf{animation:jf 9s ease-in-out infinite alternate}
.pulse{animation:pulse 3.2s ease-in-out infinite}
.tent{animation:tent 2.8s ease-in-out infinite alternate}
.fish{animation:fish 70s linear infinite}
@keyframes ray{from{transform:rotate(-3deg);opacity:.55}to{transform:rotate(3deg);opacity:1}}
@keyframes bub{0%{transform:translate(0,0);opacity:0}10%{opacity:.8}100%{transform:translate(var(--dx),-1000px);opacity:0}}
@keyframes snow{from{transform:translateY(-30px)}to{transform:translateY(60px)}}
@keyframes kelp{from{transform:rotate(-5deg)}to{transform:rotate(6deg)}}
@keyframes jf{from{transform:translate(-30px,20px)}to{transform:translate(30px,-50px)}}
@keyframes pulse{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.84)}}
@keyframes tent{from{transform:skewX(-6deg)}to{transform:skewX(6deg)}}
@keyframes fish{from{transform:translateX(-260px)}to{transform:translateX(1900px)}}
@media (prefers-reduced-motion:reduce){.ray,.bub,.snow,.kelp,.jf,.pulse,.tent,.fish{animation:none}}
`

function jelly(x, y, s, c1, c2) {
  let tents = ''

  for (let i = -2; i <= 2; i++) {
    tents += `<path class="tent" style="transform-origin:${i * 14}px 0;animation-delay:${(i * 0.3).toFixed(1)}s" d="M${i * 14} 2 C ${i * 14 + 10} 40 ${i * 14 - 10} 80 ${i * 14 + 4} 130" fill="none" stroke="${c2}" stroke-width="3" stroke-linecap="round" opacity=".55"/>`
  }

  return `<g transform="translate(${x} ${y}) scale(${s})"><g class="jf" style="animation-duration:${(8 + s * 3).toFixed(1)}s"><circle r="120" fill="url(#jg-${c1.slice(1)})" opacity=".5"/><g class="pulse" style="transform-origin:0 0"><path d="M-46 0 C -46 -58 46 -58 46 0 C 24 -9 -24 -9 -46 0 Z" fill="${c1}" opacity=".78"/><path d="M-30 -8 C -28 -36 28 -36 30 -8" fill="none" stroke="#ffffff" stroke-width="3" opacity=".35"/></g>${tents}</g></g>`
}

export function buildScene() {
  const rand = rng(41)
  const J = ['#6cf0ff', '#c79bff', '#7dffc0']
  let defs =
    '<linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d5766"/><stop offset=".45" stop-color="#073646"/><stop offset="1" stop-color="#020d14"/></linearGradient>' +
    '<linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bff6ff" stop-opacity=".24"/><stop offset=".7" stop-color="#bff6ff" stop-opacity=".04"/><stop offset="1" stop-color="#bff6ff" stop-opacity="0"/></linearGradient>'

  for (const c of J) {
    defs += `<radialGradient id="jg-${c.slice(1)}"><stop offset="0" stop-color="${c}" stop-opacity=".7"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`
  }

  let out = `<rect width="${W}" height="${H}" fill="url(#w)"/>`

  // Sun shafts from the surface.
  for (let i = 0; i < 7; i++) {
    const x = 100 + i * 230 + Math.round(rand() * 80)
    const w = 60 + Math.round(rand() * 80)

    out += `<g class="ray" style="transform-origin:${x}px 0;animation-delay:${(-rand() * 11).toFixed(1)}s;animation-duration:${(9 + rand() * 6).toFixed(1)}s"><polygon points="${x},0 ${x + w},0 ${x + w * 2.6},760 ${x - w * 1.1},760" fill="url(#rg)"/></g>`
  }

  // Drifting specks.
  for (let i = 0; i < 90; i++) {
    out += `<circle class="snow" cx="${Math.round(rand() * W)}" cy="${Math.round(rand() * H)}" r="${(0.8 + rand() * 1.6).toFixed(1)}" fill="#bff6ff" opacity="${(0.12 + rand() * 0.25).toFixed(2)}" style="animation-duration:${(18 + rand() * 20).toFixed(0)}s;animation-delay:${(-rand() * 30).toFixed(0)}s"/>`
  }

  // A school of fish, far off and dim.
  let fish = ''

  for (let i = 0; i < 9; i++) {
    const fx = Math.round(rand() * 90)
    const fy = Math.round(rand() * 60)

    fish += `<g transform="translate(${fx} ${fy})"><ellipse rx="16" ry="6" fill="#1b6070"/><polygon points="-14,0 -26,-7 -26,7" fill="#1b6070"/></g>`
  }
  out += `<g class="fish" opacity=".75"><g transform="translate(0 330)">${fish}</g></g>`
  out += `<g class="fish" style="animation-duration:95s;animation-delay:-40s" opacity=".5"><g transform="translate(0 560) scale(.8)">${fish}</g></g>`

  // Jellyfish.
  out += jelly(300, 300, 1.1, J[0], J[0]) + jelly(1260, 240, 0.8, J[1], J[1]) + jelly(1040, 560, 1.3, J[2], J[2]) + jelly(520, 640, 0.6, J[0], J[0])

  // Seafloor, kelp and rocks.
  out += `<path d="M-10 ${H} L-10 800 C 200 770 340 820 560 800 C 800 780 960 830 1200 800 C 1380 780 1500 810 1610 790 L1610 ${H} Z" fill="#031a22"/>`
  for (let i = 0; i < 22; i++) {
    const x = Math.round(rand() * W)
    const h = 150 + Math.round(rand() * 260)
    const sway = Math.round((rand() - 0.5) * 70)

    out += `<path class="kelp" style="transform-origin:${x}px 840px;animation-delay:${(-rand() * 6).toFixed(1)}s;animation-duration:${(5 + rand() * 4).toFixed(1)}s" d="M${x} 850 C ${x + sway} ${850 - h * 0.4} ${x - sway} ${850 - h * 0.7} ${x + sway / 2} ${850 - h}" fill="none" stroke="${i % 3 === 0 ? '#0c4a40' : '#0a3a34'}" stroke-width="${8 + Math.round(rand() * 8)}" stroke-linecap="round"/>`
  }
  out += `<path d="M-10 ${H} L-10 850 C 260 830 520 870 800 855 C 1080 840 1340 872 1610 850 L1610 ${H} Z" fill="#020f15"/>`

  // Bubbles.
  for (let i = 0; i < 26; i++) {
    const r = 3 + rand() * 9

    out += `<circle class="bub" cx="${Math.round(rand() * W)}" cy="${860 + Math.round(rand() * 60)}" r="${r.toFixed(1)}" fill="none" stroke="#bff6ff" stroke-width="1.5" style="--dx:${Math.round((rand() - 0.5) * 120)}px;animation-duration:${(12 + rand() * 12).toFixed(1)}s;animation-delay:${(-rand() * 24).toFixed(1)}s"/>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
