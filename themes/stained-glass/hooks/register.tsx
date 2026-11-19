import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Stained Glass: A cathedral window at night: four arched lancets of jewel-colored panes in dark lead, a slowly turning rose window and light drifting across the glass. Dark.
const { theme, problems } = makeColors({
  label: 'Stained Glass',
  only: 'dark',
  roles: {
    accent: '#e8b04a',
    danger: '#f0707a',
    success: '#6fd9a0',
    warning: '#f0c24a',
    pro: '#c49af0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0c0812',
        'surface-1': '#140e1c',
        'surface-2': '#1c1428',
        'surface-3': '#261c36',
        'text-primary': '#f2ecf6',
        'text-secondary': '#d0c6dc',
        'text-muted': '#a498b6'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'stained-glass', glass: { blur: 14, opacity: 0.62, tint: '#140e1c' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'stained-glass') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Stained Glass: A cathedral window at night: four arched lancets of jewel-colored panes in dark lead, a slowly turning rose window and light drifting across the glass" isInteractive />
  })
}
