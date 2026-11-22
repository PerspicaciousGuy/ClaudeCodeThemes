import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Windfarm Dusk: A peach and lilac evening over plum hills, with a low sun, drifting clouds, birds and a field of wind turbines turning at different speeds. Light.
const { theme, problems } = makeColors({
  label: 'Windfarm Dusk',
  only: 'light',
  roles: { accent: '#a8325e', danger: '#a8281f', success: '#2f6f48', warning: '#8a5200', pro: '#5e4a9f' },
  light: { gray: { anchors: { 'surface-0': '#ecd6d0', 'surface-1': '#f3e3de', 'surface-2': '#faf0ec', 'text-primary': '#2a1d2e', 'text-secondary': '#4f3d54', 'text-muted': '#644f6a' } } }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'windfarm-dusk', glass: { blur: 8, opacity: 0.55, tint: '#f6e6e0' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'windfarm-dusk') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Windfarm Dusk" isInteractive />
  })
}
