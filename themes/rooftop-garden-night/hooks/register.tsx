import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Rooftop Garden Night: A pixel-art rooftop after dark: a moon and stars over a skyline of lit windows, glowing string lights, fireflies and a lantern. Dark.
const { theme, problems } = makeColors({
  label: 'Rooftop Garden Night',
  only: 'dark',
  roles: {
    accent: '#ffb86b',
    danger: '#f07178',
    success: '#6fcf97',
    warning: '#e6c05a',
    pro: '#b09aff'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0a1030',
        'surface-1': '#101840',
        'surface-2': '#18214e',
        'surface-3': '#202b5c',
        'text-primary': '#eceefa',
        'text-secondary': '#c2c8e6',
        'text-muted': '#929ac0'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'rooftop-garden-night', glass: { blur: 10, opacity: 0.5, tint: '#0e1640' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'rooftop-garden-night') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Rooftop Garden Night: A pixel-art rooftop after dark" isInteractive />
  })
}
