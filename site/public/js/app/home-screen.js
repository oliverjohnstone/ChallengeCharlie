module.exports = function ($pane) {
  function redraw (players) {
    // Redraw the page
  }

  function show () {
    $pane.show()
  }

  function hide () {
    $pane.hide()
  }

  return {
    redraw: redraw,
    show: show,
    hide: hide
  }
}