/**
 * Host half of `dsh-jcc-theme`.
 *
 * The theme is presentation-only and lives entirely in the browser half
 * (`client/index.js`). This row exists so the client module system finds a
 * package with a `dsh.client` manifest and serves that bundle to the page.
 * There is no host state, no Config, no service and no route — so `apply()`
 * is deliberately empty.
 */

/** Cordis plugin name (diagnostics only). */
export const name = 'ui-jcc-theme'

/** No-op: every effect the theme has is owned by the browser half. */
export function apply() {}
