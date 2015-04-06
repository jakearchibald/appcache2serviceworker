var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var through = require('through2');

gulp.task('clean', function (done) {
  require('del')(['dist'], done);
});

gulp.task('build-lib-js', function () {
  return gulp.src('lib/**/*.js')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
});

gulp.task('build-lib-templates', function () {
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

gulp.task('watch', ['build'], function () {
  gulp.watch(['lib/**/*.js'], ['build-lib']);
  gulp.watch(['templates/**/*.hbs'], ['build-lib-templates']);
});

gulp.task('build-lib', function (done) {
  runSequence('clean', ['build-lib-js', 'build-lib-templates'], done);
});

gulp.task('build', function (done) {
  runSequence('clean', 'build-lib', done);
});

gulp.task('default', ['build']);
