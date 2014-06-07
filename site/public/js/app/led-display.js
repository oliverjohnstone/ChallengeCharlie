require('./blink')

module.exports = function ($container, cellCount) {
  var $display
    , cellMarkup = '<div class="cell-number">' +
                    '<div class="top-left cell-bar-vertical cell-bar"></div>' +
                    '<div class="centre cell-bar-horizontal cell-bar"></div>' +
                    '<div class="bottom-left cell-bar-vertical cell-bar"></div>' +
                    '<div class="bottom cell-bar-horizontal cell-bar"></div>' +
                    '<div class="bottom-right cell-bar-right cell-bar-vertical cell-bar"></div>' +
                    '<div class="top-right cell-bar-right cell-bar-vertical cell-bar"></div>' +
                    '<div class="top cell-bar-horizontal cell-bar"></div>' +
                  '</div>'
    , containerMarkup = '<div class="js-display"></div>'
    , cells =
      [ [ 'top-left', 'bottom-left', 'bottom', 'bottom-right', 'top-right', 'top']
      , [ 'top-left', 'bottom-left' ]
      , [ 'top', 'top-right', 'centre', 'bottom-left', 'bottom' ]
      , [ 'top', 'top-right', 'centre', 'bottom-right', 'bottom' ]
      , [ 'top-left', 'centre', 'top-right', 'bottom-right' ]
      , [ 'top', 'top-left', 'centre', 'bottom-right', 'bottom' ]
      , [ 'top', 'top-left', 'centre', 'bottom-right', 'bottom', 'bottom-left' ]
      , [ 'top', 'top-right', 'bottom-right' ]
      , [ 'top', 'top-left', 'top-right', 'centre', 'bottom-left', 'bottom-right', 'bottom' ]
      , [ 'top', 'top-left', 'top-right', 'centre', 'bottom-right' ]
      ]

  $display = $(containerMarkup)

  for(var i = cellCount; i > 0; i--) {
    var $cell = $(cellMarkup)
    $cell.attr('data-cell-no', i)
    $display.append($cell)
  }

  $container.append($display)
  turnOff()

  function setCellVal(cell, val) {
    var $cell = $display.find('.cell-number[data-cell-no=' + cell + ']')
    $cell.find('.cell-bar').removeClass('cell-bar-lit')
    for (var i in cells[val]) {
      $cell.find('.' + cells[val][i]).addClass('cell-bar-lit')
    }
  }

  function setAllCells(val) {
    for (var i = 0; i < cellCount; i++) {
      setCellVal(i +1, val)
    }
  }

  function turnOff () {
    $display.find('.cell-bar').removeClass('cell-bar-lit')
  }

  return {
    blink: function () { $display.blink() }
  , update: function (newVal) {
      turnOff()
      if (newVal > Math.pow(10, cellCount) -1) {
        setAllCells(9)
      } else {
        var remainder = newVal
          , found = false
        for (var i = cellCount; i > 0; i--) {
          var pow = Math.pow(10, i -1)
            , val = Math.floor(remainder / pow)

          if (val > 0) {
            found = true
            setCellVal(i, val)
          } else if (found) {
            setCellVal(i, 0)
          }

          remainder = remainder % pow
        }
      }
    }
  , turnOff: turnOff
  }

}