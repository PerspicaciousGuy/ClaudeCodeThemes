// Rainy Window: an original night view of a city through rain-streaked glass.
// Soft bokeh lights, drops sliding down the pane, a warm lamp and a steaming
// mug on the sill. Vector art on a 1600x900 canvas.
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

const GLOWS = [
  ['amber', '#ffb45a'],
  ['rose', '#ff6fa8'],
  ['cyan', '#58d8ff'],
  ['white', '#fff2dc'],
  ['green', '#7dffb0'],
]

const CSS = `
.bk{animation:bk 7s ease-in-out infinite}
.dr{animation:dr 9s ease-in infinite}
.st{animation:st 5s ease-in-out infinite}
.car{animation:car 40s linear infinite}
@keyframes bk{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.12)}}
@keyframes dr{0%{transform:translateY(0);opacity:0}8%{opacity:.8}85%{opacity:.55}100%{transform:translateY(var(--len));opacity:0}}
@keyframes st{0%{transform:translate(0,0);opacity:0}25%{opacity:.5}100%{transform:translate(var(--sx),-90px);opacity:0}}
@keyframes car{from{transform:translateX(-120px)}to{transform:translateX(1720px)}}
@media (prefers-reduced-motion:reduce){.bk,.dr,.st,.car{animation:none}}
`

export function buildScene() {
  const rand = rng(21)
  let defs = '<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#080d1f"/><stop offset=".55" stop-color="#121a38"/><stop offset="1" stop-color="#1d2347"/></linearGradient>'

  for (const [name, c] of GLOWS) {
    defs += `<radialGradient id="g-${name}"><stop offset="0" stop-color="${c}" stop-opacity=".85"/><stop offset=".55" stop-color="${c}" stop-opacity=".35"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`
  }
  defs += '<radialGradient id="lamp" cx=".2" cy="1" r=".9"><stop offset="0" stop-color="#ffb45a" stop-opacity=".45"/><stop offset="1" stop-color="#ffb45a" stop-opacity="0"/></radialGradient>'
  defs += '<linearGradient id="streak" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe6ff" stop-opacity="0"/><stop offset=".15" stop-color="#cfe6ff" stop-opacity=".55"/><stop offset="1" stop-color="#cfe6ff" stop-opacity="0"/></linearGradient>'
  defs += '<linearGradient id="sill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1f1a"/><stop offset="1" stop-color="#120d0b"/></linearGradient>'

  let out = `<rect width="${W}" height="${H}" fill="url(#bg)"/>`

  // Distant city blocks, barely lit.
  for (let x = 0; x < W; ) {
    const w = 60 + Math.floor(rand() * 110)
    const h = 160 + Math.floor(rand() * 260)

    out += `<rect x="${x}" y="${640 - h}" width="${w}" height="${h + 260}" fill="#0b1126" opacity=".75"/>`
    x += w + Math.floor(rand() * 18)
  }

  // Bokeh: soft discs of light out of focus.
  for (let i = 0; i < 70; i++) {
    const [name] = GLOWS[Math.floor(rand() * GLOWS.length)]
    const r = 16 + rand() * 46
    const x = Math.round(rand() * W)
    const y = Math.round(180 + rand() * 520)
    const d = (-rand() * 7).toFixed(1)

    out += `<g class="bk" style="transform-origin:${x}px ${y}px;animation-delay:${d}s;animation-duration:${(5 + rand() * 5).toFixed(1)}s"><circle cx="${x}" cy="${y}" r="${r.toFixed(0)}" fill="url(#g-${name})"/></g>`
  }

  // Tail lights crossing the street far below.
  out += '<g class="car"><circle cx="0" cy="720" r="9" fill="url(#g-rose)"/><circle cx="34" cy="720" r="9" fill="url(#g-rose)"/></g>'

  // Warm room light spilling up from the sill.
  out += `<rect width="${W}" height="${H}" fill="url(#lamp)"/>`

  // Drops sliding down the glass, and drops resting on it.
  for (let i = 0; i < 26; i++) {
    const x = Math.round(rand() * W)
    const y0 = Math.round(rand() * 360)
    const len = Math.round(160 + rand() * 360)

    out += `<g class="dr" style="--len:${len}px;animation-duration:${(7 + rand() * 7).toFixed(1)}s;animation-delay:${(-rand() * 12).toFixed(1)}s"><rect x="${x}" y="${y0}" width="3" height="${60 + Math.round(rand() * 80)}" rx="1.5" fill="url(#streak)"/><ellipse cx="${x + 1.5}" cy="${y0 + 64}" rx="5" ry="7" fill="#dff0ff" opacity=".4"/></g>`
  }
  for (let i = 0; i < 90; i++) {
    const x = Math.round(rand() * W)
    const y = Math.round(rand() * 800)
    const r = 2 + rand() * 4

    out += `<ellipse cx="${x}" cy="${y}" rx="${r.toFixed(1)}" ry="${(r * 1.3).toFixed(1)}" fill="#eaf4ff" opacity="${(0.12 + rand() * 0.18).toFixed(2)}"/><circle cx="${x - r / 3}" cy="${(y - r / 2).toFixed(1)}" r="${(r / 3).toFixed(1)}" fill="#ffffff" opacity=".45"/>`
  }

  // Window frame: slim sides and top, and the sill.
  out += `<rect x="0" y="0" width="34" height="${H}" fill="#0a0709"/><rect x="${W - 34}" y="0" width="34" height="${H}" fill="#0a0709"/><rect x="0" y="0" width="${W}" height="26" fill="#0a0709"/>`
  out += `<rect x="0" y="826" width="${W}" height="${H - 826}" fill="url(#sill)"/><rect x="0" y="826" width="${W}" height="3" fill="#4a362b" opacity=".7"/>`

  // A mug on the sill, with steam.
  out += '<g transform="translate(150 826)"><rect x="-34" y="-62" width="68" height="62" rx="9" fill="#2f2420"/><rect x="-34" y="-62" width="68" height="8" rx="4" fill="#4a3a32"/><path d="M34 -46 C 62 -46 62 -14 34 -14" fill="none" stroke="#2f2420" stroke-width="9" stroke-linecap="round"/><ellipse cx="0" cy="-58" rx="30" ry="4" fill="#6a4a30"/></g>'
  for (let i = 0; i < 4; i++) {
    out += `<path class="st" style="--sx:${(i % 2 ? 22 : -22)}px;animation-delay:${(-i * 1.25).toFixed(2)}s" d="M${140 + i * 8} 756 C ${132 + i * 8} 738 ${152 + i * 8} 724 ${144 + i * 8} 706" fill="none" stroke="#ffe9cf" stroke-width="5" stroke-linecap="round" opacity=".4"/>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
