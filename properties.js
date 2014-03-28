var _ = require('lodash')

var defaultProperties = 
  { sitePort: 8888
  , socketIoPort: 8889
  , appName: 'Challenge Charlie'
  , host: '127.0.0.1'
  }

var development = _.extend(defaultProperties, {

})

var production = _.extend(defaultProperties, {

})

module.exports = 
  { development: development
  , production: production
  }