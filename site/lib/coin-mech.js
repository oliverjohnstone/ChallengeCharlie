var EventEmitter = require('events').EventEmitter
  , _ = require('lodash')
  , hid = require('node-hid')
  , coinMech =
    { vendorId: 1204
    , productId: 65535
    }
  , coins =
    { '1': 0.5
    , '2': 1
    , '4': 2
    }
  , singleton

module.exports = function (sl) {
  if (singleton) return singleton

  var self = new EventEmitter()
    , device = null
    , buffer = new Buffer(4)
    , bytesRecv = 0
    , paused = false

  device = _.find(hid.devices(), function (device) {
    return device.vendorId === coinMech.vendorId &&
      device.productId === coinMech.productId
  })

  if (!device) return false

  try {
    device = new hid.HID(device.path)
  } catch (e) {
    sl.logger.error(e)
    return false
  }

  function emitCoinNotification() {
    var one = buffer[2]
      , two = buffer[3]
      , coin = (one > two ? one - two : two - one) / 8
      , coinValue

    if (coins['' + coin]) {
      coinValue = coins['' + coin]
      sl.logger.info('New coin inserted: ' + 
        (coinValue < 1 ? (coinValue * 100) + 'p' : '£' + coinValue))
      self.emit('coinInserted', coinValue)
    } else {
      sl.logger.warn('Invalid coin: ', coin)
    }
  }

  device.on('data', function (data) {
    if (bytesRecv < 4) {
      buffer[bytesRecv++] = data[0]
      if (bytesRecv === 4) {
        bytesRecv = 0
        if (!paused) emitCoinNotification()
      }
    }
  })

  device.on('error', function (error) {
    self.emit('error', error)
    sl.logger.error(error)
  })

  singleton = self

  return _.extend(self, 
    { pause: function () { paused = true }
    , resume: function () { paused = false }
    , close: device.close
    })
}