import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Woodcut Cabin Night: A winter print on night stock: cut-line sky, a moon, black pines edged in cream, a log cabin with one orange window, smoke and falling snow. Dark.
const { theme, problems } = makeColors({
  label: 'Woodcut Cabin Night',
  only: 'dark',
  roles: { accent: '#ee8a55', danger: '#ff8a7a', success: '#8fcf8a', warning: '#f0c45a', pro: '#b9a4f0' },
  dark: { gray: { anchors: { 'surface-0': '#12151c', 'surface-1': '#191d27', 'surface-2': '#222836', 'surface-3': '#2b3242', 'text-primary': '#f1e9d4', 'text-secondary': '#cfc6af', 'text-muted': '#a49b86' } } }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'woodcut-cabin-night', glass: { blur: 6, opacity: 0.6, tint: '#141820' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'woodcut-cabin-night') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Woodcut Cabin Night" isInteractive />
  })
}
