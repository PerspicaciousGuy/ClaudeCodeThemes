# Claude Code Themes

Themes for the **Claude Code desktop app**: custom colors, and animated backdrops that play behind your conversation. Each theme is a small plugin you can install in one step, and this repository is also a kit for making your own.

## Themes

<!-- previews:start -->
|   |   |   |
| --- | --- | --- |
[<img src="docs/previews/abyss-lantern.png" width="300" alt="abyss-lantern"><br>**abyss-lantern**](themes/abyss-lantern) | [<img src="docs/previews/aurora-field.png" width="300" alt="aurora-field"><br>**aurora-field**](themes/aurora-field) | [<img src="docs/previews/beacon-cove.png" width="300" alt="beacon-cove"><br>**beacon-cove**](themes/beacon-cove)
[<img src="docs/previews/hearth.png" width="300" alt="hearth"><br>**hearth**](themes/hearth) | [<img src="docs/previews/low-orbit.png" width="300" alt="low-orbit"><br>**low-orbit**](themes/low-orbit) | [<img src="docs/previews/neon-rain.png" width="300" alt="neon-rain"><br>**neon-rain**](themes/neon-rain)
[<img src="docs/previews/rainy-window.png" width="300" alt="rainy-window"><br>**rainy-window**](themes/rainy-window) | [<img src="docs/previews/sakura-drift.png" width="300" alt="sakura-drift"><br>**sakura-drift**](themes/sakura-drift) |
<!-- previews:end -->

*Previews show each theme's backdrop alone, not the app. [`docs/gallery.html`](docs/gallery.html) shows every backdrop animated: open it in a browser after cloning.*

<!-- themes:start -->
| Theme | What it is |
| --- | --- |
| [**abyss-lantern**](themes/abyss-lantern) | The deep sea: sun shafts fading into the dark, glowing jellyfish, swaying kelp, bubbles and a passing school of fish. Dark. |
| [**aurora-field**](themes/aurora-field) | Northern lights over a frozen lake ringed by pines, with twinkling stars and the odd shooting star. Dark. |
| [**beacon-cove**](themes/beacon-cove) | An animated pixel-art theme that follows your clock: a lighthouse cape and sea from night through dawn, day and dusk, with a moving sun and moon, drifting clouds, a small boat and fireflies. |
| [**hearth**](themes/hearth) | A warm theme: espresso and cream surfaces, terracotta accents, and a slow dusk backdrop with embers drifting up. |
| [**low-orbit**](themes/low-orbit) | A pixel-art view of space: a ringed gas giant, a small moon, a nebula, parallax stars, a passing ship and shooting stars. Dark. |
| [**neon-rain**](themes/neon-rain) | A pixel-art city at night in the rain: towers with lit windows, buzzing neon signs, a wet street and a passing car. Dark. |
| [**rainy-window**](themes/rainy-window) | A night city seen through a rain-streaked window: soft bokeh lights, drops sliding down the glass, a warm lamp and a steaming mug. Dark. |
| [**sakura-drift**](themes/sakura-drift) | A spring dusk of pastel sky, misty hills and a blossoming tree, with petals drifting down. Light and dark. |
<!-- themes:end -->

## Install

You need the Claude Code desktop app. Themes draw there (and in the mobile app); the terminal and editor extensions don't draw themes.

### In the desktop app

1. Click **+** next to the prompt box, then **Plugins**.
2. Choose **Add marketplace** and enter `PerspicaciousGuy/ClaudeCodeThemes`.
3. Choose **Add plugin** and pick a theme.

### From a terminal

At the prompt of a terminal Claude Code session:

```
/plugin install beacon-cove --marketplace PerspicaciousGuy/ClaudeCodeThemes
```

Or from a shell:

```bash
claude plugin install beacon-cove --marketplace PerspicaciousGuy/ClaudeCodeThemes
```

Replace `beacon-cove` with `hearth`, or any other theme's name from the table above. The first time, Claude Code asks `Add marketplace?`: answer `y`, then choose a scope (the user scope applies to every session). A theme installed from a terminal at the user scope also loads in your desktop app's local sessions.

The theme applies at the start of a session. If it doesn't show, start a new session.

### Using one theme at a time

A session has one theme, so if two are installed they overwrite each other. To switch, disable the one you don't want and enable the one you do:

```bash
claude plugin disable hearth
claude plugin enable beacon-cove
```

To remove a theme: `claude plugin uninstall <theme>`.

## Good to know

- **Light and dark.** Hearth follows your app's light or dark mode. Beacon Cove is a dark theme and keeps the app dark.
- **Reduced motion.** Animated backdrops stop moving when your system asks for reduced motion.
- **Permission prompts** always keep the app's own look.
- **Beacon Cove and your clock.** It reads your computer's local time and redraws its sky every ten minutes.

## Make your own

Start from [`template/`](template), a minimal colors-only theme, and read [CONTRIBUTING.md](CONTRIBUTING.md) for how a theme works, the quality bar, how to test one locally, and how to add it here.

## License

[MIT](LICENSE). Each theme's art is original to this repository.
