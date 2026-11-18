import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Rainy Window: A night city seen through a rain-streaked window: soft bokeh lights, drops sliding down the glass, a warm lamp and a steaming mug. Dark.
const { theme, problems } = makeColors({
  label: 'Rainy Window',
  only: 'dark',
  roles: {
    accent: '#f0a34a',
    danger: '#e0566a',
    success: '#6cc08f',
    warning: '#e3b04a',
    pro: '#a58cf0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0a0f1e',
        'surface-1': '#101730',
        'surface-2': '#161e3a',
        'surface-3': '#1c2544',
        'text-primary': '#e9ecf8',
        'text-secondary': '#bec5e0',
        'text-muted': '#929ab9'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'rainy-window', glass: { blur: 18, opacity: 0.5, tint: '#121a36' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'rainy-window') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Rainy Window: A night city seen through a rain-streaked window" isInteractive />
  })
}
