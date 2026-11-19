import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Constellations: A star map: rings and meridians of a celestial chart on deep blue, with constellations that draw themselves star to star, hold, then fade, and shooting stars. Dark.
const { theme, problems } = makeColors({
  label: 'Constellations',
  only: 'dark',
  roles: {
    accent: '#ffe28a',
    danger: '#ff8a9a',
    success: '#6fe0b0',
    warning: '#ffd24a',
    pro: '#b9a0f4'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#060b1e',
        'surface-1': '#0c1432',
        'surface-2': '#131d46',
        'surface-3': '#1b2858',
        'text-primary': '#eaf0ff',
        'text-secondary': '#c0cced',
        'text-muted': '#94a2d0'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'constellations', glass: { blur: 12, opacity: 0.5, tint: '#0c1432' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'constellations') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Constellations: A star map: rings and meridians of a celestial chart on deep blue, with constellations that draw themselves star to star, hold, then fade, and shooting stars" isInteractive />
  })
}
