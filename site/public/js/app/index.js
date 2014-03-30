var io = require('socket.io-client')
  , properties = require('../../../../properties.json')
  , socket = io.connect(properties.host + ':' + properties.socketIOPort)
  , $panes = $('.js-pane')
  , home = require('./home-screen')($panes.eq(0))
  , play = require('./play-screen')($panes.eq(1), gameOver)
  , topScore = require('./top-score-screen')

init()

function init() {
  $panes.hide()
  home.show()
}

socket.on('startGame', function (numOfTurns, topTenPlayers) {
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
  console.log(position)
  if (position) {
    play.hide()
    topScore.show(position)
  }
  socket.emit('gameOver', position)
}