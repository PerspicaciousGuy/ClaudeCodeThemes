import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Fog Valley: A misty mountain morning: blue ridges with fog drifting between them, low sun rays, a flock of birds and a far balloon. Light.
const { theme, problems } = makeColors({
  label: 'Fog Valley',
  only: 'light',
  roles: {
    accent: '#3a7d6e',
    danger: '#b83a3a',
    success: '#4f7a4a',
    warning: '#a87414',
    pro: '#6a63b0'
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#dfe8ec',
        'surface-1': '#e8eff2',
        'surface-2': '#f1f6f8',
        'text-primary': '#1c2a33',
        'text-secondary': '#41545f',
        'text-muted': '#556a77'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'fog-valley', glass: { blur: 10, opacity: 0.5, tint: '#e8eff2' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'fog-valley') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Fog Valley: A misty mountain morning" isInteractive />
  })
}
