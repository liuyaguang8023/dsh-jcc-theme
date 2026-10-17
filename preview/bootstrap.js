/* Local preview bootstrap: fakes the two things the bundle needs from the
   shell — the module loader and localStorage — then materializes it. */
;(function () {
  var params = new URLSearchParams(window.location.search)
  var dark = params.get('scheme') !== 'light'
  if (dark) document.body.setAttribute('data-ds-dark-theme', '')
  else document.body.removeAttribute('data-ds-dark-theme')

  var stored = {
    on: params.get('on') !== '0',
    accent: params.get('accent') || 'gold',
    texture: params.get('texture') || 'normal',
    corners: params.get('corners') || 'soft',
    ambience: params.get('ambience') !== '0'
  }

  /* Chrome on file:// may expose a read-only storage object; a stand-in keeps
     the preview deterministic without touching the real one. */
  var fake = {
    getItem: function (key) {
      return key === 'dsh-jcc/v1' ? JSON.stringify(stored) : null
    },
    setItem: function (key, value) {
      if (key === 'dsh-jcc/v1') stored = JSON.parse(value)
    },
    removeItem: function (key) {
      if (key === 'dsh-jcc/v1') stored = { on: true, accent: 'gold', texture: 'normal' }
    }
  }
  try {
    Object.defineProperty(window, 'localStorage', { configurable: true, value: fake })
  } catch (error) {
    /* the bundle already tolerates a missing store */
  }

  var definition = window.__jccDefinition
  if (!definition) {
    document.title = 'preview failed — no module registered'
    return
  }

  var api = definition.factory(function (name) {
    throw new Error('preview has no module for ' + name)
  })
  var dispose = api.apply({
    effect: function (callback) {
      var off = callback()
      return function () {
        if (off) off()
      }
    }
  })

  if (params.get('panel') === '1') {
    var orb = document.querySelector('.jcc-orb')
    if (orb) orb.click()
  }

  window.__jccPreview = {
    api: api,
    dispose: dispose,
    state: function () {
      var root = document.documentElement
      return {
        jcc: root.dataset.jcc,
        accent: root.dataset.jccAccent,
        texture: root.dataset.jccTexture
      }
    }
  }
})()

/* Optional computed-style probe for local debugging: ?debug=1 */
;(function () {
  var params = new URLSearchParams(window.location.search)
  if (params.get('debug') !== '1') return
  setTimeout(function () {
    var pre = document.querySelector('.code pre')
    var code = document.querySelector('.code')
    if (!pre || !code) return
    var cs = window.getComputedStyle(pre)
    var dbg = document.createElement('pre')
    dbg.id = 'debug'
    dbg.textContent = JSON.stringify(
      {
        color: cs.color,
        opacity: cs.opacity,
        fontSize: cs.fontSize,
        background: window.getComputedStyle(code).backgroundColor,
        labelPrimary: window
          .getComputedStyle(document.body)
          .getPropertyValue('--dsw-alias-label-primary'),
        bodyBg: window.getComputedStyle(document.body).backgroundColor
      },
      null,
      2
    )
    document.body.appendChild(dbg)
  }, 100)
})()
