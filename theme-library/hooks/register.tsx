import type { EngineInterface, Register, Timer } from 'claude-code'

import { makeColors } from './make-colors.js'
import { THEMES } from './registry.js'
import type { Theme } from './registry.js'

const PLUGIN = 'theme-library'
const COMMAND = 'ccthemes'
const CARD = 'theme-card'
// Kept across sessions, for every project: the id of the theme the person applied.
const CHOICE_KEY = 'choice'
const PREVIEW_MS = 20_000
// A scene that follows the clock is redrawn this often.
const REFRESH_MS = 10 * 60 * 1000
const NOT_DRAWN = 'If no theme shows, this window may not draw themes yet.'

// The module's own variables start over on a reload, which is fine for all of these.
let current: string | undefined
let previewing: string | undefined
let previewEnding: Timer | undefined
let cardOpen = false
let cardInBand = false

const colorsOf = new Map<string, ReturnType<typeof makeColors>['theme']>()
const sceneOf = new Map<string, string>()

/** A name as typed, a title as shown and an id all come to one key: lower case, each run of anything else a hyphen. */
function keyOf(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** The theme a person named: an id or title, else the one theme an id starts with, else the one it contains. */
function themeNamed(text: string): Theme | undefined {
  const key = keyOf(text)

  if (key === '') {
    return undefined
  }

  const exact = THEMES.find(theme => theme.id === key || keyOf(theme.title) === key)

  if (exact !== undefined) {
    return exact
  }

  const starts = THEMES.filter(theme => theme.id.startsWith(key))

  if (starts.length === 1) {
    return starts[0]
  }

  const has = THEMES.filter(theme => theme.id.includes(key))

  return has.length === 1 ? has[0] : undefined
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

/** Draws a theme's colors and backdrop. Answers whether a window said it draws them. */
async function setTheme($: EngineInterface, theme: Theme): Promise<boolean> {
  let colors = colorsOf.get(theme.id)

  if (colors === undefined) {
    colors = makeColors(theme.colors).theme
    colorsOf.set(theme.id, colors)
  }

  const set = await $.theme.set({ colors, backdrop: { scene: theme.id, glass: theme.glass } })

  return set.isDrawn
}

/** Applies a theme (or none) and keeps the choice for later sessions. Answers one plain sentence. */
async function apply($: EngineInterface, theme: Theme | undefined): Promise<string> {
  previewEnding?.cancel()
  previewEnding = undefined
  previewing = undefined

  if (theme === undefined) {
    await $.theme.clear()
    current = undefined
    await $.store.delete(CHOICE_KEY)
    $.ui.invalidate('ui.render')

    return 'Theme cleared.'
  }

  const isDrawn = await setTheme($, theme)

  current = theme.id
  await $.store.set(CHOICE_KEY, theme.id)
  $.ui.invalidate('ui.render')

  return isDrawn ? `${theme.title} applied.` : `${theme.title} applied. ${NOT_DRAWN}`
}

/** Back to the applied theme, or none. */
async function endPreview($: EngineInterface): Promise<void> {
  previewEnding = undefined
  previewing = undefined

  const back = THEMES.find(theme => theme.id === current)

  if (back === undefined) {
    await $.theme.clear()
  } else {
    await setTheme($, back)
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

function themeList(): string {
  return [
    `Theme library (${THEMES.length}):`,
    ...KINDS.flatMap(([mode, title]) => {
      const rows = THEMES.filter(theme => theme.mode === mode).map(theme => `  ${theme.id}: ${theme.title}${theme.id === current ? ' (applied)' : ''}`)

      return rows.length === 0 ? [] : [`${title}:`, ...rows]
    }),
    `Use /${COMMAND} <name> to apply one, /${COMMAND} to open the card, /${COMMAND} random, /${COMMAND} next, /${COMMAND} off.`,
  ].join('\n')
}

type CardElements = Pick<ReturnType<EngineInterface['ui']['resolve']>, 'Box' | 'Text' | 'Button'>

function closeCard($: EngineInterface): void {
  cardOpen = false
  cardInBand = false
  $.ui.invalidate('ui.render')
}

/** The picker: every theme under the kind of window it is made for, each with Apply and Preview. */
function card($: EngineInterface, { Box, Text, Button }: CardElements) {
  return (
    <Box flexDirection="column" borderStyle="round" paddingX={1} gap="md">
      <Box flexDirection="row" gap={1}>
        <Text bold>Theme library</Text>
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
      {KINDS.map(([mode, title]) => {
        const themes = THEMES.filter(theme => theme.mode === mode)

        if (themes.length === 0) {
          return []
        }

        return (
          <Box key={`group-${mode}`} flexDirection="column" gap="md">
            <Text key={`head-${mode}`} bold>
              {title}
            </Text>
            {themes.map(theme => {
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
                  <Text dimColor>{theme.blurb}</Text>
                </Box>
              )
            })}
          </Box>
        )
      })}
    </Box>
  )
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // A refused name must not cost the session its theme: go on without the command.
    try {
      await $.command.register({
        name: COMMAND,
        description: 'Switch themes: alone it opens the picker; with a theme name it applies that theme; "list", "random", "next" and "off" also work',
        argumentHint: '[theme | list | random | next | off]',
      })
    } catch (error) {
      void $.ui.toast(`${PLUGIN}: /${COMMAND} is not available (${reasonOf(error)})`)
    }

    // Scenes that follow the clock are redrawn now and then.
    $.clock.every(REFRESH_MS, () => $.ui.invalidate('ui.render'))

    // The theme chosen before comes back.
    await quietly($, async () => {
      const saved = await $.store.get(CHOICE_KEY)
      const theme = typeof saved === 'string' ? THEMES.find(one => one.id === saved) : undefined

      if (theme !== undefined) {
        current = theme.id
        await setTheme($, theme)
      }
    })

    return next(e)
  })

  on('command.run', { command: COMMAND }, async ($, e) => {
    const words = e.args.trim()
    const key = keyOf(words)

    try {
      if (key === '') {
        // A surface that draws placed rows gets the card in the transcript; another gets it above the prompt.
        const placed = await $.ui.place({ id: CARD })

        cardOpen = true
        cardInBand = !placed.isPlaced
        $.ui.invalidate('ui.render')

        return { text: 'Pick a theme on the card.' }
      }
      if (key === 'list') {
        return { text: themeList() }
      }
      if (key === 'off' || key === 'none') {
        return { text: await apply($, undefined) }
      }
      if (key === 'random' || key === 'next') {
        const at = THEMES.findIndex(theme => theme.id === current)
        const pool = THEMES.filter(theme => theme.id !== current)
        const theme =
          key === 'next' ? THEMES[(at + 1) % THEMES.length] : pool[Math.floor(Math.random() * pool.length)]

        return { text: theme === undefined ? 'No themes to pick from.' : await apply($, theme) }
      }

      const theme = themeNamed(words)

      if (theme === undefined) {
        return { text: `No theme named "${words}". /${COMMAND} list names all ${THEMES.length}.` }
      }

      return { text: await apply($, theme) }
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
    const follows = theme.build.length > 0
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
