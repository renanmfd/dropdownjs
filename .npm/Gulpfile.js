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
  swig = require('gulp-swig'),
  custom_filters = require('./filter/custom_filters.js'),
  reload = browserSync.reload,
  src = {
    scss: '../scss/*.scss',
    appScss: '../app/scss/*.scss',
    css: '../css',
    swig: '../app/templates/*.twig',
    js: '../src/*.js',
  };

/**
 * Kick off the sass stream with source maps + error handling
 */
function sassStream(path) {
  return sass(path, {
      sourcemap: true,
      style: 'expanded',
      unixNewlines: true
    })
    .on('error', sass.logError)
    .pipe(autoprefixer({ browsers: ['> 5%', 'last 2 version']}))
    .pipe(sourcemaps.write('./', {
      includeContent: false,
      sourceRoot: '../scss'
    }));
}

/**
 * Compile PLUGIN sass, filter the results, inject CSS into all browsers.
 */
gulp.task('sass', function () {
  return sassStream(src.scss)
    .pipe(gulp.dest(src.css))
    .pipe(gulp.dest('../app/css'))
    .pipe(filter("**/*.css"))
    .pipe(reload({stream: true}));
});

/**
 * Compile APP sass, filter the results, inject CSS into all browsers.
 */
gulp.task('appScss', function () {
  return sassStream(src.appScss)
    .pipe(gulp.dest('../app/css'))
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
    .on('end', reload);
});

gulp.task('templates', function() {
  gulp.src('../app/templates/index.twig')
    .pipe(swig({
      load_json: true,
      json_path: '../temapltes/json_data/',
      setup: function(swig) {
        for (var key in custom_filters) {
          swig.setFilter(key, custom_filters[key]);
        }
      },
    }))
    //.pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('../app'))
    .on('end', reload);
});

/**
 * Start the BrowserSync Static Server + Watch files
 */
gulp.task('serve', ['sass', 'appScss', 'js', 'templates'] , function () {
  browserSync({
    server: '../app',
  });

  gulp.watch(src.scss, ['sass']);
  gulp.watch(src.appScss, ['appScss']);
  gulp.watch(src.js, ['js']);
  gulp.watch(src.swig, ['templates']);
});

gulp.task('default', ['serve']);
