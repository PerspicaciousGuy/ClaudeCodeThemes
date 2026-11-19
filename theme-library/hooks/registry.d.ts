import type { ThemeBackdropGlass } from 'claude-code'

import type { makeColors } from './make-colors.js'

/** One theme in the library, as scripts/library.mjs pack writes it. */
export type Theme = {
  id: string
  title: string
  blurb: string
  /** Which window it is made for: `both` themes follow the app's light or dark mode. */
  mode: 'dark' | 'light' | 'both'
  /** How the scene is drawn: pixel art on a 192x108 grid, vector art, or `still` for a look of colors only, with no scene. */
  style: 'pixel' | 'vector' | 'still'
  /** Subject words from the theme's keywords, such as `beach` or `night`. */
  tags: readonly string[]
  /** The same scene for the other half of the day: a light theme's dark twin and the reverse. */
  twin?: string
  /** How the panels are frosted over the scene. Not there on a still theme. */
  glass?: ThemeBackdropGlass
  /** The definition `makeColors` builds the theme's colors from. */
  colors: Parameters<typeof makeColors>[0]
  /** Builds the scene's SVG. A scene that follows the clock takes the local hour (0 up to 24). `null` on a still theme. */
  build: ((hour: number) => string) | null
}

export const THEMES: readonly Theme[]
