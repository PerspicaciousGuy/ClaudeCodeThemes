import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Forest Floor: Moss, bark and fern: a green-brown dark theme and a pale lichen light one, with a fern-green accent. Colors only.
const { theme, problems } = makeColors({
  label: 'Forest Floor',
  roles: {
    accent: '#9cc16a',
    danger: '#d9694f',
    success: '#5dbf8e',
    warning: '#e0b04f',
    pro: '#b394d4'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#101510',
        'surface-1': '#161c15',
        'surface-2': '#1d241b',
        'surface-3': '#252d22',
        'text-primary': '#e6ecdc',
        'text-secondary': '#c1cbb1',
        'text-muted': '#9aa68b'
      }
    }
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#dde3d0',
        'surface-1': '#e7ecdc',
        'surface-2': '#f2f5ea',
        'text-primary': '#1a2217',
        'text-secondary': '#38442f',
        'text-muted': '#526046'
      }
    },
    roles: {
      accent: '#4a7a2a',
      danger: '#a8392a',
      success: '#2a7a55',
      warning: '#8a6410',
      pro: '#75519a'
    },
    git: {
      added: '#2a6a2a',
      removed: '#a8322a',
      modified: '#6e5208',
      merged: '#6a4a9a',
      closed: '#4a5440',
      conflicting: '#85440c',
      draft: '#4a5440'
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
