# Making and adding a theme

A theme is a small Claude Code plugin ("a mod") that sends the app a look once, when a session starts. It's data, not a restyle of the app: **colors** (about 100 per mode, built from a handful of seeds) and an optional **backdrop** (a color, gradient, image, or an animated SVG scene).

What a theme can't change: fonts, spacing, layout, icons, or permission prompts (they always keep the app's own look). Themes draw in the desktop and mobile apps only.

## Layout

```
themes/<name>/
  .claude-plugin/plugin.json     name, version, description, license
  hooks/hooks.json               { "modules": ["./register.ts"] }
  hooks/register.ts              the theme (.tsx if it draws a backdrop)
  hooks/make-colors.js           copied from template/, left as it is
  hooks/make-colors.d.ts         copied from template/
  hooks/scene.js                 optional: builds an SVG backdrop
  tsconfig.json                  copied from template/
  README.md                      optional: a paragraph about the theme
docs/previews/<name>.png         a preview image of the backdrop
```

Then list the theme in [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json):

```json
{ "name": "my-theme", "source": "./themes/my-theme", "description": "One line." }
```

## Start

1. Copy `template/` to `themes/<your-theme>/`.
2. Set `name` in `.claude-plugin/plugin.json`: lowercase, letters, digits and hyphens. It's what people type to install it.
3. Edit the colors in `hooks/register.ts`.

### Colors

Don't write color names by hand: the app uses about 100 design-system names, and a wrong one paints nothing and says nothing. Call `makeColors` (already set up in the template) with:

- **Anchors** per mode: `surface-0` (the page) and `text-primary` are required; `surface-1` to `surface-3` and `text-secondary`, `text-muted` fill in the rest. In both modes `surface-0` is the darkest surface and each later one is as light or lighter.
- **Roles**: `accent`, `danger`, `success`, `warning`, `pro`, one color each. Code is colored from these.
- Optional `git` colors, `codeTheme` (such as `{ dark: 'nord' }`) and `contrast: 'more'`.
- `only: 'dark'` (or `'light'`) for a look made for one mode.

Every color is a six-digit hex. `makeColors` lists contrast issues in `problems`.

### A backdrop

- **Still**: `backdrop: { color }`, `{ gradient }`, `{ vector }` or `{ image }` (a JPEG or PNG in the theme's folder, at most 1 MiB and 4096 px a side). No hook needed.
- **Animated**: `backdrop: { scene: '<id>', glass: { blur, opacity } }` plus an `ui.render` hook on `{ component: 'Backdrop' }` that returns an `<Svg>`. [`themes/hearth`](themes/hearth) and [`themes/beacon-cove`](themes/beacon-cove) are complete examples. Keep the SVG under 131,072 characters, animate with CSS inside its own `<style>`, and give it a `viewBox` and `preserveAspectRatio="xMidYMid slice"` so it fills any screen. It runs no script and loads nothing.

The hook should only draw its own scene: check `e.props.scene` against your id and `return next(e)` otherwise.

## The quality bar

A theme should meet these before it's added:

- [ ] **No line starts `Desktop won't paint`** in `problems`. If one does, the desktop app ignores the whole theme. Fix it; the other contrast notes are under the design system's own bar and still paint, so an empty list isn't the goal.
- [ ] **Words come first.** `text-primary` at 7:1 or better on each surface and `text-muted` at 4.5:1 on `surface-0` and `surface-2`.
- [ ] **Tinted grays.** Take every surface from the theme's hue, and keep neighbors a few percent of lightness apart.
- [ ] **Keep meaning.** `danger` stays a red, `success` a green, `warning` an amber, tuned toward the theme.
- [ ] **Both modes**, unless the idea can't: dark should be a second version of the idea, not an inversion. A single-mode theme uses `only`.
- [ ] **Original art.** Take the spirit of a place or an era, never a company's logo, artwork or font, or someone else's artwork.
- [ ] **Motion respects the user.** An animated backdrop stops under `@media (prefers-reduced-motion: reduce)`.
- [ ] **Quiet where the text is.** Keep the subject away from the middle (where the words sit) and the bottom (where the message box sits); use `glass` to keep text readable over the scene.
- [ ] **Previewed** in both light and dark mode (where it has both), with a long code block and at a larger text size.

## Test it locally

Run Claude Code with the theme's folder loaded, without installing it:

```bash
claude --plugin-dir ./themes/my-theme
```

Or put the folder in `CLAUDE_CODE_PLUGIN_DIRS` for sessions the desktop app starts. The folder is watched, so saving a file reloads it.

Check the files:

```bash
claude plugin validate ./themes/my-theme
claude plugin validate .
```

The validator may warn `no component is named Backdrop, so it never runs`. That check is for a terminal; the backdrop is drawn by the desktop and mobile apps, so look for the scene itself.

## Add it

The library has a small script that does the bookkeeping. It needs Node 18+ and, for previews, Chrome (set `CHROME` to its path if it isn't found).

1. Put your theme in `themes/<name>/`. If it draws a scene, export `buildScene()` from `hooks/scene.js` (a function returning the SVG string) and import it from `register.tsx`, as the existing themes do: the preview and gallery tools call it.
2. Render the preview: `node scripts/library.mjs previews <name>` (writes `docs/previews/<name>.png`). Look at it.
3. Rebuild everything and run the checks: `node scripts/library.mjs all`. That regenerates `theme-library/` (the all-in-one plugin: it copies your `hooks/scene.js` and reads your colors and glass from `register.tsx`), the marketplace file, the gallery and the README tables.
4. Validate: `claude plugin validate ./themes/<name>` and `claude plugin validate .`.
5. Open a pull request. Say what the idea is and which of the checks above you did.

`check` fails if a theme is missing a required file or its preview, isn't listed in `marketplace.json`, has a scene over 131,072 characters, uses a script, image or external link in a scene, or animates without a reduced-motion rule.

## Ideas wanted

The aim is a big, varied library. Themes that aren't here yet: a pixel-art night market, a pixel-art train station in the snow, a harbor at dawn, a night market, a greenhouse in the rain, a desert at night, a space station window, a high-contrast theme, a colorblind-safe one. Light-mode themes and still-image themes are welcome too.

## Notes

`make-colors.js` is the color helper from Claude Code's plugin tooling. Keep the copy in your theme as it is. Claude Code adds a `.claude-plugin/types/` folder next to `plugin.json` while it hot-reloads a theme; don't commit it.
