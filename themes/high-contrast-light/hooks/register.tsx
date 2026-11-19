import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// High Contrast Light: Black on white with deep, saturated colors: text well past the AA bar on every surface, and strong borders. Light, colors only.
const { theme, problems } = makeColors({
  label: 'High Contrast Light',
  only: 'light',
  contrast: 'more',
  roles: {
    accent: '#0a3d91',
    danger: '#a40000',
    success: '#0b5d1e',
    warning: '#9a5b00',
    pro: '#5b1fb0'
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e4e4e4',
        'surface-1': '#f0f0f0',
        'surface-2': '#ffffff',
        'text-primary': '#000000',
        'text-secondary': '#141414',
        'text-muted': '#333333'
      }
    },
    git: {
      added: '#0b5d1e',
      removed: '#a40000',
      modified: '#7a4a00',
      merged: '#5b1fb0',
      closed: '#8a1c1c',
      conflicting: '#8a3a00',
      draft: '#333333'
    }
  }
})

// Colors only: no backdrop.
const LOOK: ThemeSetArgs = { colors: theme }

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // Desktop ignores the whole theme if one of these lines appears.
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
}
