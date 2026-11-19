import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Torch Dungeon: A pixel-art dungeon wall: two flickering torches, a dark doorway with watching eyes, bats, a hopping slime and a treasure chest. Dark.
const { theme, problems } = makeColors({
  label: 'Torch Dungeon',
  only: 'dark',
  roles: {
    accent: '#ff9a3c',
    danger: '#ff5a5a',
    success: '#6fd07a',
    warning: '#ffd23d',
    pro: '#a08cff'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0c0c14',
        'surface-1': '#13131e',
        'surface-2': '#1b1b28',
        'surface-3': '#232334',
        'text-primary': '#ece9f5',
        'text-secondary': '#c4c0d6',
        'text-muted': '#938fa8'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'torch-dungeon', glass: { blur: 8, opacity: 0.5, tint: '#10101a' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'torch-dungeon') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Torch Dungeon: A pixel-art dungeon wall" isInteractive />
  })
}
