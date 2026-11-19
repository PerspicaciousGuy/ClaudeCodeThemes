# Changelog

What changed in the library, by release. Releases follow the `theme-library` plugin's version, since that is the plugin most people install; each single-theme plugin has its own version in its `plugin.json`, which only changes when that theme does.

Update this file when you add themes or change the tools, and bump `theme-library`'s version in `theme-library/.claude-plugin/plugin.json` when its behavior changes.

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
