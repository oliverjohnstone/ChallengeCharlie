var io = require('socket.io-client')
  , properties = require('../../../../properties.json')
  , socket = io.connect(properties.host + ':' + properties.socketIOPort)
  , $panes = $('.js-pane')
  , home = require('./home-screen')($panes.eq(0))
  , play = require('./play-screen')($panes.eq(1), gameOver)
  , topTenUpdater = require('../../../helpers/top-score-calculator')
  , topTen = []

init()

function init(topTenPlayers) {
  $panes.hide()
  home.show(topTenPlayers)
}

socket.on('fundsRecieved', function (funds) {
  home.updateFunds(funds)
})

socket.on('startGame', function (numOfTurns, topTenPlayers) {
  topTen = topTenPlayers
  home.hide()
  play.show(numOfTurns, topTenPlayers)
})

socket.on('cellDepressed', function (newVal) {
  play.cellDepressed(newVal)
})

socket.on('cellReleased', function (newVal) {
  play.cellReleased(newVal)
})

function gameOver() {
  var position = play.getPosition()
  if (position !== false) {
    play.newTopScore()
    topTen = topTenUpdater(position, play.getScore(), topTen)
    setTimeout(init.bind(null, topTen), 6000)
  } else {
    setTimeout(init, 3000)
  }
  socket.emit('gameOver', position, play.getScore())
}