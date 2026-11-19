#!/usr/bin/env node
// Tools for maintaining the theme library. Needs Node 18+.
//
//   node scripts/library.mjs previews [theme ...]   render docs/previews/<theme>.png with Chrome
//   node scripts/library.mjs gallery                build docs/gallery.html (every scene, animated)
//   node scripts/library.mjs pack                   rebuild theme-library/ (every theme in one plugin)
//   node scripts/library.mjs index                  rebuild marketplace.json and the README table
//   node scripts/library.mjs check                  check every theme has what the library needs
//   node scripts/library.mjs all                    pack, index, gallery, then check
//
// Previews and the gallery import each theme's hooks/scene.js and call
// buildScene(), so a theme that draws a scene must export it from there.

import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
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

// A theme with no scene is shown as a card of its colors: each mode it has, with
// the surfaces, the three text tints, the five roles and a few lines of code.
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

function paletteCard(colors, mode) {
  const half = colors[mode]
  const a = half.gray.anchors
  const roles = { ...colors.roles, ...half.roles }
  const surfaces = ['surface-0', 'surface-1', 'surface-2', 'surface-3'].filter(k => a[k])
  const chips = Object.entries(roles).map(([n, c]) => `<span style="background:${c};color:${a['surface-0']}">${n}</span>`).join('')
  const git = half.git ? Object.entries(half.git).map(([n, c]) => `<span class="g" style="color:${c};border-color:${c}">${n}</span>`).join('') : ''

  return `<section style="background:${a['surface-0']};color:${a['text-primary']}">
<h2>${mode === 'dark' ? 'Dark' : 'Light'}</h2>
<div class="sw">${surfaces.map(k => `<i style="background:${a[k]}" title="${k}"></i>`).join('')}</div>
<p style="color:${a['text-primary']}">Primary text on the page</p>
<p style="color:${a['text-secondary']}">Secondary text for details</p>
<p style="color:${a['text-muted']}">Muted text for hints</p>
<div class="chips">${chips}</div>
<pre style="background:${a['surface-2']}"><b style="color:${roles.accent}">const</b> total = items.<b style="color:${roles.pro}">reduce</b>((n, x) =&gt; n + x.price, <b style="color:${roles.warning}">0</b>)
<b style="color:${roles.success}">// ok</b>   <b style="color:${roles.danger}">// failed</b></pre>
${git ? `<div class="chips">${git}</div>` : ''}
</section>`
}

function paletteHtml(id) {
  const { colors } = themeConfig(id)
  const modes = ['dark', 'light'].filter(m => colors[m] && (!colors.only || colors.only === m))

  return `<!doctype html><meta charset="utf-8"><body style="margin:0;background:#000;display:flex;width:1600px;height:900px;font:28px/1.5 system-ui,sans-serif">
<style>section{flex:1;min-width:0;padding:56px 56px;box-sizing:border-box}h2{margin:0 0 20px;font-size:22px;letter-spacing:.14em;text-transform:uppercase;opacity:.7}.sw{display:flex;height:96px;margin-bottom:28px;border-radius:10px;overflow:hidden;outline:1px solid #8884}.sw i{flex:1}p{margin:6px 0}.chips{display:flex;flex-wrap:wrap;gap:12px;margin:28px 0}.chips span{padding:6px 18px;border-radius:999px;font-size:22px;font-weight:600}.chips .g{background:none;border:2px solid;font-weight:500}pre{padding:22px 28px;border-radius:12px;font:22px/1.6 ui-monospace,Consolas,monospace;margin:0;white-space:pre-wrap;overflow-wrap:anywhere}</style>${modes.map(m => paletteCard(colors, m)).join('')}</body>`
}

