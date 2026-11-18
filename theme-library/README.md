# theme-library

Every theme in [ClaudeCodeThemes](../README.md) in one plugin, with a switcher.

Install it once, then change themes whenever you like. Single-theme plugins can't do that: a session has one theme, so installing several makes them overwrite each other.

## Use

`/ccthemes` opens a card. It shows six themes a page, each with **Apply** (keeps it), **Preview** (20 seconds, then it goes back) and a one-line look at what it is. Along the top:

- **Filters**: All, Dark, Light, Pixel, Vector and Clock (themes that follow your computer's clock). Dark and Light also include the themes that follow the app's own mode.
- **Previous / Next** to page through a filter.
- **Day and night**: see below.
- **No theme** clears it; **Close** shuts the card.

Everything on the card also works from the prompt:

| Command | What it does |
| --- | --- |
| `/ccthemes <name>` | Applies a theme: its id or title in any case, or a unique start of the id (`/ccthemes neon`) |
| `/ccthemes dark`, `light`, `pixel`, `vector`, `clock` | Opens the card with that filter on |
| `/ccthemes find <words>` | Opens the card with a search: every word must be in a theme's name, tags or description (`find beach`, `find pixel night`) |
| `/ccthemes <words>` | If the words aren't a theme's name, they are searched the same way |
| `/ccthemes list [filter or words]` | Names the themes in the transcript, with their twins |
| `/ccthemes random [filter]`, `next [filter]`, `prev [filter]` | Applies a random, the next or the previous theme, optionally within a filter (`/ccthemes random pixel`) |
| `/ccthemes auto [on or off]` | Turns day and night on or off |
| `/ccthemes off` | Clears the theme |

The theme you apply, and whether day and night is on, are kept for later sessions, in every project. In a new session no theme shows until you send a first message.

## Day and night

Many themes come as a pair: a light one for the day and a dark one for the night (`sunny-shore` and `moonlit-shore`, `desert-noon` and `desert-night`, and so on). `/ccthemes list` shows each theme's twin.

With **day and night** on, a theme that has a twin shows its light half from 7:00 to 19:00 by your computer's clock and its dark half the rest of the time. The library looks at the clock every ten minutes and switches when it needs to. A theme with no twin stays as it is. Your choice stays the one you applied; day and night only picks which half to draw.

It follows the clock, not the app's light or dark setting, because a plugin can't see that setting.

## Notes

- Install this **or** single themes, not both: two plugins setting a theme overwrite each other.
- Beacon Cove and Meadow Hours follow your clock, so the library redraws their skies every ten minutes.
- The scenes and the list of themes in `hooks/` are generated from `themes/` by `node scripts/library.mjs pack`; don't edit `hooks/registry.js` or `hooks/scenes/` by hand. Tags come from each theme's `keywords` in `plugin.json`, and twins from the "twin of" line in its README.
- Everything is stored locally: your choice and the day and night setting are the only values this plugin keeps. It sends nothing anywhere.

## License

MIT, like the rest of the repository.
