import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Art Deco: A 1920s deco poster: a gold sunburst over deep navy, stepped towers with gold-lined windows, concentric fan arcs and a shimmer of light crossing the gold. Dark.
const { theme, problems } = makeColors({
  label: 'Art Deco',
  only: 'dark',
  roles: {
    accent: '#e8c060',
    danger: '#f0707a',
    success: '#6fd9a0',
    warning: '#e8c060',
    pro: '#b79af0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#070c1c',
        'surface-1': '#0d1530',
        'surface-2': '#141f44',
        'surface-3': '#1c2a58',
        'text-primary': '#f6f0e0',
        'text-secondary': '#d4cbb0',
        'text-muted': '#a89e84'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'art-deco', glass: { blur: 12, opacity: 0.5, tint: '#0d1530' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'art-deco') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Art Deco: A 1920s deco poster: a gold sunburst over deep navy, stepped towers with gold-lined windows, concentric fan arcs and a shimmer of light crossing the gold" isInteractive />
  })
}
