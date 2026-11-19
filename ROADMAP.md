# Roadmap

Where the library is going: from 26 themes to about 60, in batches of four to six, plus work on the tooling around them. Want to build one? Pick an unclaimed theme, open an issue to say so, and follow [CONTRIBUTING.md](CONTRIBUTING.md).

Each batch ends the same way: previews rendered and looked at, `node scripts/library.mjs all` passing, `claude plugin validate` passing, then pushed.

## Theme batches

| Batch | Focus | Themes |
| --- | --- | --- |
| **A** *(done)* | Twins and clock | `moonlit-shore` (pixel, night), `rooftop-garden-night` (pixel, string lights), `desert-night` (stars, campfire), `snow-cabin-day` (light winter noon), `fog-valley-night` (moonlit fog), `meadow-hours` (follows your clock) |
| **B** | Seasons | `autumn-forest` (falling leaves), `spring-rain` (light), `summer-fireflies` (dusk meadow), `harvest-moon` |
| **C** *(done)* | Pixel art 2 | `night-market`, `snow-station`, `pixel-cafe` (rainy window, warm), `haunted-manor`, `forest-trail` |
| **D** *(done)* | Vector scenes 2 | `greenhouse-rain`, `koi-pond` (top-down), `bamboo-grove` (misty, light), `lantern-festival`, `cloud-sea`, `coral-reef` |
| **E** | Abstract and tech | `blueprint`, `circuit-board` (pulses along traces), `oscilloscope` (phosphor waves), `constellations` (a star map that draws itself), `ink-wash` (sumi-e, light) |
| **F** *(done)* | Accessibility and still | `high-contrast-dark` and `-light`, `colorblind-safe-dark` and `-light`, and colors-only themes with no backdrop: `graphite`, `paperback`, `forest-floor`, `midnight-ink` |
| **G** | Seasonal events | `winter-lights`, `new-year-fireworks`, a Halloween variant of `haunted-manor` |

## Tooling

1. **Audit.** Catch a CSS animation that replaces an element's own `opacity` attribute (a glow turns solid). `check` now flags it. *Done.*
2. **Picker.** Filters (dark, light, pixel, vector, clock), search, paging, and a day and night mode that swaps a theme for its twin by your clock. *Done.* Following the app's own light or dark setting isn't possible: plugins can't read it.
3. **Automation.** A GitHub Action that runs `check`, confirms the generated files are up to date and validates the plugins on pull requests, a PR template and a "theme idea" issue template. *Done. CI validates only the marketplace file: a runner with no login rejects the plugins' `modules` hooks, so those are validated locally.*
4. **Presentation.** Animated previews in the README and the gallery (SVG, which GitHub plays inside an image). *Done*, and the gallery is live on GitHub Pages (served from `main` and `/docs`). Real in-app screenshots are in the README (six so far, in `docs/screenshots/`); more can be added the same way.
5. **Distribution.** A [changelog](CHANGELOG.md) *(done)*, release tags (v0.1.0 to v0.3.0, matching `theme-library`'s versions) and a listing in the BuildWithClaude directory, which takes a pull request that adds an entry to its `web-ui/lib/themes.json`.

## Order

Tooling 1, then batch A (it reuses existing art), then batch F, then tooling 2 before 40 themes, then batches C, D, B, E and G with tooling 3 to 5 in between.
