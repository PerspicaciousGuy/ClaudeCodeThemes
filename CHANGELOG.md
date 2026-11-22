# Changelog

What changed in the library, by release. Releases follow the `theme-library` plugin's version, since that is the plugin most people install; each single-theme plugin has its own version in its `plugin.json`, which only changes when that theme does.

Update this file when you add themes or change the tools, and bump `theme-library`'s version in `theme-library/.claude-plugin/plugin.json` when its behavior changes.

## 0.6.3: 2026-11-22 (94 themes)

**New themes (3) in `theme-library`**: more new scenes
- `station-window` (dark): a bolted space-station window over a sunlit Earth with drifting cloud bands, a sunrise on the limb, a passing satellite and a console strip of blinking lights.
- `forge-glow` (dark): a blacksmith forge with a breathing furnace, an anvil with a glowing bar, hanging tools, sparks and rising embers.
- `rice-terraces` (light): a misty morning over stepped rice paddies, with drifting mist, a small hut and egrets in flight.

**New themes (3) in `theme-library`**: new scenes
- `chalk-observatory` (dark): a slate board with a chalk observatory, a sweeping telescope, a crescent moon, twinkling stars, a constellation that draws itself and a shooting star.
- `windfarm-dusk` (light): a lilac and peach evening, plum hills and a field of turbines turning at different speeds, with clouds and birds.
- `glow-grove` (dark): a night forest lit by giant glowing mushrooms, with fog, rising spores and fireflies.

**New themes (4) in `theme-library`**: a woodcut print style
- `woodcut-cabin` (light): a winter print in two inks, a sky of cut lines, hatched hills, black pines and a log cabin with one orange window, with smoke and snow in motion.
- `woodcut-cabin-night` (dark): its night twin, on night-blue stock with a cream moon and stars.
- `woodcut-harbor` (light): wavy cut-line sea that drifts, a striped lighthouse with a pulsing orange lamp, a sailboat and gulls.
- `woodcut-rain-city` (dark): black towers with flickering cream and orange windows under rain and a hatched moon.

**theme-library**
- Now holds 89 themes, up from 79. The 5 live themes are still left out of it.

## 0.6.2: 2026-11-19 (84 themes)

**Changed in `theme-library`**
- Six new widget looks, so every scene theme now has one of its own: `reef` (coral-rimmed glass pebbles), `dune` (adobe tiles), `ice` (cut crystals), `festive` (gold starbursts), `porthole` (bolted brass) and `leaf` (green leaves with a stem). They go to the 18 themes that had only a generic look, and `/ccthemes widgets look <name>` takes them like the rest (19 looks in all).

## 0.6.1: 2026-11-19 (84 themes)

**Changed in `theme-library`**
- The picker card has `Widgets` and `Critter` buttons beside `Day and night`, so the side widgets and the critter turn on and off from the card. The choice is kept, like the slash commands.

## 0.6.0: 2026-11-19 (84 themes)

**New theme (1) in `theme-library`**
- `spooky-hollow` (dark): a haunted graveyard under a full moon, with a dead tree, a swinging green lantern and a blinking owl, tilted tombstones, three drifting ghosts and wisps, bats, a crooked house with a flickering window and a glowing pumpkin.

**Widgets: `/ccthemes widgets`** (off by default)
- Four widgets laid over any theme with a scene: context window fill, the 5-hour and 7-day limits used, the time until each limit resets, and the session cost.
- Thirteen looks, each with its own shape, matched to the theme: paper notes, neon rings, pixel tiles, blueprint frames, deco gold frames, frosted glass, wood planks, ink scrolls, riso tickets, terminal windows, amber panels, pastel stickers and spooky tombstones.
- `/ccthemes widgets left`, `right` or `both` moves them to either edge, or one column on each; `/ccthemes widgets look <name>` forces one look on every theme.
- They only read figures the app already has, so they cost no usage.

**Mascot: `/ccthemes mascot`** (off by default)
- A small orange pixel critter, in a tile beside the widgets (`tile`), strolling along the bottom of the scene (`walk`), or both (`on`). It rests, works at a laptop while Claude does, hops when a turn ends, looks worried when context is nearly full and naps when a limit is hit. It wears a hat that suits the theme, and carries a lantern in the spooky themes.

**Fixes**
- Themes no longer pin the app's "no client draws themes yet" message as a status line, and clear any left by an earlier version. This was in every theme and the template.

**theme-library**
- Now holds 79 themes, up from 78. The 5 live themes are still left out of it.
- Single-theme plugins are at 0.1.1 for the status-line fix.

## 0.5.0: 2026-11-19 (83 themes)

**New themes (3) in `theme-library`**
- `pirate-cove` (light) and `pirate-cove-night`, a day and night pair: a pirate galleon with a waving skull flag, gulls or a full moon, a far ship and a treasure chest on a palm beach or islet.
- `origami-bay` (light): a bay of folded paper, with layered paper waves that drift, an origami sailboat, flying paper cranes, a paper sun and clouds.

