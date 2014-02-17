var renderJade = require('../../lib/render-jade')
  , indexTemplate = renderJade(__dirname + '/../../templates/index.jade')
  , homeTemplate = renderJade(__dirname + '/../templates/main/home.jade')

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
    return homeTemplate({
      players: []
    })
  } 
}