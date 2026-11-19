import { atom, read, update } from 'claude-code'
import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildLive } from './scene.js'

// Campfire: a night camp whose fire follows the share of your 5-hour window that is left, and whose woodpile follows your context window.
const { theme, problems } = makeColors({
  label: 'Campfire',
  only: 'dark',
  roles: { accent: '#ff9a3a', danger: '#ef6a6a', success: '#6fd09a', warning: '#f0c24a', pro: '#b79af0' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0a0d14',
        'surface-1': '#11151f',
        'surface-2': '#181d2a',
        'surface-3': '#212736',
        'text-primary': '#f2ece4',
        'text-secondary': '#d0c6b8',
        'text-muted': '#a09484',
      },
    },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'campfire', glass: { blur: 10, opacity: 0.45, tint: '#11151f' } },
}

// Change a tag when the value's shape changes: an earlier version's value is declined.
const level = atom({ plugin: 'campfire', key: 'level' } as const, 5, { shape: 'level-1' })
const busy = atom({ plugin: 'campfire', key: 'busy' } as const, false, { shape: 'busy-1' })

const wood = atom({ plugin: 'campfire', key: 'wood' } as const, 6, { shape: 'wood-1' })

// Scenes are built the first time they are needed, then kept: fire level, busy, woodpile.
const SCENES = new Map<string, string>()

function scene(l: number, b: boolean, w: number): string {
  const key = `${l}-${b ? 1 : 0}-${w}`
  let s = SCENES.get(key)

  if (s === undefined) {
    s = buildLive(l, b, w)
    SCENES.set(key, s)
  }

  return s
}

// The woodpile follows the context window: a log for each sixth that is left.
function logs(u: { context: { percent?: number } }): number {
  return u.context.percent === undefined ? 6 : Math.max(0, Math.min(6, Math.round(((100 - u.context.percent) / 100) * 6)))
}

// True while /fire 0..5 has set the level by hand.
let manual = false

// The fire follows the 5-hour window; with no such reading, the context window.
function stage(u: { rateLimits: { kind: string; percentUsed: number }[]; context: { percent?: number } }): number {
  const five = u.rateLimits.find(r => r.kind === 'five_hour')
  const left = five !== undefined ? 100 - five.percentUsed : u.context.percent !== undefined ? 100 - u.context.percent : 100

  if (left <= 5) return 0
  if (left <= 20) return 1
  if (left <= 40) return 2
  if (left <= 60) return 3
  if (left <= 80) return 4

  return 5
}

// What the fire is reading, for the status line: the 5-hour window, else the context window.
function note(u: { rateLimits: { kind: string; percentUsed: number }[]; context: { percent?: number } }): string {
  const five = u.rateLimits.find(r => r.kind === 'five_hour')

  if (five !== undefined) {
    return `fire: ${Math.round(100 - five.percentUsed)}% of 5h left`
  }

  return u.context.percent !== undefined ? `fire: no 5h reading, context ${Math.round(100 - u.context.percent)}% left` : 'fire: no reading yet'
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

    await $.command.register({ name: 'fire', description: 'Try the campfire: /fire 0 to 5 sets a level, /fire auto follows your usage' })

    const usage = await $.session.usage()
    const now = stage(usage)

    const pile = logs(usage)

    await update($, level, () => now)
    await update($, wood, () => pile)

    return next(e)
  })

  // The usage moved: set the fire and the woodpile.
  on('session.measure', async ($, e, next) => {
    const pile = logs(e)

    await update($, wood, () => pile)

    if (!manual) {
      await update($, level, () => stage(e))
    }

    return next(e)
  })

  on('turn.start', async ($, e, next) => {
    await update($, busy, () => true)

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    await update($, busy, () => false)

    return next(e)
  })

  // A way to try each level by hand while building.
  on('command.run', { command: 'fire' }, async ($, e) => {
    const arg = e.args.trim()

    // Running /fire puts the Campfire look on, over whatever theme was set last.
    await $.theme.set(LOOK)

    if (arg === 'auto' || arg === '') {
      manual = false
      const usage = await $.session.usage()
      const now = stage(usage)

      await update($, level, () => now)

      return { text: `Campfire follows your usage again (level ${now}). ${note(usage)}.` }
    }

    if (arg.startsWith('wood')) {
      const w = Number(arg.slice(4).trim())

      if (!Number.isInteger(w) || w < 0 || w > 6) {
        return { text: 'Use /fire wood 0 to 6.' }
      }
      await update($, wood, () => w)

      return { text: `Woodpile set to ${w} logs. It follows your context window again on the next usage change.` }
    }

    const n = Number(arg)

    if (!Number.isInteger(n) || n < 0 || n > 5) {
      return { text: 'Use /fire 0 to 5, /fire wood 0 to 6, or /fire auto.' }
    }
    manual = true
    await update($, level, () => n)

    return { text: `Campfire set to level ${n}.` }
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'campfire') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)
    const l = await read($, level)
    const b = await read($, busy)
    const w = await read($, wood)

    return <Svg source={scene(l, b, w)} alt="A night camp: the fire burns lower as your 5-hour usage is used, and the woodpile shrinks as the context window fills" isInteractive />
  })
}
