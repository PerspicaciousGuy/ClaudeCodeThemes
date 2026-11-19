import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Desert Noon: A bright desert at midday: red mesas, a pale sun, saguaros, heat shimmer, drifting dust and a tumbleweed. Light.
const { theme, problems } = makeColors({
  label: 'Desert Noon',
  only: 'light',
  roles: {
    accent: '#1f8a8a',
    danger: '#b83a3a',
    success: '#4f7a4a',
    warning: '#a87414',
    pro: '#7a5aa8'
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#f0e2c6',
        'surface-1': '#f6ebd3',
        'surface-2': '#fbf3e0',
        'text-primary': '#2a1d12',
        'text-secondary': '#5a4630',
        'text-muted': '#6e5a40'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'desert-noon', glass: { blur: 8, opacity: 0.5, tint: '#f6ead0' } },
}

const SCENE = buildScene()

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    // A status line an earlier version pinned stays on screen until it is replaced, so clear it.
    $.ui.status(undefined)

    await $.theme.set(LOOK)

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'desert-noon') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Desert Noon: A bright desert at midday" isInteractive />
  })
}
