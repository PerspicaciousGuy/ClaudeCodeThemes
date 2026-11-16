import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// A starting point for a Claude Code desktop theme: a colors-only look, light
// and dark. Change the hex values, rename the plugin in
// .claude-plugin/plugin.json, and see CONTRIBUTING.md for the rest.
//
// Every color is a six-digit hex. Never write design-system color names by
// hand: makeColors builds all of them from the few anchors and roles below.
const { theme, problems } = makeColors({
  label: 'My Theme',
  roles: {
    accent: '#2f5d8c',
    danger: '#b3392f',
    success: '#4e7d3a',
    warning: '#a86f14',
    pro: '#6d4f94',
  },
  light: {
    gray: {
      anchors: {
        // surface-0 is the page; each later surface is as light or lighter.
        'surface-0': '#efe6d3',
        'surface-1': '#f4ecdc',
        'surface-2': '#faf5e9',
        'text-primary': '#2a241d',
        'text-secondary': '#544a3d',
        'text-muted': '#6a5f50',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        // surface-0 is the darkest; keep surface-3 close to it.
        'surface-0': '#1f1a15',
        'surface-1': '#28221b',
        'surface-2': '#312a22',
        'surface-3': '#3a3229',
        'text-primary': '#f0e7d7',
        'text-secondary': '#cfc4b2',
        'text-muted': '#aca08d',
      },
    },
  },
})

// To add a backdrop, give the look one and draw it (see themes/hearth for a
// moving scene, or use a still ground such as { color: 'surface-0' }):
//   backdrop: { scene: 'my-scene', glass: { blur: 14, opacity: 0.6 } }
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
