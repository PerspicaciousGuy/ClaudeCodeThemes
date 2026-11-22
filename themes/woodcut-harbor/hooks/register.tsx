import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Woodcut Harbor: A harbor in two inks: wavy cut-line water, a black headland with a striped lighthouse and orange lamp, a sailboat, gulls and a paper sun. Light.
const { theme, problems } = makeColors({
  label: 'Woodcut Harbor',
  only: 'light',
  roles: { accent: '#b4421c', danger: '#a8281f', success: '#3a6e3a', warning: '#8f5a00', pro: '#5e4a8f' },
  light: { gray: { anchors: { 'surface-0': '#e6dcc4', 'surface-1': '#eee5d0', 'surface-2': '#f6efdf', 'text-primary': '#1b1712', 'text-secondary': '#463c30', 'text-muted': '#5a4e40' } } }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'woodcut-harbor', glass: { blur: 6, opacity: 0.62, tint: '#f1e8d3' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'woodcut-harbor') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Woodcut Harbor" isInteractive />
  })
}
