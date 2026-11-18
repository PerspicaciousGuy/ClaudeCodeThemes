import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Sunny Shore: A pixel-art beach on a bright day: a pulsing sun, drifting clouds, a sparkling sea, rolling foam, palms, gulls and a crab. Light.
const { theme, problems } = makeColors({
  label: 'Sunny Shore',
  only: 'light',
  roles: {
    accent: '#d9553a',
    danger: '#b83a3a',
    success: '#3f7f52',
    warning: '#a87414',
    pro: '#7a5aa8'
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e8f1ee',
        'surface-1': '#f0f7f4',
        'surface-2': '#f8fcfa',
        'text-primary': '#14323a',
        'text-secondary': '#3a5660',
        'text-muted': '#4f6a74'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'sunny-shore', glass: { blur: 8, opacity: 0.5, tint: '#f2f8f5' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'sunny-shore') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Sunny Shore: A pixel-art beach on a bright day" isInteractive />
  })
}
