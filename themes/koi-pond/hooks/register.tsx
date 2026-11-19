import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Koi Pond: A koi pond seen from above at dusk: orange and white koi gliding in slow loops, lily pads with pink flowers, ripples spreading and petals drifting on dark water. Dark.
const { theme, problems } = makeColors({
  label: 'Koi Pond',
  only: 'dark',
  roles: {
    accent: '#ff8a4a',
    danger: '#ef6a6a',
    success: '#5fd1a4',
    warning: '#e8c55a',
    pro: '#b79af0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#06141a',
        'surface-1': '#0c1e25',
        'surface-2': '#13292f',
        'surface-3': '#1b343b',
        'text-primary': '#e6f2f2',
        'text-secondary': '#bcd5d6',
        'text-muted': '#8fadb0'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'koi-pond', glass: { blur: 12, opacity: 0.5, tint: '#0c1e25' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'koi-pond') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Koi Pond: A koi pond seen from above at dusk: orange and white koi gliding in slow loops, lily pads with pink flowers, ripples spreading and petals drifting on dark water" isInteractive />
  })
}