**theme-library**
- Now holds 78 themes, up from 75. The 5 live themes are still left out of it.

## 0.4.0: 2026-11-19 (80 themes)

**New themes (30) in `theme-library`**
- Seasons (batch B): `autumn-forest`, `spring-rain` (light), `summer-fireflies` and `harvest-moon`.
- Vector scenes (batch D): `greenhouse-rain`, `koi-pond` (seen from above), `bamboo-grove` (light, misty), `lantern-festival`, `cloud-sea` (light) and `coral-reef`.
- Abstract and technical (batch E): `blueprint`, `circuit-board`, `oscilloscope`, `constellations` and `ink-wash` (light). `blueprint` and `constellations` draw themselves in line.
- Seasonal events (batch G): `winter-lights`, `new-year-fireworks` and `halloween-night`, a vector companion to `haunted-manor`.
- Art styles (batch H): `ukiyo-e-wave` (light), `stained-glass`, `risograph` (light), `art-deco`, `isometric-room` and `cassette-futurism`.
- Calm variants (batch I): `oscilloscope-calm`, `circuit-board-calm`, `new-year-fireworks-calm`, `coral-reef-calm`, `code-rain-calm` and `neon-rain-calm`. The same scenes slowed to about 40% speed and softened under a veil, with heavier frosted panels, for when motion is distracting.

**New live themes (5), each its own plugin**
Live themes change with your session, so they are separate plugins listed in the marketplace and are not part of the `theme-library` picker. Each has a command that puts its look on, and an argument to try a state by hand.
- `campfire` (`/fire`): the fire is your 5-hour usage window and the woodpile is your context window; sparks rise faster while Claude works.
- `tide` (`/tide`): the 5-hour window as a tide that draws back from the sand.
- `weekly-sky` (`/weeksky`): the 7-day window as the sun crossing a day, with night when the limit is reached.
- `weather-mood` (`/weather`): clear and calm while Claude is idle, rain while it works (harder as the context window fills) and lightning when a tool call fails.
- `real-sky` (`/realsky`): the sun by your clock and the moon in its real phase for today's date.

**theme-library**
- Now holds 75 themes. Live themes are left out of it.

**Tooling**
- A theme tagged `live` is skipped when `theme-library` is built and checked, but still gets a preview, a marketplace entry and a place in the gallery.
- The live themes do not pin a status line, and clear any that an earlier version left.

## 0.3.0: 2026-11-19 (45 themes)

**New themes (13)**
- Accessibility and colors only (batch F): `high-contrast-dark` and `high-contrast-light`, `colorblind-safe-dark` and `colorblind-safe-light`, `graphite`, `paperback`, `midnight-ink`, `forest-floor`. `paperback` and `midnight-ink` are twins, as are each light and dark pair.
- Pixel art (batch C): `night-market`, `snow-station`, `pixel-cafe`, `haunted-manor` and `forest-trail`.

**theme-library**
- Themes with no backdrop (colors only) are supported, with a new **Still** filter (`/ccthemes still`).

**Tooling and presentation**
- A check on every pull request and push: every theme has its files, preview and marketplace entry, scenes stay under the size limit and have no script or image, animation has a reduced-motion rule, colors will paint, and the generated files are up to date. The marketplace file is validated too.
- A pull request template and a "theme idea" issue form.
- Animated SVG previews in the README and the gallery, which is now on GitHub Pages. Each scene is its own image, so scenes no longer restyle each other.
- Colors-only themes get a generated palette card as their preview.
- Real screenshots of the desktop app in the README.

## 0.2.0: 2026-11-18 (32 themes)

**New themes**
- Twins and clock (batch A): `moonlit-shore`, `rooftop-garden-night`, `desert-night`, `snow-cabin-day`, `fog-valley-night` and `meadow-hours`, which follows your clock.
- Pixel art: `arcade-hall`, `torch-dungeon`, `sunny-shore` and `rooftop-garden`.
- Scenes: `night-train`, `desert-noon`, `fog-valley`, `snow-cabin`, `tide-pool` and `reading-room`.

**theme-library**
- The picker filters by dark, light, pixel, vector and clock, searches, and pages.
- **Day and night:** a theme with a twin shows its light half from 7:00 to 19:00 by your clock and its dark half after.

**Tooling**
- `check` flags a CSS animation that replaces an element's own `opacity` attribute, which made glows turn solid; eight scenes were fixed.
- ROADMAP.md.

## 0.1.0: 2026-11-18 (16 themes)

- `theme-library`: every theme in one plugin, with `/ccthemes` to switch between them, preview and apply.
- Eight print, paper and terminal themes and six animated scenes, added alongside it.
- `scripts/library.mjs`: previews, gallery, pack, index and check.

## Before the library: 2026-11-16

- The first two themes, `beacon-cove` and `hearth`, a theme template, and install and contributing guides.
