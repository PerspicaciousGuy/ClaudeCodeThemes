import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Snow Station: A pixel-art train station in a night snowfall: snow drifting past warm lamps, a slow night train on the far track, a glowing clock on the gable and a bench under the canopy. Dark.
const { theme, problems } = makeColors({
  label: 'Snow Station',
  only: 'dark',
  roles: {
    accent: '#ffc15e',
    danger: '#f0737a',
    success: '#6fd1a0',
    warning: '#f2cd62',
    pro: '#a9a5f5'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0a1220',
        'surface-1': '#101b2e',
        'surface-2': '#172640',
        'surface-3': '#1f3252',
        'text-primary': '#e8f0fb',
        'text-secondary': '#bfd0e6',
        'text-muted': '#92a8c6'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'snow-station', glass: { blur: 10, opacity: 0.5, tint: '#101b2e' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'snow-station') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Snow Station: A pixel-art train station in a night snowfall: snow drifting past warm lamps, a slow night train on the far track, a glowing clock on the gable and a bench under the canopy" isInteractive />
  })
}
