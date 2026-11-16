# Claude Code Themes

Themes for the **Claude Code desktop app**: custom colors, and animated backdrops that play behind your conversation. Each theme is a small plugin you can install in one step, and this repository is also a kit for making your own.

## Themes

| Theme | What it is |
| --- | --- |
| [**Beacon Cove**](themes/beacon-cove) | An animated pixel-art lighthouse that follows your clock: night, dawn, day and dusk, with a moving sun and moon, a sweeping beam, drifting clouds, a boat and fireflies. |
| [**Hearth**](themes/hearth) | Warm espresso and cream surfaces, terracotta accents, and a slow dusk with embers drifting up. Light and dark. |

![Beacon Cove at 2:00, 6:24, 12:00 and 18:06](docs/previews/beacon-cove.png)

*Beacon Cove's backdrop at four hours of the day. These previews show the backdrop alone, not the app.*

![Hearth](docs/previews/hearth.png)

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
