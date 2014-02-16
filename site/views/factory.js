var fs = require('fs')
  , join = require('path').join
  , main = require('./main/view')

module.exports = function(sl, req, dir) {
  var views = { main: main }

  if (views[dir] !== 'undefined') {
    return views[dir]
  } else {
    return false
  }
}