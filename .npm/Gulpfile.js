'use strict';

var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  filter = require('gulp-filter'),
  sass = require('gulp-ruby-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  prettify = require('gulp-html-prettify'),
  jslint = require('gulp-jslint'),
  jsmin = require('gulp-jsmin'),
  rename = require('gulp-rename'),
  reload = browserSync.reload,
  src = {
    scss: '../scss/**/*.scss',
    css: '../css',
    html: '../app/*.html',
    js: '../src/*.js',
  };

/**
 * Start the BrowserSync Static Server + Watch files
 */
gulp.task('default', ['sass', 'js', 'html'] , function () {

  browserSync({
    server: '../app',
  });

  gulp.watch(src.scss, ['sass']);
  gulp.watch(src.js, ['js']);
  gulp.watch(src.html, ['html']);
});


/**
 * Kick off the sass stream with source maps + error handling
 */
function sassStream() {
  return sass('./scss', {
    sourcemap: true,
    style: 'expanded',
    unixNewlines: true
  })
    .on('error', function (err) {
      console.error('Error!', err.message);
    })
    .pipe(autoprefixer({ browsers: ['> 5%', 'last 1 version']}))
    .pipe(sourcemaps.write('./', {
      includeContent: false,
      sourceRoot: '/scss'
    }));
}


/**
 * Compile sass, filter the results, inject CSS into all browsers.
 */
gulp.task('sass', function () {
  return sassStream()
    .pipe(gulp.dest(src.css))
    .pipe(filter("**/*.css"))
    .pipe(reload({stream: true}));
});

/**
 * Verify syntax and minify js.
 */
gulp.task('js', function () {
  gulp.src(src.js)
    .pipe(jslint({
      node: true,
      evil: true,
      nomen: true,
      reporter: 'default',
      edition: '2014-07-08',
      errorsOnly: false
    }))
    .on('error', function (error) {
        console.error(String(error));
    })
    .pipe(jsmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('../app/js/'))
    .pipe(gulp.dest('../'))
    .pipe(reload({stream: true}));
});

/**
 * Generate templates.
 */
gulp.task('html', function () {
  return gulp.src(src.html)
    .pipe(prettify({indent_char: ' ', indent_size: 2}));
});
