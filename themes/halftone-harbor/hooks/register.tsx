import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Halftone Harbor: A two-ink halftone print of a harbor at sunset: a coral sun and its wake, blue water, a headland with a lighthouse, two boats. Light.
const { theme, problems } = makeColors({
  label: 'Halftone Harbor',
  only: 'light',
  roles: {
    accent: '#c8502e',
    danger: '#b83a3a',
    success: '#4f7a4a',
    warning: '#a87414',
    pro: '#5a6fb0'
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#f1e4d0',
        'surface-1': '#f6ecdc',
        'surface-2': '#fbf5ea',
        'text-primary': '#2b2018',
        'text-secondary': '#5a4838',
        'text-muted': '#6e5c4a'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'halftone-harbor', glass: { blur: 14, opacity: 0.5, tint: '#f6ead9' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'halftone-harbor') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Halftone Harbor: A two-ink halftone print of a harbor at sunset" isInteractive />
  })
}
