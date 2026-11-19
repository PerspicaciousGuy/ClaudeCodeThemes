import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// High Contrast Dark: Pure black and white with bright, saturated colors: text well past the AA bar on every surface, and strong borders. Dark, colors only.
const { theme, problems } = makeColors({
  label: 'High Contrast Dark',
  only: 'dark',
  contrast: 'more',
  roles: {
    accent: '#5cc8ff',
    danger: '#ff7b72',
    success: '#6bf09a',
    warning: '#ffd23f',
    pro: '#ecc4ff'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#000000',
        'surface-1': '#101010',
        'surface-2': '#181818',
        'surface-3': '#202020',
        'text-primary': '#ffffff',
        'text-secondary': '#ebebeb',
        'text-muted': '#d0d0d0'
      }
    },
    git: {
      added: '#4ae37a',
      removed: '#ff7b72',
      modified: '#ffd23f',
      merged: '#e0a8ff',
      closed: '#ff9e97',
      conflicting: '#ffb454',
      draft: '#d0d0d0'
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
