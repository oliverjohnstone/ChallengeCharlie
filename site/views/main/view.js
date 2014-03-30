var renderJade = require('../../lib/render-jade')
  , homeTemplate = renderJade(__dirname + '/../templates/main.jade')
  , errorTemplate = renderJade(__dirname + '/../templates/error.jade')
  , setupCoinMech = require('../../lib/coin-mech')
  , setupLoadCell = require('../../lib/load-cell')
  , io = require('socket.io')
  , minFunds = 100
  , moment = require('moment')
  , _ = require('lodash')

module.exports = function(sl) {
  var coinMech = setupCoinMech(sl)
    , loadCell = setupLoadCell(sl)
    , currentFunds = 0
    , currentTopTen = sl.application.topTenPlayers

  // Check to see that we have all the components connected, otherwise show an error page
  if (!coinMech) sl.logger.error('Failed to setup coin mech - can\'t continue')
  if (!loadCell) sl.logger.error('Failed to setup load cell - can\'t continue')
  if (!coinMech || !loadCell) return errorTemplate(
    { loadCell: loadCell, coinMech: coinMech, properties: sl.properties })

  // Start listening to the sockets server
  io.listen(sl.properties.socketIOPort, { log: false }).sockets.on('connection', function (socket) {
    // Wait for the browser to connect to the server 
    // This way we are safe to start emitting events to the IO
    setupCoinMechEvents(socket)
    setupLoadCellEvents(socket)
    loadCell.pause()
    sl.logger.info('Browser connected')

    socket.on('gameOver', onGameOver)
  })

  function setupCoinMechEvents (socket) {
    sl.logger.info('Starting to listen to coin mech')
    currentFunds = 0
    // When the user inserts a coin
    coinMech.on('coinInserted', function (value) {
      currentFunds += value
      if (currentFunds >= minFunds) onSufficientFunds(socket)
    })
  }

  function setupLoadCellEvents(socket) {
    loadCell.on('cellDepressed', function (value) {
      socket.emit('cellDepressed', value)
    })

    loadCell.on('cellReleased', function (value) {
      socket.emit('cellReleased', value)
    })
  }

  // Calculate the number of turns available to the user with the funds available
  function calculateTurns() {
    if (currentFunds === minFunds) return 1
    else if (currentFunds === minFunds * 2) return 3
    else return currentFunds / minFunds
  }

  // This function is called when the player has entered sufficient funds
  function onSufficientFunds(socket) {
    coinMech.pause()
    loadCell.resume()
    socket.emit('startGame', calculateTurns(), sl.application.topTenPlayers)
    currentFunds = 0
  }

  // This function is called when the player has finished all of their turns
  function onGameOver(results) {
    sl.logger.info('Game Over')
    loadCell.pause()
    coinMech.resume()
  }

  return homeTemplate({ players: sl.application.topTenPlayers, properties: sl.properties, moment: moment })
}