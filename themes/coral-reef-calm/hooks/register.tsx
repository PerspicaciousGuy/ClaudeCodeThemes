import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Coral Reef: A sunlit coral reef: caustic light rippling over branching corals and sea fans, schools of bright fish, a clownfish in an anemone, a turtle gliding by and rising bubbles. Dark. A calm version: slower and softer.
const { theme, problems } = makeColors({
  label: 'Coral Reef Calm',
  only: 'dark',
  roles: {
    accent: '#ff9466',
    danger: '#f0606a',
    success: '#62d99a',
    warning: '#f2c14e',
    pro: '#b79af0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#04141c',
        'surface-1': '#0a1f2a',
        'surface-2': '#112a37',
        'surface-3': '#193546',
        'text-primary': '#e8f4f6',
        'text-secondary': '#bcd8dc',
        'text-muted': '#8fb0b8'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'coral-reef-calm', glass: { blur: 16, opacity: 0.62, tint: '#0a1f2a' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'coral-reef-calm') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Coral Reef: A sunlit coral reef: caustic light rippling over branching corals and sea fans, schools of bright fish, a clownfish in an anemone, a turtle gliding by and rising bubbles" isInteractive />
  })
}
