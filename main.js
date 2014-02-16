var server = require('./server')
  , sl = require('./serviceLocator')

sl.logger.info('Creating new server instance...')

var instance = new server(sl)

if (!instance) {
  sl.logger.error('Failed to create new instance')
  return 1
}

sl.logger.info('Successfully created server instance')
sl.logger.info('Starting server...')

if (instance.listen()) {
  sl.logger.info('Server started')
} else {
  sl.logger.error('Failed to start listening to server')
}