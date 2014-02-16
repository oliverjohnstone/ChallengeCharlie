var http = require('http')
  , _ = require('lodash')
  , viewFactory = require('./site/views/factory')
  , join = require('path').join
  , fs = require('fs')
  , mime = require('mime')

module.exports = function(sl) {
  var port = sl.properties.sitePort
    , host = sl.properties.host
    , server = null

  if (port && host) {
    server = http.createServer(routeRequest.bind(this, sl))
  } else {
    sl.logger.error({ port: port, host: host }, 'Invalid host and/or port used' )
    return null
  }

  function listen() {
    server.listen(port, host)
    return true
  }

  return {
    listen: listen
  }
}

function routeRequest(sl, req, res) {

  if(req.method != 'GET') {
    res.writeHead(405)
    res.end()
  }

  var url = require('url').parse(req.url)
    , parts = url.path.split('/')

  // Remove falsy parts
  parts = _.filter(parts, function (part) {
    return part !== '..' && part
  })

  if (parts.length > 0) {
    // Directory
    if (parts[0] === 'static') {
      serveStaticAsset(req, res, parts, sl.logger)
    } else {
      sl.logger.info(parts[0], 'Attempting to load dynamic view')
      var View = viewFactory(sl, req, parts[0])
        , view
      if (!View) {
        sl.logger.warn(parts[0], 'Unable to load dynamic view')
        res.writeHead(404)
        res.end('Resource not found.\n')
        return
      }
      sl.logger.info(parts[0], 'Serving dynamic view')
      view = new View(sl, req)
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(view.render())
    }
  } else {
    sl.logger.info('Serving index page')
    // Dynamic rendering
    var View = viewFactory(sl, req, 'main')
      , view
    if (!View) {
      sl.logger.warn('main', 'Unable to load dynamic view')  
      res.writeHead(404)
      res.end('Resource not found.\n')
      return
    }
    sl.logger.info('main', 'Serving dynamic view')
    view = new View(sl, req)
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(view.render())
  }
}

function serveStaticAsset(req, res, parts, logger) {
  logger.info('Attempting to serve static asset')

  // static/js/index.js
  // static/css/index.css
  // static/img/img.png
  if (parts.length != 3) {
    logger.warn(req.path, 'Invalid file path specified')
    res.writeHead(404)
    res.end('Resource not found.\n')
    return
  }

  var file = parts[parts.length - 1]
    , type = parts[1]

  if (!_.contains(['js', 'css', 'img'], type)) {
    logger.warn(req.path, 'Invalid file path specified')
    res.writeHead(404)
    res.end('Resource not found.\n')
    return
  }

  var build = type == 'js' || type == 'css' ? 'build' : ''
    , path = join(__dirname, 'site', 'public', type, build, file)

  fs.exists(path, function (exists) {
    if (exists) {
      // Serve file
      fs.stat(path, function (err, stats) {
        if (err) {
          logger.error(err, 'Failed to get file info')
          res.writeHead(500)
          res.end('Internal server error\n')
          return
        }

        res.writeHead(200, 
          { 'Content-Type': mime.lookup(path)
          , 'Content-Length': stats.size
          })

        var fileStream = fs.createReadStream(path)
        fileStream.pipe(res)
        logger.info(path, 'Successfully served static asset')

      })
    } else {
      // File not found
      logger.warn(path, 'File not found')
      res.writeHead(404)
      res.end('Resource not found.\n')
      return
    }
  })

}