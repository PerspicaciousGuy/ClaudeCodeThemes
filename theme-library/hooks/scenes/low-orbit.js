// Low Orbit: an original pixel-art view of space, 192x108 grid. Parallax stars,
// a ringed gas giant, a small moon, a nebula, a passing ship and shooting stars.
// Pure SVG + CSS animation: no script, nothing loaded.

const W = 192
const H = 108

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

function disc(cx, cy, r, fill, extra = '') {
  let out = ''

  for (let dy = -r; dy <= r; dy++) {
    const hw = Math.floor(Math.sqrt(r * r - dy * dy) + 0.5)

    out += rect(cx - hw, cy + dy, hw * 2 + 1, 1, fill, extra)
  }

  return out
}

function mix(a, b, t) {
  const p = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16))
  const x = p(a)
  const y = p(b)

  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('')
}

const CSS = `
.d1{animation:drift 220s linear infinite}
.d2{animation:drift 130s linear infinite}
.d3{animation:drift 70s linear infinite}
.tw{animation:tw 4s ease-in-out infinite}
.ship{animation:ship 80s linear infinite}
.fl{animation:fl .5s steps(1,end) infinite}
.shoot{animation:shoot 11s linear infinite}
.slow{animation:slow 60s ease-in-out infinite alternate}
@keyframes drift{to{transform:translateX(-192px)}}
@keyframes tw{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes ship{from{transform:translateX(-24px)}to{transform:translateX(216px)}}
@keyframes fl{0%,100%{opacity:1}50%{opacity:.55}}
@keyframes shoot{0%,90%{opacity:0;transform:translate(0,0)}91%{opacity:1}100%{opacity:0;transform:translate(-70px,32px)}}
@keyframes slow{from{transform:translateX(-3px)}to{transform:translateX(3px)}}
@media (prefers-reduced-motion:reduce){.d1,.d2,.d3,.tw,.ship,.fl,.shoot,.slow{animation:none}}
`

export function buildScene() {
  const rand = rng(9)
  let out = rect(0, 0, W, H, '#05040c')

  // Nebula: stacked translucent discs.
  for (const [x, y, r, c] of [[34, 28, 30, '#6a2a9a'], [150, 18, 36, '#2a4aa8'], [96, 86, 34, '#8a2a6a']]) {
    out += disc(x, y, r, c, ' opacity=".045"') + disc(x, y, Math.round(r * 0.7), c, ' opacity=".05"') + disc(x, y, Math.round(r * 0.4), c, ' opacity=".06"')
  }

  // Three star layers drifting at different speeds, each tiled twice so it loops.
  function layer(cls, n, color, size) {
    let s = ''

    for (let i = 0; i < n; i++) {
      const x = Math.floor(rand() * W)
      const y = Math.floor(rand() * H)

      s += rect(x, y, size, size, color) + rect(x + W, y, size, size, color)
    }

    return `<g class="${cls}">${s}</g>`
  }
  out += layer('d1', 60, '#6f7bb0', 1) + layer('d2', 36, '#b8c6f0', 1) + layer('d3', 18, '#ffffff', 2)
  for (let i = 0; i < 10; i++) {
    out += rect(Math.floor(rand() * W), Math.floor(rand() * H), 1, 1, '#fff0c4', ` class="tw" style="animation-delay:${(-rand() * 4).toFixed(1)}s"`)
  }

  // The ringed planet: far half of the ring, the globe, then the near half.
  const cx = 140
  const cy = 72
  const r = 26
  const bands = ['#c98a5a', '#d9a574', '#b9784a', '#e2b98a', '#a8683f', '#d09a68']
  const ring = (front) => {
    const seen = new Set()
    let s = ''

    for (let a = 0; a < 360; a += 1) {
      const t = (a * Math.PI) / 180

      if (Math.sin(t) >= 0 !== front) {
        continue
      }
      for (const R of [34, 36, 39]) {
        const x = Math.round(cx + R * Math.cos(t))
        const y = Math.round(cy + R * 0.22 * Math.sin(t) - (x - cx) * 0.16)
        const key = x + ',' + y

        if (!seen.has(key)) {
          seen.add(key)
          s += rect(x, y, 1, 1, x > cx + 18 ? '#8a7656' : R === 36 ? '#e2cba0' : '#b79f78')
        }
      }
    }

    return s
  }

  out += `<g class="slow">${ring(false)}`
  for (let dy = -r; dy <= r; dy++) {
    const hw = Math.floor(Math.sqrt(r * r - dy * dy) + 0.5)
    const c = bands[Math.floor((dy + r) / 3) % bands.length]
    const t = cx + Math.round(hw * 0.4)

    out += rect(cx - hw, cy + dy, t - (cx - hw), 1, c) + rect(t, cy + dy, cx + hw - t + 1, 1, mix(c, '#0a0814', 0.62))
  }
  out += ring(true) + '</g>'

  // A small cratered moon.
  out += disc(34, 78, 6, '#9a9aa8') + rect(31, 76, 2, 2, '#7a7a88') + rect(35, 80, 2, 2, '#7a7a88') + disc(34, 78, 6, '#05040c', ' opacity=".0"')
  out += rect(37, 72, 4, 12, '#05040c', ' opacity=".35"')

  // A ship crossing, and a shooting star now and then.
  out += `<g class="ship"><g transform="translate(0 44)">${rect(-10, 1, 8, 1, '#ffb454', ' opacity=".25"')}${rect(-2, 1, 2, 2, '#ffb454', ' class="fl"')}${rect(0, 1, 8, 2, '#9aa3b8')}${rect(2, 0, 4, 1, '#cfd8ea')}${rect(8, 1, 2, 1, '#7aa2ff')}${rect(1, 3, 4, 1, '#6a748c')}</g></g>`
  out += `<g class="shoot"><g transform="translate(150 14) rotate(25)">${rect(0, 0, 8, 1, '#ffffff')}${rect(8, 0, 10, 1, '#ffffff', ' opacity=".3"')}</g></g>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges"><style>${CSS}</style>${out}</svg>`
}
