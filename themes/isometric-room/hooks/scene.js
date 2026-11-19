// Isometric Room: an original scene of a small room in isometric view at night.
// A desk with a glowing monitor and a lamp, a plant, a bookshelf, a rug with a
// sleeping cat and a window onto a moonlit sky, all lit softly from the screen.
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
.scr{animation:scr 3s ease-in-out infinite alternate}
.lamp{animation:scr 5s ease-in-out infinite alternate}
.cat{animation:cat 4s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}
.tail{animation:tail 3s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:100% 50%}
.leaf{animation:leaf 6s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}
.tw{animation:scr var(--d,4s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.cloud{animation:cloud 90s ease-in-out infinite alternate}
@keyframes scr{from{opacity:.7}to{opacity:1}}
@keyframes cat{from{transform:scaleY(1)}to{transform:scaleY(1.05)}}
@keyframes tail{from{transform:rotate(-8deg)}to{transform:rotate(10deg)}}
@keyframes leaf{from{transform:rotate(-2deg)}to{transform:rotate(2.5deg)}}
@keyframes cloud{from{transform:translateX(-30px)}to{transform:translateX(40px)}}
@media (prefers-reduced-motion:reduce){.scr,.lamp,.cat,.tail,.leaf,.tw,.cloud{animation:none}}
`

// Isometric projection of room coordinates: x runs down to the right, y runs down to the left, z is up.
// The back corner of the room is (0, 0, 0); the two back walls are the planes y = 0 and x = 0.
const OX = 800
const OY = 340
const U = 50

const xy = (x, y, z) => [OX + (x - y) * U * 0.866, OY + (x + y) * U * 0.5 - z * U]
const P = (x, y, z) => xy(x, y, z).map(n => n.toFixed(0)).join(',')
const poly = (pts, fill, extra = '') => `<polygon points="${pts.map(p => P(...p)).join(' ')}" fill="${fill}" ${extra}/>`

// A box with its top, +y and +x faces shaded.
function box(x, y, z, w, d, h, top, left, right) {
  return poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], top) + poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], left) + poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], right)
}

export function buildScene() {
  const rand = rng(3)
  const defs =
    vgrad('sky', [[0, '#0a1030'], [1, '#1c2250']]) +
    rgrad('scr', '#7ad8ff', 0.7) +
    rgrad('lamp', '#ffc860', 0.8) +
    rgrad('moon', '#e8eeff', 0.5)

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  for (let g = 0; g < 5; g++) {
    let st = ''

    for (let i = 0; i < 14; i++) {
      st += `<circle cx="${Math.round(rand() * W)}" cy="${Math.round(rand() * H)}" r="${(0.7 + rand() * 1.3).toFixed(1)}" fill="#e8ecff" opacity="${(0.4 + rand() * 0.4).toFixed(2)}"/>`
    }
    out += `<g class="tw" style="--d:${(3 + rand() * 3).toFixed(1)}s;--l:${(-rand() * 4).toFixed(1)}s">${st}</g>`
  }

  // The floor, and the two back walls meeting at the top corner.
  const R = 7
  const Hh = 6

  out += poly([[0, 0, 0], [R, 0, 0], [R, R, 0], [0, R, 0]], '#2a2440')
  out += poly([[0, 0, 0], [R, 0, 0], [R, 0, Hh], [0, 0, Hh]], '#2e2848')
  out += poly([[0, 0, 0], [0, R, 0], [0, R, Hh], [0, 0, Hh]], '#3a3258')

  // A window in the left wall (x = 0) with the moon in it.
  const wp = [[0, 1, 2.3], [0, 3.2, 2.3], [0, 3.2, 5], [0, 1, 5]]
  const [mx, my] = xy(0, 2.1, 4)

  out += `<clipPath id="win"><polygon points="${wp.map(p => P(...p)).join(' ')}"/></clipPath>`
  out += poly(wp, '#0c1438')
  out += `<g clip-path="url(#win)"><circle cx="${mx.toFixed(0)}" cy="${my.toFixed(0)}" r="60" fill="url(#moon)"/><circle cx="${mx.toFixed(0)}" cy="${my.toFixed(0)}" r="15" fill="#eef2ff"/><g class="cloud"><ellipse cx="${xy(0, 1.6, 3.2)[0].toFixed(0)}" cy="${xy(0, 1.6, 3.2)[1].toFixed(0)}" rx="46" ry="9" fill="#2a3a6a"/></g></g>`
  out += poly(wp, 'none', 'stroke="#6a5a8a" stroke-width="6"') + `<line x1="${xy(0, 2.1, 2.3)[0].toFixed(0)}" y1="${xy(0, 2.1, 2.3)[1].toFixed(0)}" x2="${xy(0, 2.1, 5)[0].toFixed(0)}" y2="${xy(0, 2.1, 5)[1].toFixed(0)}" stroke="#6a5a8a" stroke-width="5"/>`

  // A bookshelf against the left wall, with books on its front.
  out += box(0.05, 3.6, 0, 0.7, 3.2, 3.3, '#6a4a30', '#4a3220', '#58402a')
  for (let i = 0; i < 9; i++) {
    out += box(0.75, 3.75 + i * 0.33, 2.2, 0.2, 0.26, 0.95, '#a04040', '#802e2e', ['#c04a4a', '#4a8ac0', '#d8a83a', '#5aa86a'][i % 4])
  }

  // A rug with a sleeping cat on it.
  out += poly([[2.0, 2.6, 0.02], [5.6, 2.6, 0.02], [5.6, 5.6, 0.02], [2.0, 5.6, 0.02]], '#6a3a5a')
  out += poly([[2.3, 2.9, 0.03], [5.3, 2.9, 0.03], [5.3, 5.3, 0.03], [2.3, 5.3, 0.03]], '#8a4a6a')

  const [cx, cy] = xy(3.8, 4.1, 0.25)

  out += `<g class="tail"><path d="M${(cx - 48).toFixed(0)} ${cy.toFixed(0)} q -36 -4 -34 22 q 4 14 24 6" fill="none" stroke="#c0803a" stroke-width="11" stroke-linecap="round"/></g><g class="cat"><ellipse cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" rx="48" ry="22" fill="#d89a50"/><circle cx="${(cx + 36).toFixed(0)}" cy="${(cy - 6).toFixed(0)}" r="16" fill="#d89a50"/><polygon points="${(cx + 26).toFixed(0)},${(cy - 16).toFixed(0)} ${(cx + 30).toFixed(0)},${(cy - 31).toFixed(0)} ${(cx + 38).toFixed(0)},${(cy - 19).toFixed(0)}" fill="#d89a50"/><polygon points="${(cx + 40).toFixed(0)},${(cy - 19).toFixed(0)} ${(cx + 48).toFixed(0)},${(cy - 31).toFixed(0)} ${(cx + 50).toFixed(0)},${(cy - 15).toFixed(0)}" fill="#d89a50"/></g>`

  // A desk against the back right wall (y = 0), with a monitor and a lamp.
  out += box(2.8, 0.1, 0, 3.8, 1.5, 1.5, '#7a5a3a', '#5a4028', '#6a4c30')
  out += box(3.6, 0.5, 1.5, 1.7, 0.3, 1.1, '#1a1a24', '#12121a', '#16161e')

  const sc = [[3.7, 0.8, 1.6], [5.2, 0.8, 1.6], [5.2, 0.8, 2.5], [3.7, 0.8, 2.5]]
  const [sx, sy] = xy(4.45, 0.8, 2.05)

  out += `<g class="scr"><circle cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" r="170" fill="url(#scr)"/>${poly(sc, '#3a8ac8')}</g>`
  out += box(5.7, 0.7, 1.5, 0.3, 0.3, 0.2, '#2a2430', '#1a1620', '#201c28')

  const [lx, ly] = xy(5.85, 0.85, 2.0)

  out += `<g class="lamp"><circle cx="${lx.toFixed(0)}" cy="${ly.toFixed(0)}" r="150" fill="url(#lamp)"/></g><polygon points="${[[5.5, 0.5, 2.0], [6.2, 0.5, 2.0], [6.2, 1.2, 2.0], [5.5, 1.2, 2.0]].map(p => P(...p)).join(' ')}" fill="#ffd890"/>`

  // A plant in a pot in the right-hand corner, its leaves swaying.
  out += box(6.2, 2.2, 0, 0.7, 0.7, 0.7, '#b06a4a', '#8a5238', '#9a5c40')

  const [px, py] = xy(6.55, 2.55, 0.7)
  let leaves = ''

  for (let i = 0; i < 6; i++) {
    leaves += `<ellipse cx="${px.toFixed(0)}" cy="${(py - 46).toFixed(0)}" rx="13" ry="50" fill="${i % 2 ? '#3a9a5a' : '#2c8048'}" transform="rotate(${-62 + i * 25} ${px.toFixed(0)} ${py.toFixed(0)})"/>`
  }
  out += `<g class="leaf">${leaves}</g>`

  return svg(defs, CSS, out)
}
