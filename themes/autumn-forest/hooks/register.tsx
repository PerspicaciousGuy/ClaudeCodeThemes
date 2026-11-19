import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Autumn Forest: A forest in autumn at golden dusk: trees in red, orange and gold, leaves spiraling down, slanting light and a carpet of fallen leaves. Dark.
const { theme, problems } = makeColors({
  label: 'Autumn Forest',
  only: 'dark',
  roles: {
    accent: '#f0963c',
    danger: '#ee6a5a',
    success: '#8fcf6a',
    warning: '#e8c24a',
    pro: '#c49ae0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#1a0e0c',
        'surface-1': '#26150f',
        'surface-2': '#331d15',
        'surface-3': '#40261b',
        'text-primary': '#f6ebe0',
        'text-secondary': '#d8c4b2',
        'text-muted': '#ad9484'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'autumn-forest', glass: { blur: 12, opacity: 0.5, tint: '#26150f' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'autumn-forest') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Autumn Forest: A forest in autumn at golden dusk: trees in red, orange and gold, leaves spiraling down, slanting light and a carpet of fallen leaves" isInteractive />
  })
}
