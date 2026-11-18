import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Low Orbit: A pixel-art view of space: a ringed gas giant, a small moon, a nebula, parallax stars, a passing ship and shooting stars. Dark.
const { theme, problems } = makeColors({
  label: 'Low Orbit',
  only: 'dark',
  roles: {
    accent: '#7aa2ff',
    danger: '#ff6b7a',
    success: '#5fd3a0',
    warning: '#ffb454',
    pro: '#b48cff'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#07060f',
        'surface-1': '#0d0b1a',
        'surface-2': '#141126',
        'surface-3': '#1a1730',
        'text-primary': '#e9e8f7',
        'text-secondary': '#bfbde0',
        'text-muted': '#9390b8'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'low-orbit', glass: { blur: 10, opacity: 0.5, tint: '#0d0b1a' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'low-orbit') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Low Orbit: A pixel-art view of space" isInteractive />
  })
}
