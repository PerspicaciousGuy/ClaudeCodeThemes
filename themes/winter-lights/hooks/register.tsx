import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Winter Lights: A snowy night dressed for the holidays: strings of colored lights twinkling in three phases, lit fir trees and a cottage, falling snow and a bright moon. Dark.
const { theme, problems } = makeColors({
  label: 'Winter Lights',
  only: 'dark',
  roles: {
    accent: '#ffd24a',
    danger: '#ff7a7a',
    success: '#7aff9a',
    warning: '#ffd24a',
    pro: '#c4a0f8'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0a1230',
        'surface-1': '#111b42',
        'surface-2': '#18245a',
        'surface-3': '#202f6e',
        'text-primary': '#eef2ff',
        'text-secondary': '#c8d2f0',
        'text-muted': '#98a6d4'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'winter-lights', glass: { blur: 12, opacity: 0.5, tint: '#111b42' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'winter-lights') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Winter Lights: A snowy night dressed for the holidays: strings of colored lights twinkling in three phases, lit fir trees and a cottage, falling snow and a bright moon" isInteractive />
  })
}
