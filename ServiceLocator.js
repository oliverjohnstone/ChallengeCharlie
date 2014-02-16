var bunyan = require('bunyan')
  , properties = require('./properties.json')
  , log = bunyan.createLogger({ name: properties.appName })

module.exports = 
  { logger: log
  , properties: properties
  }