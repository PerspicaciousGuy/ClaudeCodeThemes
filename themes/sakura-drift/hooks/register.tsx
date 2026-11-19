import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Sakura Drift: A spring dusk of pastel sky, misty hills and a blossoming tree, with petals drifting down. Light and dark.
const { theme, problems } = makeColors({
  label: 'Sakura Drift',
  roles: {
    accent: '#c2476e',
    danger: '#c23a4f',
    success: '#4f8f5a',
    warning: '#b8801a',
    pro: '#8a58b8'
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#f7ebea',
        'surface-1': '#fbf2f0',
        'surface-2': '#fff9f6',
        'text-primary': '#2b1f2a',
        'text-secondary': '#5a4655',
        'text-muted': '#6e5a69'
      }
    }
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#1b1220',
        'surface-1': '#231829',
        'surface-2': '#2c1f34',
        'surface-3': '#35263f',
        'text-primary': '#f6e8ef',
        'text-secondary': '#d6c2cd',
        'text-muted': '#ae98a8'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'sakura-drift', glass: { blur: 16, opacity: 0.55 } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'sakura-drift') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Sakura Drift: A spring dusk of pastel sky, misty hills and a blossoming tree, with petals drifting down. Light and dark." isInteractive />
  })
}
