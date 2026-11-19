import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Arcade Hall: A pixel-art arcade at night: rows of cabinets playing their own little games, neon tubes and a patterned carpet. Dark.
const { theme, problems } = makeColors({
  label: 'Arcade Hall',
  only: 'dark',
  roles: {
    accent: '#33e6ff',
    danger: '#ff5470',
    success: '#3be8b0',
    warning: '#ffd23d',
    pro: '#a06bff'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0a0716',
        'surface-1': '#100b20',
        'surface-2': '#171029',
        'surface-3': '#1e1636',
        'text-primary': '#f0eaff',
        'text-secondary': '#cdc3ee',
        'text-muted': '#9d92c8'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'arcade-hall', glass: { blur: 10, opacity: 0.5, tint: '#0e0a20' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'arcade-hall') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Arcade Hall: A pixel-art arcade at night" isInteractive />
  })
}
