'use strict'

/*********************
* Requires
*********************/

const babelify                 = require('babelify'),
      browserify               = require('browserify'),
      critical                 = require('critical').stream,
      del                      = require('del'),
      fs                       = require('fs'),
      gulp                     = require('gulp'),
      babel                    = require('gulp-babel'),
      cached                   = require('gulp-cached'),
      changed                  = require('gulp-changed'),
      coffee                   = require('gulp-coffee'),
      concat                   = require('gulp-concat'),
      cssnano                  = require('gulp-cssnano'),
      // debug                    = require('gulp-debug'),
      data                     = require('gulp-data'),
      filter                   = require('gulp-filter'),
      foreach                  = require('gulp-foreach'),
      ifElse                   = require('gulp-if-else'),
      imagemin                 = require('gulp-imagemin'),
      include                  = require('gulp-include'),
      jade                     = require('gulp-jade'),
      jadeFindAffected         = require('gulp-jade-find-affected'),
      jadeInheritance          = require('gulp-jade-inheritance'),
      newer                    = require('gulp-newer'),
      postcss                  = require('gulp-postcss'),
      rename                   = require('gulp-rename'),
      replace                  = require('gulp-replace'),
      sourcemaps               = require('gulp-sourcemaps'),
      svgSprites               = require('gulp-svg-sprite'),
      swig                     = require('gulp-swig'),
      uglify                   = require('gulp-uglify'),
      gutil                    = require('gulp-util'),
      rsync                    = require('gulp-rsync'),
      gzip                     = require('gulp-gzip'),
      lost                     = require('lost'),
      bower                    = require('main-bower-files'),
      path                     = require('path'),
      postcssAssets            = require('postcss-assets'),
      postcssCenter            = require('postcss-center'),
      postcssCssnext           = require('postcss-cssnext'),
      postcssCustomMedia       = require('postcss-custom-media'),
      postcssDevtools          = require('postcss-devtools'),
      postcssEach              = require('postcss-each'),
      postcssFocus             = require('postcss-focus'),
      postcssFontMagician      = require('postcss-font-magician'),
      postcssFor               = require('postcss-for'),
      postcssEasyImport        = require('postcss-easy-import'),
      postcssMixins            = require('postcss-mixins'),
      postcssNested            = require('postcss-nested'),
      postcssPxToRem           = require('postcss-pxtorem'),
      postcssReporter          = require('postcss-reporter'),
      postcssSimplevars        = require('postcss-simple-vars'),
      postcssColor             = require('postcss-color-function'),
      rucksack                 = require('rucksack-css'),
      stylelint                = require("stylelint"),
      stylelinterConfig        = require("./.stylelintrc"),
      browsersync              = require('browser-sync'),
      buffer                   = require('vinyl-buffer'),
      source                   = require('vinyl-source-stream'),
      ghPages                  = require('gulp-gh-pages'),
      argv                     = require('yargs').argv,
      fatalLevel               = require('yargs').argv.fatal


const deleteFolderRecursive = path => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = `${path}/${file}`
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

// De-caching for Data files
const requireUncached = ($module) => {
  delete(require.cache[require.resolve($module)])
  return require($module)
}

/*********************
* Base Paths
*********************/
const paths = {
  base: {
    root       : '',
    src        : './src/',
    dist       : './dist/',
    tmp        : './tmp/'
  }
}

paths.src = {
  css    : `${paths.base.src}assets/css`,
  fonts  : `${paths.base.src}assets/fonts`,
  js     : `${paths.base.src}assets/js`,
  images : `${paths.base.src}assets/images`,
  html   : `${paths.base.src}html`
}

paths.dist = {
  css    : `${paths.base.dist}assets/css`,
  fonts  : `${paths.base.dist}assets/fonts`,
  js     : `${paths.base.dist}assets/js`,
  images : `${paths.base.dist}assets/images`,
  html   : paths.base.dist
}


/*********************
* Error Handling (ref. https://gist.github.com/noahmiller/61699ad1b0a7cc65ae2d)
*********************/

global.isWatching = false

// Command line option:
//  --fatal=[warning|error|off]
const ERROR_LEVELS = ['error', 'warning']

// Return true if the given level is equal to or more severe than
// the configured fatality error level.
// If the fatalLevel is 'off', then this will always return false.
// Defaults the fatalLevel to 'error'.
const isFatal = level => {
  return ERROR_LEVELS.indexOf(level) <= ERROR_LEVELS.indexOf(fatalLevel || 'error')
}

// Handle an error based on its severity level.
// Log all levels, and exit the process for fatal levels.
// ref. http://stackoverflow.com/questions/21602332/catching-gulp-mocha-errors#answers
const handleError = (level, error) => {
  // Emit `alert` sound
  process.stdout.write('\x07')
  gutil.log(error.message)
  // if isFatal(level)
  //   process.exit(1)
  if (global.isWatching) {
    this.emit('end')
  } else {
    process.exit(1)
  }
}

// Convenience handler for error-level errors.
const onError = error => { return handleError.call(this, 'error', error) }
// Convenience handler for warning-level errors.
const onWarning = error => { return handleError.call(this, 'warning', error) }



/*********************
* Tasks
*********************/

gulp.task('static-files', () => {
  gulp.src(`${paths.base.src}/*.*`)
    .pipe(gulp.dest(paths.base.dist))
})

gulp.task('html', () => {
  gulp.src([`${paths.src.html}/*.jade`])
    .pipe(jadeInheritance({ basedir: paths.src.html }).on('error', onError))
    .pipe(jade()).on('error', onError)
    .pipe(gulp.dest(paths.dist.html)).on('error', onError)
})


