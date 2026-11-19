// Widgets laid over a scene, each look in a shape of its own: context fill, limits, reset countdown and session cost.
import { MASCOT_CSS, sprite } from './mascot.js'

// Everything here is SVG text built from plain numbers, so a theme's own scene is left alone.

const MONO = "ui-monospace, 'Cascadia Mono', Menlo, Consolas, monospace"
const SANS = "'Segoe UI', system-ui, -apple-system, sans-serif"
const SERIF = "Cambria, 'Palatino Linotype', Palatino, 'Times New Roman', serif"

/**
 * How the widgets look. Each skin is one family of themes:
 * paper (warm cream and ink), neon (glowing lines on dark glass), pixel (square tiles),
 * blueprint (thin drafted lines), deco (gold on navy), frost (frosted glass), wood (brass on dark wood),
 * ink (brush on rice paper), riso (two-colour print), terminal (green phosphor), amber (console glass),
 * pastel (soft candy tiles) and spooky (pumpkin orange on purple).
 */
const SKINS = {
  paper: { frame: 'note', tilt: true, fill: '#fbf6ea', fillOpacity: 0.93, stroke: '#3a2e24', strokeWidth: 3.2, light: true, ink: '#3a2e24', accent: '#d8a44a', hot: '#c8402f', shadow: 0.14, font: MONO, weight: 800 },
  neon: { frame: 'circle', fill: '#0a0a1a', fillOpacity: 0.8, stroke: '#38f0ff', strokeWidth: 2.2, glow: '#38f0ff', ink: '#e8fbff', accent: '#ff4fd8', hot: '#ffe14a', shadow: 0, font: MONO, weight: 700 },
  pixel: { frame: 'notch', fill: '#1d1b2e', fillOpacity: 0.95, stroke: '#f2e9c8', strokeWidth: 4, ink: '#f2e9c8', accent: '#ffd24a', hot: '#ff5a5a', shadow: 0.35, font: MONO, weight: 900, crisp: true },
  blueprint: { frame: 'plan', fill: '#0d2a4f', fillOpacity: 0.3, stroke: '#a9d4ff', strokeWidth: 1.6, inner: '#a9d4ff', dashed: true, ink: '#cfe6ff', accent: '#7ec0ff', hot: '#ffd24a', shadow: 0, font: MONO, weight: 600 },
  deco: { frame: 'stepped', fill: '#121a30', fillOpacity: 0.88, stroke: '#d9b45a', strokeWidth: 2.8, inner: '#d9b45a', ink: '#f0dfae', accent: '#d9b45a', hot: '#f08a5a', shadow: 0.25, font: SANS, weight: 700 },
  frost: { frame: 'glass', fill: '#ffffff', fillOpacity: 0.17, stroke: '#ffffff', strokeOpacity: 0.6, strokeWidth: 1.8, ink: '#f6f9ff', accent: '#8fd4e8', hot: '#ffb18a', shadow: 0.1, font: SANS, weight: 600 },
  // Dark wood with a brass rim, for cabins, cafes and firelit rooms.
  wood: { frame: 'plank', tilt: true, fill: '#4e3220', fillOpacity: 0.93, stroke: '#c9a14a', strokeWidth: 3.6, inner: '#c9a14a', ink: '#f3e3c3', accent: '#e0a84a', hot: '#ef6a3e', shadow: 0.32, font: SERIF, weight: 700 },
  // Brush ink on rice paper, with a seal-red second hand.
  ink: { frame: 'scroll', fill: '#f4efe2', fillOpacity: 0.93, stroke: '#1c1c1c', strokeWidth: 3, light: true, ink: '#1c1c1c', accent: '#a9a79a', hot: '#b3261e', shadow: 0.08, font: SERIF, weight: 700 },
  // A two-colour print: flat cream, navy ink and a hard pink offset instead of a soft shadow.
  riso: { frame: 'ticket', tilt: true, fill: '#fff4dc', fillOpacity: 0.96, stroke: '#1b2a6b', strokeWidth: 3.4, light: true, ink: '#1b2a6b', accent: '#ff5a8a', hot: '#2f6fe0', shadow: 1, shadowColor: '#ff5a8a', shadowDx: 6, shadowDy: 6, font: SANS, weight: 800 },
  // Green phosphor on black, sharp corners.
  terminal: { frame: 'window', fill: '#041a0a', fillOpacity: 0.9, stroke: '#39ff6a', strokeWidth: 2, glow: '#39ff6a', ink: '#7dff9a', accent: '#39ff6a', hot: '#ffe14a', shadow: 0, font: MONO, weight: 600 },
  // Amber console glass in rounded cases.
  amber: { frame: 'panel', fill: '#1a1105', fillOpacity: 0.88, stroke: '#ffb000', strokeWidth: 2.4, glow: '#ffb000', ink: '#ffc94a', accent: '#ff9a00', hot: '#ff5a2a', shadow: 0, font: MONO, weight: 700 },
  // Soft rounded candy tiles with a pink edge.
  pastel: { frame: 'scallop', tilt: true, fill: '#fff8fb', fillOpacity: 0.95, stroke: '#f7b6cf', strokeWidth: 4.5, light: true, ink: '#6a4a5e', accent: '#f48fb1', hot: '#6fbf9e', shadow: 0.2, shadowColor: '#a06a88', font: SANS, weight: 700 },
  // Dusk purple with pumpkin orange.
  spooky: { frame: 'tomb', fill: '#1a0f24', fillOpacity: 0.9, stroke: '#ff8a1f', strokeWidth: 3, glow: '#ff8a1f', ink: '#ffd9a0', accent: '#ff8a1f', hot: '#b27cff', shadow: 0.3, font: SERIF, weight: 700 },
}

