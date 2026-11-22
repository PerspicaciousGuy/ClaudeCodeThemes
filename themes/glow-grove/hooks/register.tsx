import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Glow Grove: A forest at night: giant mushrooms glowing teal, violet and pink at the edges, small ones lighting the floor, spores and fireflies drifting up through slow fog. Dark.
const { theme, problems } = makeColors({
  label: 'Glow Grove',
  only: 'dark',
  roles: { accent: '#5fe3c4', danger: '#ff8a7a', success: '#8fcf8a', warning: '#f0c45a', pro: '#b9a4f0' },
  dark: { gray: { anchors: { 'surface-0': '#0d1316', 'surface-1': '#131b20', 'surface-2': '#1b252c', 'surface-3': '#243039', 'text-primary': '#e6f1ee', 'text-secondary': '#bfd0cc', 'text-muted': '#93a8a4' } } }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'glow-grove', glass: { blur: 8, opacity: 0.58, tint: '#0d1519' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'glow-grove') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Glow Grove" isInteractive />
  })
}
