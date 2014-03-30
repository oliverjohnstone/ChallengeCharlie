var server = require('./server')
  , sl = require('./serviceLocator')
  , fs = require('fs')
  , instance
  , interval = 1

sl.logger.info('Loading application settings...')
fs.readFile('application.json', function (err, data) {
  if(err) {
    sl.logger.error('Failed to load application settings: ' + err)
    return process.exit(1)
  }
  sl.logger.info('Application settings loaded')
  sl.application = JSON.parse(data)
  sl.application.startUps += 1
  sl.application.upTime = 0

  // Persist the application settings every min
  setInterval(persistApplicationSettings, interval * 60 * 1000)

  sl.logger.info('Creating new server instance...')

  instance = new server(sl)

  if (!instance) {
    sl.logger.error('Failed to create new instance')
    return process.exit(1)
  }

  sl.logger.info('Successfully created server instance')
  sl.logger.info('Starting server...')

  if (instance.listen()) {
    sl.logger.info('Server started')
  } else {
    sl.logger.error('Failed to start listening to server')
  }
})

function persistApplicationSettings() {
  sl.application.upTime += interval
  sl.application.totalUpTime += interval
  fs.writeFile('application.json', JSON.stringify(sl.application, null, '\t'), function (err) {
    if (err) sl.logger.warn('Failed to save application settings: ' + err)
    else sl.logger.info('Persisted application settings')
  })
}