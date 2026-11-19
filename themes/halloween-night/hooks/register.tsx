import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Halloween Night: A haunted hill on Halloween: a huge orange moon, a crooked manor with flickering windows, bats, drifting ghosts, glowing jack-o'-lanterns and fog among the gravestones. Dark. A vector companion to haunted-manor.
const { theme, problems } = makeColors({
  label: 'Halloween Night',
  only: 'dark',
  roles: {
    accent: '#ff8a2a',
    danger: '#ff6a7a',
    success: '#7ae0a0',
    warning: '#ffc84a',
    pro: '#c49af0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0e0818',
        'surface-1': '#190f28',
        'surface-2': '#251638',
        'surface-3': '#311e4a',
        'text-primary': '#f4eaf8',
        'text-secondary': '#d6c6e0',
        'text-muted': '#aa9aba'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'halloween-night', glass: { blur: 12, opacity: 0.5, tint: '#190f28' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'halloween-night') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Halloween Night: A haunted hill on Halloween: a huge orange moon, a crooked manor with flickering windows, bats, drifting ghosts, glowing jack-o'-lanterns and fog among the gravestones" isInteractive />
  })
}
