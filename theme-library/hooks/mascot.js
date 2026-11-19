// A small orange pixel critter, drawn as SVG with CSS animation, that rests, works, hops and sleeps.
// It is an original sketch in the spirit of the Claude Code mascot, not official art.

const BODY = '#d97757'
const BODY_DARK = '#b85c3f'
const EYE = '#2a1a14'

export const MASCOT_CSS = `
.cl-bob{animation:cl-bob 2.4s ease-in-out infinite alternate}
.cl-blink{transform-box:fill-box;transform-origin:center;animation:cl-blink 5s steps(1) infinite}
.cl-tl{animation:cl-type .32s steps(1) infinite alternate}
.cl-tr{animation:cl-type .32s steps(1) infinite alternate;animation-delay:.16s}
.cl-hop{animation:cl-hop .7s ease-out infinite}
.cl-shake{animation:cl-shake .22s linear infinite alternate}
.cl-drip{animation:cl-drip 1.6s ease-in infinite}
.cl-z{animation:cl-z 3.2s ease-in-out infinite}
.cl-spark{transform-box:fill-box;transform-origin:center;animation:cl-spark 1s ease-out infinite}
.cl-la{animation:cl-leg .42s steps(1) infinite alternate}
.cl-lb{animation:cl-leg .42s steps(1) infinite alternate;animation-delay:.21s}
.cl-glow{animation:cl-glow 2.6s ease-in-out infinite alternate}
.cl-go{animation:cl-go 34s linear infinite}
.cl-flip{animation:cl-flip 34s steps(1) infinite}
@keyframes cl-bob{from{transform:translateY(0)}to{transform:translateY(-1.6px)}}
@keyframes cl-blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
@keyframes cl-type{from{transform:translateY(0)}to{transform:translateY(-3px)}}
@keyframes cl-hop{0%,100%{transform:translateY(0)}40%{transform:translateY(-14px)}}
@keyframes cl-shake{from{transform:translateX(-1.4px)}to{transform:translateX(1.4px)}}
@keyframes cl-drip{0%{transform:translateY(0);fill-opacity:1}100%{transform:translateY(16px);fill-opacity:0}}
@keyframes cl-z{0%{transform:translate(0,0);fill-opacity:0}30%{fill-opacity:1}100%{transform:translate(8px,-16px);fill-opacity:0}}
@keyframes cl-spark{0%{transform:scale(.2);fill-opacity:1}100%{transform:scale(1.3);fill-opacity:0}}
@keyframes cl-leg{from{transform:translateY(0)}to{transform:translateY(-3px)}}
@keyframes cl-glow{from{fill-opacity:.5}to{fill-opacity:1}}
@keyframes cl-go{0%{transform:translateX(0)}40%{transform:translateX(var(--dx))}50%{transform:translateX(var(--dx))}90%{transform:translateX(0)}100%{transform:translateX(0)}}
@keyframes cl-flip{0%{transform:scaleX(1)}50%{transform:scaleX(-1)}100%{transform:scaleX(-1)}}
@media (prefers-reduced-motion:reduce){.cl-bob,.cl-blink,.cl-tl,.cl-tr,.cl-hop,.cl-shake,.cl-drip,.cl-z,.cl-spark,.cl-la,.cl-lb,.cl-glow,.cl-go,.cl-flip{animation:none}}
`

const HATS = {
  pirate: '<path d="M-31 -14 Q-22 -36 0 -32 Q22 -36 31 -14 Q0 -22 -31 -14 Z" fill="#17131e"/><path d="M-31 -14 L-37 -19 M31 -14 L37 -19" stroke="#17131e" stroke-width="3" stroke-linecap="round"/><circle cx="0" cy="-23" r="3" fill="#f3f0fa"/><path d="M-4 -18 h8" stroke="#f3f0fa" stroke-width="1.6"/>',
  witch: '<path d="M-26 -15 L-3 -54 Q0 -56 3 -52 L24 -15 Z" fill="#3a2260"/><rect x="-32" y="-19" width="60" height="6" rx="3" fill="#2a1848"/><rect x="-13" y="-25" width="20" height="5" fill="#ff8a1f"/>',
  shades: '<rect x="-16" y="-10" width="14" height="9" rx="2" fill="#0b0b12"/><rect x="2" y="-10" width="14" height="9" rx="2" fill="#0b0b12"/><rect x="-3" y="-8" width="6" height="2" fill="#0b0b12"/><path d="M-14 -8 l4 0 M4 -8 l4 0" stroke="#7fe8ff" stroke-width="1.6"/>',
  straw: '<path d="M-36 -14 L0 -42 L36 -14 Z" fill="#d9bf7a"/><path d="M-36 -14 Q0 -8 36 -14" fill="none" stroke="#a88a4a" stroke-width="2"/>',
  beanie: '<path d="M-23 -16 Q-23 -35 0 -35 Q23 -35 23 -16 Z" fill="#c8402f"/><rect x="-25" y="-21" width="50" height="7" rx="3" fill="#f3e3c3"/><circle cx="0" cy="-38" r="5" fill="#f3e3c3"/>',
  hardhat: '<path d="M-24 -16 Q-24 -35 0 -35 Q24 -35 24 -16 Z" fill="#f2c230"/><rect x="-29" y="-20" width="58" height="6" rx="3" fill="#d9a81c"/><rect x="-3" y="-34" width="6" height="14" fill="#d9a81c"/>',
  tophat: '<rect x="-14" y="-46" width="28" height="31" fill="#17131e"/><rect x="-27" y="-18" width="54" height="6" rx="3" fill="#17131e"/><rect x="-14" y="-26" width="28" height="5" fill="#d9b45a"/>',
}

