var renderJade = require('../../lib/render-jade')
  , homeTemplate = renderJade(__dirname + '/../templates/main.jade')
  , setupCoinMech = require('../../lib/coin-mech')

module.exports = function(sl) {
  var coinMech = setupCoinMech(sl)
    , currentValue = 0

  if (!coinMech) {
    sl.logger.error('Failed to setup coin mech - can\'t continue')
    process.exit()
  }

  coinMech.on('coinInserted', function (value) {
    currentValue += value
    console.log(currentValue)
    coinMech.pause()
  })

  return homeTemplate({ players: [], properties: sl.properties })
}