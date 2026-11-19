import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Cloud Sea: Sunrise above a sea of clouds: rolling banks of cloud drifting between dark peaks, a low sun, birds and a pastel sky from peach to blue. Light.
const { theme, problems } = makeColors({
  label: 'Cloud Sea',
  only: 'light',
  roles: {
    accent: '#b4502c',
    danger: '#b03a3a',
    success: '#2c7a58',
    warning: '#8a6410',
    pro: '#6a4fa8'
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e3e6ee',
        'surface-1': '#edeff5',
        'surface-2': '#f7f8fb',
        'text-primary': '#1f2433',
        'text-secondary': '#3d4660',
        'text-muted': '#566080'
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
  backdrop: { scene: 'cloud-sea', glass: { blur: 12, opacity: 0.55, tint: '#eef0f6' } },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'cloud-sea') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Cloud Sea: Sunrise above a sea of clouds: rolling banks of cloud drifting between dark peaks, a low sun, birds and a pastel sky from peach to blue" isInteractive />
  })
}
