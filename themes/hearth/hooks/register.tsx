import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Hearth: espresso brown by night, warm cream by day, terracotta accent,
// over a slow dusk with embers drifting up.
const { theme, problems } = makeColors({
  label: 'Hearth',
  roles: {
    accent: '#cf6a32',
    danger: '#b83a3a',
    success: '#6b8f3a',
    warning: '#c28a14',
    pro: '#a2567a',
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#f1e6d6',
        'surface-1': '#f6eee1',
        'surface-2': '#fbf6ec',
        'text-primary': '#2b2018',
        'text-secondary': '#54443a',
        'text-muted': '#6b5a4d',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#1c1512',
        'surface-1': '#251c18',
        'surface-2': '#2e231e',
        'surface-3': '#382b25',
        'text-primary': '#f3e8dc',
        'text-secondary': '#d3c3b2',
        'text-muted': '#ab9a88',
      },
    },
  },
})

const SCENE = buildScene()

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'dusk', glass: { blur: 32, opacity: 0.88 } },
}

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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'dusk') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="A warm dusk with embers drifting up" isInteractive />
  })
}
