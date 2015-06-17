'use strict';

var config = require('./config');

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    rimraf = require('gulp-rimraf'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify =  require('gulp-uglify');

var log  = require('gulp-util').log;
var nodemon = require('gulp-nodemon');

/*
var express = require('express'),
    refresh = require('gulp-livereload'),
    livereload = require('connect-livereload');
*/

// Set up an express server (not starting it yet)
/*
var server = express();
server.use(livereload({port: config.ports.}));
server.use(express.static('./dist'));
*/

// Dev task
gulp.task('dev', ['clean', 'static-resources', 'styles', 'lint', 'browserify','start-server'], function() { });


gulp.task('start-server', ['clean', 'static-resources', 'styles', 'lint', 'browserify'], function () {
  return nodemon({ script: config.paths.serverscript})
    .on('restart', function () {
      console.log('restarting server')
    })
});

// Clean task
gulp.task('clean', function() {
  return gulp.src('./frontend/dist/templates', { read: false }) // much faster
  .pipe(rimraf({force: true}));
});

// JSHint task
gulp.task('lint', function() {
  return gulp.src('frontend/app/scripts/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});


// Styles task
gulp.task('styles', function() {
  return gulp.src('frontend/app/styles/**/*.scss')
  .pipe(sass({onError: function(e) { console.log(e); } })) // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
  .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8')) // Optionally add autoprefixer
  .pipe(gulp.dest('backend/dist/style/'));
});


// Browserify task
gulp.task('browserify', function() {
  return gulp.src(['frontend/app/scripts/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(concat('main.js'))
  .pipe(gulp.dest('frontend/dist/js'));
});


// Static Resources task
gulp.task('static-resources', function() {
  return gulp.src('frontend/app/**/*').pipe(gulp.dest('backend/dist/'));
});


// Watch task
gulp.task('watch', ['clean', 'static-resources', 'styles', 'lint', 'browserify','start-server'], function() {
  //refresh.listen(config.ports.livereload);// Start live reload

  gulp.watch(['frontend/app/scripts/*.js'],['lint','browserify']); // Watch our scripts, and when they change run lint and browserify
  gulp.watch(['frontend/app/scripts/**/*.js'],['static-resources']);
  gulp.watch(['frontend/app/modules/**/*.js'],['lint','browserify']);
  gulp.watch(['frontend/app/styles/**/*.scss'], ['styles']); // Watch our sass files
  gulp.watch(['frontend/app/modules/**/*.scss'], ['styles']); // Watch our sass files
  gulp.watch(['frontend/app/**/*.html'], ['static-resources']);
  //gulp.watch('./backend/dist/**/*').on('change', refresh.changed);
});


// Default task
gulp.task('default', ['dev', 'watch']);
