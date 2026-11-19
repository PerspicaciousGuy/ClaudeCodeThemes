import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Meadow Hours: A rolling meadow that follows your clock: dawn, day, dusk and night, with a moving sun and moon, butterflies by day and fireflies after dark. Dark.
const { theme, problems } = makeColors({
  label: 'Meadow Hours',
  only: 'dark',
  roles: {
    accent: '#9ad86a',
    danger: '#f07178',
    success: '#6fcf97',
    warning: '#e6c05a',
    pro: '#a58cf0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0b1220',
        'surface-1': '#111a2c',
        'surface-2': '#182338',
        'surface-3': '#202d46',
        'text-primary': '#e8f0f8',
        'text-secondary': '#bccadc',
        'text-muted': '#8e9fb8'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'meadow-hours', glass: { blur: 14, opacity: 0.5, tint: '#142034' } },
}

const REFRESH_MS = 10 * 60 * 1000

// The local hour, to the nearest ten minutes, so the scene is only rebuilt
// when it would visibly change.
async function localHour($: { clock: { now: () => Promise<number> } }): Promise<number> {
  const d = new Date(await $.clock.now())

  return d.getHours() + Math.floor(d.getMinutes() / 10) / 6
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // Redraw the backdrop every ten minutes so it follows the clock.
    $.clock.every(REFRESH_MS, () => $.ui.invalidate('ui.render'))

    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    // A status line an earlier version pinned stays on screen until it is replaced, so clear it.
    $.ui.status(undefined)

    await $.theme.set(LOOK)

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'meadow-hours') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={buildScene(await localHour($))} alt="Meadow Hours: A rolling meadow that follows your clock" isInteractive />
  })
}
