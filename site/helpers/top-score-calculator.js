var moment = require('moment')

module.exports = function (pos, score, array) {
  var newArray = []
    , newScore = { score: score, date: moment().format() }
    , i

  if (pos >= array.length) {
    array[pos] = newScore
    return array
  }

  for (i = 0; i < pos; i++) newArray[i] = array[i]
  newArray[i++] = newScore
  for (i = i; i < 10; i++) {
    if (array[i -1]) newArray[i] = array[i -1]
  }

  return newArray
}