import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Desert Night: A desert after dark: stars and a cold moon over blue-violet mesas, saguaros in silhouette, a campfire with sparks and an owl. Dark.
const { theme, problems } = makeColors({
  label: 'Desert Night',
  only: 'dark',
  roles: {
    accent: '#ff9a4a',
    danger: '#f0606a',
    success: '#5fd39a',
    warning: '#e8bd5a',
    pro: '#a58cf0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0a0b1e',
        'surface-1': '#10112a',
        'surface-2': '#181a38',
        'surface-3': '#202346',
        'text-primary': '#ecebfa',
        'text-secondary': '#c4c3e6',
        'text-muted': '#9a99c4'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'desert-night', glass: { blur: 10, opacity: 0.5, tint: '#10122c' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'desert-night') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Desert Night: A desert after dark" isInteractive />
  })
}
