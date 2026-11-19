import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Summer Fireflies: A meadow at dusk: fireflies blinking and drifting over swaying grass, a thin moon, first stars and the last orange glow on the horizon. Dark.
const { theme, problems } = makeColors({
  label: 'Summer Fireflies',
  only: 'dark',
  roles: {
    accent: '#e8d84a',
    danger: '#ee6a7a',
    success: '#6fd9a0',
    warning: '#f0b84a',
    pro: '#b79af0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#070b1e',
        'surface-1': '#0e1530',
        'surface-2': '#161f42',
        'surface-3': '#1f2a56',
        'text-primary': '#eef0fa',
        'text-secondary': '#c8cee8',
        'text-muted': '#98a2cc'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'summer-fireflies', glass: { blur: 12, opacity: 0.5, tint: '#0e1530' } },
}

const SCENE = buildScene()

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

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'summer-fireflies') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Summer Fireflies: A meadow at dusk: fireflies blinking and drifting over swaying grass, a thin moon, first stars and the last orange glow on the horizon" isInteractive />
  })
}
