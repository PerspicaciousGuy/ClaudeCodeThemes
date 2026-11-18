import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Halftone Harbor Night: The halftone harbor printed on night-blue stock: an ember sun and pale-blue water in breathing dots. Dark.
const { theme, problems } = makeColors({
  label: 'Halftone Harbor Night',
  only: 'dark',
  roles: {
    accent: '#e0663f',
    danger: '#e0605a',
    success: '#6fae7a',
    warning: '#d9a44a',
    pro: '#8a9be0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#161a2c',
        'surface-1': '#1c2136',
        'surface-2': '#23283f',
        'surface-3': '#2a3048',
        'text-primary': '#eceaf4',
        'text-secondary': '#c4c2d8',
        'text-muted': '#9a98b8'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'halftone-harbor-night', glass: { blur: 14, opacity: 0.5, tint: '#1f2336' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'halftone-harbor-night') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Halftone Harbor Night: The halftone harbor printed on night-blue stock" isInteractive />
  })
}
