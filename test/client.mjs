/**
 * Bundle contract check — evaluates the browser bundle in a vm with only
 * `window.__ModuleLoader__` present, then inspects the generated palette.
 *
 * This is the part that can go wrong silently: a token emitted without its
 * `{ light, dark }` counterpart, an accent block without the extra specificity
 * that makes it win, or an unbalanced brace breaks the whole UI.
 */
import vm from 'node:vm'
import { readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const code = await readFile(join(root, 'client/index.js'), 'utf8')

let definition = null
const sandbox = {
  console,
  window: {},
  navigator: { language: 'zh-CN' }
}
sandbox.window.__ModuleLoader__ = {
  load(value) {
    definition = value
  }
}
sandbox.globalThis = sandbox
vm.createContext(sandbox)
vm.runInContext(code, sandbox, { filename: 'client/index.js' })

assert.ok(definition, 'the bundle registers a module')
assert.equal(definition.id, 'dsh-jcc-theme')
assert.equal(typeof definition.factory, 'function')

const source = sandbox.__jccThemeSource
assert.ok(source, 'the palette source is exposed for checks')
assert.deepEqual([...source.accents], ['gold', 'cyan', 'violet'])
assert.deepEqual([...source.textures], ['subtle', 'normal', 'vivid'])

const css = source.paletteCss()

/* Balanced braces: a single missing `}` breaks every following rule. */
const opens = (css.match(/{/g) || []).length
const closes = (css.match(/}/g) || []).length
assert.equal(opens, closes, 'palette CSS has balanced braces')
assert.ok(!css.includes('undefined'), 'no undefined token value')

/* One base pair plus one pair per accent, for both schemes. */
const lightBlocks = css.match(/body:not\(\[data-ds-dark-theme\]\)/g) || []
const darkBlocks = css.match(/body\[data-ds-dark-theme\]/g) || []
assert.equal(lightBlocks.length, 4, 'light: base + three accents')
assert.equal(darkBlocks.length, 4, 'dark: base + three accents')

for (const accent of ['gold', 'cyan', 'violet']) {
  assert.ok(
    css.includes(`:root[data-jcc-accent="${accent}"]{--jcc-accent:`),
    `${accent} declares its own accent variables`
  )
  assert.ok(
    css.includes(`:root[data-jcc="on"][data-jcc-accent="${accent}"] body:not([data-ds-dark-theme])`),
    `${accent} has a light token block`
  )
  assert.ok(
    css.includes(`:root[data-jcc="on"][data-jcc-accent="${accent}"] body[data-ds-dark-theme]`),
    `${accent} has a dark token block`
  )
}

/* Every generated custom property is a DSH token or one of ours. */
const names = [...css.matchAll(/(--[a-z0-9-]+):/g)].map((match) => match[1])
assert.ok(names.length > 150, 'palette emits the full token set')
for (const name of names) {
  assert.ok(
    name.startsWith('--dsw-') || name.startsWith('--jcc-'),
    `unexpected custom property ${name}`
  )
}

/* The palette the rest of the UI leans on must be present in both schemes. */
for (const token of [
  '--dsw-alias-bg-base',
  '--dsw-alias-bg-layer-1',
  '--dsw-alias-label-primary',
  '--dsw-alias-border-l2',
  '--dsw-alias-button-primary-fill',
  '--dsw-alias-label-primary-foreground',
  '--dsw-alias-settings-card-fill'
]) {
  const count = (css.match(new RegExp(`${token}:`, 'g')) || []).length
  assert.ok(count >= 2, `${token} is set for both schemes`)
}

/* Light and dark must not collapse to the same value. */
const lightBase = source.base.light['--dsw-alias-bg-base']
const darkBase = source.base.dark['--dsw-alias-bg-base']
assert.notEqual(lightBase, darkBase)

/* Every accent survives a token round-trip with six-digit colours intact. */
for (const accent of source.accents) {
  for (const scheme of ['light', 'dark']) {
    const tokens = source.accentTokens(accent, scheme)
    assert.ok(tokens['--dsw-alias-brand-primary'])
    assert.match(tokens['--dsw-alias-border-l2'], /^#[0-9a-f]{8}$/)
    assert.match(tokens['--dsw-alias-link'], /^#[0-9a-f]{6}$/)
  }
}

console.log(
  `client ok — ${source.accents.length} accents, ${new Set(names).size} custom properties, ` +
    `${(Buffer.byteLength(css) / 1024).toFixed(1)} KiB generated CSS`
)
