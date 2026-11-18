#!/usr/bin/env node
// Tools for maintaining the theme library. Needs Node 18+.
//
//   node scripts/library.mjs previews [theme ...]   render docs/previews/<theme>.png with Chrome
//   node scripts/library.mjs gallery                build docs/gallery.html (every scene, animated)
//   node scripts/library.mjs index                  rebuild marketplace.json and the README table
//   node scripts/library.mjs check                  check every theme has what the library needs
//   node scripts/library.mjs all                    index, gallery, then check
//
// Previews and the gallery import each theme's hooks/scene.js and call
// buildScene(), so a theme that draws a scene must export it from there.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const THEMES = join(ROOT, 'themes')
const MAX_SCENE = 131072

const ids = () =>
  readdirSync(THEMES, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort()

const manifest = id => JSON.parse(readFileSync(join(THEMES, id, '.claude-plugin', 'plugin.json'), 'utf8'))

async function scene(id, hour) {
  const file = join(THEMES, id, 'hooks', 'scene.js')

  if (!existsSync(file)) {
    return null
  }

  return (await import(pathToFileURL(file).href)).buildScene(hour)
}

function chrome() {
  const found = [
    process.env.CHROME,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find(p => p && existsSync(p))

  if (!found) {
    throw new Error('Chrome not found: set CHROME to its path')
  }

  return found
}

function fit(svg, w, h) {
  return svg.replace('<svg ', `<svg style="width:${w}px;height:${h}px;display:block" `)
}

// ---------- previews ----------

async function previews(only) {
  const dir = mkdtempSync(join(tmpdir(), 'cct-'))

  for (const id of only.length ? only : ids()) {
    const svg = await scene(id, 12)

    if (!svg) {
      continue
    }

    const page = join(dir, `${id}.html`)

    writeFileSync(page, `<!doctype html><body style="margin:0;background:#000">${fit(svg, 1600, 900)}</body>`)
    execFileSync(chrome(), ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1600,900', '--virtual-time-budget=5000', `--screenshot=${join(ROOT, 'docs', 'previews', id + '.png')}`, pathToFileURL(page).href], { stdio: 'ignore' })
    console.log('preview', id)
  }
}

// ---------- gallery ----------

async function gallery() {
  let cards = ''

  for (const id of ids()) {
    const svg = await scene(id, new Date().getHours())

    if (!svg) {
      continue
    }

    const m = manifest(id)

    cards += `<figure><div class="art">${fit(svg, 800, 450).replace(/style="width:800px;height:450px;display:block"/, 'class="scene"')}</div><figcaption><strong>${id}</strong><span>${m.description.replace(/</g, '&lt;')}</span><code>/plugin install ${id} --marketplace PerspicaciousGuy/ClaudeCodeThemes</code></figcaption></figure>`
  }

  writeFileSync(
    join(ROOT, 'docs', 'gallery.html'),
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Claude Code Themes: gallery</title><style>
body{margin:0;background:#0d0d12;color:#e8e8f0;font:16px/1.5 system-ui,sans-serif}
header{padding:32px 24px 8px;max-width:1200px;margin:0 auto}h1{margin:0 0 4px;font-size:28px}p{margin:0;color:#a8a8bc}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,520px),1fr));gap:24px;padding:24px;max-width:1200px;margin:0 auto}
figure{margin:0;background:#15151d;border-radius:12px;overflow:hidden}
.art{aspect-ratio:16/9;overflow:hidden;background:#000}.scene{width:100%;height:100%;display:block}
figcaption{padding:14px 16px 16px;display:grid;gap:6px}figcaption span{color:#b4b4c8;font-size:14px}
code{font:12px ui-monospace,monospace;color:#9fb4ff;overflow-wrap:anywhere}
</style></head><body><header><h1>Claude Code Themes</h1><p>Every backdrop in the library, animated. The app also tints its panels to match; this page shows the scenes only.</p></header><main>${cards}</main></body></html>`,
  )
  console.log('gallery: docs/gallery.html')
}

// ---------- index ----------

function index() {
  const list = ids().map(id => ({ id, m: manifest(id) }))

  writeFileSync(
    join(ROOT, '.claude-plugin', 'marketplace.json'),
    JSON.stringify(
      {
        name: 'claude-code-themes',
        owner: { name: 'Perspicacious Guy' },
        metadata: { description: 'Themes for the Claude Code desktop app: colors and animated backdrops.' },
        plugins: list.map(({ id, m }) => ({ name: id, source: `./themes/${id}`, description: m.description })),
      },
      null,
      2,
    ) + '\n',
  )

  const rows = list.map(({ id, m }) => `| [**${id}**](themes/${id}) | ${m.description} |`).join('\n')
  const cells = list.map(({ id }) => `[<img src="docs/previews/${id}.png" width="300" alt="${id}"><br>**${id}**](themes/${id})`)
  const grid = []

  for (let i = 0; i < cells.length; i += 3) {
    grid.push(cells.slice(i, i + 3).join(' | ').concat(' |'.repeat(Math.max(0, i + 3 - cells.length))))
  }

  const file = join(ROOT, 'README.md')
  let text = readFileSync(file, 'utf8')

  const fill = (name, body) => {
    const start = `<!-- ${name}:start -->`
    const end = `<!-- ${name}:end -->`

    if (!text.includes(start) || !text.includes(end)) {
      throw new Error(`README.md needs the ${name}:start and ${name}:end markers`)
    }
    text = text.replace(new RegExp(`${start}[\\s\\S]*?${end}`), `${start}\n${body}\n${end}`)
  }

  fill('previews', `|   |   |   |\n| --- | --- | --- |\n${grid.join('\n')}`)
  fill('themes', `| Theme | What it is |\n| --- | --- |\n${rows}`)
  writeFileSync(file, text)
  console.log(`index: ${list.length} themes`)
}

// ---------- check ----------

async function check() {
  const problems = []
  const listed = new Set(JSON.parse(readFileSync(join(ROOT, '.claude-plugin', 'marketplace.json'), 'utf8')).plugins.map(p => p.name))

  for (const id of ids()) {
    const dir = join(THEMES, id)
    const need = ['.claude-plugin/plugin.json', 'hooks/hooks.json', 'hooks/register.tsx', 'hooks/make-colors.js', 'README.md']

    for (const f of need) {
      if (!existsSync(join(dir, f))) {
        problems.push(`${id}: missing ${f}`)
      }
    }
    if (!existsSync(join(dir, '.claude-plugin', 'plugin.json'))) {
      continue
    }

    const m = manifest(id)

    if (m.name !== id) {
      problems.push(`${id}: plugin.json name is "${m.name}", the folder is "${id}"`)
    }
    for (const k of ['version', 'description', 'license']) {
      if (!m[k]) {
        problems.push(`${id}: plugin.json has no ${k}`)
      }
    }
    if (!existsSync(join(ROOT, 'docs', 'previews', `${id}.png`))) {
      problems.push(`${id}: no docs/previews/${id}.png`)
    }
    if (!listed.has(id)) {
      problems.push(`${id}: not in marketplace.json (run: node scripts/library.mjs index)`)
    }

    // Colors: the desktop app ignores a whole theme if one of these lines appears.
    const reg = readFileSync(join(dir, 'hooks', 'register.tsx'), 'utf8')
    const from = reg.indexOf('makeColors(') + 11
    const to = reg.indexOf('\n})\n', from) + 2

    if (from > 10 && to > from) {
      try {
        const { makeColors } = await import(pathToFileURL(join(dir, 'hooks', 'make-colors.js')).href)
        const { problems: notes } = makeColors(new Function('return ' + reg.slice(from, to))())

        for (const n of notes.filter(n => n.startsWith("Desktop won't paint"))) {
          problems.push(`${id}: ${n}`)
        }
      } catch (e) {
        problems.push(`${id}: makeColors failed: ${e.message}`)
      }
    }

    const svg = await scene(id, 12)

    if (svg !== null) {
      if (svg.length > MAX_SCENE) {
        problems.push(`${id}: scene is ${svg.length} characters, the limit is ${MAX_SCENE}`)
      }
      if (/<script|<image|<foreignObject|href="http/i.test(svg)) {
        problems.push(`${id}: scene uses a script, an image, a foreignObject or an external link, which the app refuses`)
      }
      if (!/prefers-reduced-motion/.test(svg) && /animation/.test(svg)) {
        problems.push(`${id}: animated scene has no prefers-reduced-motion rule`)
      }
    }
  }
  for (const id of listed) {
    if (!existsSync(join(THEMES, id))) {
      problems.push(`${id}: listed in marketplace.json but has no folder`)
    }
  }
  if (problems.length) {
    console.error(problems.join('\n'))
    process.exitCode = 1
  } else {
    console.log(`check: ${ids().length} themes ok`)
  }
}

const [cmd, ...rest] = process.argv.slice(2)

if (cmd === 'previews') {
  await previews(rest)
} else if (cmd === 'gallery') {
  await gallery()
} else if (cmd === 'index') {
  index()
} else if (cmd === 'check') {
  await check()
} else if (cmd === 'all') {
  index()
  await gallery()
  await check()
} else {
  console.log('usage: node scripts/library.mjs previews [theme ...] | gallery | index | check | all')
}
