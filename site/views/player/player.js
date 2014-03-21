var moment = require('moment')

module.exports = function(name, score) {
  var date = moment()

  var getDate = function () {
    return date
  }

  var getScore = function () {
    return score
  }

  var getFormattedData = function () {
    return {
      name: name,
      score: score,
      date: date.format('Do MMM YY')
    } 
  }

  return {
    getScore: getScore,
    getDate: getDate,
    getFormattedData: getFormattedData
  }
}