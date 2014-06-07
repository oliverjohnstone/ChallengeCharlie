var moment = require('moment')

module.exports = function (pos, score, array) {
  var newScore = { score: score, date: moment().format() }
  if(array.length < pos) array[pos -1] = newScore
  else array = array.splice(pos -1, 1, newScore)
  return array
}