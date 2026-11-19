import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Ukiyo-e Wave: A Japanese woodblock print: a great wave curling over scale-pattern swells, boats riding the water, a red sun and a snow-capped mountain on cream paper. Light.
const { theme, problems } = makeColors({
  label: 'Ukiyo-e Wave',
  only: 'light',
  roles: {
    accent: '#b8322a',
    danger: '#a8322a',
    success: '#2a6a4a',
    warning: '#8a6410',
    pro: '#5a4a8a'
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e6dcc0',
        'surface-1': '#efe6cf',
        'surface-2': '#f8f2e2',
        'text-primary': '#1c1a16',
        'text-secondary': '#3e3a30',
        'text-muted': '#58513f'
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
  backdrop: { scene: 'ukiyo-e-wave', glass: { blur: 12, opacity: 0.55, tint: '#f0e8d0' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'ukiyo-e-wave') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Ukiyo-e Wave: A Japanese woodblock print: a great wave curling over scale-pattern swells, boats riding the water, a red sun and a snow-capped mountain on cream paper" isInteractive />
  })
}
