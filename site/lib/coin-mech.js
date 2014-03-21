var EventEmitter = require('events').EventEmitter
  , serialport = require('serialport')
  , SerialPort = serialport.SerialPort
  , serialList = serialport.list
  , _ = require('lodash')
  , baudrate = 9600
  , parity = 'even'

module.exports = function (callback) {
  var self = new EventEmitter()
    , serialPort

  function findPort (cb) {
    serialList.list(function (error, ports) {
      _.each(ports, function (port) {
        console.log(port)
        return cb(port)
      })
    })
  }

  function onDataRecieved (data) {

  }

  self.open = function (cb, timeout) {
    timeout = timeout || 8000
    setTimeout(cb.bind(this, 'Timeout'), timeout)
    serialPort.open(function (error) {
      if (error) return cb(error)
      serialPort.on('data', onDataRecieved)
      return cb(null)
    })
  }

  self.pause = serialport.pause
  self.resume = serialPort.resume
  self.close = serialPort.close


  findPort(function (port) {
    if (!port) return callback('Unable to find valid port - is the coin mech connected?')
    serialPort = new SerialPort(
      port,
      { baudrate: baudrate
      , parity: parity
      },
      false)
    return callback(null, self)
  })
}