gulp.task("lint-styles", () => {
  gulp.src(`${paths.src.css}/app.css`)
    .pipe(postcss([
      stylelint(stylelinterConfig),
      postcssReporter({ clearMessages: true })
    ])).on('error', onError)
})

gulp.task('css', ['lint-styles'], () => {
  const postCSSProcessors = [
    // postcssDevtools
    postcssEasyImport({ glob: true, path: ['./node_modules', './bower_components'] }),
    postcssFor,
    postcssEach,
    postcssMixins,
    postcssNested,
    postcssFocus,
    postcssCenter,
    postcssPxToRem,
    postcssSimplevars,
    postcssCustomMedia,
    postcssColor,
    rucksack,
    postcssCssnext({ browsers: ['last 2 versions','ie >= 9'] }),
    postcssAssets({ loadPaths: [paths.src.images], relative: true, cachebuster: true }),
    lost,
    postcssFontMagician
  ]

  gulp.src(`${paths.src.css}/app.css`)
    .pipe(ifElse(!argv.production, () => {
      return sourcemaps.init({ loadMaps: true })
    }).on('error', onError))
    .pipe(postcss(postCSSProcessors).on('error', onError))
    .pipe(ifElse(argv.production, () => {
      return cssnano({ discardComments: { removeAll: true }}).on('error', onError)
    }).on('error', onError))
    .pipe(ifElse(!argv.production, () => {
      return sourcemaps.write('maps')
    }).on('error', onError))
    .pipe(gulp.dest(paths.dist.css))
})

gulp.task('fonts', () => {
  gulp.src(`${paths.src.fonts}/**/*`)
    .pipe(gulp.dest(paths.dist.fonts))
})



const compileJS = (path, dest) => {
  return browserify(path, { debug: true })
    .transform(babelify)
    .bundle().on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(path.split('/').pop()))
    .pipe(buffer()).on('error', onError)
    .pipe(ifElse(!argv.production, () => {
      return sourcemaps.init({ loadMaps: true })
    }).on('error', onError))
    .pipe(ifElse(argv.production, () => {
      return uglify({ mangle: false })
    }).on('error', onError))
    .pipe(ifElse(!argv.production, () => {
      return sourcemaps.write('maps')
    }).on('error', onError))
    .pipe(gulp.dest(dest))
}

gulp.task('js', () => {

  const JSCompileDirs = ['.', 'templates', 'utils']

  JSCompileDirs.forEach(dir => {
    gulp.src(`${paths.src.js}/${dir}/*.js`)
    .pipe(foreach(function(stream, file) {
      return compileJS(file.path, `${paths.dist.js}/${dir}`)
    }))
  })

  gulp.src(`${paths.src.js}/vendor/**/*`)
    .pipe(gulp.dest(`${paths.dist.js}/vendor`))

  // Copy files as-is from the bower packages. Refer to bower.json.
  gulp.src(bower())
    .pipe(filter('**/*.{js,map}'))
    .pipe(ifElse(argv.production, () => {
      return uglify()
    }).on('error', onError))
    .pipe(gulp.dest(`${paths.dist.js}/vendor`))

  gulp.src('./node_modules/babel-polyfill/browser.js')
    .pipe(rename('babel-es6-polyfill.js'))
    .pipe(gulp.dest(`${paths.dist.js}/vendor`))

  gulp.src('./node_modules/css-element-queries/src/*.js')
    .pipe(gulp.dest(`${paths.dist.js}/vendor`))
})



gulp.task('images', () => {
  gulp.src(`${paths.src.images}/**/*.{gif,jpg,png,svg}`)
    .pipe(gulp.dest(paths.dist.images))
})




gulp.task('clean', () => {
  cached.caches = {}
  deleteFolderRecursive(paths.base.dist)
  deleteFolderRecursive(paths.base.tmp)
})

gulp.task('critical', () => {
  gulp.src(`${paths.dist.html}/*.html`)
    .pipe(critical({
      base:   `${paths.base.dist}/`,
      inline: true,
      css:    [`${paths.dist.css}/app.css`]
    }))
    .pipe(gulp.dest(paths.dist.html))
})

gulp.task('build', ['static-files', 'images', 'fonts', 'html', 'css', 'js'])

const refreshTasks = ['clean']
if (!global.isWatching) {
  refreshTasks.push('build')
}
gulp.task('refresh', refreshTasks)

gulp.task('browsersync', () => {
  browsersync.use({
    "plugin": () => {},
    "hooks": {
      "client:js": fs.readFileSync("./lib/closer.js", "utf-8")
    }
  })
  browsersync.init([paths.dist.html, paths.dist.css, paths.dist.js], {
    "server": {
      "baseDir": paths.dist.html
    }
  })
})

gulp.task('deploy', () => {
  return gulp.src('./dist/**/*').pipe(ghPages({
    remoteUrl: "https://github.com/SeekOut/seekout-site.git"
  }))
});

gulp.task('watch', ['browsersync'], () => {
  global.isWatching = true
  gulp.watch([`${paths.src.html}/**/*.jade`,
              `${paths.src.images}/**/*.svg`], ['html'])
  gulp.watch(`${paths.src.css}/**/*`, ['css'])
  gulp.watch(`${paths.src.fonts}/**/*`, ['fonts'])
  gulp.watch(`${paths.src.js}/**/*.{js,coffee}`, ['js'])
  gulp.watch(`${paths.src.images}/**/*.{gif,jpg,png,svg}`, ['images'])
})



gulp.task('default', ['refresh', 'watch'], () => {
  global.isWatching = true
})
