// Sakura Drift: an original spring-dusk scene. Pastel sky, layered misty hills,
// a blossoming tree and petals drifting down. Vector art on a 1600x900 canvas.
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

const PINKS = ['#ffc2d4', '#ffadc6', '#ff94b5', '#ffd9e4', '#f58aae']

const CSS = `
.pf{animation:pf 18s linear infinite}
.ps{animation:ps 4s ease-in-out infinite alternate}
.mist{animation:mist 40s ease-in-out infinite alternate}
.sun{transform-origin:1180px 330px;animation:sun 10s ease-in-out infinite}
@keyframes pf{from{transform:translate(0,-80px)}to{transform:translate(var(--dx),1000px)}}
@keyframes ps{from{transform:translateX(-22px) rotate(-35deg)}to{transform:translateX(22px) rotate(35deg)}}
@keyframes mist{from{transform:translateX(-50px)}to{transform:translateX(50px)}}
@keyframes sun{0%,100%{opacity:.85;transform:scale(1)}50%{opacity:1;transform:scale(1.04)}}
@media (prefers-reduced-motion:reduce){.pf,.ps,.mist,.sun{animation:none}}
`

function hills(base, amp, seed, fill) {
  let d = `M-10 ${H}`

  for (let x = -10; x <= W + 10; x += 20) {
    d += ` L${x} ${(base - amp * (0.5 + 0.5 * Math.sin(x / 210 + seed)) - amp * 0.35 * Math.sin(x / 71 + seed * 2)).toFixed(0)}`
  }

  return `<path d="${d} L${W + 10} ${H} Z" fill="${fill}"/>`
}

export function buildScene() {
  const rand = rng(17)
  const defs =
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9a4e0"/><stop offset=".45" stop-color="#f0b4c8"/><stop offset=".8" stop-color="#ffd3b5"/><stop offset="1" stop-color="#ffe6c4"/></linearGradient>' +
    '<radialGradient id="mistG"><stop offset="0" stop-color="#fff0f4" stop-opacity=".6"/><stop offset="1" stop-color="#fff0f4" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="sunG"><stop offset="0" stop-color="#fff6e0" stop-opacity=".95"/><stop offset=".4" stop-color="#ffe0c0" stop-opacity=".55"/><stop offset="1" stop-color="#ffd0b0" stop-opacity="0"/></radialGradient>'

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  out += `<g class="sun"><circle cx="1180" cy="330" r="300" fill="url(#sunG)"/><circle cx="1180" cy="330" r="62" fill="#fff4dc"/></g>`

  out += hills(560, 110, 1, '#d6a9cf') + hills(640, 90, 3, '#c28db8')
  out += `<g class="mist"><ellipse cx="500" cy="610" rx="560" ry="52" fill="url(#mistG)"/><ellipse cx="1150" cy="662" rx="500" ry="46" fill="url(#mistG)"/></g>`
  out += hills(730, 80, 5, '#a574a6')

  // The tree: a leaning trunk, branches, and clouds of blossom.
  const trunk = 'M250 900 C 262 780 214 700 270 590 C 300 530 300 470 350 410'
  const branches = ['M270 590 C 190 560 150 520 120 450', 'M300 530 C 400 500 470 470 520 400', 'M332 440 C 300 380 330 330 400 290', 'M214 700 C 150 690 100 650 70 600']

  out += `<path d="${trunk}" fill="none" stroke="#4a2f45" stroke-width="30" stroke-linecap="round"/>`
  for (const b of branches) {
    out += `<path d="${b}" fill="none" stroke="#4a2f45" stroke-width="13" stroke-linecap="round"/>`
  }
  for (const [x, y, n] of [[120, 450, 70], [520, 400, 80], [400, 290, 70], [70, 600, 50], [350, 410, 90], [210, 520, 60]]) {
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2
      const d = rand() * 90

      out += `<circle cx="${(x + Math.cos(a) * d * 1.3).toFixed(0)}" cy="${(y + Math.sin(a) * d).toFixed(0)}" r="${(12 + rand() * 22).toFixed(0)}" fill="${PINKS[Math.floor(rand() * PINKS.length)]}" opacity=".88"/>`
    }
  }

  // Foreground hill.
  out += hills(850, 40, 7, '#6a4a78')

  // Petals: each falls on one path and sways on another.
  const petal = 'M0 0 C 6 -9 15 -5 13 6 C 9 13 0 11 0 0 Z'

  for (let i = 0; i < 38; i++) {
    const x = Math.round(rand() * W)
    const s = (0.7 + rand() * 1.0).toFixed(2)
    const dx = Math.round((rand() - 0.2) * 260)

    out += `<g transform="translate(${x} 0)"><g class="pf" style="--dx:${dx}px;animation-duration:${(14 + rand() * 12).toFixed(1)}s;animation-delay:${(-rand() * 24).toFixed(1)}s"><g class="ps" style="animation-duration:${(3 + rand() * 3).toFixed(1)}s;animation-delay:${(-rand() * 4).toFixed(1)}s"><path d="${petal}" transform="scale(${s})" fill="${PINKS[Math.floor(rand() * PINKS.length)]}" opacity=".92"/></g></g></g>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
