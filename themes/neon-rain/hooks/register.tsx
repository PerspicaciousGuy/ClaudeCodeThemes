import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Neon Rain: A pixel-art city at night in the rain: towers with lit windows, buzzing neon signs, a wet street and a passing car. Dark.
const { theme, problems } = makeColors({
  label: 'Neon Rain',
  only: 'dark',
  roles: {
    accent: '#e0409a',
    danger: '#ff5470',
    success: '#3fd9a0',
    warning: '#f5b942',
    pro: '#8a7bff'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0a0714',
        'surface-1': '#110c1f',
        'surface-2': '#181230',
        'surface-3': '#1d1636',
        'text-primary': '#efeaff',
        'text-secondary': '#c8bfe6',
        'text-muted': '#9b90c0'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'neon-rain', glass: { blur: 12, opacity: 0.5, tint: '#140c28' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'neon-rain') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Neon Rain: A pixel-art city at night in the rain" isInteractive />
  })
}
