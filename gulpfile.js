var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var through = require('through2');
var browserSync = require('browser-sync');
var watchify = require('watchify');
var browserify = require('browserify');
var uglifyify = require('uglifyify');
var babelify = require("babelify");
var mergeStream = require('merge-stream');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var reload = browserSync.reload;

gulp.task('clean', function (done) {
  require('del')(['dist', 'gui/dist'], done);
});

gulp.task('lib:js', function () {
  return gulp.src('lib/**/*.js')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
});

gulp.task('lib:templates', function () {
  return gulp.src('templates/**/*.hbs')
    .pipe(plugins.handlebars())
    .pipe(through.obj(function(file, enc, callback) {
      // Don't want the whole lib
      file.defineModuleOptions.require = {Handlebars: 'handlebars/runtime'};
      callback(null, file);
    }))
    .pipe(plugins.defineModule('commonjs'))
    .pipe(plugins.rename(function(path) {
      path.extname = '.js';
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('gui:browser-sync', function() {
  browserSync({
    notify: false,
    port: 8000,
    server: "gui/dist",
    open: false
  });
});

gulp.task('gui:html', function () {
  return gulp.src([
    'gui/src/*.html',
  ])
  .pipe(plugins.swig({
    defaults: { cache: false }
  }))
  .pipe(plugins.htmlmin({
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    minifyJS: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
  })).pipe(gulp.dest('gui/dist'))
    .pipe(reload({stream: true}));
});

gulp.task('gui:css', function () {
  return gulp.src('gui/src/css/*.scss')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({ outputStyle: 'compressed' }))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('gui/dist/css'))
    .pipe(plugins.filter('**/*.css'))
    .pipe(reload({stream: true}));
});

gulp.task('gui:misc', function () {
  return gulp.src([
    // Copy all files
    'gui/src/**',
    // Exclude the following files
    // (other tasks will handle the copying of these files)
    '!gui/src/*.html',
    '!gui/src/{css,css/**}',
    '!gui/src/{js,js/**}'
  ]).pipe(gulp.dest('build'));
});

function createBundler(src) {
  var b;

  if (plugins.util.env.production) {
    b = browserify();
  }
  else {
    b = browserify({
      cache: {}, packageCache: {}, fullPaths: true,
      debug: true
    });
  }

  b.transform(babelify);

  if (plugins.util.env.production) {
    b.transform({
      global: true
    }, 'uglifyify');
  }

  b.add(src);
  return b;
}

var bundlers = {
  'js/page.js': createBundler('./gui/src/js/page/index.js'),
  'js/appcache-2-service-worker-src-worker.js': createBundler('./gui/src/js/appcache-2-service-worker-src-worker/index.js')
};

function bundle(bundler, outputPath) {
  var splitPath = outputPath.split('/');
  var outputFile = splitPath[splitPath.length - 1];
  var outputDir = splitPath.slice(0, -1).join('/');

  return bundler.bundle()
    // log errors if they happen
    .on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))
    .pipe(source(outputFile))
    .pipe(buffer())
    .pipe(plugins.sourcemaps.init({ loadMaps: true })) // loads map from browserify file
    .pipe(plugins.sourcemaps.write('./')) // writes .map file
    .pipe(plugins.size({ gzip: true, title: outputFile }))
    .pipe(gulp.dest('gui/dist/' + outputDir))
    .pipe(reload({ stream: true }));
}

gulp.task('gui:js', function () {
  return mergeStream.apply(null,
    Object.keys(bundlers).map(function(key) {
      return bundle(bundlers[key], key);
    })
  );
});

gulp.task('watch', ['build'], function () {
  gulp.watch(['lib/**/*.js'], ['lib:js']);
  gulp.watch(['templates/**/*.hbs'], ['lib:templates']);
  gulp.watch(['gui/src/*.html'], ['gui:html']);
  gulp.watch(['gui/src/**/*.scss'], ['gui:css']);

  Object.keys(bundlers).forEach(function(key) {
    var watchifyBundler = watchify(bundlers[key]);
    watchifyBundler.on('update', function() {
      return bundle(watchifyBundler, key);
    });
    bundle(watchifyBundler, key);
  });
});

gulp.task('lib', ['lib:templates', 'lib:js']);
gulp.task('gui', ['gui:css', 'gui:misc', 'gui:html', 'gui:js']);

gulp.task('build', function (done) {
  runSequence('lib', 'gui', done);
});

gulp.task('serve', ['gui:browser-sync', 'watch']);

gulp.task('default', ['build']);
