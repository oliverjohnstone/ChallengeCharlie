var _ = require('lodash')
  , ledDisplaySetup = require('./led-display')

require('./blink')
require('./rotate')

module.exports = function ($pane, gameOver) {
  var prevVal = 0
    , topTen = []
    , turns = 0
    , turnsTaken = 0
    , topScore = 0
    , highestScore = 0
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
    , ledDisplay
    , firstShow = true

  function goFinished() {
    inGame = false
    addGoToDom(topScore)
    $playMsg.hide()
    $arrow.hide()
    turnsTaken++
    if (topScore > highestScore) {
      highestScore = topScore
      $highestScore.text('Your Highest Score: ' + highestScore + 'KG')
    }
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
    var markup = '<tr class="js-turn"><td>' + (turnsTaken + 1) + '</td><td>' + score + 'KG</td></tr>'
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
    // Reset the play message and set to blink
    $playMsg.text('Play!')

    if (firstShow) {
      $playMsg.blink()
      firstShow = false
    }

    // Clear the play table
    $playTable.find('.js-turn').remove()

    // Remove any old LED display
    $('.js-display').remove()
    ledDisplay = ledDisplaySetup($('.js-cell-display'), 3)
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

    for (var i = 0; i < topTen.length; i++) {
      var el = topTen[i]
      if (highestScore >= el.score) {
        pos = i
        break
      }
    }
    return pos === false && size < 10 ? size : pos
  }

  function getScore () {
    return highestScore
  }

  function newTopScore() {
    var pos = getPosition() + 1
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
