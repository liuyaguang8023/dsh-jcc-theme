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
  var VERSION = __VERSION__
  var STYLE_ID = 'dsh-jcc-theme-style'
  var DOCK_ID = 'dsh-jcc-dock'
  var PANEL_ID = 'dsh-jcc-panel'
  var STORE_KEY = 'dsh-jcc/v1'
  var ACCENT_IDS = ['gold', 'cyan', 'violet']
  var TEXTURES = ['subtle', 'normal', 'vivid']

  /* theme.css, inlined by build.mjs. */
  var STATIC_CSS = __CSS__

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
