/**
 * Assemble client/index.js from src/client.js + src/theme.css.
 *
 * The browser bundle is committed, so a source checkout installs without a
 * build step; this script only exists to keep the stylesheet editable as CSS
 * instead of a JS string literal.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))

const css = await readFile(join(root, 'src/theme.css'), 'utf8')
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