export const ACCESSORIES = Object.keys(HATS)

function eyes(mood) {
  if (mood === 'sleep') {
    return `<path d="M-14 -3 h9 M5 -3 h9" stroke="${EYE}" stroke-width="3" stroke-linecap="round"/>`
  }

  if (mood === 'worry') {
    return `<g class="cl-blink"><rect x="-13" y="-11" width="8" height="13" rx="1.5" fill="${EYE}"/><rect x="5" y="-11" width="8" height="13" rx="1.5" fill="${EYE}"/></g><rect x="-11" y="-9" width="3" height="3" fill="#fff"/><rect x="7" y="-9" width="3" height="3" fill="#fff"/>`
  }

  return `<g class="cl-blink"><rect x="-12" y="-9" width="6" height="10" rx="1.2" fill="${EYE}"/><rect x="6" y="-9" width="6" height="10" rx="1.2" fill="${EYE}"/></g>`
}

/**
 * The critter, feet on y = 21, centred on x = 0, about 64 wide and 37 tall (hats and props add height).
 * mood: idle, work, done, worry or sleep. accessory: one of ACCESSORIES, or none.
 */
export function sprite({ mood = 'idle', accessory = 'none', walking = false, lantern = false } = {}) {
  const working = mood === 'work'
  const armL = `<g class="${working ? 'cl-tl' : ''}"><rect x="-34" y="${working ? 2 : -2}" width="10" height="9" rx="2" fill="${BODY}"/></g>`
  const armR = `<g class="${working ? 'cl-tr' : ''}"><rect x="24" y="${working ? 2 : -2}" width="10" height="9" rx="2" fill="${BODY}"/></g>`
  const leg = (x, cls) => `<g class="${walking ? cls : ''}"><rect x="${x}" y="14" width="7" height="7" rx="1.2" fill="${BODY_DARK}"/></g>`
  const legs = `${leg(-20, 'cl-la')}${leg(-9, 'cl-lb')}${leg(2, 'cl-la')}${leg(13, 'cl-lb')}`
  const laptop = working ? `<rect x="-24" y="7" width="48" height="17" rx="2" fill="#3b3f4a"/><rect x="-21" y="10" width="42" height="11" rx="1" fill="#4a4f5c"/><circle cx="0" cy="15.5" r="2.4" fill="${BODY}"/>` : ''
  const extras =
    mood === 'worry'
      ? `<path d="M30 -14 q-4 7 0 9 q4 -2 0 -9 Z" class="cl-drip" fill="#7fc8ff"/>`
      : mood === 'sleep'
        ? `<text x="22" y="-18" class="cl-z" style="font:700 12px ui-monospace,monospace" fill="#bcd0ff">z</text><text x="31" y="-28" class="cl-z" style="font:700 9px ui-monospace,monospace;animation-delay:1.1s" fill="#bcd0ff">z</text>`
        : mood === 'done'
          ? `<path class="cl-spark" d="M-38 -22 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 Z" fill="#ffe14a"/><path class="cl-spark" style="animation-delay:.3s" d="M38 -26 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#ffe14a"/>`
          : ''
  const lamp = lantern ? `<g transform="translate(40 4)"><circle cx="0" cy="8" r="20" fill="#9dff8a" class="cl-glow" fill-opacity=".35"/><path d="M0 -4 V2" stroke="#2a1a14" stroke-width="2"/><rect x="-5" y="2" width="10" height="13" rx="2" fill="#9dff8a"/><rect x="-6" y="0" width="12" height="3" fill="#2a1a14"/></g>` : ''
  const body = `<rect x="-24" y="-16" width="48" height="30" rx="3" fill="${BODY}"/><rect x="-24" y="8" width="48" height="6" fill="${BODY_DARK}"/>${eyes(mood)}${accessory === 'none' ? '' : (HATS[accessory] ?? '')}`
  const inner = `<g class="${mood === 'sleep' ? '' : 'cl-bob'}">${legs}${body}${armL}${armR}${laptop}${lamp}</g>${extras}`
  const motion = mood === 'done' ? 'cl-hop' : mood === 'worry' ? 'cl-shake' : ''

  return `<g class="${motion}">${inner}</g>`
}
