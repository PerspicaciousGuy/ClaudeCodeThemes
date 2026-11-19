import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Bamboo Grove: A bamboo grove in morning mist: tall green stalks in layers fading into haze, leaves swaying, slow light shafts and a few leaves falling. Light.
const { theme, problems } = makeColors({
  label: 'Bamboo Grove',
  only: 'light',
  roles: {
    accent: '#5b7f2a',
    danger: '#a8392c',
    success: '#2a7a52',
    warning: '#8a6410',
    pro: '#6b4a96'
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#dfe8d2',
        'surface-1': '#e9f0dd',
        'surface-2': '#f4f8ea',
        'text-primary': '#1b2a1a',
        'text-secondary': '#394a35',
        'text-muted': '#54664d'
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
  backdrop: { scene: 'bamboo-grove', glass: { blur: 12, opacity: 0.55, tint: '#eef4e2' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'bamboo-grove') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Bamboo Grove: A bamboo grove in morning mist: tall green stalks in layers fading into haze, leaves swaying, slow light shafts and a few leaves falling" isInteractive />
  })
}
