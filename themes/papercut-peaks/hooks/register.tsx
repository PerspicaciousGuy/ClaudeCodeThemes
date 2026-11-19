import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Papercut Peaks: Five sheets of colored paper layered into mountains, each casting a soft shadow, with paper clouds and birds. Light.
const { theme, problems } = makeColors({
  label: 'Papercut Peaks',
  only: 'light',
  roles: {
    accent: '#c4566a',
    danger: '#b83a3a',
    success: '#4f8a62',
    warning: '#b07a1a',
    pro: '#7a5a9a'
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#f3e8d4',
        'surface-1': '#f8efdd',
        'surface-2': '#fdf7ea',
        'text-primary': '#2d2230',
        'text-secondary': '#5a4660',
        'text-muted': '#6e5a74'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'papercut-peaks', glass: { blur: 10, opacity: 0.5, tint: '#f8efdc' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'papercut-peaks') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Papercut Peaks: Five sheets of colored paper layered into mountains, each casting a soft shadow, with paper clouds and birds. Light." isInteractive />
  })
}
