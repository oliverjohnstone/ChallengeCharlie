var renderJade = require('../../lib/render-jade')
  , homeTemplate = renderJade(__dirname + '/../templates/main.jade')
  , errorTemplate = renderJade(__dirname + '/../templates/error.jade')
  , setupCoinMech = require('../../lib/coin-mech')
  , setupLoadCell = require('../../lib/load-cell')
  , io = require('socket.io')
  , minFunds = 100

module.exports = function(sl) {
  var coinMech = setupCoinMech(sl)
    , loadCell = setupLoadCell(sl)
    , currentValue = 0

  // Check to see that we have all the components connected, otherwise show an error page
  if (!coinMech) sl.logger.error('Failed to setup coin mech - can\'t continue')
  if (!loadCell) sl.logger.error('Failed to setup load cell - can\'t continue')
  if (!coinMech || !loadCell) return homeTemplate({ loadCell: !loadCell, coinMech: !coinMech  })

  // When the user inserts a coin
  coinMech.on('coinInserted', function (value) {
    currentValue += value
    if (currentValue >= minFunds) onSufficientFunds()
  })

  // Calculate the number of turns available to the user with the funds available
  function calculateTurns() {
    // TODO - Calculate actual turns
    return 1
  }

  // This function is called when the player has entered sufficient funds
  function onSufficientFunds() {
    coinMech.pause()
    var turns = calculateTurns()
  }

  // This function is called when the player has finished all of their turns
  function onGameOver(results) {

  }

  return homeTemplate({ players: [], properties: sl.properties })
}