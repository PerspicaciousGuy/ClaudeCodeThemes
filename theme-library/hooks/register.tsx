import type { EngineInterface, Register, Timer } from 'claude-code'

import { makeColors } from './make-colors.js'
import { THEMES } from './registry.js'
import type { Theme } from './registry.js'

const PLUGIN = 'theme-library'
const COMMAND = 'ccthemes'
const CARD = 'theme-card'
// Kept across sessions, for every project: the id of the theme the person applied,
// and whether day and night is on ('on' or 'off').
const CHOICE_KEY = 'choice'
const AUTO_KEY = 'auto'
const PREVIEW_MS = 20_000
// A scene that follows the clock, and day and night, are looked at this often.
const REFRESH_MS = 10 * 60 * 1000
// With day and night on, a theme with a twin shows its light twin from 7:00 to 19:00.
const DAY_START = 7
const DAY_END = 19
const PAGE_SIZE = 6
const NOT_DRAWN = 'If no theme shows, this window may not draw themes yet.'

type FilterId = 'all' | 'dark' | 'light' | 'pixel' | 'vector' | 'clock'

const FILTERS: readonly (readonly [FilterId, string])[] = [
  ['all', 'All'],
  ['dark', 'Dark'],
  ['light', 'Light'],
  ['pixel', 'Pixel'],
  ['vector', 'Vector'],
  ['clock', 'Clock'],
]

// The module's own variables start over on a reload, which is fine for all of these.
let current: string | undefined
// What is drawn now: the applied theme, or its twin under day and night, or a preview.
let shown: string | undefined
let auto = false
let previewing: string | undefined
let previewEnding: Timer | undefined
let cardOpen = false
let cardInBand = false
let filter: FilterId = 'all'
let query = ''
let page = 0

const colorsOf = new Map<string, ReturnType<typeof makeColors>['theme']>()
const sceneOf = new Map<string, string>()

/** A name as typed, a title as shown and an id all come to one key: lower case, each run of anything else a hyphen. */
function keyOf(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function isFilter(text: string): text is FilterId {
  return FILTERS.some(([id]) => id === text)
}

/** The theme a person named exactly: an id or a title. */
function exactTheme(text: string): Theme | undefined {
  const key = keyOf(text)

  return key === '' ? undefined : THEMES.find(theme => theme.id === key || keyOf(theme.title) === key)
}

/** The one theme an id starts with, else the one an id contains. */
function fuzzyTheme(text: string): Theme | undefined {
  const key = keyOf(text)

  if (key === '') {
    return undefined
  }

  const starts = THEMES.filter(theme => theme.id.startsWith(key))

  if (starts.length === 1) {
    return starts[0]
  }

  const has = THEMES.filter(theme => theme.id.includes(key))

  return has.length === 1 ? has[0] : undefined
}

function isClock(theme: Theme): boolean {
  return theme.build.length > 0
}

function matchesFilter(theme: Theme, id: FilterId): boolean {
  switch (id) {
    case 'dark':
      return theme.mode !== 'light'
    case 'light':
      return theme.mode !== 'dark'
    case 'pixel':
    case 'vector':
      return theme.style === id
    case 'clock':
      return isClock(theme)
    default:
      return true
  }
}

/** Every word of a search is somewhere in the theme's name, tags or description. */
function matchesQuery(theme: Theme, text: string): boolean {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean)
  const hay = `${theme.id} ${theme.title} ${theme.tags.join(' ')} ${theme.blurb} ${theme.mode} ${theme.style}`.toLowerCase()

  return words.every(word => hay.includes(word))
}

function visibleThemes(id: FilterId = filter, text: string = query): Theme[] {
  return THEMES.filter(theme => matchesFilter(theme, id) && matchesQuery(theme, text))
}

function reasonOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

/** Runs a step nobody waits on: a fault is told in one dim line of the transcript and costs nothing else. */
async function quietly($: EngineInterface, step: () => Promise<void>): Promise<void> {
  try {
    await step()
  } catch (error) {
    try {
      await $.ui.log(`a step nobody waits on failed, and the window stays as it is (${reasonOf(error)})`)
    } catch {
      // An engine without that call: nothing more to tell.
    }
  }
}

