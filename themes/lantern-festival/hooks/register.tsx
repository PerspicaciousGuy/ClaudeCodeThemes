import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Lantern Festival: A lantern festival on a lake at night: paper lanterns rising into a starry sky, their warm light shimmering on the water, a pagoda and hills in silhouette. Dark.
const { theme, problems } = makeColors({
  label: 'Lantern Festival',
  only: 'dark',
  roles: {
    accent: '#ff9a3a',
    danger: '#ef6a7a',
    success: '#6fd1a0',
    warning: '#f0c24a',
    pro: '#c08be0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#080b1c',
        'surface-1': '#0f1330',
        'surface-2': '#171c42',
        'surface-3': '#202654',
        'text-primary': '#eef0fa',
        'text-secondary': '#c8cee8',
        'text-muted': '#98a2cc'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'lantern-festival', glass: { blur: 12, opacity: 0.5, tint: '#0f1330' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'lantern-festival') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Lantern Festival: A lantern festival on a lake at night: paper lanterns rising into a starry sky, their warm light shimmering on the water, a pagoda and hills in silhouette" isInteractive />
  })
}
