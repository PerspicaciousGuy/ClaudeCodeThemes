import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Night Market: A pixel-art night market: strings of paper lanterns swinging over a lane, two glowing food stalls with rising steam, puddles that carry the light and a cat on a crate. Dark.
const { theme, problems } = makeColors({
  label: 'Night Market',
  only: 'dark',
  roles: {
    accent: '#ff9a3c',
    danger: '#ef6a5e',
    success: '#7ccf8a',
    warning: '#f0c24a',
    pro: '#c08be0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#120a10',
        'surface-1': '#1a0f17',
        'surface-2': '#24151f',
        'surface-3': '#2e1c28',
        'text-primary': '#f6e9dc',
        'text-secondary': '#d8c4b4',
        'text-muted': '#ab9486'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'night-market', glass: { blur: 10, opacity: 0.5, tint: '#1a0f17' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'night-market') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Night Market: A pixel-art night market: strings of paper lanterns swinging over a lane, two glowing food stalls with rising steam, puddles that carry the light and a cat on a crate" isInteractive />
  })
}
