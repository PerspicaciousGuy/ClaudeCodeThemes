import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Abyss Lantern: The deep sea: sun shafts fading into the dark, glowing jellyfish, swaying kelp, bubbles and a passing school of fish. Dark.
const { theme, problems } = makeColors({
  label: 'Abyss Lantern',
  only: 'dark',
  roles: {
    accent: '#35d6d0',
    danger: '#f06c7a',
    success: '#5fd9a8',
    warning: '#e3b34e',
    pro: '#a78bfa'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#04121a',
        'surface-1': '#091a24',
        'surface-2': '#0e232f',
        'surface-3': '#142d3a',
        'text-primary': '#e4f3f5',
        'text-secondary': '#b5d0d4',
        'text-muted': '#86a9ae'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'abyss-lantern', glass: { blur: 14, opacity: 0.5, tint: '#08202b' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'abyss-lantern') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Abyss Lantern: The deep sea" isInteractive />
  })
}
