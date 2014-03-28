var _ = require('lodash')
  , hid = require('node-hid')

module.exports = function (vendorId, productId) {
  var device = _.find(hid.devices(), function (device) {
    return device.vendorId === vendorId &&
      device.productId === productId
  })

  if (!device) return false

  try {
    return new hid.HID(device.path)
  } catch (e) {
    return e
  }
}