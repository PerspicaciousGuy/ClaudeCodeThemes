import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Moonlit Shore: A pixel-art beach at night: a moon and its glitter on the sea, stars, a campfire with sparks, a lantern boat and a crab. Dark.
const { theme, problems } = makeColors({
  label: 'Moonlit Shore',
  only: 'dark',
  roles: {
    accent: '#f2a85a',
    danger: '#f07178',
    success: '#5fcf9a',
    warning: '#e6c05a',
    pro: '#9aa5ff'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#070b1e',
        'surface-1': '#0c1230',
        'surface-2': '#131b40',
        'surface-3': '#1a2450',
        'text-primary': '#e8ecf8',
        'text-secondary': '#bcc6e4',
        'text-muted': '#8e9ac0'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'moonlit-shore', glass: { blur: 10, opacity: 0.5, tint: '#0b1230' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'moonlit-shore') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Moonlit Shore: A pixel-art beach at night" isInteractive />
  })
}
