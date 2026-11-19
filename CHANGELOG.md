# Changelog

What changed in the library, by release. Releases follow the `theme-library` plugin's version, since that is the plugin most people install; each single-theme plugin has its own version in its `plugin.json`, which only changes when that theme does.

Update this file when you add themes or change the tools, and bump `theme-library`'s version in `theme-library/.claude-plugin/plugin.json` when its behavior changes.

## Unreleased (63 themes)

**New themes (6), vector scenes (batch D)**
- `greenhouse-rain`, `koi-pond` (seen from above), `bamboo-grove` (light, misty), `lantern-festival`, `cloud-sea` (light) and `coral-reef`.

**New themes (4), seasons (batch B)**
- `autumn-forest`, `spring-rain` (light), `summer-fireflies` and `harvest-moon`.

**New themes (5), abstract and technical (batch E)**
- `blueprint`, `circuit-board`, `oscilloscope`, `constellations` and `ink-wash` (light). `blueprint` and `constellations` draw themselves in line.

**New themes (3), seasonal events (batch G)**
- `winter-lights`, `new-year-fireworks` and `halloween-night`, a vector companion to `haunted-manor`.

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
