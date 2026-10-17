/**
 * Runs test/dom.html in headless Chrome and reads the PASS/FAIL marker out of
 * the dumped DOM. Skipped (not failed) when no Chrome/Chromium is installed,
 * so `npm test` stays usable on a machine without one.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const page = pathToFileURL(join(root, 'test/dom.html')).href

const candidates = [
  process.env.CHROME,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser'
].filter(Boolean)

const chrome = candidates.find((path) => existsSync(path))
if (!chrome) {
  console.log('dom skipped — no Chrome/Chromium found (set CHROME to run it)')
  process.exit(0)
}

/* Chrome refuses to start headless without a writable profile directory. */
const profile = mkdtempSync(join(tmpdir(), 'dsh-jcc-chrome-'))
const args = [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--no-first-run',
  '--hide-scrollbars',
  '--disable-dev-shm-usage',
  '--user-data-dir=' + profile,
  '--virtual-time-budget=3000',
  '--dump-dom',
  page
]

const result = spawnSync(chrome, args, { encoding: 'utf8', timeout: 40_000 })
rmSync(profile, { recursive: true, force: true })
if (result.error) {
  console.error('dom failed — could not start Chrome:', result.error.message)
  process.exit(1)
}

const dom = result.stdout || ''
if (!dom.includes('data-test="PASS"')) {
  const body = /<pre id="result">([\s\S]*?)<\/pre>/.exec(dom)
  console.error('dom failed\n' + (body ? body[1] : dom.slice(0, 4000)))
  process.exit(1)
}

const passes = (dom.match(/PASS /g) || []).length
console.log(`dom ok — ${passes} checks passed in headless Chrome`)
