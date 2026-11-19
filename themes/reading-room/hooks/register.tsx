import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Reading Room: A cozy library at night: tall shelves of books, a floor lamp with dust turning in its light, a candle, a cup of tea and a sleeping cat. Dark.
const { theme, problems } = makeColors({
  label: 'Reading Room',
  only: 'dark',
  roles: {
    accent: '#d98e4a',
    danger: '#e0605a',
    success: '#7fb069',
    warning: '#e6c05a',
    pro: '#b48cc8'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#140d09',
        'surface-1': '#1c130d',
        'surface-2': '#261a12',
        'surface-3': '#30221a',
        'text-primary': '#f5ead9',
        'text-secondary': '#d6c3a8',
        'text-muted': '#a8957a'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'reading-room', glass: { blur: 14, opacity: 0.5, tint: '#1c120c' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'reading-room') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Reading Room: A cozy library at night" isInteractive />
  })
}
