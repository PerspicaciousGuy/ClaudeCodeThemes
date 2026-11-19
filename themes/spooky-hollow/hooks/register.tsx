import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Spooky Hollow: A haunted graveyard under a full moon: a dead tree with a swinging green lantern and a blinking owl, tilted tombstones, drifting ghosts and wisps, bats crossing the sky, a crooked house with a flickering window and a glowing pumpkin. Dark.
const { theme, problems } = makeColors({
  label: 'Spooky Hollow',
  only: 'dark',
  roles: {
    "accent": "#7fe6a0",
    "danger": "#ef6a7a",
    "success": "#7fe6a0",
    "warning": "#f0c24a",
    "pro": "#b79af0"
  },
  dark: {
    gray: {
      anchors: {
        "surface-0": "#0a0614",
        "surface-1": "#120b22",
        "surface-2": "#1b1230",
        "surface-3": "#251a40",
        "text-primary": "#efe8ff",
        "text-secondary": "#cfc4ea",
        "text-muted": "#a094c0"
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'spooky-hollow', glass: { blur: 10, opacity: 0.5, tint: '#120b22' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'spooky-hollow') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Spooky Hollow: A haunted graveyard under a full moon with a dead tree and swinging lantern, tombstones, floating ghosts and wisps, bats in flight, a crooked house and a glowing pumpkin" isInteractive />
  })
}