async function previews(only) {
  const dir = mkdtempSync(join(tmpdir(), 'cct-'))

  for (const id of only.length ? only : ids()) {
    const svg = await scene(id, 12)
    const page = join(dir, `${id}.html`)

    if (svg) {
      writeFileSync(page, `<!doctype html><body style="margin:0;background:#000">${fit(svg, 1600, 900)}</body>`)
    } else {
      writeFileSync(page, paletteHtml(id))
    }
    execFileSync(chrome(), ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1600,900', '--virtual-time-budget=5000', `--screenshot=${join(ROOT, 'docs', 'previews', id + '.png')}`, pathToFileURL(page).href], { stdio: 'ignore' })
    console.log('preview', id)
  }
}

// ---------- gallery ----------

async function gallery() {
  let cards = ''

  for (const id of ids()) {
    const svg = await scene(id, new Date().getHours())
    const m = manifest(id)
    // A theme with no scene shows its preview image of its colors.
    const art = svg ? fit(svg, 800, 450).replace(/style="width:800px;height:450px;display:block"/, 'class="scene"') : `<img class="scene" src="previews/${id}.png" alt="${id}" loading="lazy">`

    cards += `<figure><div class="art">${art}</div><figcaption><strong>${id}</strong><span>${m.description.replace(/</g, '&lt;')}</span><code>/plugin install ${id} --marketplace PerspicaciousGuy/ClaudeCodeThemes</code></figcaption></figure>`
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

// ---------- pack ----------

// What a theme's register.tsx says: its makeColors definition and its glass.
function themeConfig(id) {
  const reg = readFileSync(join(THEMES, id, 'hooks', 'register.tsx'), 'utf8')
  const from = reg.indexOf('makeColors(') + 11
  const to = reg.indexOf('\n})\n', from) + 2
  const glass = /glass:\s*(\{[^}]*\})/.exec(reg)

  if (from < 11 || to < from) {
    throw new Error(`${id}: could not read makeColors(...) from register.tsx`)
  }

  // A theme with no scene has no glass either.
  return { colors: new Function('return ' + reg.slice(from, to))(), glass: glass ? new Function('return ' + glass[1])() : null }
}

// theme-library/ is every theme in one plugin with a switcher. Its scenes and
// registry are generated from themes/, so run this after changing a theme.
function pack() {
  const dir = join(ROOT, 'theme-library', 'hooks')

  mkdirSync(join(dir, 'scenes'), { recursive: true })
  for (const f of ['make-colors.js', 'make-colors.d.ts']) {
    copyFileSync(join(ROOT, 'template', 'hooks', f), join(dir, f))
  }

  const list = ids()
  const imports = []
  const scenes = []
  const data = []

  list.forEach((id, i) => {
    // A theme with no scene (colors only) goes in with no scene, no glass and a "still" style.
    const drawn = existsSync(join(THEMES, id, 'hooks', 'scene.js'))
    const { colors, glass } = themeConfig(id)

    if (drawn) {
      copyFileSync(join(THEMES, id, 'hooks', 'scene.js'), join(dir, 'scenes', `${id}.js`))
      imports.push(`import * as s${i} from './scenes/${id}.js'`)
    } else if (glass) {
      throw new Error(`${id}: register.tsx sets glass but there is no hooks/scene.js`)
    }
    scenes.push(drawn ? `s${i}` : 'null')

    const keywords = (manifest(id).keywords ?? []).filter(k => !['claude-code', 'theme', 'animated'].includes(k)).map(k => (k === 'pixel-art' ? 'pixel' : k))

    data.push({ id, title: colors.label, blurb: manifest(id).description, mode: colors.only ?? 'both', style: !drawn ? 'still' : keywords.includes('pixel') ? 'pixel' : 'vector', tags: keywords, ...(glass ? { glass } : {}), colors })
  })

  // Twins: a theme's README says "twin of `x`" or "twin is `x`". Make it mutual, and
  // keep it only between a light and a dark theme, which is what day and night pick from.
  const byId = new Map(data.map(d => [d.id, d]))

  for (const d of data) {
    const readme = join(THEMES, d.id, 'README.md')
    const found = existsSync(readme) ? /twin (?:of|is) `([a-z0-9-]+)`/.exec(readFileSync(readme, 'utf8')) : null
    const other = found ? byId.get(found[1]) : undefined

    if (other && other.mode !== d.mode && other.mode !== 'both' && d.mode !== 'both') {
      d.twin = other.id
      other.twin = d.id
    }
  }
  writeFileSync(
    join(dir, 'registry.js'),
    `// Generated by scripts/library.mjs pack from themes/. Do not edit by hand.\n${imports.join('\n')}\n\nconst data = ${JSON.stringify(data, null, 2)}\nconst scenes = [${scenes.join(', ')}]\n\nexport const THEMES = data.map((d, i) => ({ ...d, build: scenes[i] === null ? null : scenes[i].buildScene }))\n`,
  )
  console.log(`pack: ${list.length} themes`)
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
        plugins: [
          { name: 'theme-library', source: './theme-library', description: JSON.parse(readFileSync(join(ROOT, 'theme-library', '.claude-plugin', 'plugin.json'), 'utf8')).description },
          ...list.map(({ id, m }) => ({ name: id, source: `./themes/${id}`, description: m.description })),
        ],
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

// A CSS animation that moves opacity replaces an element's own opacity attribute
// while it runs, so a glow drawn with opacity=".1" turns solid. Finds the classes
// that animate opacity and are used on a tag that also carries an opacity attribute.
function opacityClashes(svg) {
  const css = (svg.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || ''
  const fades = new Set([...css.matchAll(/@keyframes\s+([\w-]+)\s*\{([\s\S]*?\}\s*)\}/g)].filter(m => /opacity\s*:/.test(m[2])).map(m => m[1]))
  const animated = new Set()

  for (const m of css.matchAll(/\.([\w-]+)\s*\{[^}]*animation(?:-name)?\s*:\s*([\w-]+)/g)) {
    if (fades.has(m[2])) {
      animated.add(m[1])
    }
  }

  const bad = new Set()

  for (const tag of svg.matchAll(/<[a-z]+\s[^>]*>/g)) {
    const cls = /\sclass="([^"]+)"/.exec(tag[0])

    if (cls && /\sopacity="/.test(tag[0])) {
      for (const c of cls[1].split(/\s+/)) {
        if (animated.has(c)) {
          bad.add(c)
        }
      }
    }
  }

  return bad
}

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
      for (const cls of opacityClashes(svg)) {
        problems.push(`${id}: class "${cls}" animates opacity on an element that also has an opacity attribute, so the attribute is lost (put the class on a wrapping <g>)`)
      }
    }
  }
  for (const id of listed) {
    if (id !== 'theme-library' && !existsSync(join(THEMES, id))) {
      problems.push(`${id}: listed in marketplace.json but has no folder`)
    }
  }

  // The library plugin must hold every theme.
  const registry = join(ROOT, 'theme-library', 'hooks', 'registry.js')

  if (!existsSync(registry)) {
    problems.push('theme-library: no hooks/registry.js (run: node scripts/library.mjs pack)')
  } else {
    const text = readFileSync(registry, 'utf8')

    for (const id of ids()) {
      if (!text.includes(`"id": "${id}"`)) {
        problems.push(`theme-library: ${id} is missing from the registry (run: node scripts/library.mjs pack)`)
      }
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
} else if (cmd === 'pack') {
  pack()
} else if (cmd === 'index') {
  index()
} else if (cmd === 'check') {
  await check()
} else if (cmd === 'all') {
  pack()
  index()
  await gallery()
  await check()
} else {
  console.log('usage: node scripts/library.mjs previews [theme ...] | gallery | pack | index | check | all')
}
