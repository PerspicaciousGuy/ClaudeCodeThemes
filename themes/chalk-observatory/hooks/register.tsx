import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Chalk Observatory: A night sky in chalk on a slate board: a hilltop observatory whose telescope sweeps the sky, a crescent moon, twinkling stars, a constellation that draws itself and a shooting star. Dark.
const { theme, problems } = makeColors({
  label: 'Chalk Observatory',
  only: 'dark',
  roles: { accent: '#f2c94c', danger: '#ff8a7a', success: '#8fcf8a', warning: '#f0c45a', pro: '#b9a4f0' },
  dark: { gray: { anchors: { 'surface-0': '#161d1e', 'surface-1': '#1d2627', 'surface-2': '#273233', 'surface-3': '#313e40', 'text-primary': '#f1efe3', 'text-secondary': '#cfcdbd', 'text-muted': '#a8a696' } } }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'chalk-observatory', glass: { blur: 6, opacity: 0.6, tint: '#182021' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'chalk-observatory') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Chalk Observatory" isInteractive />
  })
}
