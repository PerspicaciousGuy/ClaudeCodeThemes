import type { ThemeBackdropGlass } from 'claude-code'

import type { makeColors } from './make-colors.js'

/** One theme in the library, as scripts/library.mjs pack writes it. */
export type Theme = {
  id: string
  title: string
  blurb: string
  /** Which window it is made for: `both` themes follow the app's light or dark mode. */
  mode: 'dark' | 'light' | 'both'
  /** How the scene is drawn: pixel art on a 192x108 grid, or vector art. */
  style: 'pixel' | 'vector'
  /** Subject words from the theme's keywords, such as `beach` or `night`. */
  tags: readonly string[]
  /** The same scene for the other half of the day: a light theme's dark twin and the reverse. */
  twin?: string
  glass: ThemeBackdropGlass
  /** The definition `makeColors` builds the theme's colors from. */
  colors: Parameters<typeof makeColors>[0]
  /** Builds the scene's SVG. A scene that follows the clock takes the local hour (0 up to 24). */
  build: (hour: number) => string
}

export const THEMES: readonly Theme[]
