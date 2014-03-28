var EventEmitter = require('events').EventEmitter
  , _ = require('lodash')
  , coinMech = require('./hid-device')(1204, 65535)
  , coins =
    { '1': 50
    , '2': 100
    , '4': 200
    }
  , singleton

module.exports = function (sl) {
  if (singleton) return singleton
  if (typeof coinMech !== 'object') {
    sl.logger.error('Failed to load coin mech: ' + coinMech)
    return false
  }

  var self = new EventEmitter()
    , buffer = new Buffer(4)
    , bytesRecv = 0
    , paused = false

  function emitCoinNotification() {
    var one = buffer[2]
      , two = buffer[3]
      , coin = (one > two ? one - two : two - one) / 8
      , coinValue

    if (coins['' + coin]) {
      coinValue = coins['' + coin]
      sl.logger.info('New coin inserted: ' + 
        (coinValue < 100 ? coinValue + 'p' : '£' + (coinValue / 100)))
      self.emit('coinInserted', coinValue)
    } else {
      sl.logger.warn('Invalid coin: ', coin)
    }
  }

  coinMech.on('data', function (data) {
    if (bytesRecv < 4) {
      buffer[bytesRecv++] = data[0]
      if (bytesRecv === 4) {
        bytesRecv = 0
        if (!paused) emitCoinNotification()
      }
    }
  })

  coinMech.on('error', function (error) {
    self.emit('error', error)
    sl.logger.error(error)
  })

  singleton = self

  return _.extend(self, 
    { pause: function () { paused = true }
    , resume: function () { paused = false }
    , close: coinMech.close
    })
}