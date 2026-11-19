import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Risograph: A risograph print: fluorescent pink, teal and yellow shapes overprinting on warm paper with halftone dots and slight misregistration, drifting as if the ink were still wet. Light.
const { theme, problems } = makeColors({
  label: 'Risograph',
  only: 'light',
  roles: {
    accent: '#c8266a',
    danger: '#c02a3a',
    success: '#0d7a6a',
    warning: '#8a6a00',
    pro: '#6a3ab0'
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#ece4cf',
        'surface-1': '#f3ecd9',
        'surface-2': '#faf5e8',
        'text-primary': '#1c1a16',
        'text-secondary': '#3e3a30',
        'text-muted': '#5a5444'
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
  backdrop: { scene: 'risograph', glass: { blur: 10, opacity: 0.62, tint: '#f6f0de' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'risograph') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Risograph: A risograph print: fluorescent pink, teal and yellow shapes overprinting on warm paper with halftone dots and slight misregistration, drifting as if the ink were still wet" isInteractive />
  })
}
