import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Rooftop Garden: A pixel-art rooftop at golden hour: a pastel skyline, planters of sunflowers and tomatoes, string lights, birds on a wire and a kite. Light.
const { theme, problems } = makeColors({
  label: 'Rooftop Garden',
  only: 'light',
  roles: {
    accent: '#3f8a52',
    danger: '#b83a3a',
    success: '#4f7a4a',
    warning: '#a87414',
    pro: '#8a5aa8'
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#f6e6da',
        'surface-1': '#faeee4',
        'surface-2': '#fdf6ef',
        'text-primary': '#2e2028',
        'text-secondary': '#5a4450',
        'text-muted': '#6e5662'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'rooftop-garden', glass: { blur: 8, opacity: 0.5, tint: '#f9ede2' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'rooftop-garden') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Rooftop Garden: A pixel-art rooftop at golden hour" isInteractive />
  })
}
