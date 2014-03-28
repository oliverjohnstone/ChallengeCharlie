var io = require('socket.io-client')
  , properties = require('../../../../properties.json')
  , socket = io.connect(properties.host + ':' + properties.socketIOPort)
  , turns = 0
  , $panes = $('.js-pane')
  , $homePane = $panes.eq(0)
  , $playPane = $panes.eq(1)
  , $scorePane = $panes.eq(2)

init()

function init() {
  $panes.hide()
  $homePane.show()
}

socket.on('startGame', function (numOfTurns) {
  $panes.hide()
  $playPane.fadeIn()
  turns = numOfTurns
})

function gameOver() {
  socket.emit('gameOver', { maxScore: 1 })
}