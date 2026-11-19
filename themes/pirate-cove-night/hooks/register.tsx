import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Pirate Cove Night: A pirate galleon under a full moon: a skull flag waving, lantern light at the stern, a far ship on the horizon and a treasure chest glowing on a palm islet. Dark.
const { theme, problems } = makeColors({
  label: 'Pirate Cove Night',
  only: 'dark',
  roles: {
    "accent": "#f2c14e",
    "danger": "#ef6a6a",
    "success": "#5fd1a4",
    "warning": "#e8c55a",
    "pro": "#b79af0"
  },
  dark: {
    gray: {
      anchors: {
        "surface-0": "#060a1c",
        "surface-1": "#0d1431",
        "surface-2": "#141d41",
        "surface-3": "#1d2851",
        "text-primary": "#eceefa",
        "text-secondary": "#c4cae6",
        "text-muted": "#99a2c9"
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'pirate-cove-night', glass: { blur: 12, opacity: 0.5, tint: '#0d1431' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'pirate-cove-night') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Pirate Cove Night: A pirate galleon under a full moon with a skull flag waving, a far ship on the horizon and a treasure chest glowing on a palm islet" isInteractive />
  })
}
