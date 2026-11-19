import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Colorblind Safe Light: A light theme whose colors stay apart for red-green and blue-yellow color blindness: blue and orange for added and removed, and a different lightness for each status. Colors only.
const { theme, problems } = makeColors({
  label: 'Colorblind Safe Light',
  only: 'light',
  roles: {
    accent: '#0072b2',
    danger: '#a84300',
    success: '#007a5e',
    warning: '#8a6a00',
    pro: '#a0437a'
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e6e9ef',
        'surface-1': '#eef0f4',
        'surface-2': '#f7f8fa',
        'text-primary': '#11141a',
        'text-secondary': '#2b3240',
        'text-muted': '#4a5363'
      }
    },
    git: {
      added: '#0072b2',
      removed: '#a84300',
      modified: '#7d6200',
      merged: '#a0437a',
      closed: '#5b6577',
      conflicting: '#9a5a00',
      draft: '#5b6577'
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
