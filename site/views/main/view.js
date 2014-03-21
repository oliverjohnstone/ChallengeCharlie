var renderJade = require('../../lib/render-jade')
  , homeTemplate = renderJade(__dirname + '/../templates/main.jade')
  , setupCoinMech = require('../../lib/coin-mech')

module.exports = function(sl) {
  setupCoinMech(function (error, coinMech) {
    if (error) return sl.logger.error(error)
    coinMech.on('coinEntered', function (coinValue) {
      console.log('Coin received: ' + coinValue)
    })
  })

  return homeTemplate({ players: [], properties: sl.properties })
}