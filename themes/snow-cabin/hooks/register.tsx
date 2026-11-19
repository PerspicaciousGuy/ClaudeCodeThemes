import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Snow Cabin: A winter night: a log cabin with a lit window, smoke curling from the chimney, snowy pines and snow falling in three layers. Dark.
const { theme, problems } = makeColors({
  label: 'Snow Cabin',
  only: 'dark',
  roles: {
    accent: '#ffb457',
    danger: '#f07178',
    success: '#6fcf97',
    warning: '#e8c15a',
    pro: '#8fa6ff'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0a1122',
        'surface-1': '#101a30',
        'surface-2': '#17233f',
        'surface-3': '#1e2d4e',
        'text-primary': '#eaf2fc',
        'text-secondary': '#bccce6',
        'text-muted': '#8ea3c6'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'snow-cabin', glass: { blur: 12, opacity: 0.45, tint: '#0f1a33' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'snow-cabin') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Snow Cabin: A winter night" isInteractive />
  })
}
