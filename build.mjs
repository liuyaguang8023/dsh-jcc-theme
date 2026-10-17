/**
 * Assemble client/index.js from src/client.js, src/theme.css and the two
 * backdrop scenes.
 *
 * The browser bundle is committed, so a source checkout installs without a
 * build step; this script exists to keep the stylesheet editable as CSS and
 * the scenes editable as SVG instead of JS string literals.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))

/** A self-contained SVG background: no extra request, no CSP surprise. */
function svgDataUri(svg) {
  const compact = svg.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim()
  return 'data:image/svg+xml,' + encodeURIComponent(compact)
}

const rawCss = await readFile(join(root, 'src/theme.css'), 'utf8')
const darkScene = await readFile(join(root, 'src/scene-dark.svg'), 'utf8')
const lightScene = await readFile(join(root, 'src/scene-light.svg'), 'utf8')

const css = rawCss
  .replaceAll('__SCENE_DARK__', svgDataUri(darkScene))
  .replaceAll('__SCENE_LIGHT__', svgDataUri(lightScene))

for (const leftover of ['__SCENE_DARK__', '__SCENE_LIGHT__']) {
  if (css.includes(leftover)) throw new Error(`${leftover} was not replaced`)
}

const template = await readFile(join(root, 'src/client.js'), 'utf8')
if (!template.includes('__CSS__') || !template.includes('__VERSION__')) {
  throw new Error('src/client.js is missing the __CSS__ / __VERSION__ placeholders')
}

const bundle = template
  .replace('__VERSION__', JSON.stringify(pkg.version))
  .replace('__CSS__', JSON.stringify(css.replace(/\r\n/g, '\n')))

if (bundle.includes('__CSS__') || bundle.includes('__VERSION__')) {
  throw new Error('placeholder left unreplaced')
}

await mkdir(join(root, 'client'), { recursive: true })
await writeFile(join(root, 'client/index.js'), bundle)

console.log(
  `built client/index.js — ${(Buffer.byteLength(bundle) / 1024).toFixed(1)} KiB ` +
    `(css ${(Buffer.byteLength(css) / 1024).toFixed(1)} KiB, v${pkg.version})`
)
