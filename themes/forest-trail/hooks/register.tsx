import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Forest Trail: A pixel-art forest trail on a bright morning: sunbeams through layered trees, a winding dirt path, drifting mist, butterflies and falling leaves. Light.
const { theme, problems } = makeColors({
  label: 'Forest Trail',
  only: 'light',
  roles: {
    accent: '#3f7a2a',
    danger: '#a8392c',
    success: '#2a7a52',
    warning: '#8a6410',
    pro: '#6b4a96'
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#d8e2c4',
        'surface-1': '#e4ecd2',
        'surface-2': '#f0f5e2',
        'text-primary': '#1a2416',
        'text-secondary': '#34422b',
        'text-muted': '#4c5a3d'
      }
    },
    git: {
      added: '#1f6b34',
      removed: '#a8322a',
      modified: '#6e5208',
      merged: '#6a4a9a',
      closed: '#505660',
      conflicting: '#85440c',
      draft: '#505660'
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'forest-trail', glass: { blur: 10, opacity: 0.55, tint: '#e8f0d8' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'forest-trail') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Forest Trail: A pixel-art forest trail on a bright morning: sunbeams through layered trees, a winding dirt path, drifting mist, butterflies and falling leaves" isInteractive />
  })
}
