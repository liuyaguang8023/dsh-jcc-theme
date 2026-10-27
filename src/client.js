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
  var AMBIENCE_ID = 'dsh-jcc-ambience'
  var DRAFT_ID = 'dsh-jcc-draft'
  var CODEX_ID = 'dsh-jcc-codex'
  var STORE_KEY = 'dsh-jcc/v1'
  var ACCENT_IDS = ['gold', 'cyan', 'violet', 'blue']
  var CORNERS = ['soft', 'sharp']
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
    },
    blue: {
      light: { fill: '#4f93f0', hover: '#3f82df', line: '#2f6fb8', strong: '#1f5aa6', ink: '#061426' },
      dark: { fill: '#7fb8ff', hover: '#a8ccff', line: '#7fb8ff', strong: '#b9d7ff', ink: '#061426' },
      accent: '#7fb8ff',
      accent2: '#b9d7ff',
      accentDeep: '#2f6fb8'
    }
  }

  /** The 12 cosmetic cards: every accent × texture pair. */
  var CARDS = []
  var CARD_IDS = []
  var CARD_BY_ID = Object.create(null)
  for (var ca = 0; ca < ACCENT_IDS.length; ca += 1) {
    for (var ct = 0; ct < TEXTURES.length; ct += 1) {
      var cardDef = {
        id: ACCENT_IDS[ca] + '-' + TEXTURES[ct],
        accent: ACCENT_IDS[ca],
        texture: TEXTURES[ct]
      }
      CARDS.push(cardDef)
      CARD_IDS.push(cardDef.id)
      CARD_BY_ID[cardDef.id] = cardDef
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
      corners: '界面棱角',
      cornersSoft: '圆润',
      cornersSharp: '锐利',
      ambience: '氛围光效',
      draft: '海克斯强化',
      draftSub: '三选一 · 无限重抽',
      cardTextures: ['淡纹', '标准', '浓烈'],
      codexShort: '图鉴',
      codexView: '查看',
      codex: '海克斯图鉴',
      codexSub: '收集 12 张外观卡',
      equip: '装备',
      owned: '已拥有',
      locked: '未解锁',
      collected: '已收集',
      redraw: '重新抽取',
      clear: '清空收集',
      clearConfirm: '再点一次清空',
      allCollected: '全图鉴',
      goDraw: '去抽取',
      flavors: {
        gold: '金币在棋盘边缘燃烧。',
        cyan: '奥术在六边形之间流动。',
        violet: '紫电压住了最后一排。',
        blue: '星光落在最后一格。'
      },
      reset: '恢复默认',
      close: '关闭',
      open: '金铲铲主题设置',
      foot: '非官方同人',
      names: { gold: '海克斯金', cyan: '奥术青', violet: '狂暴紫', blue: '星界蓝' },
      short: { gold: '金', cyan: '青', violet: '紫', blue: '蓝' }
    },
    en: {
      title: 'Hextech Core',
      sub: 'Golden Spatula · fan theme',
      enable: 'Theme on',
      accent: 'Augment',
      accentHint: 'accent',
      texture: 'Board texture',
      textures: ['Subtle', 'Standard', 'Vivid'],
      corners: 'Corners',
      cornersSoft: 'Soft',
      cornersSharp: 'Sharp',
      ambience: 'Ambience',
      draft: 'Hextech augment',
      draftSub: 'Pick one of three · unlimited redraws',
      cardTextures: ['Subtle', 'Standard', 'Vivid'],
      codexShort: 'Codex',
      codexView: 'View',
      codex: 'Hextech codex',
      codexSub: 'Collect all 12 appearance cards',
      equip: 'Equip',
      owned: 'Owned',
      locked: 'Locked',
      collected: 'Collected',
      redraw: 'Draw again',
      clear: 'Clear collection',
      clearConfirm: 'Click again to clear',
      allCollected: 'Full codex',
      goDraw: 'Draw',
      flavors: {
        gold: 'Gold burns at the edge of the board.',
        cyan: 'Arcana flows between the hexes.',
        violet: 'Violet static pins the back line.',
        blue: 'Starlight lands on the last tile.'
      },
      reset: 'Reset',
      close: 'Close',
      open: 'Golden Spatula theme settings',
      foot: 'unofficial fan work',
      names: { gold: 'Hextech Gold', cyan: 'Arcane Cyan', violet: 'Fury Violet', blue: 'Astral Blue' },
      short: { gold: 'Gold', cyan: 'Cyan', violet: 'Violet', blue: 'Blue' }
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
      var ambience = null
      var draftEl = null
      var codexEl = null
      var draftCards = []
      var overlay = ''
      var overlayTrigger = null
      var clearArmed = false
      var clearTimer = 0

      function readState() {
        var fallback = {
          on: true,
          accent: 'gold',
          texture: 'normal',
          ambience: true,
          corners: 'soft',
          collection: []
        }
        try {
          var raw = window.localStorage.getItem(STORE_KEY)
          if (!raw) return fallback
          var saved = JSON.parse(raw)
          if (!saved || typeof saved !== 'object') return fallback
          if (typeof saved.on === 'boolean') fallback.on = saved.on
          if (ACCENT_IDS.indexOf(saved.accent) !== -1) fallback.accent = saved.accent
          if (TEXTURES.indexOf(saved.texture) !== -1) fallback.texture = saved.texture
          if (typeof saved.ambience === 'boolean') fallback.ambience = saved.ambience
          if (CORNERS.indexOf(saved.corners) !== -1) fallback.corners = saved.corners
          if (Array.isArray(saved.collection)) {
            var seenCards = Object.create(null)
            for (var ci = 0; ci < saved.collection.length; ci += 1) {
              var cardId = saved.collection[ci]
              if (CARD_IDS.indexOf(cardId) !== -1 && !seenCards[cardId]) {
                seenCards[cardId] = true
                fallback.collection.push(cardId)
              }
            }
          }
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
        root.dataset.jccAmbience = state.ambience ? 'on' : 'off'
        root.dataset.jccCorners = state.corners
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
        if (overlay === 'draft') renderDraft(true)
        else if (overlay === 'codex') renderCodex()
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
          texture: TEXTURES.indexOf(patch.texture) === -1 ? state.texture : patch.texture,
          ambience: patch.ambience === undefined ? state.ambience : Boolean(patch.ambience),
          corners: CORNERS.indexOf(patch.corners) === -1 ? state.corners : patch.corners,
          collection: state.collection
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
          swatch('gold', c) + swatch('cyan', c) + swatch('violet', c) + swatch('blue', c) +
          '</div>' +
          '</div>' +
          '<div class="jcc-field jcc-draft-field">' +
          '<button type="button" class="jcc-draft-btn" data-jcc="draft">' +
          '<span class="jcc-draft-btn__mark" aria-hidden="true">' + SPATULA_SVG + '</span>' +
          '<span class="jcc-draft-btn__text"><b>' + c.draft + '</b><small>' + c.draftSub + '</small></span>' +
          '<span class="jcc-draft-btn__chev" aria-hidden="true">›</span>' +
          '</button>' +
          '<div class="jcc-progress">' +
          '<span class="jcc-progress__label">' + c.codexShort + ' <b data-jcc-count>0</b>/12</span>' +
          '<span class="jcc-progress__hexes" data-jcc-hexes aria-hidden="true"></span>' +
          '<button type="button" class="jcc-link" data-jcc="codex">' + c.codexView + '</button>' +
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
          '<div class="jcc-field">' +
          '<span class="jcc-label">' + c.corners + '</span>' +
          '<div class="jcc-seg jcc-seg--two" role="group" aria-label="' + c.corners + '">' +
          '<button type="button" data-corners="soft" aria-pressed="false">' + c.cornersSoft + '</button>' +
          '<button type="button" data-corners="sharp" aria-pressed="false">' + c.cornersSharp + '</button>' +
          '</div>' +
          '</div>' +
          '<div class="jcc-row">' +
          '<span class="jcc-label">' + c.ambience + '</span>' +
          '<button type="button" class="jcc-switch" data-jcc="ambience" role="switch" aria-checked="true" aria-label="' +
          c.ambience + '"><span></span></button>' +
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
        var staleAmbience = document.getElementById(AMBIENCE_ID)
        var staleDraft = document.getElementById(DRAFT_ID)
        var staleCodex = document.getElementById(CODEX_ID)
        if (staleDock) staleDock.remove()
        if (stalePanel) stalePanel.remove()
        if (staleAmbience) staleAmbience.remove()
        if (staleDraft) staleDraft.remove()
        if (staleCodex) staleCodex.remove()

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

        ambience = document.createElement('div')
        ambience.className = 'jcc-ambience'
        ambience.id = AMBIENCE_ID
        ambience.setAttribute('aria-hidden', 'true')
        ambience.innerHTML = '<span class="jcc-aurora"></span>'

        draftEl = document.createElement('div')
        draftEl.className = 'jcc-overlay'
        draftEl.id = DRAFT_ID
        draftEl.hidden = true

        codexEl = document.createElement('div')
        codexEl.className = 'jcc-overlay'
        codexEl.id = CODEX_ID
        codexEl.hidden = true

        document.body.appendChild(ambience)
        document.body.appendChild(dock)
        document.body.appendChild(panel)
        document.body.appendChild(draftEl)
        document.body.appendChild(codexEl)

        draftEl.addEventListener('click', onOverlayClick)
        codexEl.addEventListener('click', onOverlayClick)

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

        var ambienceToggle = panel.querySelector('[data-jcc="ambience"]')
        if (ambienceToggle) {
          ambienceToggle.setAttribute('aria-checked', state.ambience ? 'true' : 'false')
        }

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

        var corners = panel.querySelectorAll('[data-corners]')
        for (var k = 0; k < corners.length; k += 1) {
          corners[k].setAttribute(
            'aria-pressed',
            corners[k].getAttribute('data-corners') === state.corners ? 'true' : 'false'
          )
        }

        var count = state.collection.length
        var countEl = panel.querySelector('[data-jcc-count]')
        if (countEl) countEl.textContent = String(count)
        var hexes = panel.querySelector('[data-jcc-hexes]')
        if (hexes) {
          var hexHtml = ''
          for (var h = 0; h < CARD_IDS.length; h += 1) {
            hexHtml += '<i' + (isOwned(CARD_IDS[h]) ? ' class="is-on"' : '') + '></i>'
          }
          if (hexes.innerHTML !== hexHtml) hexes.innerHTML = hexHtml
        }
        var progress = panel.querySelector('.jcc-progress')
        if (progress) progress.classList.toggle('is-complete', count === CARD_IDS.length)
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
            (node.dataset.jcc || node.dataset.accent || node.dataset.texture || node.dataset.corners)
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
          setState({ on: true, accent: 'gold', texture: 'normal', ambience: true, corners: 'soft' })
        } else if (control.dataset.jcc === 'ambience') {
          setState({ ambience: !state.ambience })
        } else if (control.dataset.jcc === 'draft') {
          openDraft()
        } else if (control.dataset.jcc === 'codex') {
          openCodex()
        } else if (control.dataset.accent) {
          setState({ accent: control.dataset.accent })
        } else if (control.dataset.texture) {
          setState({ texture: control.dataset.texture })
        } else if (control.dataset.corners) {
          setState({ corners: control.dataset.corners })
        }
      }

      function onDocumentClick(event) {
        if (overlay) return
        if (!open) return
        if (panel && panel.contains(event.target)) return
        if (dock && dock.contains(event.target)) return
        closePanel(false)
      }

      function onKeyDown(event) {
        if (overlay) {
          if (event.key === 'Escape') {
            event.preventDefault()
            closeOverlay(true)
          } else if (event.key === 'Tab') {
            trapOverlayFocus(event)
          }
          return
        }
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
       * Augment draft and codex
       * ----------------------------------------------------------------- */

      function isOwned(id) {
        return state.collection.indexOf(id) !== -1
      }

      function drawCards() {
        /* Three different accents, each with its own random texture: the
           draft reads as three choices, not three shades of one card. */
        var accents = ACCENT_IDS.slice()
        var picks = []
        while (picks.length < 3 && accents.length > 0) {
          var accentIndex = Math.floor(Math.random() * accents.length)
          var accent = accents.splice(accentIndex, 1)[0]
          var texture = TEXTURES[Math.floor(Math.random() * TEXTURES.length)]
          picks.push(accent + '-' + texture)
        }
        return picks
      }

      function cardName(card, c) {
        return c.names[card.accent] + ' · ' + c.cardTextures[TEXTURES.indexOf(card.texture)]
      }

      function cardHtml(id, c, index) {
        var card = CARD_BY_ID[id]
        if (!card) return ''
        var accent = ACCENTS[card.accent]
        var owned = isOwned(id)
        var name = cardName(card, c)
        return (
          '<button type="button" class="jcc-card' + (owned ? ' is-owned' : '') + '"' +
          ' data-jcc="pick" data-card="' + id + '"' +
          ' aria-label="' + name + '"' +
          ' style="--card-accent:' + accent.accent + ';--card-accent-2:' + accent.accent2 +
          ';--card-accent-deep:' + accent.accentDeep + ';animation-delay:' + index * 70 + 'ms">' +
          (owned ? '<span class="jcc-card__badge">' + c.owned + '</span>' : '') +
          '<span class="jcc-card__art" aria-hidden="true">' + SPATULA_SVG + '</span>' +
          '<span class="jcc-card__name">' + name + '</span>' +
          '<span class="jcc-card__flavor">' + c.flavors[card.accent] + '</span>' +
          '<span class="jcc-card__tex" aria-hidden="true"></span>' +
          '<span class="jcc-card__cta">' + c.equip + '</span>' +
          '</button>'
        )
      }

      function draftHtml(c) {
        var count = state.collection.length
        return (
          '<div class="jcc-scrim" data-jcc="dismiss"></div>' +
          '<div class="jcc-tray" role="dialog" aria-modal="true" aria-labelledby="dsh-jcc-draft-title">' +
          '<div class="jcc-tray__head">' +
          '<div class="jcc-tray__title"><b id="dsh-jcc-draft-title">' + c.draft +
          '</b><small>' + c.draftSub + '</small></div>' +
          (count === CARD_IDS.length ? '<span class="jcc-chip">' + c.allCollected + '</span>' : '') +
          '<button type="button" class="jcc-x" data-jcc="dismiss" aria-label="' + c.close +
          '" title="' + c.close + '">' + X_SVG + '</button>' +
          '</div>' +
          '<div class="jcc-cards">' +
          draftCards
            .map(function (id, i) {
              return cardHtml(id, c, i)
            })
            .join('') +
          '</div>' +
          '<div class="jcc-tray__foot">' +
          '<button type="button" class="jcc-tray-btn" data-jcc="redraw">' + c.redraw + '</button>' +
          '<button type="button" class="jcc-tray-link" data-jcc="codex">' + c.codex +
          ' <b>' + count + '</b>/12</button>' +
          '</div>' +
          '</div>'
        )
      }

      function renderDraft(keep) {
        if (!draftEl || !codexEl) return
        if (!keep || draftCards.length === 0) draftCards = drawCards()
        draftEl.innerHTML = draftHtml(currentCopy())
        draftEl.hidden = false
        codexEl.hidden = true
        overlay = 'draft'
        var first = draftEl.querySelector('.jcc-card')
        if (first) first.focus({ preventScroll: true })
      }

      function codexHtml(c) {
        var count = state.collection.length
        var cards = CARDS.map(function (card) {
          var accent = ACCENTS[card.accent]
          var owned = isOwned(card.id)
          return (
            '<button type="button" class="jcc-codex-card' + (owned ? '' : ' is-locked') + '"' +
            ' data-jcc="codexPick" data-card="' + card.id + '"' +
            (owned ? '' : ' disabled') +
            ' style="--card-accent:' + accent.accent + ';--card-accent-2:' + accent.accent2 +
            ';--card-accent-deep:' + accent.accentDeep + '">' +
            '<span class="jcc-codex-card__hex" aria-hidden="true"></span>' +
            '<span class="jcc-codex-card__name">' + cardName(card, c) + '</span>' +
            '<span class="jcc-codex-card__state">' + (owned ? c.collected : c.locked) + '</span>' +
            '</button>'
          )
        }).join('')
        return (
          '<div class="jcc-scrim" data-jcc="dismiss"></div>' +
          '<div class="jcc-tray" role="dialog" aria-modal="true" aria-labelledby="dsh-jcc-codex-title">' +
          '<div class="jcc-tray__head">' +
          '<div class="jcc-tray__title"><b id="dsh-jcc-codex-title">' + c.codex +
          '</b><small>' + c.codexSub + '</small></div>' +
          '<span class="jcc-chip">' + count + ' / ' + CARD_IDS.length + '</span>' +
          '<button type="button" class="jcc-x" data-jcc="dismiss" aria-label="' + c.close +
          '" title="' + c.close + '">' + X_SVG + '</button>' +
          '</div>' +
          '<div class="jcc-codex-grid">' + cards + '</div>' +
          '<div class="jcc-tray__foot">' +
          '<button type="button" class="jcc-tray-btn" data-jcc="draw">' + c.goDraw + '</button>' +
          '<button type="button" class="jcc-tray-link' + (clearArmed ? ' is-danger' : '') +
          '" data-jcc="clear"' + (count === 0 ? ' disabled' : '') + '>' +
          (clearArmed ? c.clearConfirm : c.clear) + '</button>' +
          '</div>' +
          '</div>'
        )
      }

      function renderCodex() {
        if (!codexEl) return
        codexEl.innerHTML = codexHtml(currentCopy())
        codexEl.hidden = false
        draftEl.hidden = true
        overlay = 'codex'
        var first =
          codexEl.querySelector('.jcc-codex-card:not([disabled])') || codexEl.querySelector('.jcc-x')
        if (first) first.focus({ preventScroll: true })
      }

      function openDraft() {
        if (!draftEl) return
        overlayTrigger = panel ? panel.querySelector('[data-jcc="draft"]') : null
        renderDraft(false)
      }

      function openCodex() {
        if (!codexEl) return
        overlayTrigger = panel ? panel.querySelector('[data-jcc="codex"]') : null
        renderCodex()
      }

      function closeOverlay(refocus) {
        overlay = ''
        clearArmed = false
        if (clearTimer) {
          window.clearTimeout(clearTimer)
          clearTimer = 0
        }
        if (draftEl) draftEl.hidden = true
        if (codexEl) codexEl.hidden = true
        if (refocus) {
          var target =
            overlayTrigger && overlayTrigger.isConnected
              ? overlayTrigger
              : panel
                ? panel.querySelector('[data-jcc="draft"]')
                : orb
          if (target) target.focus({ preventScroll: true })
        }
        overlayTrigger = null
      }

      function pickCard(id) {
        var card = CARD_BY_ID[id]
        if (!card) return
        if (!isOwned(id)) state.collection = state.collection.concat([id])
        setState({ on: true, accent: card.accent, texture: card.texture })
        closeOverlay(true)
      }

      function handleClear() {
        if (state.collection.length === 0) return
        if (!clearArmed) {
          clearArmed = true
          renderCodex()
          var armedClear = codexEl.querySelector('[data-jcc="clear"]')
          if (armedClear) armedClear.focus({ preventScroll: true })
          clearTimer = window.setTimeout(function () {
            clearTimer = 0
            clearArmed = false
            if (overlay === 'codex') renderCodex()
          }, 3200)
          return
        }
        if (clearTimer) {
          window.clearTimeout(clearTimer)
          clearTimer = 0
        }
        clearArmed = false
        state.collection = []
        saveState()
        syncUi()
        renderCodex()
      }

      function overlayFocusables(root) {
        var nodes = root.querySelectorAll(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        )
        var list = []
        for (var i = 0; i < nodes.length; i += 1) {
          if (nodes[i].offsetParent !== null) list.push(nodes[i])
        }
        return list
      }

      function trapOverlayFocus(event) {
        var root = overlay === 'draft' ? draftEl : codexEl
        if (!root) return
        var list = overlayFocusables(root)
        if (list.length === 0) return
        var first = list[0]
        var last = list[list.length - 1]
        var active = document.activeElement
        if (event.shiftKey) {
          if (active === first || !root.contains(active)) {
            event.preventDefault()
            last.focus()
          }
        } else if (active === last || !root.contains(active)) {
          event.preventDefault()
          first.focus()
        }
      }

      function onOverlayClick(event) {
        var root = event.currentTarget
        var node = event.target
        var control = null
        while (node && node !== root) {
          if (node.dataset && (node.dataset.jcc || node.dataset.card)) {
            control = node
            break
          }
          node = node.parentElement
        }
        if (!control) return
        if (control.dataset.jcc === 'dismiss') closeOverlay(true)
        else if (control.dataset.jcc === 'redraw') renderDraft(false)
        else if (control.dataset.jcc === 'codex') openCodex()
        else if (control.dataset.jcc === 'draw') openDraft()
        else if (control.dataset.jcc === 'pick') pickCard(control.dataset.card)
        else if (control.dataset.jcc === 'codexPick') {
          if (!control.disabled) pickCard(control.dataset.card)
        } else if (control.dataset.jcc === 'clear') handleClear()
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
        if (ambience) {
          ambience.remove()
          ambience = null
        }
        if (clearTimer) {
          window.clearTimeout(clearTimer)
          clearTimer = 0
        }
        overlay = ''
        overlayTrigger = null
        clearArmed = false
        draftCards = []
        if (draftEl) {
          draftEl.remove()
          draftEl = null
        }
        if (codexEl) {
          codexEl.remove()
          codexEl = null
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
