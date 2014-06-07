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
  , child = null

module.exports = function (pliers) {

  pliers.filesets('css', join(__dirname, 'site', 'public', '**/*.styl'))
  pliers.filesets('browserJs',
    [ join(__dirname, 'site', 'public', 'js', 'app', '**/*.js') ])
  pliers.filesets('templates', join(__dirname, 'site', 'public', 'js', 'app', '**/*.jade'))
  pliers.filesets('serverJs',
    [ join(__dirname, 'lib/**/*.js')
    , join(__dirname, '*.js')
    // , join(__dirname, '*.json')
    , join(__dirname, 'site/views/**/*.js')
    , join(__dirname, 'site/views/templates/**/*.jade')
    , join(__dirname, 'site/templates/**/*.jade')
    ]
  )

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
    pliers.mkdirp(join(__dirname, 'site', 'public', 'css', 'build'))

    function compile(str, path) {
      return stylus(str)
        .use(nib())
        .set('filename', path)
        .set('warn', false)
        .set('compress', !debug)
    }

    var styleSheets = [ join(__dirname, 'site', 'public', 'css', 'index.styl') ]

    stylusRender(styleSheets, { compress: !debug, compile: compile }, function (err) {
      if (err) {
        pliers.logger.error(err.message)
        done()
      } else {
        fs.rename(join(__dirname, 'site/public/css/index.css'), 
          join(__dirname, 'site/public/css/build/index.css'), 
          function() {
            done()
          }
        )
      }
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
        fs.link(
          join(__dirname, 'site/public/js/vendor/jquery-1.11.0.min.js'),
          join(__dirname, 'site/public/js/build/jquery-1.11.0.min.js'),
          function () {
            done()
          })
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


  pliers('watch', function (done) {

    pliers.logger.info('Watching for application JavaScript changes')
    pliers.watch(pliers.filesets.serverJs, function () {
      pliers.run('start', function () {
        pliers.logger.info('Restarting server...')
        pliers.logger.info('Server restarted')
      })
    })

    pliers.logger.info('Watching for CSS changes')
    pliers.watch(pliers.filesets.css, function () {
      pliers.run('buildCss', function () {
        pliers.logger.info('CSS rendered')
      })
    })

    pliers.logger.info('Watching for browser JavaScript changes')
    pliers.watch(pliers.filesets.browserJs.concat(pliers.filesets.templates), function () {
      pliers.run('buildJs', function () {
        pliers.logger.info('JS built')
      })
    })
    done()

  })



  pliers('start', function (done) {
    if (child) child.kill()
    child = pliers.exec('node main.js')
    done()
  })



  pliers('go', 'build', function () {
    pliers.runAll('watch', function () {
      pliers.run('start')
    })
  })



  pliers('build', 'buildProperties', 'clean', 'buildCss', 'buildJs')
}
