var _ = require('lodash')

var defaultProperties = 
  { sitePort: 80
  , appName: 'Challenge Charlie'
  }

var development = _.extend(defaultProperties, {

})

var production = _.extend(defaultProperties, {

})

module.exports = 
  { defaultProperties: defaultProperties
  , development: development
  , production: production
  }