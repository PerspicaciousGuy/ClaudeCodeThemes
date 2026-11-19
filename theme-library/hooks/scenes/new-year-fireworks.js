// New Year Fireworks: an original scene of a city on New Year's night. Rockets
// climb and burst over the skyline in rings of colored sparks that fall as they
// fade, lit windows flicker, and stars show through the smoke.
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
.rk{animation:rk var(--d,8s) linear infinite;animation-delay:var(--l,0s)}
.bu{animation:bu var(--d,8s) ease-out infinite;animation-delay:var(--l,0s)}
.fl{animation:fl var(--d,8s) ease-out infinite;animation-delay:var(--l,0s)}
.tw{animation:tw var(--e,4s) ease-in-out infinite alternate;animation-delay:var(--m,0s)}
.win{animation:tw 6s ease-in-out infinite alternate}
@keyframes rk{0%{transform:translateY(var(--h,500px));opacity:0}2%{opacity:1}16%{transform:translateY(0);opacity:1}17%,100%{opacity:0;transform:translateY(0)}}
@keyframes bu{0%,16%{transform:scale(.05);opacity:0}17%{transform:scale(.1);opacity:1}42%{transform:scale(1);opacity:1}66%{transform:scale(1.05) translateY(46px);opacity:0}100%{transform:scale(1.05) translateY(46px);opacity:0}}
@keyframes fl{0%,16%{opacity:0}18%{opacity:1}34%,100%{opacity:0}}
@keyframes tw{from{opacity:.4}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.rk,.bu,.fl,.tw,.win{animation:none}.bu{opacity:0}}
`

export function buildScene() {
  const rand = rng(2027)
  const defs =
    vgrad('sky', [[0, '#04061a'], [0.6, '#12104a'], [1, '#3a1a6a']]) +
    rgrad('sm', '#7a6ac0', 0.25)

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  for (let g = 0; g < 6; g++) {
    let st = ''

    for (let i = 0; i < 14; i++) {
      st += `<circle cx="${Math.round(rand() * W)}" cy="${Math.round(rand() * rand() * 520)}" r="${(0.7 + rand() * 1.3).toFixed(1)}" fill="#e8ecff" opacity="${(0.5 + rand() * 0.4).toFixed(2)}"/>`
    }
    out += `<g class="tw" style="--e:${(3 + rand() * 3).toFixed(1)}s;--m:${(-rand() * 5).toFixed(1)}s">${st}</g>`
  }
  out += `<ellipse cx="800" cy="380" rx="900" ry="200" fill="url(#sm)"/>`

  // Each burst: a rocket, a flash and a shell of sparks in two rings.
  const bursts = [
    [260, 250, 190, '#ff5a7a', '#ffd0d8', 9, -1],
    [620, 170, 150, '#ffd24a', '#fff2b0', 8, -5],
    [1010, 260, 200, '#5ad0ff', '#d0f2ff', 10, -3],
    [1350, 180, 170, '#7aff8a', '#d8ffd8', 9, -7],
    [800, 340, 160, '#c08aff', '#ecd8ff', 11, -9],
    [1480, 360, 130, '#ff9a3a', '#ffe0b0', 8, -2],
    [120, 420, 120, '#ff8ae0', '#ffd8f4', 10, -6]
  ]

  for (const [x, y, R, c1, c2, d, l] of bursts) {
    let sp = ''
    const n = 26

    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      const ca = Math.cos(a)
      const sa = Math.sin(a)

      sp += `<line x1="${(ca * R * 0.55).toFixed(0)}" y1="${(sa * R * 0.55).toFixed(0)}" x2="${(ca * R).toFixed(0)}" y2="${(sa * R).toFixed(0)}" stroke="${c1}" stroke-width="3" stroke-linecap="round"/><circle cx="${(ca * R).toFixed(0)}" cy="${(sa * R).toFixed(0)}" r="5" fill="${c2}"/>`
      sp += `<circle cx="${(ca * R * 0.62).toFixed(0)}" cy="${(sa * R * 0.62).toFixed(0)}" r="3" fill="${c1}"/>`
    }
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2 + 0.2

      sp += `<circle cx="${(Math.cos(a) * R * 0.3).toFixed(0)}" cy="${(Math.sin(a) * R * 0.3).toFixed(0)}" r="4" fill="${c2}"/>`
    }

    const sty = `--d:${d}s;--l:${l}s`

    out += `<g transform="translate(${x} ${y})"><g class="rk" style="${sty};--h:${700 - y}px"><line x1="0" y1="0" x2="0" y2="40" stroke="#ffe6b0" stroke-width="4" stroke-linecap="round"/><circle r="5" fill="#fff"/></g><g class="fl" style="${sty}"><circle r="${R}" fill="${c1}" fill-opacity=".18"/></g><g class="bu" style="${sty}">${sp}</g></g>`
  }

  // The skyline, with lit windows.
  let sky = ''
  let wins = ''
  let x = -10

  while (x < W) {
    const w = 70 + Math.round(rand() * 90)
    const h = 130 + Math.round(rand() * 230)

    sky += `<rect x="${x}" y="${900 - h}" width="${w}" height="${h + 10}" fill="#0a0820"/>`
    for (let wy = 900 - h + 18; wy < 880; wy += 26) {
      for (let wx = x + 12; wx < x + w - 14; wx += 22) {
        if (rand() < 0.4) {
          wins += `<rect x="${wx}" y="${wy}" width="9" height="12" fill="${rand() < 0.5 ? '#ffd88a' : '#ffb85a'}"/>`
        }
      }
    }
    x += w + Math.round(rand() * 14)
  }
  out += sky + `<g class="win">${wins}</g>`

  return svg(defs, CSS, out)
}
