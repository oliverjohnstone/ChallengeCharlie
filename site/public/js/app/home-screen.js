module.exports = function ($pane) {

  function show (topTenPlayers) {
    if (topTenPlayers) updateScoreTable(topTenPlayers)
    $pane.show()
  }

  function updateScoreTable(topTenPlayers) {
    console.log(topTenPlayers)
  }

  function hide () {
    $pane.hide()
  }

  return {
    show: show,
    hide: hide
  }
}