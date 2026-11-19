import { atom, read, update } from 'claude-code'
import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildLive } from './scene.js'

// Weather Mood: a lighthouse whose weather follows Claude: clear and calm when it is idle, rain while it works.
const { theme, problems } = makeColors({
  label: 'Weather Mood',
  only: 'dark',
  roles: { accent: '#f4c870', danger: '#ef6a7a', success: '#6fd0a0', warning: '#f0c24a', pro: '#b79af0' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0a0e1c',
        'surface-1': '#111728',
        'surface-2': '#192034',
        'surface-3': '#222a42',
        'text-primary': '#eef2fa',
        'text-secondary': '#c8d0e4',
        'text-muted': '#9aa4c0',
      },
    },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'weather-mood', glass: { blur: 12, opacity: 0.5, tint: '#111728' } },
}

// Change a tag when the value's shape changes: an earlier version's value is declined.
const working = atom({ plugin: 'weather-mood', key: 'working' } as const, false, { shape: 'working-1' })
const intensity = atom({ plugin: 'weather-mood', key: 'intensity' } as const, 1, { shape: 'intensity-1' })
const flash = atom({ plugin: 'weather-mood', key: 'flash' } as const, false, { shape: 'flash-1' })

// Scenes are built the first time they are needed, then kept.
const SCENES = new Map<string, string>()

function scene(w: boolean, i: number, f: boolean): string {
  const key = `${w ? 1 : 0}-${i}-${f ? 1 : 0}`
  let s = SCENES.get(key)

  if (s === undefined) {
    s = buildLive(w, i, f)
    SCENES.set(key, s)
  }

  return s
}

// The rain is harder the fuller the context window is.
function rainFor(percent: number | undefined): number {
  if (percent === undefined || percent < 40) return 0
  if (percent < 75) return 1

  return 2
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

    await $.command.register({ name: 'weather', description: 'Apply the Weather Mood look. /weather calm, rain, storm or flash tries a state' })

    const usage = await $.session.usage()
    const now = rainFor(usage.context.percent)

    await update($, intensity, () => now)

    return next(e)
  })

  // The context window moved: the rain gets harder or lighter.
  on('session.measure', async ($, e, next) => {
    const now = rainFor(e.context.percent)

    await update($, intensity, () => now)

    return next(e)
  })

  // Claude starts working: clouds roll in. It finishes: the sky clears.
  on('turn.start', async ($, e, next) => {
    await update($, working, () => true)

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    await update($, working, () => false)

    return next(e)
  })

  // A failed tool call: a flash of lightning, for a few seconds.
  on('tool.call', async ($, e, next) => {
    const ran = await next(e)

    if (ran.isError) {
      await update($, flash, () => true)
      $.clock.after(5000, () => {
        void update($, flash, () => false)
      })
    }

    return ran
  })

  on('command.run', { command: 'weather' }, async ($, e) => {
    const arg = e.args.trim()

    // Running /weather puts the look on, over whatever theme was set last.
    await $.theme.set(LOOK)

    if (arg === 'calm') {
      await update($, working, () => false)

      return { text: 'Clear and calm. It changes with Claude\'s next turn.' }
    }

    if (arg === 'rain' || arg === 'storm') {
      await update($, working, () => true)
      await update($, intensity, () => (arg === 'storm' ? 2 : 1))

      return { text: `${arg === 'storm' ? 'A storm' : 'Rain'} rolls in. It changes with Claude's next turn.` }
    }

    if (arg === 'flash') {
      await update($, flash, () => true)
      $.clock.after(5000, () => {
        void update($, flash, () => false)
      })

      return { text: 'Lightning.' }
    }

    return { text: 'The Weather Mood look is on. Try /weather calm, rain, storm or flash.' }
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'weather-mood') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)
    const w = await read($, working)
    const i = await read($, intensity)
    const f = await read($, flash)

    return <Svg source={scene(w, i, f)} alt="A lighthouse: clear and calm when Claude is idle, rain and clouds while it works, lightning on a failed tool call" isInteractive />
  })
}
