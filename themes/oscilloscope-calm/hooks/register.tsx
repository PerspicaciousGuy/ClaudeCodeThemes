import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Oscilloscope: An oscilloscope screen: a glowing green graticule with a sine, a two-tone, a square and a triangle wave scrolling across and a cursor sweeping the display. Dark. A calm version: slower and softer.
const { theme, problems } = makeColors({
  label: 'Oscilloscope Calm',
  only: 'dark',
  roles: {
    accent: '#4dff9a',
    danger: '#ff7a7a',
    success: '#4dff9a',
    warning: '#ffc24a',
    pro: '#ff9ae0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#030b07',
        'surface-1': '#07140d',
        'surface-2': '#0c1f14',
        'surface-3': '#122b1b',
        'text-primary': '#dcffe8',
        'text-secondary': '#a8dcbc',
        'text-muted': '#7fb494'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'oscilloscope-calm', glass: { blur: 16, opacity: 0.62, tint: '#07140d' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'oscilloscope-calm') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Oscilloscope: An oscilloscope screen: a glowing green graticule with a sine, a two-tone, a square and a triangle wave scrolling across and a cursor sweeping the display" isInteractive />
  })
}
