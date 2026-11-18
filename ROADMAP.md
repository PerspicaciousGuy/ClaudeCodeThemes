# Roadmap

Where the library is going: from 26 themes to about 60, in batches of four to six, plus work on the tooling around them. Want to build one? Pick an unclaimed theme, open an issue to say so, and follow [CONTRIBUTING.md](CONTRIBUTING.md).

Each batch ends the same way: previews rendered and looked at, `node scripts/library.mjs all` passing, `claude plugin validate` passing, then pushed.

## Theme batches

| Batch | Focus | Themes |
| --- | --- | --- |
| **A** *(done)* | Twins and clock | `moonlit-shore` (pixel, night), `rooftop-garden-night` (pixel, string lights), `desert-night` (stars, campfire), `snow-cabin-day` (light winter noon), `fog-valley-night` (moonlit fog), `meadow-hours` (follows your clock) |
| **B** | Seasons | `autumn-forest` (falling leaves), `spring-rain` (light), `summer-fireflies` (dusk meadow), `harvest-moon` |
| **C** | Pixel art 2 | `night-market`, `snow-station`, `pixel-cafe` (rainy window, warm), `haunted-manor`, `forest-trail` |
| **D** | Vector scenes 2 | `greenhouse-rain`, `koi-pond` (top-down), `bamboo-grove` (misty, light), `lantern-festival`, `cloud-sea`, `coral-reef` |
| **E** | Abstract and tech | `blueprint`, `circuit-board` (pulses along traces), `oscilloscope` (phosphor waves), `constellations` (a star map that draws itself), `ink-wash` (sumi-e, light) |
| **F** | Accessibility and still | `high-contrast-dark` and `-light`, `colorblind-safe-dark` and `-light`, and colors-only themes with no backdrop: `graphite`, `paperback`, `forest-floor`, `midnight-ink` |
| **G** | Seasonal events | `winter-lights`, `new-year-fireworks`, a Halloween variant of `haunted-manor` |

## Tooling

1. **Audit.** Catch a CSS animation that replaces an element's own `opacity` attribute (a glow turns solid). `check` now flags it. *Done.*
2. **Picker.** Filters (`/ccthemes dark`, `light`, `pixel`), search, and an option to follow the system's light or dark mode by switching between a theme and its twin. Needed before the library passes about 40 themes.
3. **Automation.** A GitHub Action that runs `check` and plugin validation on pull requests, a PR template and a "theme idea" issue template.
4. **Presentation.** Animated previews in the README, real in-app screenshots, the gallery on GitHub Pages.
5. **Distribution.** A changelog and release tags, and a listing in the BuildWithClaude directory.

## Order

Tooling 1, then batch A (it reuses existing art), then batch F, then tooling 2 before 40 themes, then batches C, D, B, E and G with tooling 3 to 5 in between.
