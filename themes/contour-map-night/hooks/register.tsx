import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Contour Map Night: The topographic survey in pale ink on blue-black paper, with the contours drawing themselves. Dark.
const { theme, problems } = makeColors({
  label: 'Contour Map Night',
  only: 'dark',
  roles: {
    accent: '#7fd0bc',
    danger: '#e0605a',
    success: '#6fc08f',
    warning: '#e0b050',
    pro: '#9a8be0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0b1017',
        'surface-1': '#111821',
        'surface-2': '#17202b',
        'surface-3': '#1d2835',
        'text-primary': '#e6f0ee',
        'text-secondary': '#b8cdc8',
        'text-muted': '#8aa39e'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'contour-map-night', glass: { blur: 4, opacity: 0.45, tint: '#0f151e' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'contour-map-night') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Contour Map Night: The topographic survey in pale ink on blue-black paper, with the contours drawing themselves. Dark." isInteractive />
  })
}
