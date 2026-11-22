import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Forge Glow: A blacksmith forge at night: a stone wall, a furnace breathing orange light, an anvil with a glowing bar, hanging tools, sparks bursting off the anvil and embers rising. Dark.
const { theme, problems } = makeColors({
  label: 'Forge Glow',
  only: 'dark',
  roles: { accent: '#ff9a4d', danger: '#ff8a7a', success: '#8fcf8a', warning: '#f0c45a', pro: '#b9a4f0' },
  dark: { gray: { anchors: { 'surface-0': '#120c0a', 'surface-1': '#1a1210', 'surface-2': '#251a16', 'surface-3': '#30231e', 'text-primary': '#f6ebdf', 'text-secondary': '#d4c4b4', 'text-muted': '#a8998b' } } }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'forge-glow', glass: { blur: 8, opacity: 0.6, tint: '#140d0b' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'forge-glow') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Forge Glow" isInteractive />
  })
}
