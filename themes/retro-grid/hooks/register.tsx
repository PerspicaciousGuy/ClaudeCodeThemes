import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Retro Grid: A neon horizon: a slatted sun, wireframe mountains and a perspective grid that rolls toward you. Dark.
const { theme, problems } = makeColors({
  label: 'Retro Grid',
  only: 'dark',
  roles: {
    accent: '#ff4fa8',
    danger: '#ff5470',
    success: '#3be8b0',
    warning: '#ffcc4a',
    pro: '#a06bff'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#07041a',
        'surface-1': '#0d0722',
        'surface-2': '#140b2e',
        'surface-3': '#1a1038',
        'text-primary': '#f0e8ff',
        'text-secondary': '#cdbff0',
        'text-muted': '#9f8fc8'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'retro-grid', glass: { blur: 10, opacity: 0.5, tint: '#0d0722' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'retro-grid') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Retro Grid: A neon horizon" isInteractive />
  })
}
