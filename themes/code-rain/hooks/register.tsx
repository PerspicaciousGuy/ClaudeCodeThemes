import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Code Rain: Columns of falling glyphs in phosphor green, bright at the head and fading behind, dimmer under the chat. Dark.
const { theme, problems } = makeColors({
  label: 'Code Rain',
  only: 'dark',
  roles: {
    accent: '#2cff7a',
    danger: '#ff6b6b',
    success: '#3ddc84',
    warning: '#e6c84a',
    pro: '#7ad7ff'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#030806',
        'surface-1': '#07100b',
        'surface-2': '#0c1a12',
        'surface-3': '#11241a',
        'text-primary': '#dcffe8',
        'text-secondary': '#a9d9bb',
        'text-muted': '#7fae92'
      }
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'code-rain', glass: { blur: 6, opacity: 0.45, tint: '#06100a' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'code-rain') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Code Rain: Columns of falling glyphs in phosphor green, bright at the head and fading behind, dimmer under the chat. Dark." isInteractive />
  })
}
