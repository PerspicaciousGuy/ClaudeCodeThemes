## What is this?

<!-- The idea in a sentence or two: the place or look, light or dark, still or animated. -->

## Checks

- [ ] `node scripts/library.mjs all` passes (it regenerates `theme-library/`, the marketplace, the gallery and the README tables: commit what it changes)
- [ ] `claude plugin validate .` and `claude plugin validate ./themes/<name>` pass
- [ ] The preview in `docs/previews/<name>.png` is rendered and I looked at it
- [ ] No line starts `Desktop won't paint` in the theme's `problems`
- [ ] Text is 7:1 or better on every surface; muted text is 4.5:1 on `surface-0` and `surface-2`
- [ ] Original art: nothing from a company's logo, artwork or font, or someone else's artwork
- [ ] An animated backdrop stops under `prefers-reduced-motion`, and the subject stays out of the middle and the bottom
- [ ] Looked at in the desktop app, in each mode the theme has

See [CONTRIBUTING.md](../CONTRIBUTING.md) for what each of these means.
