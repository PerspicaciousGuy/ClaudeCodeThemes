/** What the widgets show. Times are milliseconds since the epoch, except `lastMs`, a length. */
export type WidgetState = {
  /** Context window fill, 0 to 100, if known. */
  percent?: number
  /** The 5-hour limit used, 0 to 100, if known. */
  five?: number
  /** The 7-day limit used, 0 to 100, if known. */
  week?: number
  /** When each limit resets, as an ISO time, if known. */
  fiveReset?: string
  weekReset?: string
  /** Which side the widgets sit on: the right (the default), the left, or both. */
  side?: 'right' | 'left' | 'both'
  /** Session cost so far in US dollars, if known. */
  usd?: number
  /** True if some of the cost has no known price. */
  unsure?: boolean
  /** False to draw the critter alone, with none of the widgets. Defaults to true. */
  showWidgets?: boolean
  /** The critter: off (the default), in a tile, out on the scene, or both. */
  mascot?: 'off' | 'tile' | 'walk' | 'both'
  /** What the critter is doing. */
  mood?: 'idle' | 'work' | 'done' | 'worry' | 'sleep'
  /** A hat or prop for the critter: pirate, witch, shades, straw, beanie, hardhat, tophat, or none. */
  accessory?: string
  /** Where the critter strolls, in scene units: ground height and the ends of its walk. */
  stage?: { x0: number; x1: number; y: number; lantern?: boolean }
  /** The time now. */
  now: number
}

/** The looks the widgets come in: paper, neon, pixel, blueprint, deco, frost, wood, ink, riso, terminal, amber, pastel and spooky. */
export type WidgetSkin = 'paper' | 'neon' | 'pixel' | 'blueprint' | 'deco' | 'frost' | 'wood' | 'ink' | 'riso' | 'terminal' | 'amber' | 'pastel' | 'spooky'

export const SKIN_NAMES: readonly WidgetSkin[]

/** Adds the widgets to a scene's SVG source, just before its closing tag, in the given look. */
export function withWidgets(source: string, state: WidgetState, skin?: WidgetSkin): string
