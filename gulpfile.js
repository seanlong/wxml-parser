var babelify = require('babelify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var plugins = require('gulp-load-plugins')();

var options = {
  debug: false,
  fullPaths: false,
  standalone: 'wxmlparser'
};

function createBundler(entry) {
  options = plugins.util.env.production ? options :
    assign(options, { debug: true, fullPaths: true, cache: {}, packageCache: {} });
  options.entries = [entry];
  var b = browserify(options);
  b.transform('babelify', { presets: ['es2015'] });
  return b;
}

function bundle(b, out) {
  return b.bundle()
    .on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))
    .pipe(source(out))
    .pipe(buffer())
    .pipe(plugins.util.env.production ? uglify() : gutil.noop())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));
}

gulp.task('build', function() {
  var bundler = createBundler('index.js');
  return bundle(bundler, 'wxml-parser.js')
});

gulp.task('test', function() {
  var bundler = createBundler('test/test.js');
  bundler.plugin(watchify);
  bundler.on('update', function() {
    bundle(bundler, 'test.js');
    gutil.log('Rebundle...');
  });
  bundle(bundler, 'test.js');
});