var _ = require('lodash')
  , ledDisplaySetup = require('./led-display')

require('./blink')
require('./rotate')

module.exports = function ($pane, gameOver) {
  var prevVal = 0
    , topTen = {}
    , turns = 0
    , turnsTaken = 0
    , topScore = 0
    , highestScore = 0
    , scores = []
    , $playMsg = $pane.find('.js-msg-play')
    , $highestScore = $pane.find('.js-higest-score')
    , $avgScore = $pane.find('.js-avg-score')
    , $turnMsg = $pane.find('.js-turn')
    , $playTable = $pane.find('.js-play-tbl')
    , $scorePane = $pane.find('.js-score-pane')
    , $arrow = $pane.find('.js-rotate').hide()
    , goOver = false
    , inGame = false
    , goFinishedTimout
    , ledDisplay = ledDisplaySetup($('.js-cell-display'), 3)

  function goFinished() {
    inGame = false
    addGoToDom(topScore)
    $playMsg.hide()
    $arrow.hide()
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
      $playMsg.text('Game Over').show()
      ledDisplay.update(highestScore)
      ledDisplay.blink()
      gameOver()
    } else {
      startGo()
    }
  }

  function addGoToDom(score) {
    var markup = '<tr><td>' + (turnsTaken + 1) + '</td><td>' + score + 'KG</td></tr>'
    $playTable.append(markup)
  }

  function startGo () {
    topScore = 0
    inGame = true
    $turnMsg.text('Turn ' + (turnsTaken + 1) + '/' + turns)
    $playMsg.show()
    $arrow.show()
  }

  function cellDepressed (val) {
    if (inGame) {
      rotateArrowUp()
      clearInterval(goFinishedTimout)
      if (val > topScore) topScore = val
      ledDisplay.update(val)
      if (val > 10) setTimeout(function () { goOver = true }, 10000)
    }
  }

  function cellReleased (val) {
    if (inGame) {
      rotateArrowDown()
      ledDisplay.update(val)
      if (val < 10) setTimeout(function () { goOver = true }, 3000)
      if (val === 0 && goOver) goFinished()
      else if (val === 0) goFinishedTimout = setTimeout(goFinished, 2000)
    }
  }

  function rotateArrowUp () {
    $arrow.css('color', 'green')
    $arrow.rotate({ animateTo: 180 })
  }

  function rotateArrowDown () {
    $arrow.css('color', 'red')
    $arrow.rotate({ animateTo: 0 })
  }

  function show (gos, topTenPlayers) {
    $playMsg.blink()
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
      , size = Object.keys(topTen).length
    console.log(topTen)
    _.each(topTen, function (el, index) {
      if (highestScore >= el.score) pos = index
    })
    return !pos && size < 10 ? size + 1 : pos
  }

  function getScore () {
    return highestScore
  }

  function newTopScore() {
    var pos = getPosition()
    switch(pos) { 
      case 1: pos += 'st'; break
      case 2: pos += 'nd'; break
      case 3: pos += 'rd'; break
      default: pos += 'th'
    }

    $playMsg.text('New Top Score - ' + pos)
  }

  return {
    newTopScore: newTopScore,
    cellDepressed: cellDepressed,
    cellReleased: cellReleased,
    show: show,
    hide: hide,
    getPosition: getPosition,
    getScore: getScore
  }
}