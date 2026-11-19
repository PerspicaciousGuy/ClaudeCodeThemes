import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Circuit Board: A green circuit board: traces between pads and chips, bright pulses of light running along them and small LEDs blinking on their own beats. Dark. A calm version: slower and softer.
const { theme, problems } = makeColors({
  label: 'Circuit Board Calm',
  only: 'dark',
  roles: {
    accent: '#5dffb0',
    danger: '#ff7a7a',
    success: '#5dffb0',
    warning: '#ffd24a',
    pro: '#b9a0f4'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#04130e',
        'surface-1': '#08201a',
        'surface-2': '#0d2c24',
        'surface-3': '#143a30',
        'text-primary': '#e0f5ec',
        'text-secondary': '#b4d8c8',
        'text-muted': '#88b0a0'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'circuit-board-calm', glass: { blur: 16, opacity: 0.62, tint: '#08201a' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'circuit-board-calm') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Circuit Board: A green circuit board: traces between pads and chips, bright pulses of light running along them and small LEDs blinking on their own beats" isInteractive />
  })
}
