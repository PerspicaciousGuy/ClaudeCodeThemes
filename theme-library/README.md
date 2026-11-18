# theme-library

Every theme in [ClaudeCodeThemes](../README.md) in one plugin, with a switcher.

Install it once, then change themes whenever you like. Single-theme plugins can't do that: a session has one theme, so installing several makes them overwrite each other.

## Use

- `/ccthemes` opens a card with every theme, grouped by the kind of window it is made for. **Apply** keeps a theme; **Preview** shows it for 20 seconds and then goes back; **No theme** clears it.
- `/ccthemes <name>` applies a theme, for example `/ccthemes retro-grid`. A name can be typed as the id or the title, in any case, or as a unique start of the id.
- `/ccthemes list` names every theme, `/ccthemes random` and `/ccthemes next` pick one for you, `/ccthemes off` clears it.

The theme you apply is kept for later sessions, in every project. In a new session no theme shows until you send a first message.

## Notes

- Install this **or** single themes, not both: two plugins setting a theme overwrite each other.
- Beacon Cove follows your clock, so the library redraws its sky every ten minutes.
- The scenes and the list of themes in `hooks/` are generated from `themes/` by `node scripts/library.mjs pack`; don't edit `hooks/registry.js` or `hooks/scenes/` by hand.
- Everything is stored locally: your choice is the one value this plugin keeps. It sends nothing anywhere.

## License

MIT, like the rest of the repository.
