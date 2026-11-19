import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Spring Rain: A soft spring rain over pale green hills: blossoming trees shedding petals, rain streaking through, puddles rippling under a pastel sky. Light.
const { theme, problems } = makeColors({
  label: 'Spring Rain',
  only: 'light',
  roles: {
    accent: '#b0457a',
    danger: '#b03a3a',
    success: '#2c7a52',
    warning: '#8a6410',
    pro: '#6a4fa8'
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#dde6e4',
        'surface-1': '#e8eeec',
        'surface-2': '#f4f7f5',
        'text-primary': '#1e2b2a',
        'text-secondary': '#3a4c4a',
        'text-muted': '#546664'
      }
    },
    git: {
      added: '#1f6b34',
      removed: '#a8322a',
      modified: '#6e5208',
      merged: '#6a4a9a',
      closed: '#505660',
      conflicting: '#85440c',
      draft: '#505660'
    }
  }
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'spring-rain', glass: { blur: 12, opacity: 0.55, tint: '#eef3f1' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'spring-rain') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Spring Rain: A soft spring rain over pale green hills: blossoming trees shedding petals, rain streaking through, puddles rippling under a pastel sky" isInteractive />
  })
}
