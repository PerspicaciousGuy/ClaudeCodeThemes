import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Paperback: A well-read paperback: cream pages, brown-black ink and an ink-blue accent. Light, colors only.
const { theme, problems } = makeColors({
  label: 'Paperback',
  only: 'light',
  roles: {
    accent: '#2e5b7a',
    danger: '#b33a2c',
    success: '#4a7a32',
    warning: '#94650f',
    pro: '#7a4a8a'
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e9dfc8',
        'surface-1': '#f1e9d6',
        'surface-2': '#f8f2e4',
        'text-primary': '#2b2118',
        'text-secondary': '#54463a',
        'text-muted': '#6b5b4c'
      }
    },
    git: {
      added: '#1f6b34',
      removed: '#a8322a',
      modified: '#6e5208',
      merged: '#6a4a9a',
      closed: '#5a4a3a',
      conflicting: '#85440c',
      draft: '#5a4a3a'
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
