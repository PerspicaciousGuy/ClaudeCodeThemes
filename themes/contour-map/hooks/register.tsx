import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Contour Map: A topographic survey on warm paper: elevation lines draw themselves one height at a time around a flat basin. Light.
const { theme, problems } = makeColors({
  label: 'Contour Map',
  only: 'light',
  roles: {
    accent: '#b5532e',
    danger: '#b03a3a',
    success: '#4f7a4a',
    warning: '#a87414',
    pro: '#6a5aa8'
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#ece4cf',
        'surface-1': '#f2ebd8',
        'surface-2': '#f8f2e4',
        'text-primary': '#2a2418',
        'text-secondary': '#54482f',
        'text-muted': '#6a5c3e'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'contour-map', glass: { blur: 4, opacity: 0.45, tint: '#f2ebd8' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'contour-map') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Contour Map: A topographic survey on warm paper" isInteractive />
  })
}
