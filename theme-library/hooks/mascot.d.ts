export type MascotMood = 'idle' | 'work' | 'done' | 'worry' | 'sleep'

/** The hats and props the critter can wear. */
export const ACCESSORIES: readonly string[]

/** The CSS the critter's animations need, to put in a `<style>`. */
export const MASCOT_CSS: string

/** The critter as SVG, feet on y = 21 and centred on x = 0. */
export function sprite(options?: { mood?: MascotMood; accessory?: string; walking?: boolean; lantern?: boolean }): string
