var hid = require('node-hid')
  , loadCell = require('./hid-device')(4303, 21760)
  , singleton = null
  , EventEmitter = require('events').EventEmitter
  , pollInterval = 100

module.exports = function (sl, startListening) {
  if (singleton) return singleton
  if (typeof loadCell !== 'object') 
    return sl.logger.error('Failed to connect to load cell: ' + loadCell)

  var self = new EventEmitter()
    , intervalId
    , parsedValue
    , prevValue = 0

  loadCell.on('error', function (err) {
    sl.logger.error('Load cell error: ' + err)
    self.close()
  })

  function parseCellData(data) {
    return data.readInt32LE(3)
  }

  function pollData() {
    intervalId = setInterval(function () {
      loadCell.read(function (err, data) {
        if (err) return self.emit('error', err)
        parsedValue = parseCellData(data)
        if (parsedValue > prevValue) self.emit('cellDepressed', parsedValue + 'KG')
        else if (parsedValue < prevValue) self.emit('cellReleased', parsedValue + 'KG')
        prevValue = parsedValue
      })
    }, pollInterval)
  }

  self.pause = function() {
    sl.logger.info('Load cell polling paused')
    clearInterval(intervalId)
  }

  self.resume = function () {
    sl.logger.info('Load cell polling resumed')
    pollData()
  }

  self.close = function () {
    sl.logger.info('Load cell closing')
    self.pause()
    loadCell.close()
    singleton = null
  }

  if (startListening) pollData()

  singleton = self

  return self
}