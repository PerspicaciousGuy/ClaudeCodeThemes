import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Colorblind Safe Dark: A dark theme whose colors stay apart for red-green and blue-yellow color blindness: blue and orange for added and removed, and a different lightness for each status. Colors only.
const { theme, problems } = makeColors({
  label: 'Colorblind Safe Dark',
  only: 'dark',
  roles: {
    accent: '#56b4e9',
    danger: '#f2784b',
    success: '#2fc7a2',
    warning: '#f0e442',
    pro: '#cc79a7'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#11141a',
        'surface-1': '#181c24',
        'surface-2': '#20252f',
        'surface-3': '#282e3a',
        'text-primary': '#f2f4f8',
        'text-secondary': '#cdd3de',
        'text-muted': '#a9b1c0'
      }
    },
    git: {
      added: '#56b4e9',
      removed: '#f2784b',
      modified: '#f0e442',
      merged: '#cc79a7',
      closed: '#a9b1c0',
      conflicting: '#e69f00',
      draft: '#9aa3b2'
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
