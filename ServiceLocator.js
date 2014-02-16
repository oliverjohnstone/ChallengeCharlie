var bunyon = require('bunyon')
  , properties = require('properties.json')
  , log = bunyon.createLogger({ name: properties.appName })

module.exports = 
  { log: log
  , properties: properties
  }