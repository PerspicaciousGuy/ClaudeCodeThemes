import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Midnight Ink: Blue-black ink with pale paper-white text and a periwinkle accent. Dark, colors only.
const { theme, problems } = makeColors({
  label: 'Midnight Ink',
  only: 'dark',
  roles: {
    accent: '#8aa4ff',
    danger: '#e5706a',
    success: '#74c09a',
    warning: '#e8a75a',
    pro: '#c39be0'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0a0f1f',
        'surface-1': '#10172b',
        'surface-2': '#171f38',
        'surface-3': '#1f2845',
        'text-primary': '#e9eefb',
        'text-secondary': '#bfc9e3',
        'text-muted': '#96a3c6'
      }
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
