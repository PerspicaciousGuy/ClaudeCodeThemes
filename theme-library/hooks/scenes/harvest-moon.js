// Harvest Moon: an original scene of a huge orange moon over a wheat field.
// Wheat sways in long waves, hay bales and a barn stand dark against the moon,
// crows cross its face, thin clouds drift and stars come out.
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
.tw{animation:tw var(--d,4s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.wave{animation:wave var(--d,6s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.cloud{animation:cloud var(--d,90s) ease-in-out infinite alternate}
.crow{animation:crow var(--d,50s) linear infinite;animation-delay:var(--l,0s)}
.flap{animation:flap .8s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center}
.glow{animation:glow 10s ease-in-out infinite alternate}
@keyframes tw{from{opacity:.25}to{opacity:1}}
@keyframes wave{from{transform:skewX(-3deg)}to{transform:skewX(3.5deg)}}
@keyframes cloud{from{transform:translateX(-140px)}to{transform:translateX(160px)}}
@keyframes crow{from{transform:translateX(-120px)}to{transform:translateX(1760px)}}
@keyframes flap{from{transform:scaleY(1)}to{transform:scaleY(.4)}}
@keyframes glow{from{opacity:.7}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.tw,.wave,.cloud,.crow,.flap,.glow{animation:none}}
`

export function buildScene() {
  const rand = rng(19)
  const defs =
    vgrad('sky', [[0, '#150f2e'], [0.5, '#3a1f4a'], [0.8, '#8a3a3a'], [1, '#c8683a']]) +
    rgrad('halo', '#ffb060', 0.8) +
    vgrad('moon', [[0, '#ffe2a0'], [1, '#f0a860']]) +
    vgrad('field', [[0, '#8a5a24'], [1, '#2a160c']])

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  for (let g = 0; g < 7; g++) {
    let stars = ''

    for (let i = 0; i < 14; i++) {
      stars += `<circle cx="${Math.round(rand() * W)}" cy="${Math.round(rand() * rand() * 400)}" r="${(0.7 + rand() * 1.3).toFixed(1)}" fill="#ffeed8" opacity="${(0.45 + rand() * 0.4).toFixed(2)}"/>`
    }
    out += `<g class="tw" style="--d:${(3 + rand() * 3).toFixed(1)}s;--l:${(-rand() * 5).toFixed(1)}s">${stars}</g>`
  }

  // The moon, huge and low, with a halo and faint seas.
  out += `<g class="glow"><circle cx="800" cy="470" r="520" fill="url(#halo)" opacity=".6"/></g>`
  out += `<circle cx="800" cy="470" r="230" fill="url(#moon)"/><circle cx="740" cy="420" r="46" fill="#e8a860" opacity=".5"/><circle cx="860" cy="520" r="62" fill="#e8a860" opacity=".4"/><circle cx="830" cy="390" r="26" fill="#e8a860" opacity=".45"/><circle cx="730" cy="540" r="30" fill="#e8a860" opacity=".35"/>`

  // Crows crossing.
  for (let i = 0; i < 4; i++) {
    const y = 250 + Math.round(rand() * 250)
    const s = 0.8 + rand() * 0.6

    out += `<g class="crow" style="--d:${(40 + rand() * 30).toFixed(0)}s;--l:${(-rand() * 60).toFixed(0)}s"><g transform="translate(0 ${y}) scale(${s.toFixed(2)})"><g class="flap" style="animation-delay:${(-rand() * 0.8).toFixed(2)}s"><path d="M-20 0 Q -10 -14 0 -2 Q 10 -14 20 0 Q 10 -5 0 4 Q -10 -5 -20 0 Z" fill="#05030a"/></g></g></g>`
  }

  // Thin clouds crossing the moon's glow.
  out += `<g class="cloud"><g fill="#4a2a4a" opacity=".4"><ellipse cx="500" cy="330" rx="260" ry="20"/><ellipse cx="1100" cy="560" rx="320" ry="24"/><ellipse cx="1300" cy="250" rx="200" ry="16"/></g></g>`

  // A far treeline and barn, dark against the glow.
  out += `<path d="M0 640 C 200 610 400 630 620 616 C 840 602 1060 632 1280 614 C 1420 604 1520 616 1600 608 L1600 900 L0 900 Z" fill="#2a1428"/>`
  out += `<g fill="#160a18"><path d="M1240 640 L1240 560 L1290 520 L1340 560 L1340 640 Z"/><rect x="1352" y="590" width="40" height="50"/><path d="M1352 590 L1372 572 L1392 590 Z"/></g><g class="glow"><rect x="1278" y="570" width="24" height="24" fill="#f4b050"/></g>`

  // The wheat field: rows of waving ears in perspective, back to front.
  out += `<rect x="0" y="640" width="${W}" height="260" fill="url(#field)"/>`

  for (const [y, step, h, col] of [[660, 28, 70, '#8a5a26'], [700, 34, 95, '#a8702c'], [760, 40, 125, '#c08838'], [840, 46, 160, '#d49c44']]) {
    let row = ''

    for (let x = -20; x < W + 40; x += step) {
      const hh = h * (0.85 + rand() * 0.3)

      row += `<path d="M${x} ${y} Q ${x + 4} ${(y - hh * 0.6).toFixed(0)} ${x + 8} ${(y - hh).toFixed(0)}" stroke="${col}" stroke-width="3" fill="none"/><ellipse cx="${x + 8}" cy="${(y - hh - 8).toFixed(0)}" rx="4" ry="12" fill="${col}"/>`
    }
    out += `<g class="wave" style="transform-origin:800px ${y}px;--d:${(5 + rand() * 3).toFixed(1)}s;--l:${(-rand() * 6).toFixed(1)}s">${row}</g>`
  }

  // Hay bales in the foreground corners.
  for (const [x, y] of [[170, 850], [320, 868], [1420, 856]]) {
    out += `<ellipse cx="${x}" cy="${y}" rx="64" ry="48" fill="#a07030"/><ellipse cx="${x}" cy="${y}" rx="44" ry="32" fill="none" stroke="#7a5020" stroke-width="3"/><ellipse cx="${x}" cy="${y}" rx="22" ry="16" fill="none" stroke="#7a5020" stroke-width="3"/>`
  }

  return svg(defs, CSS, out)
}