/** The local hour to the nearest ten minutes, for scenes that follow the clock. */
async function localHour($: EngineInterface): Promise<number> {
  const date = new Date(await $.clock.now())

  return date.getHours() + Math.floor(date.getMinutes() / 10) / 6
}

/** With day and night on, a theme with a twin shows its light half by day and its dark half by night. */
function forTheHour(theme: Theme, hour: number): Theme {
  const twin = auto && theme.twin !== undefined ? THEMES.find(one => one.id === theme.twin) : undefined

  if (twin === undefined) {
    return theme
  }

  return theme.mode === (hour >= DAY_START && hour < DAY_END ? 'light' : 'dark') ? theme : twin
}

/** Draws a theme's colors and backdrop. Answers whether a window said it draws them. */
async function setTheme($: EngineInterface, theme: Theme): Promise<boolean> {
  let colors = colorsOf.get(theme.id)

  if (colors === undefined) {
    colors = makeColors(theme.colors).theme
    colorsOf.set(theme.id, colors)
  }

  const set = await $.theme.set({ colors, backdrop: { scene: theme.id, glass: theme.glass } })

  shown = theme.id

  return set.isDrawn
}

/** Draws the applied theme as the hour asks. Does nothing where it is already drawn, unless forced. */
async function showApplied($: EngineInterface, force = false): Promise<boolean | undefined> {
  const chosen = THEMES.find(theme => theme.id === current)

  if (chosen === undefined) {
    return undefined
  }

  const target = forTheHour(chosen, await localHour($))

  return !force && shown === target.id ? true : setTheme($, target)
}

/** Applies a theme (or none) and keeps the choice for later sessions. Answers one plain sentence. */
async function apply($: EngineInterface, theme: Theme | undefined): Promise<string> {
  previewEnding?.cancel()
  previewEnding = undefined
  previewing = undefined

  if (theme === undefined) {
    await $.theme.clear()
    current = undefined
    shown = undefined
    await $.store.delete(CHOICE_KEY)
    $.ui.invalidate('ui.render')

    return 'Theme cleared.'
  }

  current = theme.id
  await $.store.set(CHOICE_KEY, theme.id)

  const isDrawn = await showApplied($, true)
  const drawn = THEMES.find(one => one.id === shown)
  const twinNote = drawn !== undefined && drawn.id !== theme.id ? ` Showing ${drawn.title} for this time of day.` : ''

  $.ui.invalidate('ui.render')

  return isDrawn === false ? `${theme.title} applied. ${NOT_DRAWN}` : `${theme.title} applied.${twinNote}`
}

/** Turns day and night on or off, keeps it, and redraws. */
async function setAuto($: EngineInterface, on: boolean): Promise<string> {
  auto = on
  await $.store.set(AUTO_KEY, on ? 'on' : 'off')
  if (previewing === undefined) {
    await showApplied($, true)
  }
  $.ui.invalidate('ui.render')

  const chosen = THEMES.find(theme => theme.id === current)
  const twins = THEMES.filter(theme => theme.twin !== undefined).length

  if (!on) {
    return 'Day and night is off: your theme stays as you applied it.'
  }

  return chosen !== undefined && chosen.twin === undefined
    ? `Day and night is on, but ${chosen.title} has no twin, so it stays as it is. ${twins} themes have one: /${COMMAND} list shows them.`
    : `Day and night is on: a theme with a twin shows its light half from ${DAY_START}:00 to ${DAY_END}:00 and its dark half after.`
}

/** Back to the applied theme, or none. */
async function endPreview($: EngineInterface): Promise<void> {
  previewEnding = undefined
  previewing = undefined

  if (THEMES.some(theme => theme.id === current)) {
    await showApplied($, true)
  } else {
    await $.theme.clear()
    shown = undefined
  }
  $.ui.invalidate('ui.render')
}

/** Shows a theme for a few seconds without keeping it. */
async function preview($: EngineInterface, theme: Theme): Promise<string> {
  previewEnding?.cancel()
  previewing = theme.id

  const isDrawn = await setTheme($, theme)

  previewEnding = $.clock.after(PREVIEW_MS, () => void quietly($, () => endPreview($)))
  $.ui.invalidate('ui.render')

  return isDrawn ? `Previewing ${theme.title} for ${PREVIEW_MS / 1000} seconds.` : `Previewing ${theme.title}. ${NOT_DRAWN}`
}

