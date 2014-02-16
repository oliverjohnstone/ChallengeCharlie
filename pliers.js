var stylus = require('stylus')
  , stylusRender = require('stylus-renderer')
  , nib = require('nib')
  , join = require('path').join
  , browserify = require('browserify')
  , browjadify = require('./pliers/lib/browjadify')
  , compressJs = require('./pliers/lib/compress-js')
  , fs = require('fs')
  , debug = process.env.NODE_ENV === undefined
  , properties = require('./properties')

module.exports = function (pliers) {

  function log(msg, level) {
    pliers.logger[level](msg)
  }

  pliers('test', function (done) {
    pliers.exec('npm run test', done)
  })

  pliers('lint', { description: 'Run lint checks on all site and lib JS files' }, function (done) {
    pliers.exec('npm run lint', done)
  })

  pliers('buildCss', function (done) {
    function compile(str, path) {
      return stylus(str)
        .use(nib())
        .set('filename', path)
        .set('warn', false)
        .set('compress', !debug)
    }

    var styleSheets = [ join(__dirname, 'site', 'public', 'css', 'index.styl') ]

    stylusRender(styleSheets, { compress: !debug, compile: compile }, function (err) {
      if (err) pliers.logger.error(err.message)
      done()
    }).on('log', log)
  })

  pliers('clean', function (done) {
    pliers.rm(join(__dirname, 'site', 'public', 'js', 'build'))
    done()
  })

  pliers('buildJs', function (done) {
    pliers.mkdirp(join(__dirname, 'site', 'public', 'js', 'build'))

    var script = 'index.js'
      , b = browserify(join(__dirname, 'site', 'public', 'js', 'app', script))

    b.transform(browjadify)

    b.bundle({ debug: debug }, function (err, js) {

      if (err) return done(err)

      if (!debug) {
        pliers.logger.info('Compressing Browser JavaScript', script)
        js = compressJs(js)
      }

      fs.writeFile(join(__dirname, 'site', 'public', 'js', 'build', script), js, 'utf-8', function (err) {
        if (err) return done(err)
        done()
      })

    })

  })

  pliers('buildProperties', function (done) {
    fs.writeFile(join(__dirname, 'properties.json'), 
      JSON.stringify(properties[debug ? 'development' : 'production'], null, '\t'), 
      'utf-8', 
      function (err) {

      if (err) return done(err)
      done()
    })
  })

  pliers('build', 'buildProperties', 'clean', 'buildCss', 'buildJs')
}