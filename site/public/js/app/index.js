var io = require('socket.io-client')
  , properties = require('../../../../properties.json')
  , socket = io.connect(properties.host + ':' + properties.socketIOPort)
  , slida = require('')
  , turns = 0

socket.on('startGame', function (numOfTurns) {
  turns = numOfTurns
})