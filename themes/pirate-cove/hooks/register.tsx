import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Pirate Cove: A pirate galleon in a sunny cove: a skull flag waving, gulls overhead, a far sail on the horizon and a treasure chest on a palm beach. Light.
const { theme, problems } = makeColors({
  label: 'Pirate Cove',
  only: 'light',
  roles: {
    "accent": "#a05a12",
    "danger": "#a8392c",
    "success": "#1f7a52",
    "warning": "#8a6410",
    "pro": "#6b4a96"
  },
  light: {
    gray: {
      anchors: {
        "surface-0": "#cdeaee",
        "surface-1": "#dcf2f3",
        "surface-2": "#ecf9f8",
        "text-primary": "#0f2a33",
        "text-secondary": "#2b4a54",
        "text-muted": "#47666f"
      }
    },
    git: {
      "added": "#1f6b34",
      "removed": "#a8322a",
      "modified": "#6e5208",
      "merged": "#6a4a9a",
      "closed": "#505660",
      "conflicting": "#85440c",
      "draft": "#505660"
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'pirate-cove', glass: { blur: 12, opacity: 0.55, tint: '#e2f5f5' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'pirate-cove') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Pirate Cove: A pirate galleon in a sunny turquoise cove with a skull flag waving, gulls overhead and a treasure chest on a palm beach" isInteractive />
  })
}
