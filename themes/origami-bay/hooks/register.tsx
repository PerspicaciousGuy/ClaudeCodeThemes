import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Origami Bay: A bay made of folded paper: layered paper waves that drift, an origami sailboat bobbing, folded cranes flying across a paper sun and clouds. Light.
const { theme, problems } = makeColors({
  label: 'Origami Bay',
  only: 'light',
  roles: {
    "accent": "#b8402c",
    "danger": "#a8392c",
    "success": "#1f7a52",
    "warning": "#8a6410",
    "pro": "#6b4a96"
  },
  light: {
    gray: {
      anchors: {
        "surface-0": "#eadfc6",
        "surface-1": "#f3ead6",
        "surface-2": "#faf4e6",
        "text-primary": "#2b2118",
        "text-secondary": "#4a3d30",
        "text-muted": "#66584a"
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
  backdrop: { scene: 'origami-bay', glass: { blur: 8, opacity: 0.6, tint: '#f3ead6' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'origami-bay') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Origami Bay: A bay made of folded paper with layered paper waves, an origami sailboat, folded paper cranes in flight, a paper sun and clouds" isInteractive />
  })
}
