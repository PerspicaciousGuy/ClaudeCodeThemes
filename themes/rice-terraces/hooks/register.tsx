import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Rice Terraces: A misty morning over stepped rice terraces: pale mountains, a low sun, green steps alternating with sky-colored water, drifting mist, a small hut and egrets in flight. Light.
const { theme, problems } = makeColors({
  label: 'Rice Terraces',
  only: 'light',
  roles: { accent: '#2a6a46', danger: '#a8281f', success: '#2f6f48', warning: '#865400', pro: '#5e4a9f' },
  light: { gray: { anchors: { 'surface-0': '#dfe8d4', 'surface-1': '#e9f0df', 'surface-2': '#f3f8ec', 'text-primary': '#1d2a1c', 'text-secondary': '#3e4f3b', 'text-muted': '#54664f' } } }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'rice-terraces', glass: { blur: 8, opacity: 0.55, tint: '#eef4e4' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'rice-terraces') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Rice Terraces" isInteractive />
  })
}
