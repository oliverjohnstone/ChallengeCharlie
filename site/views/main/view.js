var renderJade = require('../../lib/render-jade')
  , indexTemplate = renderJade(__dirname + '/../../templates/index.jade')

module.exports = function(sl, req) {
  return {
    render: function () {
      var viewHtml = render()
        , indexHtml = indexTemplate(
          { properties: sl.properties
          , pageView: viewHtml
          })
      return indexHtml
    }
  }

  function render() {
    return '<h1>Hello</h1>'
  } 
}