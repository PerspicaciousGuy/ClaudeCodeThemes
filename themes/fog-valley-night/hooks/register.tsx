import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Fog Valley Night: A misty mountain night: a moon over deep-blue ridges, pale fog drifting between them, fireflies in the pines and a sky lantern rising. Dark.
const { theme, problems } = makeColors({
  label: 'Fog Valley Night',
  only: 'dark',
  roles: {
    accent: '#7fd0c8',
    danger: '#f07178',
    success: '#6fcf97',
    warning: '#e6c05a',
    pro: '#9aa5ff'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#080d1e',
        'surface-1': '#0e1530',
        'surface-2': '#151e3e',
        'surface-3': '#1c274c',
        'text-primary': '#e6eaf8',
        'text-secondary': '#b9c2de',
        'text-muted': '#8b97ba'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'fog-valley-night', glass: { blur: 12, opacity: 0.5, tint: '#0e1630' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'fog-valley-night') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Fog Valley Night: A misty mountain night" isInteractive />
  })
}
