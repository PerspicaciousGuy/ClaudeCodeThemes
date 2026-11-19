import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// New Year Fireworks: New Year's night over a city: rockets climbing and bursting in rings of colored sparks that fall as they fade, lit windows and stars through the smoke. Dark. A calm version: slower and softer.
const { theme, problems } = makeColors({
  label: 'New Year Fireworks Calm',
  only: 'dark',
  roles: {
    accent: '#ffd45a',
    danger: '#ff7a8a',
    success: '#7aff9a',
    warning: '#ffd45a',
    pro: '#c4a0f8'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#080818',
        'surface-1': '#10102c',
        'surface-2': '#191a42',
        'surface-3': '#232458',
        'text-primary': '#f0f0ff',
        'text-secondary': '#ccccec',
        'text-muted': '#9c9cc8'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'new-year-fireworks-calm', glass: { blur: 16, opacity: 0.62, tint: '#10102c' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'new-year-fireworks-calm') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="New Year Fireworks: New Year's night over a city: rockets climbing and bursting in rings of colored sparks that fall as they fade, lit windows and stars through the smoke" isInteractive />
  })
}
