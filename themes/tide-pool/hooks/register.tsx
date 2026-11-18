import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Tide Pool: Looking straight down into a rock pool: breathing anemones, starfish, rippling light, drops making rings and small fish. Dark.
const { theme, problems } = makeColors({
  label: 'Tide Pool',
  only: 'dark',
  roles: {
    accent: '#ff7f66',
    danger: '#f0606a',
    success: '#5fd39a',
    warning: '#e8bd5a',
    pro: '#9d8cf0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#04161b',
        'surface-1': '#082027',
        'surface-2': '#0d2b33',
        'surface-3': '#13363f',
        'text-primary': '#e2f6f3',
        'text-secondary': '#b3d6d2',
        'text-muted': '#86adaa'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'tide-pool', glass: { blur: 10, opacity: 0.45, tint: '#06232a' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'tide-pool') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Tide Pool: Looking straight down into a rock pool" isInteractive />
  })
}
