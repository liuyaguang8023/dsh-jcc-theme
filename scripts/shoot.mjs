/**
 * Renders the preview page in headless Chrome and writes the README screenshots.
 *
 *   node scripts/shoot.mjs
 *
 * Chrome is resolved from CHROME or the usual macOS/Linux locations. The page
 * is opened from disk, so no server is needed.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'assets')
mkdirSync(outDir, { recursive: true })

const candidates = [
  process.env.CHROME,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser'
].filter(Boolean)
const chrome = candidates.find((path) => existsSync(path))
if (!chrome) {
  console.error('no Chrome/Chromium found — set CHROME=/path/to/chrome')
  process.exit(1)
}

const page = pathToFileURL(join(root, 'preview/index.html')).href

const shots = [
  {
    file: 'screenshot-dark.png',
    query: 'scheme=dark&accent=gold&texture=normal&panel=1'
  },
  {
    file: 'screenshot-light.png',
    query: 'scheme=light&accent=gold&texture=normal'
  },
  {
    file: 'screenshot-cyan.png',
    query: 'scheme=dark&accent=cyan&texture=vivid&panel=1'
  }
]

for (const shot of shots) {
  const profile = mkdtempSync(join(tmpdir(), 'dsh-jcc-shot-'))
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--no-first-run',
    '--hide-scrollbars',
    '--disable-dev-shm-usage',
    '--force-prefers-reduced-motion',
    '--force-device-scale-factor=2',
    '--window-size=1440,900',
    '--virtual-time-budget=2500',
    '--user-data-dir=' + profile,
    '--screenshot=' + join(outDir, shot.file),
    page + '?' + shot.query
  ]
  const result = spawnSync(chrome, args, { encoding: 'utf8', timeout: 60_000 })
  rmSync(profile, { recursive: true, force: true })
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout || 'chrome failed')
    process.exit(1)
  }
  console.log('wrote assets/' + shot.file)
}
