import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Harvest Moon: A huge orange moon over a wheat field: wheat swaying in waves, hay bales and a barn in silhouette, crows crossing the moon and stars coming out. Dark.
const { theme, problems } = makeColors({
  label: 'Harvest Moon',
  only: 'dark',
  roles: {
    accent: '#f0a040',
    danger: '#ee6a5a',
    success: '#8fcf6a',
    warning: '#e8c24a',
    pro: '#c49ae0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#120c1e',
        'surface-1': '#1d1230',
        'surface-2': '#291a42',
        'surface-3': '#352355',
        'text-primary': '#f4ecf0',
        'text-secondary': '#d8c8d4',
        'text-muted': '#ae9ab0'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'harvest-moon', glass: { blur: 12, opacity: 0.5, tint: '#1d1230' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'harvest-moon') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Harvest Moon: A huge orange moon over a wheat field: wheat swaying in waves, hay bales and a barn in silhouette, crows crossing the moon and stars coming out" isInteractive />
  })
}
