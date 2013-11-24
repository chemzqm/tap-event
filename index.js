var cancelEvents = [
  'touchstart',
  'touchmove',
  'touchcancel'
]

module.exports = Tap

function Tap(callback) {
  // to keep track of the original listener
  listener.handler = callback

  return listener

  // el.addEventListener('touchstart', listener)
  function listener(e1) {
    // tap should only happen with a single finger
    if (e1.touches.length > 1 || e1.defaultPrevented)
      return

    var el = this

    cancelEvents.forEach(function (event) {
      document.addEventListener(event, cleanup)
    })

    el.addEventListener('touchend', done)

    function done(e2) {
      cleanup()

      // if handled by some other handler
      if (e1.defaultPrevented || e2.defaultPrevented)
        return

      e1.preventDefault()
      e2.preventDefault()
      // calls the handler with the `end` event,
      // but i don't think it matters.
      callback.call(el, e2)
    }

    function cleanup() {
      cancelEvents.forEach(function (event) {
        document.removeEventListener(event, cleanup)
      })

      el.removeEventListener('touchend', done)
    }
  }
}