export const SKIN_NAMES = Object.keys(SKINS)

const R = 56
const GAP = 14
const RIGHT = [1600 - 72 - R - (2 * R + GAP), 1600 - 72 - R]
const LEFT = [72 + R, 72 + R + 2 * R + GAP]
// One column on each edge, for both sides at once.
const EDGE = [72 + R, 1600 - 72 - R]
const CY = [0, 1, 2].map(row => 92 + R + row * (2 * R + GAP))

const CSS = `
.wg-wave{animation:wg-wave 5s ease-in-out infinite alternate}
.wg-glow{animation:wg-glow 3.2s ease-in-out infinite alternate}
@keyframes wg-wave{from{transform:translateX(-14px)}to{transform:translateX(14px)}}
@keyframes wg-glow{from{stroke-opacity:.12}to{stroke-opacity:.34}}
@media (prefers-reduced-motion:reduce){.wg-wave,.wg-glow{animation:none}}
`

/**
 * The outline of a widget's plate as an SVG path, by frame. `g` shrinks it (and a negative `g` grows it)
 * around (cx, cy), so the same shape serves for the plate, its shadow, its glow, its inner line and the clip.
 */
function pathOf(frame, cx, cy, g) {
  const r = R - g
  const x0 = cx - r
  const x1 = cx + r
  const y0 = cy - r
  const y1 = cy + r
  const round = rx => {
    const k = Math.max(0.01, rx)

    return `M${x0 + k} ${y0} H${x1 - k} A${k} ${k} 0 0 1 ${x1} ${y0 + k} V${y1 - k} A${k} ${k} 0 0 1 ${x1 - k} ${y1} H${x0 + k} A${k} ${k} 0 0 1 ${x0} ${y1 - k} V${y0 + k} A${k} ${k} 0 0 1 ${x0 + k} ${y0} Z`
  }

  switch (frame) {
    case 'note':
      return round(5)
    case 'plank':
    case 'window':
      return round(8)
    case 'panel':
      return round(18 - g)
    case 'glass':
      return round(30 - g)
    case 'plan':
      return `M${x0} ${y0} H${x1} V${y1} H${x0} Z`
    case 'scroll':
      return `M${x0 + 4} ${y0 + 4} H${x1 - 4} V${y1 - 4} H${x0 + 4} Z`
    case 'ticket':
      return `M${x0} ${y0} H${x1} V${cy - 9} A9 9 0 0 0 ${x1} ${cy + 9} V${y1} H${x0} V${cy + 9} A9 9 0 0 0 ${x0} ${cy - 9} Z`
    case 'tomb':
      return `M${x0} ${y1} V${cy - 24} A${r} ${32 - g} 0 0 1 ${x1} ${cy - 24} V${y1} Z`
    case 'notch': {
      const c = 12
      const pts = [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]

      return `M${pts.map(([x, y]) => `${x} ${y}`).join(' L')} Z`
    }
    case 'stepped': {
      const s = 7
      const pts = [[x0 + 2 * s, y0], [x1 - 2 * s, y0], [x1 - 2 * s, y0 + s], [x1 - s, y0 + s], [x1 - s, y0 + 2 * s], [x1, y0 + 2 * s], [x1, y1 - 2 * s], [x1 - s, y1 - 2 * s], [x1 - s, y1 - s], [x1 - 2 * s, y1 - s], [x1 - 2 * s, y1], [x0 + 2 * s, y1], [x0 + 2 * s, y1 - s], [x0 + s, y1 - s], [x0 + s, y1 - 2 * s], [x0, y1 - 2 * s], [x0, y0 + 2 * s], [x0 + s, y0 + 2 * s], [x0 + s, y0 + s], [x0 + 2 * s, y0 + s]]

      return `M${pts.map(([x, y]) => `${x} ${y}`).join(' L')} Z`
    }
    case 'scallop': {
      const n = 14
      const r0 = 47 - g
      const bump = 11
      const at = i => {
        const a = (2 * Math.PI * i) / n - Math.PI / 2

        return `${(cx + r0 * Math.cos(a)).toFixed(1)} ${(cy + r0 * Math.sin(a)).toFixed(1)}`
      }
      let d = `M${at(0)}`

      for (let i = 1; i <= n; i++) {
        d += ` A${bump} ${bump} 0 0 1 ${at(i % n)}`
      }

      return `${d} Z`
    }
    default:
      return `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`
  }
}

