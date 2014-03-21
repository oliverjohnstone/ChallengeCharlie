var moment = require('moment')
  , fs = require('fs')

module.exports = function (file, sl) {
  var players = []
    , dirty = true

  var serialise = function(cb) {
    fs.writeFile(file, JSON.stringify(players), function (err) {
      if (err) sl.logger.warn(err, 'Failed to serialise player scores')
      else dirty = false
      if (typeof cb === 'function') cb(err)
    })
  }

  var deserialise = function (cb) {
    fs.readFile(file, function (err, data) {
      if (err) sl.logger.warn(err, 'Failed to deserialise player scores')
      else players = JSON.parse(data)
      dirty = false
      if (typeof cb === 'function') cb(err)
    })
  }

  var getPlayers = function () {
    return players
  }

  var setPlayer = function (player) {
    var index = getPosition(player.getScore())
    if (index) {
      players[index] = player
      dirty = true
      serialise()
    } else {
      return false
    }
  }

  var getPosition = function (score) {
    for(var i in players) {
      var player = players[i]
      if (player.getScore() < score) {
        return i
      } else if (player.getScore() === score) {
        if (player.getDate() < moment()) {
          return i
        }
      }
    }
    return false
  }

  return {
    serialise: serialise,
    deserialise: deserialise,
    getPlayers: getPlayers,
    setPlayer: setPlayer,
    getPosition: getPosition
  }
}