import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Snow Cabin Day: A winter noon: a pale blue sky and low sun, white hills, a log cabin with smoke from its chimney and snow falling in three layers. Light.
const { theme, problems } = makeColors({
  label: 'Snow Cabin Day',
  only: 'light',
  roles: {
    accent: '#b8592a',
    danger: '#b83a3a',
    success: '#3f7f52',
    warning: '#a87414',
    pro: '#6a63b0'
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e3edf6',
        'surface-1': '#ebf2f9',
        'surface-2': '#f4f8fc',
        'text-primary': '#14222e',
        'text-secondary': '#3c5064',
        'text-muted': '#4f6478'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'snow-cabin-day', glass: { blur: 8, opacity: 0.5, tint: '#eaf2f9' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'snow-cabin-day') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Snow Cabin Day: A winter noon" isInteractive />
  })
}
