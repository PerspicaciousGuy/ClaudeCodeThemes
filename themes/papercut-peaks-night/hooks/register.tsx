import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Papercut Peaks Night: The paper-cut mountains in deep indigo under a paper moon and cut-out stars. Dark.
const { theme, problems } = makeColors({
  label: 'Papercut Peaks Night',
  only: 'dark',
  roles: {
    accent: '#9a8cf0',
    danger: '#e0627a',
    success: '#6fc0a0',
    warning: '#e0b86a',
    pro: '#b48cf0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#10112a',
        'surface-1': '#161838',
        'surface-2': '#1d1f45',
        'surface-3': '#24274f',
        'text-primary': '#ecebfa',
        'text-secondary': '#c4c3e6',
        'text-muted': '#9a99c4'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'papercut-peaks-night', glass: { blur: 10, opacity: 0.5, tint: '#1a1a42' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'papercut-peaks-night') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Papercut Peaks Night: The paper-cut mountains in deep indigo under a paper moon and cut-out stars. Dark." isInteractive />
  })
}
