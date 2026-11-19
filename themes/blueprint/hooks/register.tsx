import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Blueprint: An architect's blueprint: a fine grid on deep blue paper, with a gear, a house elevation, a beam section and a compass drawing that trace themselves in white line. Dark.
const { theme, problems } = makeColors({
  label: 'Blueprint',
  only: 'dark',
  roles: {
    accent: '#ffd866',
    danger: '#ff8080',
    success: '#a4f6cc',
    warning: '#ffd866',
    pro: '#b9a0f4'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#091f42',
        'surface-1': '#0d2b58',
        'surface-2': '#113565',
        'surface-3': '#173f74',
        'text-primary': '#eaf3ff',
        'text-secondary': '#c0d8f4',
        'text-muted': '#98b8e0'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'blueprint', glass: { blur: 12, opacity: 0.5, tint: '#0f3366' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'blueprint') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Blueprint: An architect's blueprint: a fine grid on deep blue paper, with a gear, a house elevation, a beam section and a compass drawing that trace themselves in white line" isInteractive />
  })
}