const KINDS = [
  ['dark', 'Dark windows'],
  ['light', 'Light windows'],
  ['both', 'Light and dark'],
] as const

function describe(theme: Theme): string {
  const twin = theme.twin === undefined ? undefined : THEMES.find(one => one.id === theme.twin)
  const parts = [theme.mode === 'both' ? 'light and dark' : theme.mode, theme.style]

  if (isClock(theme)) {
    parts.push('follows your clock')
  }
  if (twin !== undefined) {
    parts.push(`twin: ${twin.id}`)
  }

  return parts.join(' · ')
}

function themeList(id: FilterId, text: string): string {
  const shownList = visibleThemes(id, text)
  const what = [id === 'all' ? '' : id, text === '' ? '' : `"${text}"`].filter(Boolean).join(' ')

  if (shownList.length === 0) {
    return `No themes match${what === '' ? '' : ` ${what}`}. /${COMMAND} list names all ${THEMES.length}.`
  }

  return [
    `Theme library (${shownList.length}${what === '' ? '' : `, ${what}`}):`,
    ...KINDS.flatMap(([mode, title]) => {
      const rows = shownList.filter(theme => theme.mode === mode).map(theme => `  ${theme.id}: ${theme.title}${theme.id === current ? ' (applied)' : ''}${theme.twin === undefined ? '' : ` [twin: ${theme.twin}]`}`)

      return rows.length === 0 ? [] : [`${title}:`, ...rows]
    }),
    `/${COMMAND} <name> applies one; /${COMMAND} dark, light, pixel, vector or clock filters the card; /${COMMAND} find <words> searches; /${COMMAND} auto turns day and night on or off; /${COMMAND} random, next, prev, off.`,
  ].join('\n')
}

type CardElements = Pick<ReturnType<EngineInterface['ui']['resolve']>, 'Box' | 'Text' | 'Button'>

function closeCard($: EngineInterface): void {
  cardOpen = false
  cardInBand = false
  $.ui.invalidate('ui.render')
}

/** Opens the picker, with a filter and a search if given. A surface that draws placed rows gets it in the transcript; another gets it above the prompt. */
async function openCard($: EngineInterface, id: FilterId, text: string): Promise<string> {
  filter = id
  query = text
  page = 0

  const placed = await $.ui.place({ id: CARD })

  cardOpen = true
  cardInBand = !placed.isPlaced
  $.ui.invalidate('ui.render')

  return visibleThemes().length === 0 ? `No themes match, so the card is empty. /${COMMAND} list names all ${THEMES.length}.` : 'Pick a theme on the card.'
}

