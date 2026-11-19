import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Greenhouse Rain: A glass greenhouse at dusk in the rain: streaks and drops running down the panes, big leaves and ferns swaying inside, warm hanging lamps and a drifting mist. Dark.
const { theme, problems } = makeColors({
  label: 'Greenhouse Rain',
  only: 'dark',
  roles: {
    accent: '#f0a95a',
    danger: '#ee7068',
    success: '#6fcf8f',
    warning: '#e6cc5c',
    pro: '#b99be6'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#07120f',
        'surface-1': '#0d1b17',
        'surface-2': '#142520',
        'surface-3': '#1c302a',
        'text-primary': '#e6f2ea',
        'text-secondary': '#bdd3c6',
        'text-muted': '#90ab9c'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'greenhouse-rain', glass: { blur: 12, opacity: 0.5, tint: '#0d1b17' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'greenhouse-rain') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Greenhouse Rain: A glass greenhouse at dusk in the rain: streaks and drops running down the panes, big leaves and ferns swaying inside, warm hanging lamps and a drifting mist" isInteractive />
  })
}
