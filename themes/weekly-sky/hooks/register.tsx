import { atom, read, update } from 'claude-code'
import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildLive } from './scene.js'

// Weekly Sky: a lakeside cabin under a sky that crosses a day as your 7-day usage window is used.
const { theme, problems } = makeColors({
  label: 'Weekly Sky',
  only: 'dark',
  roles: { accent: '#f4b070', danger: '#ef6a7a', success: '#6fd0a0', warning: '#f0c24a', pro: '#b79af0' },
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
  backdrop: { scene: 'weekly-sky', glass: { blur: 14, opacity: 0.64, tint: '#131a34' } },
}

const STAGES = 12

// Change a tag when the value's shape changes: an earlier version's value is declined.
const stage = atom({ plugin: 'weekly-sky', key: 'stage' } as const, 0, { shape: 'stage-1' })

// Scenes are built the first time they are needed, then kept.
const SCENES = new Map<number, string>()

function scene(s: number): string {
  let out = SCENES.get(s)

  if (out === undefined) {
    out = buildLive(s)
    SCENES.set(s, out)
  }

  return out
}

// True while /weeksky 0..11 has set the stage by hand.
let manual = false

type Usage = { rateLimits: { kind: string; percentUsed: number }[] }

// The sky follows the 7-day window: 0% used is sunrise, 100% is night.
function pick(u: Usage): number {
  const week = u.rateLimits.find(r => r.kind === 'seven_day')

  return week === undefined ? 0 : Math.max(0, Math.min(STAGES - 1, Math.round((week.percentUsed / 100) * (STAGES - 1))))
}

function note(u: Usage): string {
  const week = u.rateLimits.find(r => r.kind === 'seven_day')

  return week === undefined ? 'sky: no 7-day reading' : `sky: ${Math.round(week.percentUsed)}% of the week used`
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    await $.command.register({ name: 'weeksky', description: 'Apply the Weekly Sky look. /weeksky 0 to 11 holds a stage to try it, /weeksky auto follows your 7-day usage' })

    const usage = await $.session.usage()
    const now = pick(usage)

    await update($, stage, () => now)
    $.ui.status(note(usage))

    return next(e)
  })

  // The usage moved: move the sun.
  on('session.measure', async ($, e, next) => {
    if (!manual) {
      await update($, stage, () => pick(e))
      $.ui.status(note(e))
    }

    return next(e)
  })

  on('command.run', { command: 'weeksky' }, async ($, e) => {
    const arg = e.args.trim()

    // Running /weeksky puts the look on, over whatever theme was set last.
    await $.theme.set(LOOK)

    if (arg === 'auto' || arg === '') {
      manual = false
      const usage = await $.session.usage()
      const now = pick(usage)

      await update($, stage, () => now)
      $.ui.status(note(usage))

      return { text: `The sky follows your week again (stage ${now} of ${STAGES - 1}). ${note(usage)}.` }
    }

    const n = Number(arg)

    if (!Number.isInteger(n) || n < 0 || n > STAGES - 1) {
      return { text: `Use /weeksky 0 to ${STAGES - 1}, or /weeksky auto.` }
    }
    manual = true
    await update($, stage, () => n)

    return { text: `Sky set to stage ${n}.` }
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'weekly-sky') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)
    const s = await read($, stage)

    return <Svg source={scene(s)} alt="A lakeside cabin under a sky that crosses a day as your 7-day usage is used" isInteractive />
  })
}