/** The picker: filters, a page of themes each with Apply and Preview, and day and night. */
function card($: EngineInterface, { Box, Text, Button }: CardElements) {
  const list = visibleThemes()
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
  const at = Math.min(page, pages - 1)
  const rows = list.slice(at * PAGE_SIZE, (at + 1) * PAGE_SIZE)
  const redraw = () => $.ui.invalidate('ui.render')

  return (
    <Box flexDirection="column" borderStyle="round" paddingX={1} gap="md">
      <Box flexDirection="row" flexWrap="wrap" gap={1}>
        <Text bold>Theme library</Text>
        <Button
          key="auto"
          label={auto ? 'Day and night: on' : 'Day and night: off'}
          onPress={async () => {
            try {
              void $.ui.toast(await setAuto($, !auto))
            } catch (error) {
              void $.ui.toast(`Day and night could not change: ${reasonOf(error)}`)
            }
          }}
        >
          {auto ? 'Day and night: on' : 'Day and night: off'}
        </Button>
        <Button
          key="off"
          label="No theme"
          onPress={async () => {
            try {
              void $.ui.toast(await apply($, undefined))
            } catch (error) {
              void $.ui.toast(`The theme could not be cleared: ${reasonOf(error)}`)
            }
            closeCard($)
          }}
        >
          No theme
        </Button>
        <Button key="close" label="Close" role="dismiss" autoFocus onPress={() => closeCard($)}>
          Close
        </Button>
      </Box>
      <Box flexDirection="row" flexWrap="wrap" gap={1}>
        {FILTERS.map(([id, title]) => {
          const label = filter === id ? `• ${title}` : title

          return (
            <Button
              key={`filter-${id}`}
              label={label}
              onPress={() => {
                filter = id
                page = 0
                redraw()
              }}
            >
              {label}
            </Button>
          )
        })}
      </Box>
      <Box flexDirection="row" flexWrap="wrap" gap={1}>
        <Text dimColor>
          {list.length} {list.length === 1 ? 'theme' : 'themes'}
          {query === '' ? '' : ` matching "${query}"`}
          {pages > 1 ? ` · page ${at + 1} of ${pages}` : ''}
        </Text>
        {query === '' ? null : (
          <Button
            key="clear-search"
            label="Clear search"
            onPress={() => {
              query = ''
              page = 0
              redraw()
            }}
          >
            Clear search
          </Button>
        )}
      </Box>
      {auto ? <Text dimColor>{`Day and night: a theme with a twin shows its light half from ${DAY_START}:00 to ${DAY_END}:00 and its dark half after.`}</Text> : null}
      {rows.length === 0 ? <Text dimColor>{`Nothing matches. Try another filter, or /${COMMAND} find <words>.`}</Text> : null}
      {rows.map(theme => {
        const applyWord = current === theme.id ? 'Applied' : 'Apply'
        const previewWord = previewing === theme.id ? 'Previewing' : 'Preview'

        return (
          <Box key={`theme-${theme.id}`} flexDirection="column" gap="xs">
            <Box flexDirection="row" flexWrap="wrap" justifyContent="space-between" columnGap="md" rowGap="xs">
              <Text bold={current === theme.id}>
                {current === theme.id ? '✓ ' : ''}
                {theme.title}
              </Text>
              <Box flexDirection="row" gap={1}>
                <Button
                  key={`apply-${theme.id}`}
                  label={applyWord}
                  onPress={async () => {
                    try {
                      void $.ui.toast(await apply($, theme))
                    } catch (error) {
                      void $.ui.toast(`${theme.title} could not be applied: ${reasonOf(error)}`)
                      return
                    }
                    closeCard($)
                  }}
                >
                  {applyWord}
                </Button>
                <Button
                  key={`preview-${theme.id}`}
                  label={previewWord}
                  onPress={async () => {
                    try {
                      void $.ui.toast(await preview($, theme))
                    } catch (error) {
                      void $.ui.toast(`${theme.title} could not be shown: ${reasonOf(error)}`)
                    }
                  }}
                >
                  {previewWord}
                </Button>
              </Box>
            </Box>
            <Text dimColor>{describe(theme)}</Text>
            <Text dimColor>{theme.blurb}</Text>
          </Box>
        )
      })}
      {pages > 1 ? (
        <Box flexDirection="row" gap={1}>
          {at > 0 ? (
            <Button
              key="prev"
              label="Previous"
              onPress={() => {
                page = at - 1
                redraw()
              }}
            >
              Previous
            </Button>
          ) : null}
          {at < pages - 1 ? (
            <Button
              key="next"
              label="Next"
              onPress={() => {
                page = at + 1
                redraw()
              }}
            >
              Next
            </Button>
          ) : null}
        </Box>
      ) : null}
    </Box>
  )
}