/** The outline as an element tag and attributes, for the clip path. */
function outline(skin, cx, cy, grow = 0) {
  return { tag: 'path', attrs: `d="${pathOf(skin.frame, cx, cy, -grow)}"` }
}

function shape(skin, cx, cy, grow, extra) {
  return `<path d="${pathOf(skin.frame, cx, cy, -grow)}" ${extra}/>`
}

/** What a frame adds to its plate: tape, nails, rods, moss, screws, title bars and the like. */
function decor(skin, cx, cy) {
  const x0 = cx - R
  const x1 = cx + R
  const y0 = cy - R
  const y1 = cy + R

  switch (skin.frame) {
    case 'note':
      return `<g transform="rotate(-5 ${cx} ${y0})"><rect x="${cx - 20}" y="${y0 - 7}" width="40" height="14" fill="#f1dc82" fill-opacity=".82"/><path d="M${cx - 20} ${y0 - 1} h40 M${cx - 20} ${y0 + 3} h40" stroke="#fff" stroke-opacity=".35"/></g>`
    case 'plank': {
      const nails = [[x0 + 9, y0 + 9], [x1 - 9, y0 + 9], [x0 + 9, y1 - 9], [x1 - 9, y1 - 9]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.8" fill="#c9a14a"/><circle cx="${x - 0.8}" cy="${y - 0.8}" r="1" fill="#fff" fill-opacity=".5"/>`).join('')
      const grain = [-30, 0, 30].map((dy, i) => `<path d="M${x0 + 8} ${cy + dy + i} q16 -4 32 0 t32 0 t32 0" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="1.4"/>`).join('')

      return `${grain}${nails}`
    }
    case 'tomb':
      return `<path d="M${cx + 10} ${cy - 54} l-6 12 l8 8 l-5 10" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="1.6"/><path d="M${x0} ${y1} V${y1 - 8} q6 -6 12 -2 q5 -5 10 -1 V${y1} Z" fill="#4f8a4a" fill-opacity=".75"/><path d="M${x1 - 3} ${cy - 22} L${x1 - 22} ${cy - 46} M${x1 - 3} ${cy - 22} L${x1 - 30} ${cy - 30} M${x1 - 3} ${cy - 22} L${x1 - 24} ${cy - 10} M${x1 - 14} ${cy - 36} q-6 2 -4 8 M${x1 - 22} ${cy - 27} q-3 5 1 9" fill="none" stroke="#d9d0f0" stroke-opacity=".5" stroke-width="1"/>`
    case 'scroll':
      return `<rect x="${cx - 62}" y="${cy - 60}" width="124" height="8" rx="4" fill="#6b4a2b"/><rect x="${cx - 62}" y="${cy + 52}" width="124" height="8" rx="4" fill="#6b4a2b"/><circle cx="${cx - 62}" cy="${cy - 56}" r="5" fill="#4a3220"/><circle cx="${cx + 62}" cy="${cy - 56}" r="5" fill="#4a3220"/><circle cx="${cx - 62}" cy="${cy + 56}" r="5" fill="#4a3220"/><circle cx="${cx + 62}" cy="${cy + 56}" r="5" fill="#4a3220"/><rect x="${cx + 36}" y="${cy + 34}" width="11" height="11" fill="#b3261e" fill-opacity=".85" transform="rotate(6 ${cx + 41} ${cy + 39})"/>`
    case 'ticket':
      return `<path d="${pathOf('ticket', cx, cy, 6)}" fill="none" stroke="${skin.stroke}" stroke-opacity=".4" stroke-width="1.2" stroke-dasharray="3 3"/>`
    case 'window':
      return `<path d="M${x0} ${y0 + 11} V${y0 + 8} Q${x0} ${y0} ${x0 + 8} ${y0} H${x1 - 8} Q${x1} ${y0} ${x1} ${y0 + 8} V${y0 + 11} Z" fill="${skin.stroke}" fill-opacity=".3"/><circle cx="${x0 + 10}" cy="${y0 + 5.5}" r="2.3" fill="#ff5f56"/><circle cx="${x0 + 18}" cy="${y0 + 5.5}" r="2.3" fill="#ffbd2e"/><circle cx="${x0 + 26}" cy="${y0 + 5.5}" r="2.3" fill="#27c93f"/>`
    case 'panel':
      return [[x0 + 10, y0 + 10], [x1 - 10, y0 + 10], [x0 + 10, y1 - 10], [x1 - 10, y1 - 10]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="${skin.stroke}" fill-opacity=".55"/><path d="M${x - 2} ${y + 2} L${x + 2} ${y - 2}" stroke="#000" stroke-opacity=".6" stroke-width="1"/>`).join('')
    case 'plan': {
      const b = (sx, sy) => `<path d="M${sx * (R + 4)} ${sy * (R - 6)} V${sy * (R + 4)} H${sx * (R - 6)}" transform="translate(${cx} ${cy})" fill="none" stroke="${skin.stroke}" stroke-width="1.2"/>`

      return `${b(1, 1)}${b(-1, 1)}${b(1, -1)}${b(-1, -1)}<path d="M${cx} ${y0 - 4} v6 M${cx} ${y1 - 2} v6 M${x0 - 4} ${cy} h6 M${x1 - 2} ${cy} h6" stroke="${skin.stroke}" stroke-width="1.2"/>`
    }
    case 'glass':
      return `<path d="M${x0 + 10} ${y0 + 32} Q${x0 + 14} ${y0 + 12} ${x0 + 36} ${y0 + 8} Q${x0 + 22} ${y0 + 20} ${x0 + 10} ${y0 + 32} Z" fill="#fff" fill-opacity=".28"/>`
    default:
      return ''
  }
}

function plate(skin, cx, cy, defs, body) {
  const shadow = skin.shadow > 0 ? shape(skin, cx + (skin.shadowDx ?? 3), cy + (skin.shadowDy ?? 5), 0, `fill="${skin.shadowColor ?? '#000'}" fill-opacity="${skin.shadow}"`) : ''
  const glow = skin.glow !== undefined ? shape(skin, cx, cy, 3, `class="wg-glow" fill="none" stroke="${skin.glow}" stroke-width="7" stroke-opacity=".22"`) : ''
  const base = shape(skin, cx, cy, 0, `fill="${skin.fill}" fill-opacity="${skin.fillOpacity}" stroke="${skin.stroke}" stroke-opacity="${skin.strokeOpacity ?? 1}" stroke-width="${skin.strokeWidth}" stroke-linejoin="${skin.crisp ? 'miter' : 'round'}"`)
  const inner = skin.inner !== undefined ? shape(skin, cx, cy, -6.5, `fill="none" stroke="${skin.inner}" stroke-width="1" ${skin.dashed ? 'stroke-dasharray="2 3"' : 'stroke-opacity=".7"'}`) : ''
  // Notes, planks, tickets and stickers sit a little askew, each its own way.
  const tilt = skin.tilt ? ((Math.round(cx) * 7 + Math.round(cy) * 13) % 5 - 2) * 0.8 : 0
  const turned = tilt === 0 ? '' : ` transform="rotate(${tilt} ${cx} ${cy})"`

  return `<g${skin.crisp ? ' shape-rendering="crispEdges"' : ''}${turned}>${shadow}${glow}${base}${inner}${decor(skin, cx, cy)}${defs}${body}</g>`
}

function label(skin, cx, y, text, size = 11, halo = false) {
  const outlineText = halo ? ' paint-order="stroke" stroke="#000" stroke-opacity=".7" stroke-width="3" stroke-linejoin="round"' : ''

  return `<text x="${cx}" y="${y}" text-anchor="middle" style="font-family:${skin.font};font-size:${size}px;font-weight:${skin.weight};font-variant-numeric:lining-nums tabular-nums;fill:${skin.ink}"${outlineText}>${text}</text>`
}

/** Context window: a cup that fills from the bottom, then goes orange, then red as it nears full. */
function context(skin, cx, cy, percent) {
  const known = typeof percent === 'number'
  const p = known ? Math.max(0, Math.min(100, percent)) : 0
  const top = cy + R - 4 - ((2 * R - 8) * p) / 100
  const color = p >= 90 ? '#e0483a' : p >= 70 ? '#e8862b' : skin.accent
  const id = 'wg-clip-ctx'
  const crest = skin.crisp
    ? `<rect x="${cx - R}" y="${top}" width="${2 * R}" height="${R + cy - top}" fill="${color}" fill-opacity="${skin.light === true ? 1 : 0.62}"/>`
    : `<path class="wg-wave" d="M${cx - R - 30} ${top} q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 L${cx + R + 30} ${cy + R} L${cx - R - 30} ${cy + R} Z" fill="${color}" fill-opacity="${skin.light === true ? 1 : 0.62}"/>`
  const o = outline(skin, cx, cy, -3)
  const defs = `<clipPath id="${id}"><${o.tag} ${o.attrs}/></clipPath>`
  // On a dark or glassy plate the cup is bright, so the text gets a dark halo to stay readable.
  const halo = skin.light !== true
  const body = `<g clip-path="url(#${id})">${known ? crest : ''}</g>${label(skin, cx, cy + 3, known ? `${Math.round(p)}%` : '--', 22, halo)}${label(skin, cx, cy + 20, 'context', 11, halo)}`

  return plate(skin, cx, cy, defs, body)
}

/** The 5-hour and 7-day limits: two rings, the outer one the 5-hour window and the inner one the week, with how much of each is used. */
function limits(skin, cx, cy, five, week) {
  const ring = (r, value, color) => {
    const known = typeof value === 'number'
    const p = known ? Math.max(0, Math.min(100, value)) : 0

    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${skin.ink}" stroke-opacity=".18" stroke-width="7"/>${known && p > 0 ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${p >= 90 ? '#e0483a' : p >= 75 ? '#e8862b' : color}" stroke-width="7" stroke-linecap="${skin.crisp ? 'butt' : 'round'}" pathLength="100" stroke-dasharray="${p} ${100 - p}" transform="rotate(-90 ${cx} ${cy})"/>` : ''}`
  }
  const show = v => (typeof v === 'number' ? `${Math.round(v)}%` : '--')

  return plate(skin, cx, cy, '', `${ring(44, five, skin.accent)}${ring(32, week, skin.hot)}${label(skin, cx, cy - 2, `5h ${show(five)}`, 12)}${label(skin, cx, cy + 12, `7d ${show(week)}`, 12)}`)
}

/** How long until a time given as an ISO string: "2h 10m", "5d 3h", "40m", or "--" if it is not known. */
function until(iso, now) {
  const ms = typeof iso === 'string' ? Date.parse(iso) - now : Number.NaN

  if (Number.isNaN(ms)) return '--'
  if (ms <= 0) return 'now'

  const m = Math.round(ms / 60000)
  const d = Math.floor(m / 1440)
  const h = Math.floor((m % 1440) / 60)

  return d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m % 60}m` : `${m}m`
}

/** How long until each limit resets: a reset arrow, then the 5-hour and the 7-day countdowns, each led by a dot in its ring's colour. */
function resets(skin, cx, cy, fiveReset, weekReset, now) {
  const arrow = `<g transform="translate(${cx} ${cy - 30})" fill="none" stroke="${skin.ink}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M-8 1 A8 8 0 1 1 -3 8"/><path d="M-10 -5 L-8 1 L-2 -1"/></g>`
  const start = node => node.replace('text-anchor="middle"', 'text-anchor="start"')
  const row = (y, color, name, iso) => `<circle cx="${cx - 42}" cy="${y - 4}" r="3.4" fill="${color}"/>${start(label(skin, cx - 34, y, name, 12))}${start(label(skin, cx - 8, y, until(iso, now), 13))}`

  return plate(skin, cx, cy, '', `${arrow}${row(cy + 2, skin.accent, '5h', fiveReset)}${row(cy + 22, skin.hot, '7d', weekReset)}${label(skin, cx, cy + 40, 'until reset')}`)
}

/** The session's cost so far, an estimate. */
function cost(skin, cx, cy, usd, unsure) {
  const text = typeof usd !== 'number' ? '--' : usd >= 100 ? `$${Math.round(usd)}` : `$${usd.toFixed(2)}`

  return plate(skin, cx, cy, '', `${label(skin, cx, cy + 5, text, 21)}${label(skin, cx, cy + 22, unsure ? 'session cost+' : 'session cost')}`)
}

const MOOD_NOTE = { idle: 'resting', work: 'working', done: 'all done', worry: 'context full', sleep: 'limit hit' }

/** The critter in a tile of its own, in the same frame as the other widgets. */
function critter(skin, cx, cy, mood, accessory) {
  return plate(skin, cx, cy, '', `<g transform="translate(${cx} ${cy + 2}) scale(.85)">${sprite({ mood, accessory })}</g>${label(skin, cx, cy + 43, MOOD_NOTE[mood] ?? 'resting')}`)
}

/**
 * The critter out on the scene. While Claude works it sits at its laptop; the rest of the time it strolls
 * to and fro along the ground, pausing at each end. `stage` is { x0, x1, y, lantern } in scene units.
 */
function stroller(mood, accessory, stage) {
  const k = 1.5
  const base = stage.y - 21 * k

  if (mood === 'work') {
    return `<g transform="translate(${stage.x0 + (stage.x1 - stage.x0) * 0.2} ${base}) scale(${k})">${sprite({ mood, accessory, lantern: stage.lantern })}</g>`
  }

  return `<g transform="translate(${stage.x0} ${base}) scale(${k})"><g class="cl-go" style="--dx:${((stage.x1 - stage.x0) / k).toFixed(0)}px"><g class="cl-flip" style="transform-box:fill-box;transform-origin:center">${sprite({ mood, accessory, walking: true, lantern: stage.lantern })}</g></g></g>`
}

/**
 * Adds the widgets and the critter to a scene's SVG source, just before its closing tag.
 * state: { percent, five, week, fiveReset, weekReset, usd, unsure, side, now,
 *   showWidgets (default true), mascot ('off', 'tile', 'walk' or 'both'; default 'off'),
 *   mood, accessory, stage }, times in milliseconds.
 * skin: one of SKIN_NAMES; an unknown name gives `paper`.
 * Returns the source unchanged if it is not an SVG it can place them in.
 */
export function withWidgets(source, state, skinName = 'paper') {
  const end = source.lastIndexOf('</svg>')
  const view = /viewBox="\s*([\d.-]+)[\s,]+([\d.-]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*"/.exec(source)

  if (end < 0 || view === null) {
    return source
  }

  const skin = SKINS[skinName] ?? SKINS.paper
  const scale = Number(view[3]) / 1600
  const side = state.side ?? 'right'
  const mascot = state.mascot ?? 'off'
  const mood = state.mood ?? 'idle'
  const accessory = state.accessory ?? 'none'
  const stage = state.stage ?? { x0: 140, x1: 1000, y: 872 }
  const tiles = []

  if (state.showWidgets !== false) {
    tiles.push(
      (x, y) => context(skin, x, y, state.percent),
      (x, y) => limits(skin, x, y, state.five, state.week),
      (x, y) => resets(skin, x, y, state.fiveReset, state.weekReset, state.now),
      (x, y) => cost(skin, x, y, state.usd, state.unsure),
    )
  }
  if (mascot === 'tile' || mascot === 'both') {
    tiles.push((x, y) => critter(skin, x, y, mood, accessory))
  }

  // Two columns on one side, filled across; or the first half on the left edge and the rest on the right.
  const half = Math.ceil(tiles.length / 2)
  const placed = tiles
    .map((draw, i) => {
      const [x, row] = side === 'both' ? [i < half ? EDGE[0] : EDGE[1], i < half ? i : i - half] : [(side === 'left' ? LEFT : RIGHT)[i % 2], Math.floor(i / 2)]

      return draw(x, CY[row])
    })
    .join('')
  const walker = mascot === 'walk' || mascot === 'both' ? stroller(mood, accessory, stage) : ''
  const css = CSS + (mascot === 'off' ? '' : MASCOT_CSS)
  const group = `<g id="wg" shape-rendering="geometricPrecision" transform="translate(${view[1]} ${view[2]}) scale(${scale.toFixed(5)})"><style>${css}</style>${walker}${placed}</g>`

  return source.slice(0, end) + group + source.slice(end)
}
