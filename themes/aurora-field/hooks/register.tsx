import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Aurora Field: Northern lights over a frozen lake ringed by pines, with twinkling stars and the odd shooting star. Dark.
const { theme, problems } = makeColors({
  label: 'Aurora Field',
  only: 'dark',
  roles: {
    accent: '#3ddc97',
    danger: '#f07178',
    success: '#4ccf8f',
    warning: '#e6b450',
    pro: '#9b87f5'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#050b16',
        'surface-1': '#0a141f',
        'surface-2': '#0f1d2a',
        'surface-3': '#152636',
        'text-primary': '#e6f2f2',
        'text-secondary': '#b9ced0',
        'text-muted': '#8ba5a8'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'aurora-field', glass: { blur: 14, opacity: 0.5, tint: '#0a1a26' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'aurora-field') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Aurora Field: Northern lights over a frozen lake ringed by pines, with twinkling stars and the odd shooting star. Dark." isInteractive />
  })
}
