var moment = require('moment')

module.exports = function ($pane) {

  var $scoreBoard = $pane.find('.js-players-tbl')
    , $funds = $pane.find('.js-funds')

  function show (topTenPlayers) {
    if (topTenPlayers) updateScoreTable(topTenPlayers)
    $pane.show()
    $funds.html('&pound;0.00')
  }

  function updateScoreTable(topTenPlayers) {
    $scoreBoard.find('.js-row').remove()
    for(var i = 0; i < topTenPlayers.length; i++) {
      var pos = i +1
      switch(pos) {
        case 1: pos += 'st'; break
        case 2: pos += 'nd'; break
        case 3: pos += 'rd'; break
        default: pos += 'th'
      }

      $scoreBoard.append('<tr class="js-row">' +
        '<td>' + pos + '</td>' +
        '<td>' + topTenPlayers[i].score + 'KG</td>' +
        '<td>' + moment(topTenPlayers[i].date).calendar() + '</td></tr>')
    }
  }

  function hide () {
    $pane.hide()
  }

  function updateFunds(amount) {
    $funds.html('&pound;' + (amount / 100).toFixed(2))
  }

  return {
    show: show,
    hide: hide,
    updateFunds: updateFunds
  }
}