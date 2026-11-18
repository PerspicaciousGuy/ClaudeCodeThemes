// Neon Rain: an original pixel-art city at night, 192x108 grid. Layered towers
// with lit windows, buzzing neon signs, rain on a wet street, a passing car.
// Pure SVG + CSS animation: no script, nothing loaded.

const W = 192
const H = 108
const GROUND = 90

function rng(seed) {
  let s = seed >>> 0

  return () => {
    s = (s * 1664525 + 1013904223) >>> 0

    return s / 4294967296
  }
}

function rect(x, y, w, h, fill, extra = '') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${extra}/>`
}

const NEON = ['#ff3d9a', '#33e6ff', '#ffd23d', '#a06bff']
const WINDOWS = ['#ffd27a', '#5be7ff', '#ff5fb0', '#ffe9b0']

const CSS = `
.rn{animation:rn 1s linear infinite}
.rf{animation:rn 1.7s linear infinite}
.nz{animation:nz 3s ease-in-out infinite}
.wf{animation:wf 5s steps(1,end) infinite}
.sp{animation:sp 1.1s ease-out infinite}
.car{animation:car 28s linear infinite}
.drone{animation:drone 70s linear infinite}
.blink{animation:blink 1.4s steps(1,end) infinite}
@keyframes rn{from{transform:translate(0,-8px)}to{transform:translate(-8px,118px)}}
@keyframes nz{0%,100%{opacity:1}45%{opacity:.55}50%{opacity:.9}55%{opacity:.5}}
@keyframes wf{0%,100%{opacity:1}40%{opacity:.15}60%{opacity:1}}
@keyframes sp{0%{opacity:0}20%{opacity:.7}100%{opacity:0}}
@keyframes car{from{transform:translateX(-24px)}to{transform:translateX(216px)}}
@keyframes drone{from{transform:translateX(-10px)}to{transform:translateX(205px)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@media (prefers-reduced-motion:reduce){.rn,.rf,.nz,.wf,.sp,.car,.drone,.blink{animation:none}}
`

export function buildScene() {
  const rand = rng(5)
  let out = ''

  // Sky: banded dusk, with a magenta glow along the skyline.
  const sky = ['#07040f', '#0a0518', '#0e0720', '#130929', '#190b32', '#210d3a', '#2d1042', '#401249']

  sky.forEach((c, i) => {
    out += rect(0, i * 11, W, 11, c)
  })
  for (let i = 0; i < 5; i++) {
    out += rect(0, 56 + i * 6, W, 6, '#ff3d9a', ` opacity=".09"`)
  }

  // Far towers.
  for (let x = 0; x < W; ) {
    const w = 6 + Math.floor(rand() * 8)
    const h = 18 + Math.floor(rand() * 24)

    out += rect(x, GROUND - h, w, h, '#170a2c')
    if (rand() < 0.35) {
      out += rect(x + Math.floor(w / 2), GROUND - h - 4, 1, 4, '#170a2c')
    }
    for (let k = 0; k < 4; k++) {
      out += rect(x + 1 + Math.floor(rand() * (w - 2)), GROUND - h + 2 + Math.floor(rand() * (h - 4)), 1, 1, '#4a2a6a')
    }
    x += w
  }

  // Near towers, with windows and neon.
  const signs = []

  for (let x = -4; x < W; ) {
    const w = 11 + Math.floor(rand() * 8)
    const h = 26 + Math.floor(rand() * 34)
    const top = GROUND - h

    out += rect(x, top, w, h, '#0b0616') + rect(x, top, 1, h, '#1d0f36')
    for (let wy = top + 3; wy < GROUND - 4; wy += 4) {
      for (let wx = x + 2; wx < x + w - 2; wx += 3) {
        if (rand() < 0.24) {
          const c = WINDOWS[Math.floor(rand() * WINDOWS.length)]
          const flicker = rand() < 0.1

          out += rect(wx, wy, 2, 2, c, flicker ? ` class="wf" style="animation-delay:${(-rand() * 5).toFixed(1)}s"` : ' opacity=".85"')
        }
      }
    }
    if (rand() < 0.45 && w > 12) {
      signs.push({ x: x + w - 4, top, c: NEON[Math.floor(rand() * NEON.length)], tall: rand() < 0.6, w })
    }
    x += w + (rand() < 0.4 ? 3 + Math.floor(rand() * 7) : 0)
  }

  for (const s of signs) {
    const d = (-rand() * 3).toFixed(1)

    if (s.tall) {
      out += rect(s.x - 2, s.top + 4, 6, 16, s.c, ` opacity=".14" class="nz" style="animation-delay:${d}s"`)
      out += rect(s.x, s.top + 6, 2, 12, s.c, ` class="nz" style="animation-delay:${d}s"`)
      out += rect(s.x, GROUND + 2, 2, 14, s.c, ` opacity=".3" class="nz" style="animation-delay:${d}s"`)
    } else {
      out += rect(s.x - 8, s.top - 4, 12, 4, s.c, ` opacity=".14" class="nz" style="animation-delay:${d}s"`)
      out += rect(s.x - 7, s.top - 3, 10, 2, s.c, ` class="nz" style="animation-delay:${d}s"`)
      out += rect(s.x - 7, GROUND + 3, 10, 1, s.c, ` opacity=".3" class="nz" style="animation-delay:${d}s"`)
    }
  }

  // Wet street.
  out += rect(0, GROUND, W, H - GROUND, '#0a0612')
  for (let i = 0; i < 5; i++) {
    out += rect(0, GROUND + 2 + i * 4, W, 1, '#1b0f30', ' opacity=".7"')
  }
  for (let i = 0; i < 16; i++) {
    out += rect(Math.floor(rand() * (W - 6)), GROUND + 3 + Math.floor(rand() * 15), 3 + Math.floor(rand() * 4), 1, '#2a1650', ' opacity=".6"')
  }

  // A car and a drone.
  out += `<g class="car"><g transform="translate(0 ${GROUND + 8})">${rect(0, 0, 9, 2, '#0b0616')}${rect(1, -1, 5, 1, '#0b0616')}${rect(9, 0, 1, 1, '#fff6c0')}${rect(10, 0, 7, 1, '#fff6c0', ' opacity=".25"')}${rect(-1, 0, 1, 1, '#ff3d5a')}${rect(1, 3, 8, 1, '#fff6c0', ' opacity=".15"')}</g></g>`
  out += `<g class="drone"><g transform="translate(0 22)">${rect(0, 0, 3, 1, '#1a1030')}${rect(1, -1, 1, 1, '#ff3d5a', ' class="blink"')}</g></g>`

  // Rain: a thin far layer and a brighter near layer.
  for (let i = 0; i < 50; i++) {
    out += rect(Math.floor(rand() * (W + 12)), 0, 1, 3, '#7aa8d8', ` opacity=".25" class="rf" style="animation-duration:${(1.4 + rand() * 0.6).toFixed(2)}s;animation-delay:${(-rand() * 2).toFixed(2)}s"`)
  }
  for (let i = 0; i < 60; i++) {
    out += rect(Math.floor(rand() * (W + 12)), 0, 1, 5, '#a8d8ff', ` opacity=".5" class="rn" style="animation-duration:${(0.8 + rand() * 0.4).toFixed(2)}s;animation-delay:${(-rand() * 2).toFixed(2)}s"`)
  }
  for (let i = 0; i < 16; i++) {
    out += rect(Math.floor(rand() * (W - 4)), GROUND + 2 + Math.floor(rand() * 16), 3, 1, '#a8d8ff', ` class="sp" style="animation-delay:${(-rand() * 1.1).toFixed(2)}s"`)
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges"><style>${CSS}</style>${out}</svg>`
}
