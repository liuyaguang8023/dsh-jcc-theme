/**
 * dsh-jcc-theme — browser half.
 *
 * A Golden Spatula (金铲铲) fan theme for the DSH Web GUI. The whole feature is
 * one stylesheet plus a small hex-core launcher:
 *
 *   - colour tokens are generated from the palette table below and scoped to
 *     `:root[data-jcc="on"] body…`, so they out-specify the product's `body`
 *     and `body[data-ds-dark-theme]` rules and revert the moment the theme is
 *     switched off;
 *   - the page canvas (hex lattice + two ambient lights) lives in theme.css,
 *     inlined at build time;
 *   - the launcher and its panel are plain DOM: no React, no services, no
 *     network, and one localStorage key for the three choices.
 *
 * The factory runs at materialization, which for an `immediately` row is the
 * shell's pre-plugin interval — attributes and styles are in place before the
 * first paint, so enabling the theme never flashes the stock palette.
 */

;(function () {
  var PKG = 'dsh-jcc-theme'
  var VERSION = "0.1.1"
  var STYLE_ID = 'dsh-jcc-theme-style'
  var DOCK_ID = 'dsh-jcc-dock'
  var PANEL_ID = 'dsh-jcc-panel'
  var STORE_KEY = 'dsh-jcc/v1'
  var ACCENT_IDS = ['gold', 'cyan', 'violet']
  var TEXTURES = ['subtle', 'normal', 'vivid']

  /* theme.css, inlined by build.mjs. */
  var STATIC_CSS = "/*\n * dsh-jcc-theme — static stylesheet.\n *\n * The colour tokens (--dsw-alias-*) are generated in client.js from the same\n * palette table that feeds every accent, so this file holds only what does not\n * depend on a colour scheme by itself: the page canvas, the hex board, and the\n * floating hex-core panel.\n *\n * Conventions\n *   - every page-level rule is gated on :root[data-jcc=\"on\"], so switching the\n *     theme off restores the stock UI without unloading the bundle;\n *   - the launcher keeps its own dark HUD colours instead of reading page\n *     tokens, so it stays legible while the theme is off (that is when you\n *     need it to turn the theme back on).\n */\n\n/* ── 0. Own variables ───────────────────────────────────────────────────── */\n\n:root {\n  /* Overwritten per accent by the generated sheet; these are the fallbacks. */\n  --jcc-accent: #e8c477;\n  --jcc-accent-2: #f6e3b4;\n  --jcc-accent-deep: #a97f2e;\n\n  --jcc-grid: 44px;\n  --jcc-grid-p: 7%;\n  --jcc-grid-p2: 4.5%;\n\n  --jcc-hud-bg: #0a0f1b;\n  --jcc-hud-bg-2: #121a2b;\n  --jcc-hud-line: rgba(232, 196, 119, 0.26);\n  --jcc-hud-text: #f3ebd9;\n  --jcc-hud-text-2: #c3b79e;\n  --jcc-hud-text-3: #8d8370;\n  --jcc-ease: cubic-bezier(0.22, 0.61, 0.36, 1);\n}\n\n:root[data-jcc=\"on\"][data-jcc-texture=\"subtle\"] {\n  --jcc-grid: 58px;\n  --jcc-grid-p: 4.5%;\n  --jcc-grid-p2: 3%;\n}\n\n:root[data-jcc=\"on\"][data-jcc-texture=\"normal\"] {\n  --jcc-grid: 44px;\n  --jcc-grid-p: 7%;\n  --jcc-grid-p2: 4.5%;\n}\n\n:root[data-jcc=\"on\"][data-jcc-texture=\"vivid\"] {\n  --jcc-grid: 32px;\n  --jcc-grid-p: 11%;\n  --jcc-grid-p2: 7%;\n}\n\n/* ── 1. The board: canvas, hex lattice, ambient hextech light ───────────── */\n\n/* The product paints the app frame (and each page root) with\n   `--dsw-alias-bg-base`, which covers the body canvas. client.js marks those\n   full-viewport canvas layers at runtime; only they go transparent, so sticky\n   headers and cards that also use the token keep their opaque fill. */\n:root[data-jcc=\"on\"] .jcc-canvas {\n  background-color: transparent !important;\n}\n\n:root[data-jcc=\"on\"] body {\n  background-attachment: fixed;\n  background-position: center;\n  background-repeat: no-repeat, no-repeat, no-repeat, repeat, repeat, repeat;\n  background-size: cover, auto, auto, auto, auto, auto;\n}\n\n:root[data-jcc=\"on\"] body:not([data-ds-dark-theme]) {\n  --jcc-deco: var(--jcc-accent-deep);\n  --jcc-scene: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201600%201000%22%20width%3D%221600%22%20height%3D%221000%22%3E%3Cdefs%3E%3CradialGradient%20id%3D%22paper%22%20cx%3D%22.5%22%20cy%3D%22.42%22%20r%3D%22.78%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23fdf9f0%22%2F%3E%3Cstop%20offset%3D%22.58%22%20stop-color%3D%22%23f7efdd%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23eadfc6%22%2F%3E%3C%2FradialGradient%3E%3CradialGradient%20id%3D%22sun%22%20cx%3D%22.62%22%20cy%3D%22.12%22%20r%3D%22.58%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23fff8e6%22%20stop-opacity%3D%22.95%22%2F%3E%3Cstop%20offset%3D%22.5%22%20stop-color%3D%22%23f6e3b4%22%20stop-opacity%3D%22.32%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f6e3b4%22%20stop-opacity%3D%220%22%2F%3E%3C%2FradialGradient%3E%3CradialGradient%20id%3D%22core%22%20cx%3D%22.5%22%20cy%3D%22.5%22%20r%3D%22.5%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23e8c477%22%20stop-opacity%3D%22.32%22%2F%3E%3Cstop%20offset%3D%22.55%22%20stop-color%3D%22%23c99a2e%22%20stop-opacity%3D%22.1%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23a8822f%22%20stop-opacity%3D%220%22%2F%3E%3C%2FradialGradient%3E%3ClinearGradient%20id%3D%22gold%22%20x1%3D%22.1%22%20y1%3D%220%22%20x2%3D%22.9%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23e8c477%22%2F%3E%3Cstop%20offset%3D%22.45%22%20stop-color%3D%22%23c99a2e%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%238a6413%22%2F%3E%3C%2FlinearGradient%3E%3CradialGradient%20id%3D%22vignette%22%20cx%3D%22.5%22%20cy%3D%22.44%22%20r%3D%22.82%22%3E%3Cstop%20offset%3D%22.52%22%20stop-color%3D%22%238a6d3b%22%20stop-opacity%3D%220%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%238a6d3b%22%20stop-opacity%3D%22.22%22%2F%3E%3C%2FradialGradient%3E%3ClinearGradient%20id%3D%22floor%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%220%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23f3e8cf%22%20stop-opacity%3D%220%22%2F%3E%3Cstop%20offset%3D%22.7%22%20stop-color%3D%22%23f3e8cf%22%20stop-opacity%3D%22.55%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f3e8cf%22%20stop-opacity%3D%22.92%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22soft%22%20x%3D%22-50%25%22%20y%3D%22-50%25%22%20width%3D%22200%25%22%20height%3D%22200%25%22%3E%3CfeGaussianBlur%20stdDeviation%3D%2220%22%2F%3E%3C%2Ffilter%3E%3Csymbol%20id%3D%22hex%22%20viewBox%3D%22-10%20-10%2020%2020%22%3E%3Cpath%20d%3D%22M0-10%208.66-5%208.66%205%200%2010-8.66%205-8.66-5Z%22%20fill%3D%22none%22%20stroke%3D%22%23a8822f%22%20stroke-width%3D%22.9%22%2F%3E%3C%2Fsymbol%3E%3C%2Fdefs%3E%3Crect%20width%3D%221600%22%20height%3D%221000%22%20fill%3D%22url(%23paper)%22%2F%3E%3Crect%20width%3D%221600%22%20height%3D%221000%22%20fill%3D%22url(%23sun)%22%2F%3E%3C!--%20old%20chart%20contours%20--%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23a8822f%22%20stroke-opacity%3D%22.08%22%3E%3Cpath%20d%3D%22M-120%20128C220%2072%20430%20196%20760%20148S1330%2066%201720%20138%22%2F%3E%3Cpath%20d%3D%22M-120%20188C240%20130%20450%20258%20780%20206S1350%20124%201720%20196%22%2F%3E%3Cpath%20d%3D%22M-120%20252C200%20198%20480%20314%20800%20262S1360%20184%201720%20256%22%2F%3E%3Cpath%20d%3D%22M-120%20322C260%20268%20500%20382%20820%20330S1380%20250%201720%20322%22%2F%3E%3Cpath%20d%3D%22M-120%20398C240%20344%20520%20456%20840%20404S1400%20324%201720%20396%22%2F%3E%3Cpath%20d%3D%22M-120%20480C280%20424%20540%20536%20860%20484S1420%20404%201720%20476%22%2F%3E%3Cpath%20d%3D%22M-120%20566C240%20512%20560%20620%20880%20568S1440%20488%201720%20560%22%2F%3E%3C%2Fg%3E%3Cg%20fill%3D%22%23a8822f%22%20opacity%3D%22.18%22%3E%3Ccircle%20cx%3D%22286%22%20cy%3D%22132%22%20r%3D%221.4%22%2F%3E%3Ccircle%20cx%3D%22612%22%20cy%3D%22198%22%20r%3D%221.1%22%2F%3E%3Ccircle%20cx%3D%22944%22%20cy%3D%22146%22%20r%3D%221.3%22%2F%3E%3Ccircle%20cx%3D%221268%22%20cy%3D%22210%22%20r%3D%221.1%22%2F%3E%3Ccircle%20cx%3D%22372%22%20cy%3D%22338%22%20r%3D%221.2%22%2F%3E%3Ccircle%20cx%3D%221084%22%20cy%3D%22368%22%20r%3D%221.4%22%2F%3E%3Ccircle%20cx%3D%22696%22%20cy%3D%22470%22%20r%3D%221.1%22%2F%3E%3Ccircle%20cx%3D%221436%22%20cy%3D%22474%22%20r%3D%221.3%22%2F%3E%3Ccircle%20cx%3D%22182%22%20cy%3D%22566%22%20r%3D%221.2%22%2F%3E%3Ccircle%20cx%3D%221232%22%20cy%3D%22586%22%20r%3D%221.1%22%2F%3E%3C%2Fg%3E%3C!--%20arena%20floor%20--%3E%3Cellipse%20cx%3D%22800%22%20cy%3D%22596%22%20rx%3D%22600%22%20ry%3D%2248%22%20fill%3D%22url(%23core)%22%20opacity%3D%22.5%22%2F%3E%3Cpath%20d%3D%22M-80%20610Q800%20552%201680%20610%22%20fill%3D%22none%22%20stroke%3D%22%23a8822f%22%20stroke-opacity%3D%22.12%22%2F%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23a8822f%22%20stroke-opacity%3D%22.07%22%3E%3Cpath%20d%3D%22M800%20590L-260%201000M800%20590L-40%201000M800%20590L180%201000M800%20590L400%201000M800%20590L620%201000M800%20590L800%201000M800%20590L980%201000M800%20590L1200%201000M800%20590L1420%201000M800%20590L1620%201000M800%20590L1860%201000%22%2F%3E%3Cpath%20d%3D%22M-140%20706Q800%20650%201740%20706%22%2F%3E%3Cpath%20d%3D%22M-140%20792Q800%20730%201740%20792%22%2F%3E%3Cpath%20d%3D%22M-140%20896Q800%20826%201740%20896%22%2F%3E%3Cpath%20d%3D%22M-140%201010Q800%20930%201740%201010%22%2F%3E%3C%2Fg%3E%3C!--%20arena%20rings%20--%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22url(%23gold)%22%3E%3Cpath%20d%3D%22M800%20306%201215.7%20546V1026L800%201266%20384.3%201026V546Z%22%20stroke-opacity%3D%22.1%22%20stroke-width%3D%221.1%22%2F%3E%3Cpath%20d%3D%22M800%20486%201059.8%20636v300L800%201086%20540.2%20936V636Z%22%20stroke-opacity%3D%22.16%22%20stroke-width%3D%221.2%22%2F%3E%3Cpath%20d%3D%22M800%20626%20940%20706v160L800%20946%20660%20866V706Z%22%20stroke-opacity%3D%22.22%22%20stroke-width%3D%221.4%22%2F%3E%3Ccircle%20cx%3D%22800%22%20cy%3D%22786%22%20r%3D%22466%22%20stroke-dasharray%3D%222%2018%22%20stroke-opacity%3D%22.12%22%2F%3E%3C%2Fg%3E%3C!--%20golden%20spatula%20watermark%20--%3E%3Cellipse%20cx%3D%221470%22%20cy%3D%22306%22%20rx%3D%22250%22%20ry%3D%22230%22%20fill%3D%22url(%23core)%22%20opacity%3D%22.45%22%20filter%3D%22url(%23soft)%22%2F%3E%3Cpath%20d%3D%22M1470%20126%201625.9%20216V396L1470%20486%201314.1%20396V216Z%22%20fill%3D%22none%22%20stroke%3D%22url(%23gold)%22%20stroke-opacity%3D%22.12%22%20stroke-width%3D%221.2%22%2F%3E%3Cg%20transform%3D%22translate(1470%20306)%20rotate(-12)%20scale(11)%20translate(-12%20-12)%22%20opacity%3D%22.18%22%3E%3Cellipse%20cx%3D%2212%22%20cy%3D%2213%22%20rx%3D%2220%22%20ry%3D%2216%22%20fill%3D%22url(%23core)%22%20filter%3D%22url(%23soft)%22%2F%3E%3Cg%20fill%3D%22url(%23gold)%22%3E%3Cpath%20d%3D%22M14.4%203.2c1.9-.6%203.9-.3%205.5%201.1%201.4%201.6%201.7%203.6%201.1%205.5-.2.8-.7%201.5-1.3%202.1l-1.1%201.1-7.4-7.4%201.1-1.1c.6-.6%201.3-1.1%202.1-1.3Z%22%2F%3E%3Cpath%20d%3D%22M11.7%208.2%204.2%2015.7%22%20stroke%3D%22url(%23gold)%22%20stroke-width%3D%222.4%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C!--%20compass%20rose%20--%3E%3Cg%20transform%3D%22translate(212%20812)%22%20fill%3D%22none%22%20stroke%3D%22%23a8822f%22%20opacity%3D%22.16%22%3E%3Ccircle%20r%3D%2286%22%20stroke-opacity%3D%22.5%22%2F%3E%3Ccircle%20r%3D%2258%22%20stroke-dasharray%3D%221%209%22%2F%3E%3Cpath%20d%3D%22M0-86V86M-86%200H86M-61-61%2061%2061M61-61-61%2061%22%20stroke-opacity%3D%22.35%22%2F%3E%3Cpath%20d%3D%22M0-22%208%200%200%2022-8%200Z%22%20fill%3D%22%23a8822f%22%20stroke%3D%22none%22%20opacity%3D%22.7%22%2F%3E%3C%2Fg%3E%3C!--%20floating%20hexes%20--%3E%3Cg%3E%3Cuse%20href%3D%22%23hex%22%20x%3D%22262%22%20y%3D%22220%22%20width%3D%2230%22%20height%3D%2230%22%20opacity%3D%22.2%22%2F%3E%3Cuse%20href%3D%22%23hex%22%20x%3D%221216%22%20y%3D%22470%22%20width%3D%2220%22%20height%3D%2220%22%20opacity%3D%22.16%22%2F%3E%3Cuse%20href%3D%22%23hex%22%20x%3D%22442%22%20y%3D%22592%22%20width%3D%2226%22%20height%3D%2226%22%20opacity%3D%22.16%22%2F%3E%3Cuse%20href%3D%22%23hex%22%20x%3D%221438%22%20y%3D%22752%22%20width%3D%2224%22%20height%3D%2224%22%20opacity%3D%22.14%22%2F%3E%3Cuse%20href%3D%22%23hex%22%20x%3D%221046%22%20y%3D%22154%22%20width%3D%2216%22%20height%3D%2216%22%20opacity%3D%22.18%22%2F%3E%3Cuse%20href%3D%22%23hex%22%20x%3D%22590%22%20y%3D%22252%22%20width%3D%2218%22%20height%3D%2218%22%20opacity%3D%22.15%22%2F%3E%3Ccircle%20cx%3D%22279%22%20cy%3D%22235%22%20r%3D%222%22%20fill%3D%22%23a8822f%22%20opacity%3D%22.26%22%2F%3E%3C%2Fg%3E%3Crect%20width%3D%221600%22%20height%3D%221000%22%20fill%3D%22url(%23vignette)%22%2F%3E%3Crect%20y%3D%22560%22%20width%3D%221600%22%20height%3D%22440%22%20fill%3D%22url(%23floor)%22%2F%3E%3C%2Fsvg%3E\");\n  background-color: #f7f1e3;\n  background-image:\n    var(--jcc-scene, none),\n    radial-gradient(\n      1100px 560px at 50% -220px,\n      color-mix(in srgb, var(--jcc-accent) 16%, transparent),\n      transparent 70%\n    ),\n    radial-gradient(\n      900px 500px at 104% 108%,\n      color-mix(in srgb, var(--jcc-accent-2) 10%, transparent),\n      transparent 72%\n    ),\n    repeating-linear-gradient(\n      60deg,\n      color-mix(in srgb, var(--jcc-deco) var(--jcc-grid-p), transparent) 0 1px,\n      transparent 1px var(--jcc-grid)\n    ),\n    repeating-linear-gradient(\n      -60deg,\n      color-mix(in srgb, var(--jcc-deco) var(--jcc-grid-p), transparent) 0 1px,\n      transparent 1px var(--jcc-grid)\n    ),\n    repeating-linear-gradient(\n      0deg,\n      color-mix(in srgb, var(--jcc-deco) var(--jcc-grid-p2), transparent) 0 1px,\n      transparent 1px calc(var(--jcc-grid) * 0.86)\n    );\n}\n\n:root[data-jcc=\"on\"] body[data-ds-dark-theme] {\n  --jcc-deco: var(--jcc-accent);\n  --jcc-scene: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201600%201000%22%20width%3D%221600%22%20height%3D%221000%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22sky%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%220%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%2304060c%22%2F%3E%3Cstop%20offset%3D%22.42%22%20stop-color%3D%22%23070c17%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%230b1424%22%2F%3E%3C%2FlinearGradient%3E%3CradialGradient%20id%3D%22dawn%22%20cx%3D%22.62%22%20cy%3D%22.2%22%20r%3D%22.6%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23e8c477%22%20stop-opacity%3D%22.26%22%2F%3E%3Cstop%20offset%3D%22.42%22%20stop-color%3D%22%23e8c477%22%20stop-opacity%3D%22.09%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23e8c477%22%20stop-opacity%3D%220%22%2F%3E%3C%2FradialGradient%3E%3CradialGradient%20id%3D%22core%22%20cx%3D%22.5%22%20cy%3D%22.5%22%20r%3D%22.5%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23f6e3b4%22%20stop-opacity%3D%22.5%22%2F%3E%3Cstop%20offset%3D%22.55%22%20stop-color%3D%22%23e8c477%22%20stop-opacity%3D%22.14%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23e8c477%22%20stop-opacity%3D%220%22%2F%3E%3C%2FradialGradient%3E%3ClinearGradient%20id%3D%22gold%22%20x1%3D%22.1%22%20y1%3D%220%22%20x2%3D%22.9%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23fbf0d2%22%2F%3E%3Cstop%20offset%3D%22.42%22%20stop-color%3D%22%23e8c477%22%2F%3E%3Cstop%20offset%3D%22.78%22%20stop-color%3D%22%23c99a2e%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%238a6413%22%2F%3E%3C%2FlinearGradient%3E%3ClinearGradient%20id%3D%22handle%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23f6e3b4%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23a97f2e%22%2F%3E%3C%2FlinearGradient%3E%3CradialGradient%20id%3D%22vignette%22%20cx%3D%22.5%22%20cy%3D%22.44%22%20r%3D%22.8%22%3E%3Cstop%20offset%3D%22.5%22%20stop-color%3D%22%23000%22%20stop-opacity%3D%220%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23000%22%20stop-opacity%3D%22.66%22%2F%3E%3C%2FradialGradient%3E%3ClinearGradient%20id%3D%22floor%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%220%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%2304060c%22%20stop-opacity%3D%220%22%2F%3E%3Cstop%20offset%3D%22.62%22%20stop-color%3D%22%2304060c%22%20stop-opacity%3D%22.5%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%2304060c%22%20stop-opacity%3D%22.92%22%2F%3E%3C%2FlinearGradient%3E%3CradialGradient%20id%3D%22crystal%22%20cx%3D%22.5%22%20cy%3D%22.35%22%20r%3D%22.7%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23f6e3b4%22%20stop-opacity%3D%22.8%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23e8c477%22%20stop-opacity%3D%220%22%2F%3E%3C%2FradialGradient%3E%3Cfilter%20id%3D%22soft%22%20x%3D%22-50%25%22%20y%3D%22-50%25%22%20width%3D%22200%25%22%20height%3D%22200%25%22%3E%3CfeGaussianBlur%20stdDeviation%3D%2222%22%2F%3E%3C%2Ffilter%3E%3Cfilter%20id%3D%22bloom%22%20x%3D%22-50%25%22%20y%3D%22-50%25%22%20width%3D%22200%25%22%20height%3D%22200%25%22%3E%3CfeGaussianBlur%20stdDeviation%3D%227%22%2F%3E%3C%2Ffilter%3E%3Csymbol%20id%3D%22hex%22%20viewBox%3D%22-10%20-10%2020%2020%22%3E%3Cpath%20d%3D%22M0-10%208.66-5%208.66%205%200%2010-8.66%205-8.66-5Z%22%20fill%3D%22none%22%20stroke%3D%22url(%23gold)%22%20stroke-width%3D%22.9%22%2F%3E%3C%2Fsymbol%3E%3C%2Fdefs%3E%3Crect%20width%3D%221600%22%20height%3D%221000%22%20fill%3D%22url(%23sky)%22%2F%3E%3Crect%20width%3D%221600%22%20height%3D%221000%22%20fill%3D%22url(%23dawn)%22%2F%3E%3C!--%20arcane%20dust%20--%3E%3Cg%20fill%3D%22%23f6e3b4%22%3E%3Ccircle%20cx%3D%2286%22%20cy%3D%2292%22%20r%3D%221.1%22%20opacity%3D%22.42%22%2F%3E%3Ccircle%20cx%3D%22148%22%20cy%3D%22178%22%20r%3D%22.8%22%20opacity%3D%22.26%22%2F%3E%3Ccircle%20cx%3D%22232%22%20cy%3D%2264%22%20r%3D%221.4%22%20opacity%3D%22.5%22%2F%3E%3Ccircle%20cx%3D%22318%22%20cy%3D%22150%22%20r%3D%22.9%22%20opacity%3D%22.3%22%2F%3E%3Ccircle%20cx%3D%22410%22%20cy%3D%2286%22%20r%3D%221.1%22%20opacity%3D%22.34%22%2F%3E%3Ccircle%20cx%3D%22506%22%20cy%3D%22190%22%20r%3D%22.8%22%20opacity%3D%22.22%22%2F%3E%3Ccircle%20cx%3D%22596%22%20cy%3D%2272%22%20r%3D%221.3%22%20opacity%3D%22.42%22%2F%3E%3Ccircle%20cx%3D%22690%22%20cy%3D%22152%22%20r%3D%22.9%22%20opacity%3D%22.28%22%2F%3E%3Ccircle%20cx%3D%22792%22%20cy%3D%2258%22%20r%3D%221.2%22%20opacity%3D%22.46%22%2F%3E%3Ccircle%20cx%3D%22892%22%20cy%3D%22128%22%20r%3D%22.8%22%20opacity%3D%22.24%22%2F%3E%3Ccircle%20cx%3D%22990%22%20cy%3D%2274%22%20r%3D%221.4%22%20opacity%3D%22.4%22%2F%3E%3Ccircle%20cx%3D%221092%22%20cy%3D%22182%22%20r%3D%22.9%22%20opacity%3D%22.3%22%2F%3E%3Ccircle%20cx%3D%221194%22%20cy%3D%2292%22%20r%3D%221.1%22%20opacity%3D%22.44%22%2F%3E%3Ccircle%20cx%3D%221290%22%20cy%3D%22156%22%20r%3D%22.8%22%20opacity%3D%22.22%22%2F%3E%3Ccircle%20cx%3D%221392%22%20cy%3D%2266%22%20r%3D%221.3%22%20opacity%3D%22.4%22%2F%3E%3Ccircle%20cx%3D%221496%22%20cy%3D%22148%22%20r%3D%22.9%22%20opacity%3D%22.3%22%2F%3E%3Ccircle%20cx%3D%2264%22%20cy%3D%22336%22%20r%3D%22.8%22%20opacity%3D%22.2%22%2F%3E%3Ccircle%20cx%3D%22171%22%20cy%3D%22286%22%20r%3D%221.1%22%20opacity%3D%22.3%22%2F%3E%3Ccircle%20cx%3D%22286%22%20cy%3D%22360%22%20r%3D%22.8%22%20opacity%3D%22.18%22%2F%3E%3Ccircle%20cx%3D%22382%22%20cy%3D%22272%22%20r%3D%221.2%22%20opacity%3D%22.32%22%2F%3E%3Ccircle%20cx%3D%221230%22%20cy%3D%22300%22%20r%3D%221%22%20opacity%3D%22.26%22%2F%3E%3Ccircle%20cx%3D%221338%22%20cy%3D%22360%22%20r%3D%22.8%22%20opacity%3D%22.2%22%2F%3E%3Ccircle%20cx%3D%221446%22%20cy%3D%22286%22%20r%3D%221.2%22%20opacity%3D%22.3%22%2F%3E%3Ccircle%20cx%3D%221536%22%20cy%3D%22380%22%20r%3D%22.8%22%20opacity%3D%22.18%22%2F%3E%3C%2Fg%3E%3C!--%20horizon%20--%3E%3Cellipse%20cx%3D%22800%22%20cy%3D%22588%22%20rx%3D%22620%22%20ry%3D%2254%22%20fill%3D%22url(%23core)%22%20opacity%3D%22.4%22%2F%3E%3Cpath%20d%3D%22M-80%20604Q800%20532%201680%20604%22%20fill%3D%22none%22%20stroke%3D%22%23e8c477%22%20stroke-opacity%3D%22.14%22%2F%3E%3Cpath%20d%3D%22M-80%20604Q800%20546%201680%20604%22%20fill%3D%22none%22%20stroke%3D%22%23f6e3b4%22%20stroke-opacity%3D%22.06%22%2F%3E%3C!--%20receding%20arena%20floor%20--%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23e8c477%22%20stroke-opacity%3D%22.09%22%3E%3Cpath%20d%3D%22M800%20566L-260%201000M800%20566L-40%201000M800%20566L180%201000M800%20566L400%201000M800%20566L620%201000M800%20566L800%201000M800%20566L980%201000M800%20566L1200%201000M800%20566L1420%201000M800%20566L1620%201000M800%20566L1860%201000%22%2F%3E%3Cpath%20d%3D%22M-140%20690Q800%20628%201740%20690%22%20stroke-opacity%3D%22.07%22%2F%3E%3Cpath%20d%3D%22M-140%20772Q800%20706%201740%20772%22%20stroke-opacity%3D%22.08%22%2F%3E%3Cpath%20d%3D%22M-140%20872Q800%20798%201740%20872%22%20stroke-opacity%3D%22.09%22%2F%3E%3Cpath%20d%3D%22M-140%20990Q800%20900%201740%20990%22%20stroke-opacity%3D%22.1%22%2F%3E%3C%2Fg%3E%3C!--%20hex%20arena%3A%20three%20tiers%20%2B%20rune%20ticks%20--%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22url(%23gold)%22%3E%3Cpath%20d%3D%22M800%20280%201215.7%20520V1000L800%201240%20384.3%201000V520Z%22%20stroke-opacity%3D%22.14%22%20stroke-width%3D%221.2%22%2F%3E%3Cpath%20d%3D%22M800%20460%201059.8%20610v300L800%201060%20540.2%20910V610Z%22%20stroke-opacity%3D%22.22%22%20stroke-width%3D%221.4%22%2F%3E%3Cpath%20d%3D%22M800%20610%20940%20690v160L800%20930%20660%20850V690Z%22%20stroke-opacity%3D%22.3%22%20stroke-width%3D%221.6%22%2F%3E%3Ccircle%20cx%3D%22800%22%20cy%3D%22770%22%20r%3D%22472%22%20stroke-dasharray%3D%222%2018%22%20stroke-opacity%3D%22.16%22%2F%3E%3C%2Fg%3E%3C!--%20platform%20glow%20--%3E%3Cellipse%20cx%3D%22800%22%20cy%3D%22792%22%20rx%3D%22230%22%20ry%3D%2270%22%20fill%3D%22url(%23core)%22%20opacity%3D%22.55%22%20filter%3D%22url(%23bloom)%22%2F%3E%3C!--%20the%20golden%20spatula%2C%20an%20original%20geometric%20mark%20--%3E%3Cellipse%20cx%3D%221470%22%20cy%3D%22300%22%20rx%3D%22260%22%20ry%3D%22240%22%20fill%3D%22url(%23core)%22%20opacity%3D%22.42%22%20filter%3D%22url(%23soft)%22%2F%3E%3Cpath%20d%3D%22M1470%20120%201625.9%20210V390L1470%20480%201314.1%20390V210Z%22%20fill%3D%22none%22%20stroke%3D%22url(%23gold)%22%20stroke-opacity%3D%22.14%22%20stroke-width%3D%221.2%22%2F%3E%3Cg%20transform%3D%22translate(1470%20300)%20rotate(-12)%20scale(11.5)%20translate(-12%20-12)%22%20opacity%3D%22.26%22%3E%3Cellipse%20cx%3D%2212%22%20cy%3D%2213%22%20rx%3D%2222%22%20ry%3D%2218%22%20fill%3D%22url(%23crystal)%22%20opacity%3D%22.5%22%20filter%3D%22url(%23soft)%22%2F%3E%3Cg%20fill%3D%22url(%23gold)%22%3E%3Cpath%20d%3D%22M14.4%203.2c1.9-.6%203.9-.3%205.5%201.1%201.4%201.6%201.7%203.6%201.1%205.5-.2.8-.7%201.5-1.3%202.1l-1.1%201.1-7.4-7.4%201.1-1.1c.6-.6%201.3-1.1%202.1-1.3Z%22%2F%3E%3Cpath%20d%3D%22M11.7%208.2%204.2%2015.7%22%20stroke%3D%22url(%23handle)%22%20stroke-width%3D%222.4%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C!--%20floating%20hex%20crystals%20--%3E%3Cg%3E%3Cuse%20href%3D%22%23hex%22%20x%3D%22214%22%20y%3D%22196%22%20width%3D%2234%22%20height%3D%2234%22%20opacity%3D%22.36%22%2F%3E%3Cuse%20href%3D%22%23hex%22%20x%3D%221228%22%20y%3D%22452%22%20width%3D%2222%22%20height%3D%2222%22%20opacity%3D%22.24%22%2F%3E%3Cuse%20href%3D%22%23hex%22%20x%3D%22408%22%20y%3D%22548%22%20width%3D%2230%22%20height%3D%2230%22%20opacity%3D%22.26%22%2F%3E%3Cuse%20href%3D%22%23hex%22%20x%3D%221464%22%20y%3D%22742%22%20width%3D%2226%22%20height%3D%2226%22%20opacity%3D%22.2%22%2F%3E%3Cuse%20href%3D%22%23hex%22%20x%3D%22118%22%20y%3D%22764%22%20width%3D%2220%22%20height%3D%2220%22%20opacity%3D%22.18%22%2F%3E%3Cuse%20href%3D%22%23hex%22%20x%3D%221058%22%20y%3D%22140%22%20width%3D%2216%22%20height%3D%2216%22%20opacity%3D%22.28%22%2F%3E%3Cuse%20href%3D%22%23hex%22%20x%3D%22596%22%20y%3D%22228%22%20width%3D%2218%22%20height%3D%2218%22%20opacity%3D%22.22%22%2F%3E%3Ccircle%20cx%3D%22231%22%20cy%3D%22212%22%20r%3D%222%22%20fill%3D%22%23f6e3b4%22%20opacity%3D%22.4%22%2F%3E%3Ccircle%20cx%3D%221238%22%20cy%3D%22463%22%20r%3D%221.6%22%20fill%3D%22%23f6e3b4%22%20opacity%3D%22.34%22%2F%3E%3Ccircle%20cx%3D%22421%22%20cy%3D%22563%22%20r%3D%222%22%20fill%3D%22%23f6e3b4%22%20opacity%3D%22.3%22%2F%3E%3C%2Fg%3E%3C!--%20frame%20light%20--%3E%3Crect%20width%3D%221600%22%20height%3D%221000%22%20fill%3D%22url(%23vignette)%22%2F%3E%3Crect%20y%3D%22560%22%20width%3D%221600%22%20height%3D%22440%22%20fill%3D%22url(%23floor)%22%2F%3E%3C%2Fsvg%3E\");\n  background-color: #080b14;\n  background-image:\n    var(--jcc-scene, none),\n    radial-gradient(\n      1200px 620px at 50% -240px,\n      color-mix(in srgb, var(--jcc-accent) 15%, transparent),\n      transparent 70%\n    ),\n    radial-gradient(\n      1000px 560px at 106% 110%,\n      color-mix(in srgb, var(--jcc-accent) 9%, transparent),\n      transparent 72%\n    ),\n    repeating-linear-gradient(\n      60deg,\n      color-mix(in srgb, var(--jcc-deco) var(--jcc-grid-p), transparent) 0 1px,\n      transparent 1px var(--jcc-grid)\n    ),\n    repeating-linear-gradient(\n      -60deg,\n      color-mix(in srgb, var(--jcc-deco) var(--jcc-grid-p), transparent) 0 1px,\n      transparent 1px var(--jcc-grid)\n    ),\n    repeating-linear-gradient(\n      0deg,\n      color-mix(in srgb, var(--jcc-deco) var(--jcc-grid-p2), transparent) 0 1px,\n      transparent 1px calc(var(--jcc-grid) * 0.86)\n    );\n}\n\n/* A thin arcane seam along the top edge of the viewport. */\n:root[data-jcc=\"on\"] body::before {\n  content: \"\";\n  position: fixed;\n  inset: 0 0 auto 0;\n  height: 1px;\n  z-index: 2147482000;\n  pointer-events: none;\n  background: linear-gradient(\n    90deg,\n    transparent,\n    color-mix(in srgb, var(--jcc-accent) 78%, transparent) 22%,\n    color-mix(in srgb, var(--jcc-accent-2) 90%, transparent) 50%,\n    color-mix(in srgb, var(--jcc-accent) 78%, transparent) 78%,\n    transparent\n  );\n  opacity: 0.7;\n}\n\n:root[data-jcc=\"on\"] ::selection {\n  background: color-mix(in srgb, var(--jcc-accent) 38%, transparent);\n}\n\n/* ── 2. Launcher: the hex core in the bottom-right corner ───────────────── */\n\n.jcc-dock {\n  position: fixed;\n  right: 18px;\n  bottom: 18px;\n  z-index: 2147483000;\n  width: 46px;\n  height: 52px;\n  pointer-events: none;\n}\n\n.jcc-dock *,\n.jcc-panel *,\n.jcc-panel {\n  box-sizing: border-box;\n}\n\n.jcc-halo {\n  position: absolute;\n  inset: -9px;\n  border-radius: 50%;\n  background: conic-gradient(\n    from 0deg,\n    transparent 0 66%,\n    color-mix(in srgb, var(--jcc-accent) 85%, transparent) 84%,\n    transparent 100%\n  );\n  filter: blur(9px);\n  opacity: 0.55;\n  animation: jcc-orbit 9s linear infinite;\n  pointer-events: none;\n}\n\n.jcc-orb {\n  position: relative;\n  display: grid;\n  place-items: center;\n  width: 46px;\n  height: 52px;\n  padding: 0;\n  border: 0;\n  cursor: pointer;\n  pointer-events: auto;\n  color: var(--jcc-accent-2);\n  background: linear-gradient(\n    165deg,\n    var(--jcc-accent-2),\n    var(--jcc-accent) 48%,\n    var(--jcc-accent-deep)\n  );\n  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);\n  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.4));\n  transition: transform 0.18s var(--jcc-ease), filter 0.18s var(--jcc-ease);\n}\n\n.jcc-orb::before {\n  content: \"\";\n  position: absolute;\n  inset: 2px;\n  clip-path: inherit;\n  background:\n    radial-gradient(circle at 50% 26%, #243352, #0a0f1b 74%),\n    repeating-linear-gradient(\n      60deg,\n      rgba(255, 255, 255, 0.05) 0 1px,\n      transparent 1px 9px\n    );\n}\n\n.jcc-orb svg {\n  position: relative;\n  z-index: 1;\n  width: 22px;\n  height: 22px;\n  filter: drop-shadow(0 0 7px color-mix(in srgb, var(--jcc-accent) 65%, transparent));\n}\n\n.jcc-orb:hover {\n  transform: translateY(-1px) scale(1.04);\n  filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.45))\n    drop-shadow(0 0 14px color-mix(in srgb, var(--jcc-accent) 45%, transparent));\n}\n\n.jcc-orb:active {\n  transform: scale(0.97);\n}\n\n.jcc-orb:focus-visible {\n  outline: none;\n  filter: drop-shadow(0 0 12px color-mix(in srgb, var(--jcc-accent) 85%, transparent));\n}\n\n.jcc-orb:focus-visible::before {\n  inset: 4px;\n  box-shadow: inset 0 0 0 2px var(--jcc-accent-2);\n}\n\n.jcc-dock:has(.jcc-orb:focus-visible)::after {\n  content: \"\";\n  position: absolute;\n  inset: -5px;\n  border: 2px solid var(--jcc-accent-2);\n  border-radius: 16px;\n  opacity: 0.9;\n  pointer-events: none;\n}\n\n.jcc-orb.is-open {\n  transform: scale(0.96);\n}\n\n:root[data-jcc=\"off\"] .jcc-halo {\n  opacity: 0.12;\n  animation: none;\n}\n\n:root[data-jcc=\"off\"] .jcc-orb {\n  filter: grayscale(0.55) brightness(0.86) drop-shadow(0 6px 14px rgba(0, 0, 0, 0.35));\n}\n\n/* ── 3. Panel: the hex-core HUD ─────────────────────────────────────────── */\n\n.jcc-panel {\n  position: fixed;\n  right: 18px;\n  bottom: 82px;\n  z-index: 2147483001;\n  width: 278px;\n  max-height: calc(100vh - 160px);\n  overflow: auto;\n  padding: 14px 14px 12px;\n  color: var(--jcc-hud-text);\n  background:\n    radial-gradient(\n      220px 140px at 100% 0,\n      color-mix(in srgb, var(--jcc-accent) 12%, transparent),\n      transparent 70%\n    ),\n    linear-gradient(180deg, #131c2e, var(--jcc-hud-bg) 72%);\n  border: 1px solid color-mix(in srgb, var(--jcc-accent) 42%, transparent);\n  border-radius: 16px;\n  box-shadow:\n    0 26px 70px rgba(0, 0, 0, 0.55),\n    0 0 0 1px rgba(0, 0, 0, 0.35),\n    0 0 40px -14px color-mix(in srgb, var(--jcc-accent) 60%, transparent);\n  font: 400 13px/1.45 var(--dsw-font-family, system-ui, sans-serif);\n  -webkit-backdrop-filter: blur(18px) saturate(1.1);\n  backdrop-filter: blur(18px) saturate(1.1);\n  animation: jcc-pop 0.18s var(--jcc-ease);\n}\n\n.jcc-panel[hidden] {\n  display: none;\n}\n\n.jcc-panel::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 18px;\n  right: 18px;\n  height: 1px;\n  background: linear-gradient(\n    90deg,\n    transparent,\n    color-mix(in srgb, var(--jcc-accent) 80%, transparent),\n    transparent\n  );\n}\n\n.jcc-panel button:focus-visible {\n  outline: 2px solid var(--jcc-accent-2);\n  outline-offset: 2px;\n}\n\n.jcc-panel__top {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  padding-bottom: 11px;\n  border-bottom: 1px solid var(--jcc-hud-line);\n}\n\n.jcc-brand {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  min-width: 0;\n}\n\n.jcc-mark {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 30px;\n  height: 34px;\n  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);\n  background: linear-gradient(160deg, var(--jcc-accent-2), var(--jcc-accent-deep));\n  color: #10131c;\n}\n\n.jcc-mark svg {\n  width: 15px;\n  height: 15px;\n}\n\n.jcc-brand b {\n  display: block;\n  font-size: 13.5px;\n  font-weight: 600;\n  letter-spacing: 0.06em;\n  line-height: 1.25;\n}\n\n.jcc-brand small {\n  display: block;\n  margin-top: 2px;\n  color: var(--jcc-hud-text-3);\n  font-size: 10.5px;\n  letter-spacing: 0.04em;\n  white-space: nowrap;\n}\n\n.jcc-x {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 26px;\n  height: 26px;\n  padding: 0;\n  border: 0;\n  border-radius: 8px;\n  color: var(--jcc-hud-text-3);\n  background: transparent;\n  cursor: pointer;\n}\n\n.jcc-x:hover {\n  color: var(--jcc-hud-text);\n  background: rgba(255, 255, 255, 0.07);\n}\n\n.jcc-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  padding: 11px 0;\n}\n\n.jcc-field {\n  display: flex;\n  flex-direction: column;\n  gap: 9px;\n  padding: 11px 0;\n}\n\n.jcc-row + .jcc-field,\n.jcc-field + .jcc-field {\n  border-top: 1px solid rgba(255, 255, 255, 0.06);\n}\n\n.jcc-label {\n  color: var(--jcc-hud-text-2);\n  font-size: 12.5px;\n  letter-spacing: 0.02em;\n}\n\n.jcc-label em {\n  margin-left: 5px;\n  color: var(--jcc-hud-text-3);\n  font-size: 10.5px;\n  font-style: normal;\n}\n\n/* switch */\n.jcc-switch {\n  position: relative;\n  flex: none;\n  width: 40px;\n  height: 22px;\n  padding: 0;\n  border: 1px solid color-mix(in srgb, var(--jcc-accent) 40%, transparent);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.08);\n  cursor: pointer;\n  transition: background 0.18s, border-color 0.18s;\n}\n\n.jcc-switch > span {\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background: var(--jcc-hud-text-3);\n  transition: transform 0.18s var(--jcc-ease), background 0.18s;\n}\n\n.jcc-switch[aria-checked=\"true\"] {\n  border-color: transparent;\n  background: linear-gradient(90deg, var(--jcc-accent-deep), var(--jcc-accent));\n}\n\n.jcc-switch[aria-checked=\"true\"] > span {\n  transform: translateX(18px);\n  background: #12100a;\n}\n\n/* accent swatches */\n.jcc-swatches {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 8px;\n}\n\n.jcc-swatch {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 5px;\n  padding: 7px 4px 6px;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 10px;\n  color: var(--jcc-hud-text-3);\n  background: transparent;\n  font: inherit;\n  font-size: 10.5px;\n  letter-spacing: 0.02em;\n  cursor: pointer;\n  transition: border-color 0.15s, background 0.15s, color 0.15s;\n}\n\n.jcc-swatch:hover {\n  background: rgba(255, 255, 255, 0.05);\n}\n\n.jcc-swatch[aria-pressed=\"true\"] {\n  color: var(--jcc-hud-text);\n  border-color: color-mix(in srgb, var(--jcc-accent) 60%, transparent);\n  background: color-mix(in srgb, var(--jcc-accent) 10%, transparent);\n}\n\n.jcc-hex {\n  width: 22px;\n  height: 25px;\n  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);\n  background: linear-gradient(160deg, #f6e3b4, #c99a2e 60%, #8a6413);\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);\n}\n\n.jcc-swatch[data-accent=\"cyan\"] .jcc-hex {\n  background: linear-gradient(160deg, #a8fff3, #2ec4b6 60%, #0b6b63);\n}\n\n.jcc-swatch[data-accent=\"violet\"] .jcc-hex {\n  background: linear-gradient(160deg, #e2d6ff, #9b7bea 60%, #5b3bbd);\n}\n\n/* texture segmented control */\n.jcc-seg {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 2px;\n  padding: 2px;\n  border: 1px solid rgba(255, 255, 255, 0.09);\n  border-radius: 9px;\n  background: rgba(255, 255, 255, 0.04);\n}\n\n.jcc-seg button {\n  padding: 5px 0;\n  border: 0;\n  border-radius: 7px;\n  color: var(--jcc-hud-text-3);\n  background: transparent;\n  font: inherit;\n  font-size: 11.5px;\n  cursor: pointer;\n}\n\n.jcc-seg button[aria-pressed=\"true\"] {\n  color: var(--jcc-hud-text);\n  background: rgba(255, 255, 255, 0.09);\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);\n}\n\n.jcc-panel__foot {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  margin-top: 2px;\n  padding-top: 10px;\n  border-top: 1px solid var(--jcc-hud-line);\n  color: var(--jcc-hud-text-3);\n  font-size: 10.5px;\n  letter-spacing: 0.02em;\n}\n\n.jcc-reset {\n  padding: 2px 4px;\n  border: 0;\n  border-radius: 6px;\n  color: var(--jcc-accent-2);\n  background: transparent;\n  font: inherit;\n  font-size: 11px;\n  cursor: pointer;\n}\n\n.jcc-reset:hover {\n  background: rgba(255, 255, 255, 0.06);\n}\n\n/* ── 4. Motion ──────────────────────────────────────────────────────────── */\n\n@keyframes jcc-orbit {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes jcc-pop {\n  from {\n    opacity: 0;\n    transform: translateY(6px) scale(0.985);\n  }\n}\n\n/* ── 5. Small screens ───────────────────────────────────────────────────── */\n\n@media (max-width: 860px) {\n  .jcc-dock {\n    right: 12px;\n    bottom: 92px;\n    transform: scale(0.94);\n    transform-origin: bottom right;\n  }\n\n  .jcc-panel {\n    right: 12px;\n    bottom: 152px;\n    width: min(278px, calc(100vw - 24px));\n    max-height: calc(100vh - 240px);\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .jcc-halo {\n    animation: none;\n  }\n\n  .jcc-panel {\n    animation: none;\n  }\n\n  .jcc-orb,\n  .jcc-switch,\n  .jcc-switch > span,\n  .jcc-swatch {\n    transition: none;\n  }\n}\n"

  /* ---------------------------------------------------------------------
   * Palette
   *
   * BASE holds the scheme-wide surfaces and labels. ACCENTS holds the three
   * identity colours; their border/brand/link tokens are derived from `line`
   * by appending an alpha pair to the six-digit hex.
   * ------------------------------------------------------------------- */

  var BASE = {
    light: {
      '--dsw-alias-bg-base': '#f7f1e3',
      '--dsw-alias-bg-document-preview': '#f5eddb',
      '--dsw-alias-bg-layer-1': '#fbf7ec',
      '--dsw-alias-bg-layer-2': '#f5eddb',
      '--dsw-alias-bg-layer-3': '#efe4cc',
      '--dsw-alias-bg-overlay': '#fdf9f0',
      '--dsw-alias-bg-module-platform': '#f3ead7',
      '--dsw-alias-bg-multi-select': '#f0e6d0',
      '--dsw-alias-bg-skeleton': '#0000000a',
      '--dsw-alias-bg-document-selection':
        'color-mix(in srgb, var(--jcc-accent) 30%, transparent)',
      '--dsw-alias-label-primary': '#241d12',
      '--dsw-alias-label-primary-bluish': '#3d3324',
      '--dsw-alias-label-primary-dimmed': '#3d3324',
      '--dsw-alias-label-primary-foreground': '#1a1206',
      '--dsw-alias-label-primary-inverted': '#fbf7ec',
      '--dsw-alias-label-secondary': '#554a38',
      '--dsw-alias-label-tertiary': '#7c6f58',
      '--dsw-alias-label-caption': '#94876e',
      '--dsw-alias-label-dimmed': '#b3a68c',
      '--dsw-alias-label-shimmer': 'color-mix(in srgb, #241d12 30%, transparent)',
      '--dsw-alias-label-document-preview': '#554a38',
      '--dsw-alias-menu-icon': '#554a38',
      '--dsw-alias-menu-group-header-fill': '#f6efdef7',
      '--dsw-menu-surface-fill': '#fbf7ecf2',
      '--dsw-specific-menu': '#fbf7ecf2',
      '--dsw-alias-settings-card-fill': '#fdf9f0',
      '--dsw-specific-bubble': '#f6ead0',
      '--dsw-specific-bubble-highlight': '#efdfba',
      '--dsw-specific-input-major': '#fdf9f0',
      '--dsw-specific-login-input': '#f5eddb',
      '--dsw-specific-selector': '#efe4cc',
      '--dsw-specific-sidebar-fill': '#f1e7d2',
      '--dsw-specific-sidebar-nav-item-hover': '#6b4f1a12',
      '--dsw-specific-tip': '#ece1c8',
      '--dsw-alias-tooltip-bg': '#2a2418',
      '--dsw-alias-tooltip-key-bg': '#3d3324',
      '--dsw-alias-toast-bg': '#2a2418',
      '--dsw-alias-toast-label': '#fbf7ec',
      '--dsw-alias-button-elevated-fill': '#fbf7ec',
      '--dsw-alias-button-floating-fill': '#fbf7ec',
      '--dsw-alias-button-floating-hover': '#f3ead7',
      '--dsw-alias-button-contrast-fill': '#241d12',
      '--dsw-alias-button-primary-dimmed': '#eadfc6',
      '--dsw-alias-interactive-bg-hover': '#6b4f1a0f',
      '--dsw-alias-interactive-bg-hover-solid': '#efe4cc',
      '--dsw-alias-interactive-bg-active': '#6b4f1a1a',
      '--dsw-alias-markdown-code-block': '#f4ecda',
      '--dsw-alias-markdown-code-block-banner': '#efe4cc',
      '--dsw-alias-markdown-code-segment-selected': '#fbf7ec',
      '--dsw-alias-markdown-code-segment-unselected': '#f0e6d0',
      '--dsw-alias-markdown-inline-code': '#f0e6d0',
      '--dsw-alias-markdown-citation': '#efe4cc',
      '--dsw-alias-markdown-placeholder': '#b3a68c',
      '--dsw-alias-markdown-tag': '#f0e6d0',
      '--dsw-alias-turn-trigger-bg': '#f4ecda',
      '--dsw-alias-turn-trigger-bg-hover': '#efe4cc',
      '--dsw-alias-switch-thumb': '#fdf9f0',
      '--dsw-alias-scrollbar-bg-l1': '#d9c9a8',
      '--dsw-alias-scrollbar-bg-l2': '#d9c9a8',
      '--dsw-alias-scrollbar-hover-l1': '#c4b08a',
      '--dsw-alias-scrollbar-hover-l2': '#c4b08a'
    },
    dark: {
      '--dsw-alias-bg-base': '#080b14',
      '--dsw-alias-bg-document-preview': '#0e1524',
      '--dsw-alias-bg-layer-1': '#0e1524',
      '--dsw-alias-bg-layer-2': '#121b2e',
      '--dsw-alias-bg-layer-3': '#18243b',
      '--dsw-alias-bg-overlay': '#131c30',
      '--dsw-alias-bg-module-platform': '#0f1728',
      '--dsw-alias-bg-multi-select': '#1b2740',
      '--dsw-alias-bg-skeleton': '#ffffff0d',
      '--dsw-alias-bg-document-selection':
        'color-mix(in srgb, var(--jcc-accent) 32%, transparent)',
      '--dsw-alias-label-primary': '#f4ecdc',
      '--dsw-alias-label-primary-bluish': '#e2d6bd',
      '--dsw-alias-label-primary-dimmed': '#e2d6bd',
      '--dsw-alias-label-primary-foreground': '#171004',
      '--dsw-alias-label-primary-inverted': '#0b0f18',
      '--dsw-alias-label-secondary': '#c9bda4',
      '--dsw-alias-label-tertiary': '#9a907b',
      '--dsw-alias-label-caption': '#7b7261',
      '--dsw-alias-label-dimmed': '#5a5346',
      '--dsw-alias-label-shimmer': 'color-mix(in srgb, #f4ecdc 30%, transparent)',
      '--dsw-alias-label-document-preview': '#9a907b',
      '--dsw-alias-menu-icon': '#d9c9a5',
      '--dsw-alias-menu-group-header-fill': '#131b2ef7',
      '--dsw-menu-surface-fill': '#131b2ef2',
      '--dsw-specific-menu': '#131b2ef2',
      '--dsw-alias-settings-card-fill': '#0f1728',
      '--dsw-specific-bubble': '#1a2236',
      '--dsw-specific-bubble-highlight': '#232e48',
      '--dsw-specific-input-major': '#0d1424',
      '--dsw-specific-login-input': '#0b1220',
      '--dsw-specific-selector': '#1b2740',
      '--dsw-specific-sidebar-fill': '#0a0f1b',
      '--dsw-specific-sidebar-nav-item-hover': '#ffffff0f',
      '--dsw-specific-tip': '#18243b',
      '--dsw-alias-tooltip-bg': '#1a2438',
      '--dsw-alias-tooltip-key-bg': '#2a3a55',
      '--dsw-alias-toast-bg': '#1a2438',
      '--dsw-alias-toast-label': '#f4ecdc',
      '--dsw-alias-button-elevated-fill': '#121b2e',
      '--dsw-alias-button-floating-fill': '#121b2e',
      '--dsw-alias-button-floating-hover': '#18243b',
      '--dsw-alias-button-contrast-fill': '#f4ecdc',
      '--dsw-alias-button-primary-dimmed': '#3a3020',
      '--dsw-alias-interactive-bg-hover': '#ffffff14',
      '--dsw-alias-interactive-bg-hover-solid': '#1a2338',
      '--dsw-alias-interactive-bg-active': '#ffffff1f',
      '--dsw-alias-markdown-code-block': '#0b1220',
      '--dsw-alias-markdown-code-block-banner': '#0f1829',
      '--dsw-alias-markdown-code-segment-selected': '#1e2a42',
      '--dsw-alias-markdown-code-segment-unselected': '#131c2e',
      '--dsw-alias-markdown-inline-code': '#1a2235',
      '--dsw-alias-markdown-citation': '#1a2438',
      '--dsw-alias-markdown-placeholder': '#5f5748',
      '--dsw-alias-markdown-tag': '#1d2940',
      '--dsw-alias-turn-trigger-bg': '#101a2c',
      '--dsw-alias-turn-trigger-bg-hover': '#17233a',
      '--dsw-alias-switch-thumb': '#f4ecdc',
      '--dsw-alias-scrollbar-bg-l1': '#1a2438',
      '--dsw-alias-scrollbar-bg-l2': '#1a2438',
      '--dsw-alias-scrollbar-hover-l1': '#2a3a55',
      '--dsw-alias-scrollbar-hover-l2': '#2a3a55'
    }
  }

  var ACCENTS = {
    gold: {
      light: { fill: '#d1a545', hover: '#bd9236', line: '#a97f2e', strong: '#8a6413', ink: '#201705' },
      dark: { fill: '#e8c477', hover: '#f4d99b', line: '#e8c477', strong: '#f0cf8a', ink: '#171004' },
      accent: '#e8c477',
      accent2: '#f6e3b4',
      accentDeep: '#a97f2e'
    },
    cyan: {
      light: { fill: '#2ec4b6', hover: '#21b0a3', line: '#0f766e', strong: '#0b6b63', ink: '#04201d' },
      dark: { fill: '#56e6d4', hover: '#8af5e8', line: '#56e6d4', strong: '#a8fff3', ink: '#04201d' },
      accent: '#56e6d4',
      accent2: '#a8fff3',
      accentDeep: '#0f766e'
    },
    violet: {
      light: { fill: '#9b7bea', hover: '#8a66e0', line: '#6d4bd1', strong: '#5b3bbd', ink: '#170e2b' },
      dark: { fill: '#b08cff', hover: '#cbb4ff', line: '#b08cff', strong: '#d9c7ff', ink: '#170e2b' },
      accent: '#b08cff',
      accent2: '#d9c7ff',
      accentDeep: '#6d4bd1'
    }
  }

  /** One accent's derived tokens. `line` is a six-digit hex; alpha is appended. */
  function accentTokens(id, scheme) {
    var a = ACCENTS[id][scheme]
    var line = a.line
    var dark = scheme === 'dark'
    return {
      '--dsw-alias-border-l1': line + (dark ? '1f' : '14'),
      '--dsw-alias-border-l2': line + (dark ? '2e' : '24'),
      '--dsw-alias-border-l2-darkmode-thin': line + (dark ? '1f' : '1a'),
      '--dsw-alias-border-l3': line + (dark ? '3d' : '2e'),
      '--dsw-alias-border-l4': line + (dark ? '4d' : '3d'),
      '--dsw-alias-border-inverted': line + (dark ? '1a' : '14'),
      '--dsw-alias-border-inverted2': line + (dark ? '24' : '1f'),
      '--dsw-alias-brand-primary': a.fill,
      '--dsw-alias-brand-primary-invert': a.ink,
      '--dsw-alias-brand-text': a.strong,
      '--dsw-alias-link': a.strong,
      '--dsw-alias-button-primary-fill': a.fill,
      '--dsw-alias-button-primary-hover': a.hover,
      '--dsw-alias-button-info-fill': a.fill,
      '--dsw-alias-button-info-hover': a.hover,
      '--dsw-alias-button-ghost-active-border': line + (dark ? '8c' : '66'),
      '--dsw-alias-button-ghost-active-fill': line + (dark ? '24' : '1f'),
      '--dsw-alias-button-ghost-active-hover': line + (dark ? '2e' : '29'),
      '--dsw-alias-interactive-bg-hover-accent': line + (dark ? '24' : '1f'),
      '--dsw-alias-settings-card-stroke': line + (dark ? '33' : '2b'),
      '--dsw-alias-state-business-primary': a.strong,
      '--dsw-alias-state-business-tertiary': line + (dark ? '1f' : '14'),
      '--dsw-alias-label-deep-diving': a.strong,
      '--dsw-alias-label-deep-diving-shimmer': a.fill,
      '--dsw-alias-switch-thumb': a.fill,
      '--dsw-specific-sidebar-nav-item-active': line + '1f',
      '--dsw-specific-sidebar-nav-item-active-accent': line + (dark ? '2b' : '26'),
      '--dsw-focus-ring-color': a.strong
    }
  }

  function declarations(tokens) {
    var out = ''
    for (var name in tokens) {
      if (Object.prototype.hasOwnProperty.call(tokens, name)) {
        out += name + ':' + tokens[name] + ';'
      }
    }
    return out
  }

  /**
   * The generated half of the stylesheet: base tokens once, then one block
   * pair per accent. Accent blocks are more specific, so switching
   * `data-jcc-accent` needs no re-injection and no reload.
   */
  function paletteCss() {
    var out = []
    out.push(
      ':root{--jcc-accent:' + ACCENTS.gold.accent + ';--jcc-accent-2:' +
        ACCENTS.gold.accent2 + ';--jcc-accent-deep:' + ACCENTS.gold.accentDeep + ';}'
    )
    out.push(
      ':root[data-jcc="on"] body:not([data-ds-dark-theme]){' + declarations(BASE.light) + '}'
    )
    out.push(
      ':root[data-jcc="on"] body[data-ds-dark-theme]{' + declarations(BASE.dark) + '}'
    )
    for (var i = 0; i < ACCENT_IDS.length; i += 1) {
      var id = ACCENT_IDS[i]
      var a = ACCENTS[id]
      out.push(
        ':root[data-jcc-accent="' + id + '"]{--jcc-accent:' + a.accent +
          ';--jcc-accent-2:' + a.accent2 + ';--jcc-accent-deep:' + a.accentDeep + ';}'
      )
      out.push(
        ':root[data-jcc="on"][data-jcc-accent="' + id +
          '"] body:not([data-ds-dark-theme]){' + declarations(accentTokens(id, 'light')) + '}'
      )
      out.push(
        ':root[data-jcc="on"][data-jcc-accent="' + id +
          '"] body[data-ds-dark-theme]{' + declarations(accentTokens(id, 'dark')) + '}'
      )
    }
    return out.join('\n')
  }

  /* ---------------------------------------------------------------------
   * Copy
   * ------------------------------------------------------------------- */

  var COPY = {
    zh: {
      title: '海克斯核心',
      sub: '金铲铲 · 同人主题',
      enable: '启用主题',
      accent: '强化符文',
      accentHint: '强调色',
      texture: '棋盘纹理',
      textures: ['淡', '标准', '浓烈'],
      reset: '恢复默认',
      close: '关闭',
      open: '金铲铲主题设置',
      foot: '非官方同人',
      names: { gold: '海克斯金', cyan: '奥术青', violet: '狂暴紫' },
      short: { gold: '金', cyan: '青', violet: '紫' }
    },
    en: {
      title: 'Hextech Core',
      sub: 'Golden Spatula · fan theme',
      enable: 'Theme on',
      accent: 'Augment',
      accentHint: 'accent',
      texture: 'Board texture',
      textures: ['Subtle', 'Standard', 'Vivid'],
      reset: 'Reset',
      close: 'Close',
      open: 'Golden Spatula theme settings',
      foot: 'unofficial fan work',
      names: { gold: 'Hextech Gold', cyan: 'Arcane Cyan', violet: 'Fury Violet' },
      short: { gold: 'Gold', cyan: 'Cyan', violet: 'Violet' }
    }
  }

  function uiLang() {
    try {
      return document.documentElement.lang || (navigator && navigator.language) || 'zh'
    } catch (error) {
      return 'zh'
    }
  }

  function currentCopy() {
    return /^en/i.test(uiLang()) ? COPY.en : COPY.zh
  }

  /* ---------------------------------------------------------------------
   * Icons (original geometry — no game assets)
   * ------------------------------------------------------------------- */

  var HEX_SVG =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<path d="M12 2.5 20.5 7.35v9.3L12 21.5 3.5 16.65v-9.3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M12 8.2 15.4 12 12 15.8 8.6 12Z" fill="currentColor"/>' +
    '</svg>'

  var SPATULA_SVG =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<path d="M14.4 3.2c1.9-.6 3.9-.3 5.5 1.1 1.4 1.6 1.7 3.6 1.1 5.5-.2.8-.7 1.5-1.3 2.1l-1.1 1.1-7.4-7.4 1.1-1.1c.6-.6 1.3-1.1 2.1-1.3Z" fill="currentColor"/>' +
    '<path d="M11.7 8.2 4.2 15.7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>' +
    '<path d="M3.1 16.4c1.1-.4 2.4-.2 3.3.7.9.9 1.1 2.2.7 3.3-1.1.4-2.4.2-3.3-.7-.9-.9-1.1-2.2-.7-3.3Z" fill="currentColor" opacity=".75"/>' +
    '</svg>'

  var X_SVG =
    '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
    '<path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
    '</svg>'

  /* Test / preview surface: the palette generator without materializing the UI. */
  globalThis.__jccThemeSource = {
    id: PKG,
    version: VERSION,
    accents: ACCENT_IDS,
    textures: TEXTURES,
    paletteCss: paletteCss,
    accentTokens: accentTokens,
    base: BASE
  }

  /* ---------------------------------------------------------------------
   * Browser module
   * ------------------------------------------------------------------- */

  window.__ModuleLoader__.load({
    id: PKG,
    factory: function (require) {
      var module = { exports: {} }
      var exports = module.exports

      var state = readState()
      var mounted = false
      var open = false
      var styleEl = null
      var dock = null
      var panel = null
      var orb = null
      var readyBound = false
      var localeObserver = null
      var localeBucket = ''
      var canvasObserver = null
      var canvasTimer = 0
      var canvasPath = ''

      function readState() {
        var fallback = { on: true, accent: 'gold', texture: 'normal' }
        try {
          var raw = window.localStorage.getItem(STORE_KEY)
          if (!raw) return fallback
          var saved = JSON.parse(raw)
          if (!saved || typeof saved !== 'object') return fallback
          if (typeof saved.on === 'boolean') fallback.on = saved.on
          if (ACCENT_IDS.indexOf(saved.accent) !== -1) fallback.accent = saved.accent
          if (TEXTURES.indexOf(saved.texture) !== -1) fallback.texture = saved.texture
        } catch (error) {
          /* private mode, disabled storage, corrupt JSON — defaults are fine */
        }
        return fallback
      }

      function saveState() {
        try {
          window.localStorage.setItem(STORE_KEY, JSON.stringify(state))
        } catch (error) {
          /* the theme still works for this page; the choice just won't persist */
        }
      }

      function applyAttributes() {
        var root = document.documentElement
        root.dataset.jcc = state.on ? 'on' : 'off'
        root.dataset.jccAccent = state.accent
        root.dataset.jccTexture = state.texture
      }

      /* -------------------------------------------------------------------
       * Locale
       *
       * The shell sets <html lang> after the first client modules run, so a
       * copy computed once at mount can latch onto the pre-locale default.
       * Watch the attribute and rebuild the panel when the language flips.
       * ----------------------------------------------------------------- */

      function localeBucketOf() {
        return /^en/i.test(uiLang()) ? 'en' : 'zh'
      }

      function watchLocale() {
        localeBucket = localeBucketOf()
        if (typeof MutationObserver !== 'function') return
        localeObserver = new MutationObserver(function () {
          var next = localeBucketOf()
          if (next === localeBucket) return
          localeBucket = next
          refreshCopy()
        })
        localeObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['lang']
        })
      }

      function refreshCopy() {
        if (!orb || !panel) return
        var c = currentCopy()
        orb.setAttribute('aria-label', c.open)
        orb.setAttribute('title', c.open)
        panel.setAttribute('aria-label', c.title)
        panel.innerHTML = panelHtml(c)
        syncUi()
      }

      /* -------------------------------------------------------------------
       * Canvas layers
       *
       * The app frame and every SPA page root paint themselves with
       * --dsw-alias-bg-base and would hide the body canvas. Find the layers
       * that actually cover the viewport (and are not overlays) through
       * hit-testing, and mark only those. Sticky headers, cards and
       * attachments that use the same token stay opaque.
       * ----------------------------------------------------------------- */

      function unmarkCanvas() {
        var marked = document.querySelectorAll('.jcc-canvas')
        for (var i = 0; i < marked.length; i += 1) marked[i].classList.remove('jcc-canvas')
      }

      function markCanvas() {
        if (!state.on || !document.body) {
          unmarkCanvas()
          return
        }
        var root = document.getElementById('root')
        if (!root || typeof document.elementsFromPoint !== 'function') return

        /* Once this view's canvas layers are marked they stay marked, so a
           streaming transcript (which mutates the DOM constantly) does not
           need a new hit-test per batch. A route change or a re-rendered
           frame drops the class and rescans. */
        var path = window.location.pathname + window.location.hash
        if (path === canvasPath && document.querySelector('.jcc-canvas')) return
        canvasPath = path

        var base = getComputedStyle(document.body).backgroundColor
        var w = window.innerWidth
        var h = window.innerHeight
        if (!w || !h) return

        var points = [
          [w * 0.5, h * 0.5],
          [w * 0.85, h * 0.2],
          [w * 0.15, h * 0.85]
        ]
        for (var p = 0; p < points.length; p += 1) {
          var under = document.elementsFromPoint(points[p][0], points[p][1])
          for (var i = 0; i < under.length; i += 1) {
            var el = under[i]
            if (el === document.body || el === document.documentElement) continue
            var cs = getComputedStyle(el)
            if (cs.backgroundColor !== base || cs.backgroundImage !== 'none') continue
            if (cs.position === 'fixed') continue
            var rect = el.getBoundingClientRect()
            if (rect.width >= w * 0.6 && rect.height >= h * 0.6) {
              el.classList.add('jcc-canvas')
            }
          }
        }
      }

      function scheduleCanvas() {
        if (canvasTimer) return
        canvasTimer = window.setTimeout(function () {
          canvasTimer = 0
          markCanvas()
        }, 120)
      }

      function watchCanvas() {
        if (typeof MutationObserver !== 'function') return
        canvasObserver = new MutationObserver(scheduleCanvas)
        canvasObserver.observe(document.body, { childList: true, subtree: true })
        window.addEventListener('resize', scheduleCanvas)
      }

      function setState(patch) {
        state = {
          on: patch.on === undefined ? state.on : Boolean(patch.on),
          accent: ACCENT_IDS.indexOf(patch.accent) === -1 ? state.accent : patch.accent,
          texture: TEXTURES.indexOf(patch.texture) === -1 ? state.texture : patch.texture
        }
        saveState()
        applyAttributes()
        syncUi()
        if (state.on) scheduleCanvas()
        else unmarkCanvas()
      }

      /* -------------------------------------------------------------------
       * Stylesheet
       * ----------------------------------------------------------------- */

      function ensureStyle() {
        if (!styleEl || !styleEl.isConnected) {
          styleEl = document.getElementById(STYLE_ID)
        }
        if (!styleEl) {
          styleEl = document.createElement('style')
          styleEl.id = STYLE_ID
          styleEl.setAttribute('data-plugin', PKG)
          ;(document.head || document.documentElement).appendChild(styleEl)
        }
        var css = STATIC_CSS + '\n' + paletteCss()
        if (styleEl.textContent !== css) styleEl.textContent = css
      }

      /* -------------------------------------------------------------------
       * Chrome (launcher + panel)
       * ----------------------------------------------------------------- */

      function swatch(id, c) {
        return (
          '<button type="button" class="jcc-swatch" data-accent="' + id +
          '" aria-pressed="false" aria-label="' + c.names[id] + '" title="' + c.names[id] + '">' +
          '<span class="jcc-hex"></span><span>' + c.short[id] + '</span></button>'
        )
      }

      function panelHtml(c) {
        return (
          '<div class="jcc-panel__top">' +
          '<div class="jcc-brand">' +
          '<span class="jcc-mark" aria-hidden="true">' + HEX_SVG + '</span>' +
          '<span class="jcc-brand__text"><b>' + c.title + '</b><small>' + c.sub + '</small></span>' +
          '</div>' +
          '<button type="button" class="jcc-x" data-jcc="close" aria-label="' + c.close +
          '" title="' + c.close + '">' + X_SVG + '</button>' +
          '</div>' +
          '<div class="jcc-row">' +
          '<span class="jcc-label">' + c.enable + '</span>' +
          '<button type="button" class="jcc-switch" data-jcc="toggle" role="switch" aria-checked="true" aria-label="' +
          c.enable + '"><span></span></button>' +
          '</div>' +
          '<div class="jcc-field">' +
          '<span class="jcc-label">' + c.accent + '<em>' + c.accentHint + '</em></span>' +
          '<div class="jcc-swatches">' +
          swatch('gold', c) + swatch('cyan', c) + swatch('violet', c) +
          '</div>' +
          '</div>' +
          '<div class="jcc-field">' +
          '<span class="jcc-label">' + c.texture + '</span>' +
          '<div class="jcc-seg" role="group" aria-label="' + c.texture + '">' +
          '<button type="button" data-texture="subtle" aria-pressed="false">' + c.textures[0] + '</button>' +
          '<button type="button" data-texture="normal" aria-pressed="false">' + c.textures[1] + '</button>' +
          '<button type="button" data-texture="vivid" aria-pressed="false">' + c.textures[2] + '</button>' +
          '</div>' +
          '</div>' +
          '<div class="jcc-panel__foot">' +
          '<span>v' + VERSION + ' · ' + c.foot + '</span>' +
          '<button type="button" class="jcc-reset" data-jcc="reset">' + c.reset + '</button>' +
          '</div>'
        )
      }

      function mountChrome() {
        if (!document.body) {
          if (!readyBound) {
            readyBound = true
            document.addEventListener('DOMContentLoaded', onDomReady, { once: true })
          }
          return
        }

        /* A hot reload may leave the previous instance behind. */
        var staleDock = document.getElementById(DOCK_ID)
        var stalePanel = document.getElementById(PANEL_ID)
        if (staleDock) staleDock.remove()
        if (stalePanel) stalePanel.remove()

        var c = currentCopy()
        dock = document.createElement('div')
        dock.className = 'jcc-dock'
        dock.id = DOCK_ID
        dock.innerHTML =
          '<span class="jcc-halo" aria-hidden="true"></span>' +
          '<button type="button" class="jcc-orb" aria-label="' + c.open + '" aria-expanded="false" title="' +
          c.open + '">' + SPATULA_SVG + '</button>'

        panel = document.createElement('div')
        panel.className = 'jcc-panel'
        panel.id = PANEL_ID
        panel.setAttribute('role', 'dialog')
        panel.setAttribute('aria-modal', 'false')
        panel.setAttribute('aria-label', c.title)
        panel.hidden = true
        panel.innerHTML = panelHtml(c)

        document.body.appendChild(dock)
        document.body.appendChild(panel)

        orb = dock.querySelector('.jcc-orb')
        orb.addEventListener('click', onOrbClick)
        panel.addEventListener('click', onPanelClick)
        document.addEventListener('click', onDocumentClick, true)
        document.addEventListener('keydown', onKeyDown)

        mounted = true
        syncUi()
        watchLocale()
        watchCanvas()
        scheduleCanvas()
      }

      function syncUi() {
        if (!mounted || !panel) return
        orb.setAttribute('aria-expanded', open ? 'true' : 'false')
        orb.classList.toggle('is-open', open)
        panel.hidden = !open

        var toggle = panel.querySelector('[data-jcc="toggle"]')
        if (toggle) toggle.setAttribute('aria-checked', state.on ? 'true' : 'false')

        var accents = panel.querySelectorAll('[data-accent]')
        for (var i = 0; i < accents.length; i += 1) {
          accents[i].setAttribute(
            'aria-pressed',
            accents[i].getAttribute('data-accent') === state.accent ? 'true' : 'false'
          )
        }

        var textures = panel.querySelectorAll('[data-texture]')
        for (var j = 0; j < textures.length; j += 1) {
          textures[j].setAttribute(
            'aria-pressed',
            textures[j].getAttribute('data-texture') === state.texture ? 'true' : 'false'
          )
        }
      }

      function openPanel() {
        open = true
        syncUi()
        var toggle = panel && panel.querySelector('[data-jcc="toggle"]')
        if (toggle) toggle.focus({ preventScroll: true })
      }

      function closePanel(refocus) {
        open = false
        syncUi()
        if (refocus && orb) orb.focus({ preventScroll: true })
      }

      function onOrbClick(event) {
        event.preventDefault()
        if (open) closePanel(false)
        else openPanel()
      }

      function closestControl(target) {
        var node = target
        while (node && node !== panel) {
          if (
            node.dataset &&
            (node.dataset.jcc || node.dataset.accent || node.dataset.texture)
          ) {
            return node
          }
          node = node.parentElement
        }
        return null
      }

      function onPanelClick(event) {
        var control = closestControl(event.target)
        if (!control) return
        if (control.dataset.jcc === 'close') {
          closePanel(true)
        } else if (control.dataset.jcc === 'toggle') {
          setState({ on: !state.on })
        } else if (control.dataset.jcc === 'reset') {
          setState({ on: true, accent: 'gold', texture: 'normal' })
        } else if (control.dataset.accent) {
          setState({ accent: control.dataset.accent })
        } else if (control.dataset.texture) {
          setState({ texture: control.dataset.texture })
        }
      }

      function onDocumentClick(event) {
        if (!open) return
        if (panel && panel.contains(event.target)) return
        if (dock && dock.contains(event.target)) return
        closePanel(false)
      }

      function onKeyDown(event) {
        if (event.key === 'Escape' && open) {
          event.preventDefault()
          closePanel(true)
        }
      }

      function onDomReady() {
        readyBound = false
        mountChrome()
        syncUi()
      }

      /* -------------------------------------------------------------------
       * Lifecycle
       * ----------------------------------------------------------------- */

      function teardownChrome() {
        if (readyBound) {
          document.removeEventListener('DOMContentLoaded', onDomReady)
          readyBound = false
        }
        if (localeObserver) {
          localeObserver.disconnect()
          localeObserver = null
        }
        if (canvasObserver) {
          canvasObserver.disconnect()
          canvasObserver = null
        }
        if (canvasTimer) {
          window.clearTimeout(canvasTimer)
          canvasTimer = 0
        }
        window.removeEventListener('resize', scheduleCanvas)
        unmarkCanvas()
        canvasPath = ''
        if (mounted) {
          document.removeEventListener('click', onDocumentClick, true)
          document.removeEventListener('keydown', onKeyDown)
          if (orb) orb.removeEventListener('click', onOrbClick)
          if (panel) panel.removeEventListener('click', onPanelClick)
          mounted = false
        }
        if (dock) {
          dock.remove()
          dock = null
        }
        if (panel) {
          panel.remove()
          panel = null
        }
        if (styleEl) {
          styleEl.remove()
          styleEl = null
        }
        var stale = document.getElementById(STYLE_ID)
        if (stale) stale.remove()
        orb = null
      }

      function install() {
        teardownChrome()
        ensureStyle()
        applyAttributes()
        mountChrome()
      }

      function uninstall() {
        teardownChrome()
        var root = document.documentElement
        delete root.dataset.jcc
        delete root.dataset.jccAccent
        delete root.dataset.jccTexture
        open = false
      }

      /* Materialize early: the `immediately` row runs before the shell paints. */
      install()

      exports.name = 'ui-jcc-theme'
      exports.inject = []
      exports.apply = function (ctx) {
        /* A hot reload drops owned nodes before the fiber re-mounts. */
        install()
        if (ctx && typeof ctx.effect === 'function') {
          ctx.effect(function () {
            return function () {
              uninstall()
            }
          }, 'jcc-theme: stylesheet and hex core')
        }
      }

      globalThis.__jccTheme = {
        id: PKG,
        version: VERSION,
        paletteCss: paletteCss,
        install: install,
        uninstall: uninstall
      }

      return module.exports
    }
  })
})()
