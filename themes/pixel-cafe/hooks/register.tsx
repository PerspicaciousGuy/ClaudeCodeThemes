import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Pixel Cafe: A pixel-art cafe on a rainy night: rain running down a big window over blurred city lights, warm pendant lamps, a steaming cup on the counter and a cat asleep on the sill. Dark.
const { theme, problems } = makeColors({
  label: 'Pixel Cafe',
  only: 'dark',
  roles: {
    accent: '#e8924a',
    danger: '#e8675c',
    success: '#8bc279',
    warning: '#ebc35a',
    pro: '#c49ad4'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#170e0a',
        'surface-1': '#20140e',
        'surface-2': '#2b1c14',
        'surface-3': '#36251a',
        'text-primary': '#f6e8d6',
        'text-secondary': '#d9c3a8',
        'text-muted': '#ab937a'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'pixel-cafe', glass: { blur: 10, opacity: 0.5, tint: '#20140e' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'pixel-cafe') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Pixel Cafe: A pixel-art cafe on a rainy night: rain running down a big window over blurred city lights, warm pendant lamps, a steaming cup on the counter and a cat asleep on the sill" isInteractive />
  })
}
