/**
 * Manifest contract check — runs without any dependency and without a browser.
 *
 * Verifies the pieces the DSH loader and the plugin market actually read:
 * `dsh.bundle.patch`, the patch row, the `./client` export, and the built
 * bundle's identity.
 */
import { readFile, stat } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path) => readFile(join(root, path), 'utf8')

const pkg = JSON.parse(await read('package.json'))

assert.equal(pkg.name, 'dsh-jcc-theme')
assert.match(pkg.version, /^\d+\.\d+\.\d+$/)
assert.equal(pkg.type, 'module')
assert.ok(pkg.dsh, 'package.json declares dsh')

/* The bundle manifest is what makes the package installable. */
assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml')
assert.equal(pkg.dsh.client.platform, 'web')
assert.equal(pkg.dsh.client.immediately, true)
assert.deepEqual(pkg.dsh.client.inject, [])

/* Declared host range is metadata the market shows on the card. */
assert.ok(pkg.engines.dsh, 'engines.dsh is declared')
assert.match(pkg.engines.dsh, /0\.2\./)

/* Every export the loader may resolve must exist. */
for (const [subpath, entry] of Object.entries(pkg.exports)) {
  const file = typeof entry === 'string' ? entry : entry.default
  assert.ok(file, `export ${subpath} has a target`)
  assert.ok((await stat(join(root, file))).isFile(), `${file} exists`)
}

const patch = await read('cordis.patch.yml')
assert.match(patch, /-\s+insert:/)
assert.match(patch, /id:\s*ui-jcc-theme/)
assert.match(patch, /name:\s*'dsh-jcc-theme'/)

const host = await read('lib/index.js')
assert.match(host, /export const name = 'ui-jcc-theme'/)
assert.match(host, /export function apply\(\)/)

const client = await read('client/index.js')
assert.ok(!client.includes('__CSS__'), 'CSS placeholder was replaced')
assert.ok(!client.includes('__VERSION__'), 'version placeholder was replaced')
assert.ok(client.includes("var PKG = 'dsh-jcc-theme'"))
assert.ok(client.includes('__ModuleLoader__.load'))
assert.ok(client.includes('.jcc-orb'), 'static stylesheet is inlined')
assert.ok(client.includes('--dsw-alias-bg-base'), 'palette is inlined')

/* The browser half must not reach the network. */
assert.ok(!/fetch\s*\(/.test(client), 'no fetch in the client bundle')
assert.ok(!/XMLHttpRequest/.test(client), 'no XHR in the client bundle')
assert.ok(!/https?:\/\//.test(client), 'no absolute URL in the client bundle')

/* A theme has no business writing files or spawning processes. */
for (const forbidden of ['child_process', 'node:fs', 'require("fs")', "require('fs')"]) {
  assert.ok(!client.includes(forbidden), `client does not use ${forbidden}`)
}

for (const file of ['README.md', 'README.en.md', 'LICENSE', 'assets/icon.svg']) {
  assert.ok((await stat(join(root, file))).isFile(), `${file} exists`)
}

const size = Buffer.byteLength(client)
assert.ok(size > 30_000 && size < 160_000, `client bundle stays small (${size} bytes)`)

console.log(`manifest ok — ${pkg.name}@${pkg.version}, client ${(size / 1024).toFixed(1)} KiB`)
