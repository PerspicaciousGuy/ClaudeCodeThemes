import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Isometric Room: A small isometric room at night: a desk with a glowing monitor and lamp, a plant, a bookshelf, a window onto a moonlit sky and a cat asleep on the rug. Dark.
const { theme, problems } = makeColors({
  label: 'Isometric Room',
  only: 'dark',
  roles: {
    accent: '#ffb860',
    danger: '#f0707a',
    success: '#6fd9a0',
    warning: '#f0c24a',
    pro: '#b79af0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0a0e26',
        'surface-1': '#111636',
        'surface-2': '#181e48',
        'surface-3': '#212a5c',
        'text-primary': '#eef0fa',
        'text-secondary': '#c8cee8',
        'text-muted': '#98a2cc'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'isometric-room', glass: { blur: 12, opacity: 0.5, tint: '#111636' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'isometric-room') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Isometric Room: A small isometric room at night: a desk with a glowing monitor and lamp, a plant, a bookshelf, a window onto a moonlit sky and a cat asleep on the rug" isInteractive />
  })
}
