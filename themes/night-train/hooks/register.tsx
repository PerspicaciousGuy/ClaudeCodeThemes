import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Night Train: A night run seen from a carriage window: hills, town lights and telegraph poles sliding past under a thin moon. Dark.
const { theme, problems } = makeColors({
  label: 'Night Train',
  only: 'dark',
  roles: {
    accent: '#ffb86b',
    danger: '#f07178',
    success: '#6fcf97',
    warning: '#e6c05a',
    pro: '#9aa5ff'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#080a18',
        'surface-1': '#0e1124',
        'surface-2': '#151a30',
        'surface-3': '#1c223c',
        'text-primary': '#ebeefa',
        'text-secondary': '#c0c6e2',
        'text-muted': '#8f98c0'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'night-train', glass: { blur: 12, opacity: 0.5, tint: '#0c1024' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'night-train') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Night Train: A night run seen from a carriage window" isInteractive />
  })
}
