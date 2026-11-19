import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Graphite: Neutral graphite grays with one steel-blue accent. Quiet and tool-like, light and dark, colors only.
const { theme, problems } = makeColors({
  label: 'Graphite',
  roles: {
    accent: '#8aa9c7',
    danger: '#e0665e',
    success: '#6fbf8a',
    warning: '#d9b25c',
    pro: '#a99bd1'
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#121416',
        'surface-1': '#181b1e',
        'surface-2': '#1f2327',
        'surface-3': '#272c30',
        'text-primary': '#e8eaec',
        'text-secondary': '#c3c8cd',
        'text-muted': '#9ea5ac'
      }
    }
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#dfe2e5',
        'surface-1': '#e8eaed',
        'surface-2': '#f3f4f6',
        'text-primary': '#1c1f22',
        'text-secondary': '#3a4046',
        'text-muted': '#565d65'
      }
    },
    roles: {
      accent: '#3d6486',
      danger: '#b13a33',
      success: '#2f7a4b',
      warning: '#8f6a12',
      pro: '#6a5aa3'
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

// Colors only: no backdrop.
const LOOK: ThemeSetArgs = { colors: theme }

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // Desktop ignores the whole theme if one of these lines appears.
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    // A status line an earlier version pinned stays on screen until it is replaced, so clear it.
    $.ui.status(undefined)

    await $.theme.set(LOOK)

    return next(e)
  })
}
