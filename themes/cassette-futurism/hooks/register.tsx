import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Cassette Futurism: A 1980s vision of the future: an amber monochrome console with a sweeping radar, a spectrum, scrolling data, turning cassette reels, blinking lights and scanlines. Dark.
const { theme, problems } = makeColors({
  label: 'Cassette Futurism',
  only: 'dark',
  roles: {
    accent: '#ffb030',
    danger: '#ff7050',
    success: '#a0d860',
    warning: '#ffc840',
    pro: '#d89af0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0e0904',
        'surface-1': '#171007',
        'surface-2': '#20170a',
        'surface-3': '#2a1e0e',
        'text-primary': '#ffe8c0',
        'text-secondary': '#e0c490',
        'text-muted': '#b09868'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'cassette-futurism', glass: { blur: 12, opacity: 0.5, tint: '#171007' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'cassette-futurism') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Cassette Futurism: A 1980s vision of the future: an amber monochrome console with a sweeping radar, a spectrum, scrolling data, turning cassette reels, blinking lights and scanlines" isInteractive />
  })
}
