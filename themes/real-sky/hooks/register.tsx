import { atom, read, update } from 'claude-code'
import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildLive } from './scene.js'

// Real Sky: a lakeside view under the sky outside right now: the sun by your clock, the moon in its real phase.
const { theme, problems } = makeColors({
  label: 'Real Sky',
  only: 'dark',
  roles: { accent: '#f4c070', danger: '#ef6a7a', success: '#6fd0a0', warning: '#f0c24a', pro: '#b79af0' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0c1226',
        'surface-1': '#131a34',
        'surface-2': '#1b2342',
        'surface-3': '#252e54',
        'text-primary': '#f0f2fa',
        'text-secondary': '#ccd2e8',
        'text-muted': '#9ea6c6',
      },
    },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  // The sky is bright at midday, so the glass over it is heavier than most.
  backdrop: { scene: 'real-sky', glass: { blur: 14, opacity: 0.64, tint: '#131a34' } },
}

const PHASES = ['new moon', 'waxing crescent', 'first quarter', 'waxing gibbous', 'full moon', 'waning gibbous', 'last quarter', 'waning crescent']

// Change a tag when the value's shape changes: an earlier version's value is declined.
const slot = atom({ plugin: 'real-sky', key: 'slot' } as const, 24, { shape: 'slot-1' })
const phase = atom({ plugin: 'real-sky', key: 'phase' } as const, 4, { shape: 'phase-1' })

// Scenes are built the first time they are needed, then kept: 48 slots by 8 phases.
const SCENES = new Map<string, string>()

function scene(s: number, p: number): string {
  const key = `${s}-${p}`
  let out = SCENES.get(key)

  if (out === undefined) {
    out = buildLive(s, p)
    SCENES.set(key, out)
  }

  return out
}

// True while /realsky <hour> has set the time by hand.
let manual = false

// The moon's phase from the date: the days since a known new moon over the length of a lunation.
function moonPhase(ms: number): number {
  const lunation = 29.530588853 * 86400000
  const age = (((ms - 947182440000) % lunation) + lunation) % lunation

  return Math.round((age / lunation) * 8) % 8
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sync($: any): Promise<string> {
  const ms: number = await $.clock.now()
  const d = new Date(ms)
  const s = d.getHours() * 2 + (d.getMinutes() >= 30 ? 1 : 0)
  const p = moonPhase(ms)

  await update($, slot, () => s)
  await update($, phase, () => p)

  return `sky: ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}, ${PHASES[p]}`
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // Clear any status line an earlier version of this mod pinned: it stays on screen until it is replaced.
    $.ui.status(undefined)

    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    await $.command.register({ name: 'realsky', description: 'Apply the Real Sky look. /realsky 0 to 23 shows an hour to try it, /realsky auto follows your clock' })

    await sync($)

    // The sky moves on its own as the day goes by: look again every minute.
    $.clock.every(60000, () => {
      if (!manual) {
        void sync($)
      }
    })

    return next(e)
  })

  on('command.run', { command: 'realsky' }, async ($, e) => {
    const arg = e.args.trim()

    // Running /realsky puts the look on, over whatever theme was set last.
    await $.theme.set(LOOK)

    if (arg === 'auto' || arg === '') {
      manual = false

      return { text: `The sky follows your clock again. ${await sync($)}.` }
    }

    const h = Number(arg)

    if (!Number.isFinite(h) || h < 0 || h >= 24) {
      return { text: 'Use /realsky 0 to 23, or /realsky auto.' }
    }
    manual = true
    await update($, slot, () => Math.round(h * 2))

    return { text: `Showing ${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? '30' : '00'}.` }
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'real-sky') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)
    const s = await read($, slot)
    const p = await read($, phase)

    return <Svg source={scene(s, p)} alt="A lakeside view under the sky outside right now: the sun by your clock, the moon in its real phase" isInteractive />
  })
}
