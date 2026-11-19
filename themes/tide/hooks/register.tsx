import { atom, read, update } from 'claude-code'
import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildLive } from './scene.js'

// Tide: a beach at dusk whose tide follows the share of your 5-hour window that is left.
const { theme, problems } = makeColors({
  label: 'Tide',
  only: 'dark',
  roles: { accent: '#f0a070', danger: '#ef6a7a', success: '#6fd0a0', warning: '#f0c24a', pro: '#b79af0' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0e1030',
        'surface-1': '#151a40',
        'surface-2': '#1d2250',
        'surface-3': '#262c62',
        'text-primary': '#f2eef8',
        'text-secondary': '#d0c8e0',
        'text-muted': '#a398bc',
      },
    },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'tide', glass: { blur: 12, opacity: 0.5, tint: '#151a40' } },
}

// Change a tag when the value's shape changes: an earlier version's value is declined.
const level = atom({ plugin: 'tide', key: 'level' } as const, 5, { shape: 'level-1' })

// Scenes are built the first time they are needed, then kept.
const SCENES = new Map<number, string>()

function scene(l: number): string {
  let s = SCENES.get(l)

  if (s === undefined) {
    s = buildLive(l)
    SCENES.set(l, s)
  }

  return s
}

// True while /tide 0..5 has set the level by hand.
let manual = false

type Usage = { rateLimits: { kind: string; percentUsed: number }[]; context: { percent?: number } }

// The tide follows the 5-hour window; with no such reading, the context window.
function stage(u: Usage): number {
  const five = u.rateLimits.find(r => r.kind === 'five_hour')
  const left = five !== undefined ? 100 - five.percentUsed : u.context.percent !== undefined ? 100 - u.context.percent : 100

  if (left <= 5) return 0
  if (left <= 20) return 1
  if (left <= 40) return 2
  if (left <= 60) return 3
  if (left <= 80) return 4

  return 5
}

function note(u: Usage): string {
  const five = u.rateLimits.find(r => r.kind === 'five_hour')

  if (five !== undefined) {
    return `tide: ${Math.round(100 - five.percentUsed)}% of 5h left`
  }

  return u.context.percent !== undefined ? `tide: no 5h reading, context ${Math.round(100 - u.context.percent)}% left` : 'tide: no reading yet'
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // Clear any status line an earlier version of this mod pinned: it stays on screen until it is replaced.
    $.ui.status(undefined)

    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    await $.theme.set(LOOK)

    await $.command.register({ name: 'tide', description: 'Apply the Tide look. /tide 0 to 5 holds a level to try it, /tide auto follows your usage' })

    const usage = await $.session.usage()
    const now = stage(usage)

    await update($, level, () => now)

    return next(e)
  })

  // The usage moved: set the tide.
  on('session.measure', async ($, e, next) => {
    if (!manual) {
      await update($, level, () => stage(e))
    }

    return next(e)
  })

  on('command.run', { command: 'tide' }, async ($, e) => {
    const arg = e.args.trim()

    // Running /tide puts the Tide look on, over whatever theme was set last.
    await $.theme.set(LOOK)

    if (arg === 'auto' || arg === '') {
      manual = false
      const usage = await $.session.usage()
      const now = stage(usage)

      await update($, level, () => now)

      return { text: `The tide follows your usage again (level ${now}). ${note(usage)}.` }
    }

    const n = Number(arg)

    if (!Number.isInteger(n) || n < 0 || n > 5) {
      return { text: 'Use /tide 0 to 5, or /tide auto.' }
    }
    manual = true
    await update($, level, () => n)

    return { text: `Tide set to level ${n}.` }
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'tide') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)
    const l = await read($, level)

    return <Svg source={scene(l)} alt="A beach at dusk: the sea draws back from the sand as your 5-hour usage is used" isInteractive />
  })
}