/** The next theme in the filter's list, a step away from the applied one, or a random one. */
function stepTheme(kind: 'next' | 'prev' | 'random', id: FilterId, text: string): Theme | undefined {
  const pool = visibleThemes(id, text)

  if (pool.length === 0) {
    return undefined
  }

  const at = pool.findIndex(theme => theme.id === current)

  if (kind === 'random') {
    const others = pool.filter(theme => theme.id !== current)

    return others.length === 0 ? pool[0] : others[Math.floor(Math.random() * others.length)]
  }
  if (at < 0) {
    return kind === 'next' ? pool[0] : pool[pool.length - 1]
  }

  return pool[(at + (kind === 'next' ? 1 : pool.length - 1)) % pool.length]
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // A refused name must not cost the session its theme: go on without the command.
    try {
      await $.command.register({
        name: COMMAND,
        description: 'Switch themes: alone it opens the picker; a theme name applies it; dark, light, pixel, vector or clock filter the picker; "find <words>", "auto", "list", "random", "next", "prev" and "off" also work',
        argumentHint: '[theme | dark | light | pixel | vector | clock | find <words> | auto | list | random | next | prev | off]',
      })
    } catch (error) {
      void $.ui.toast(`${PLUGIN}: /${COMMAND} is not available (${reasonOf(error)})`)
    }

    // Scenes that follow the clock, and day and night, are looked at now and then.
    $.clock.every(REFRESH_MS, () => {
      $.ui.invalidate('ui.render')
      if (auto && previewing === undefined) {
        void quietly($, async () => void (await showApplied($)))
      }
    })

    // The theme chosen before comes back, as the hour asks.
    await quietly($, async () => {
      const saved = await $.store.get(CHOICE_KEY)
      const theme = typeof saved === 'string' ? THEMES.find(one => one.id === saved) : undefined

      auto = (await $.store.get(AUTO_KEY)) === 'on'
      if (theme !== undefined) {
        current = theme.id
        await showApplied($, true)
      }
    })

    return next(e)
  })

  on('command.run', { command: COMMAND }, async ($, e) => {
    const words = e.args.trim()
    const [first = '', ...more] = words.toLowerCase().split(/\s+/).filter(Boolean)
    const rest = more.join(' ')
    const filterOf = (text: string): FilterId => (isFilter(text) ? text : 'all')
    const searchOf = (text: string): string => (isFilter(text) ? '' : text)

    try {
      if (first === '') {
        return { text: await openCard($, 'all', '') }
      }
      if (first === 'list') {
        return { text: themeList(filterOf(rest), searchOf(rest)) }
      }
      if (first === 'find' || first === 'search') {
        return { text: rest === '' ? `Say what to look for: /${COMMAND} find beach, or /${COMMAND} find pixel night.` : await openCard($, 'all', rest) }
      }
      if (first === 'off' || first === 'none') {
        return { text: await apply($, undefined) }
      }
      if (first === 'auto' || first === 'daynight') {
        return { text: await setAuto($, rest === 'on' ? true : rest === 'off' ? false : !auto) }
      }
      if (first === 'random' || first === 'next' || first === 'prev' || first === 'previous') {
        const theme = stepTheme(first === 'previous' ? 'prev' : first, filterOf(rest), searchOf(rest))

        return { text: theme === undefined ? 'No themes to pick from.' : await apply($, theme) }
      }

      const exact = exactTheme(words)

      if (exact !== undefined) {
        return { text: await apply($, exact) }
      }
      if (more.length === 0 && isFilter(first)) {
        return { text: await openCard($, first, '') }
      }

      const near = fuzzyTheme(words)

      if (near !== undefined) {
        return { text: await apply($, near) }
      }

      // Not a name: treat the words as a search.
      const found = visibleThemes('all', words)

      if (found.length === 0) {
        return { text: `No theme named "${words}". /${COMMAND} list names all ${THEMES.length}.` }
      }

      return { text: `${found.length} ${found.length === 1 ? 'theme matches' : 'themes match'} "${words}". ${await openCard($, 'all', words)}` }
    } catch (error) {
      return { text: `That did not work: ${reasonOf(error)}` }
    }
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (e.props.plugin !== PLUGIN || (e.surface !== 'desktop' && e.surface !== 'mobile')) {
      return next(e)
    }

    const theme = THEMES.find(one => one.id === e.props.scene)

    if (theme === undefined) {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)
    // Only a scene that follows the clock takes the hour.
    const follows = isClock(theme)
    const hour = follows ? await localHour($) : 12
    const key = follows ? `${theme.id}@${hour}` : theme.id
    let source = sceneOf.get(key)

    if (source === undefined) {
      source = theme.build(hour)
      sceneOf.clear()
      sceneOf.set(key, source)
    }

    return <Svg isInteractive alt={`${theme.title}: ${theme.blurb}`} source={source} />
  })

  on('ui.render', { component: 'Placed' }, ($, e, next) => {
    if (e.props.plugin !== PLUGIN || e.props.id !== CARD || !cardOpen) {
      return next(e)
    }

    return card($, $.ui.resolve(e))
  })

  on('ui.render', { component: 'AbovePrompt' }, ($, e, next) => {
    if (!cardOpen || !cardInBand) {
      return next(e)
    }

    return card($, $.ui.resolve(e))
  })
}
