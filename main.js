var server = require('./Server')
  , sl = require('./ServiceLocator')

sl.info('Creating new server instance...')

var instance = new server(sl, function (err) {
  if (err) sl.logger.error('Failed to create new instance')
  else sl.logger.info('Successfully created server instance')
})

sl.logger.info('Starting server...')
if (instance.listen()) sl.logger.info('Server started')
else sl.logger.error('Failed to start listening to server')