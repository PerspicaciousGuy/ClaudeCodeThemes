import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// Beacon Cove: a night-only look. Blue-black panels, lamp-amber accent,
// over an animated pixel-art lighthouse scene.
const { theme, problems } = makeColors({
  label: 'Beacon Cove',
  only: 'dark',
  roles: {
    accent: '#e8a23a',
    danger: '#d4545e',
    success: '#5fae86',
    warning: '#cfa24a',
    pro: '#8f7be0',
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#080c1c',
        'surface-1': '#0d1328',
        'surface-2': '#131a33',
        'surface-3': '#1a2240',
        'text-primary': '#e8ecf8',
        'text-secondary': '#bcc4de',
        'text-muted': '#8e98ba',
      },
    },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'cove', glass: { blur: 14, opacity: 0.6 } },
}

const REFRESH_MS = 10 * 60 * 1000

// The local hour, to the nearest ten minutes, so the scene is only rebuilt
// when it would visibly change.
async function localHour($: { clock: { now: () => Promise<number> } }): Promise<number> {
  const d = new Date(await $.clock.now())

  return d.getHours() + Math.floor(d.getMinutes() / 10) / 6
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // Redraw the backdrop every ten minutes so it follows the clock.
    $.clock.every(REFRESH_MS, () => $.ui.invalidate('ui.render'))

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

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'cove') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)
    const scene = buildScene(await localHour($))

    return <Svg source={scene} alt="A pixel-art lighthouse on a cape by the sea, lit for the time of day, with a slow sweeping beam" isInteractive />
  })
}
