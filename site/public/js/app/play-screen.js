var _ = require('lodash')

module.exports = function ($pane, gameOver) {
  var prevVal = 0
    , topTen = {}
    , turns = 0
    , turnsTaken = 0
    , topScore = 0
    , highestScore = 0
    , scores = []
    , $currentScore = $pane.find('.js-current-cell-value')
    , $playMsg = $pane.find('.js-msg-play')
    , $highestScore = $pane.find('.js-higest-score')
    , $avgScore = $pane.find('.js-avg-score')
    , $turnMsg = $pane.find('.js-turn')
    , goOver = false
    , inGame = false
    , goFinishedTimout

  function goFinished() {
    inGame = false
    addGoToDom(topScore)
    $playMsg.hide()
    turnsTaken++
    scores.push(topScore)
    if (topScore > highestScore) {
      highestScore = topScore
      $highestScore.text('Your Highest Score: ' + highestScore + 'KG')
    }
    $avgScore.text('Your Average Score: ' + _.reduce(scores, function (memo, num) {
        return memo + num
      }, 0) / scores.length + 'KG')
    if (turnsTaken >= turns) {
      gameOver()
    } else {
      startGo()
    }
  }

  function addGoToDom(score) {

  }

  function startGo () {
    topScore = 0
    inGame = true
    $currentScore.text('0KG')
    $turnMsg.text('Turn ' + (turnsTaken + 1) + '/' + turns)
    $playMsg.show()
  }

  function cellDepressed (val) {
    if (inGame) {
      clearInterval(goFinishedTimout)
      if (val > topScore) topScore = val
      $currentScore.text(val + 'KG')
      if (val > 10) setTimeout(function () { goOver = true }, 10000)      
    }
  }

  function cellReleased (val) {
    if (inGame) {
      $currentScore.text(val + 'KG')
      if (val < 10) setTimeout(function () { goOver = true }, 3000)
      if (val === 0 && goOver) goFinished()
      else if (val === 0) goFinishedTimout = setTimeout(goFinished, 2000)
    }
  }

  function show (gos, topTenPlayers) {
    turnsTaken = prevVal = topScore = highestScore = 0
    turns = gos
    scores = []
    topTen = topTenPlayers
    $highestScore.text('Your Highest Score: 0KG')
    $avgScore.text('Your Average Score: 0KG')
    $pane.fadeIn()
    startGo()
  }

  function hide () {
    $pane.hide()
  }

  function getPosition () {
    var pos = false
    _.each(topTen, function (el, index) {
      if (el.score <= highestScore) pos = index
    })
    if (!pos && topTen.length < 10) return topTen.length
    return pos
  }

  return {
    cellDepressed: cellDepressed,
    cellReleased: cellReleased,
    show: show,
    hide: hide,
    getPosition: getPosition
  }
}