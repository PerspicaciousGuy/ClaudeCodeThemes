import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Ink Wash: A sumi-e painting on rice paper: mountains in grey washes fading into mist, a pine branch, a lone boat, birds crossing and a red seal. Light.
const { theme, problems } = makeColors({
  label: 'Ink Wash',
  only: 'light',
  roles: {
    accent: '#b3261e',
    danger: '#a8322a',
    success: '#2c6a4a',
    warning: '#8a6410',
    pro: '#5a4a8a'
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e8e1d0',
        'surface-1': '#f0ead9',
        'surface-2': '#f8f4ea',
        'text-primary': '#1e1d1b',
        'text-secondary': '#403e3a',
        'text-muted': '#5a5750'
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
  backdrop: { scene: 'ink-wash', glass: { blur: 12, opacity: 0.55, tint: '#f2ecdc' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'ink-wash') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Ink Wash: A sumi-e painting on rice paper: mountains in grey washes fading into mist, a pine branch, a lone boat, birds crossing and a red seal" isInteractive />
  })
}
