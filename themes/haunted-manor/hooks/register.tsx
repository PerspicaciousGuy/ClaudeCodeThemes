import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Haunted Manor: A pixel-art haunted manor under a huge moon: flickering windows, bats crossing the sky, a bare tree, drifting ground fog and an iron fence. Dark.
const { theme, problems } = makeColors({
  label: 'Haunted Manor',
  only: 'dark',
  roles: {
    accent: '#f29a3a',
    danger: '#ef6a78',
    success: '#6fd4a0',
    warning: '#ecc450',
    pro: '#b48cf0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0c0814',
        'surface-1': '#140e20',
        'surface-2': '#1c142c',
        'surface-3': '#261c3a',
        'text-primary': '#ece6f6',
        'text-secondary': '#c8bde0',
        'text-muted': '#9c90bc'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'haunted-manor', glass: { blur: 10, opacity: 0.5, tint: '#140e20' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'haunted-manor') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Haunted Manor: A pixel-art haunted manor under a huge moon: flickering windows, bats crossing the sky, a bare tree, drifting ground fog and an iron fence" isInteractive />
  })
}
