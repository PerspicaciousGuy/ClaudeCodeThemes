import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Station Window: A view from a space station: a thick bolted window frame, the curve of a sunlit Earth with drifting cloud bands, a sunrise on the limb, a passing satellite and a console strip of blinking lights. Dark.
const { theme, problems } = makeColors({
  label: 'Station Window',
  only: 'dark',
  roles: { accent: '#5fb4ff', danger: '#ff8a7a', success: '#8fcf8a', warning: '#f0c45a', pro: '#b9a4f0' },
  dark: { gray: { anchors: { 'surface-0': '#0b0f18', 'surface-1': '#121824', 'surface-2': '#1b2332', 'surface-3': '#252f42', 'text-primary': '#eaf0fb', 'text-secondary': '#c1cbdd', 'text-muted': '#97a3ba' } } }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'station-window', glass: { blur: 8, opacity: 0.58, tint: '#0b1019' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'station-window') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Station Window" isInteractive />
  })
}
