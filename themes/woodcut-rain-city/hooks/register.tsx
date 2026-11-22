import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Woodcut Rain City: A night city in the rain, cut in two inks on dark stock: black towers with cream windows, a hatched moon behind cloud, rain streaks and a wet street. Dark.
const { theme, problems } = makeColors({
  label: 'Woodcut Rain City',
  only: 'dark',
  roles: { accent: '#ee8a55', danger: '#ff8a7a', success: '#8fcf8a', warning: '#f0c45a', pro: '#b9a4f0' },
  dark: { gray: { anchors: { 'surface-0': '#13151b', 'surface-1': '#1a1d25', 'surface-2': '#232733', 'surface-3': '#2c3140', 'text-primary': '#f1e9d4', 'text-secondary': '#cfc6af', 'text-muted': '#a49b86' } } }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'woodcut-rain-city', glass: { blur: 6, opacity: 0.6, tint: '#14171e' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'woodcut-rain-city') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Woodcut Rain City" isInteractive />
  })
}
