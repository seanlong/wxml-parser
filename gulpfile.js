var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var path = require('path');

function compile(entry, output, watch) {
  var bundler = watchify(browserify(entry, { debug: true }).transform(babel));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source(output))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./build'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

gulp.task('build', function() { return compile('./index.js', 'wxml-parser.js'); });
gulp.task('watch', function() { return compile('./index.js', 'wxml-parser.js', true); });
gulp.task('test', function() { return compile('./test/test.js', 'test.js', true); })

gulp.task('default', ['watch']);