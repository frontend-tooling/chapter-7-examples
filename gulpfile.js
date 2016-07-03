const gulp = require('gulp');
const coffee = require('gulp-coffee');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const coffeelint = require('gulp-coffeelint');

const merge = require('merge2');

gulp.task('listing-7-1', function() {
  return gulp.src('src/scripts/**/*.coffee')
    .pipe(coffee())
    .pipe(gulp.src('src/scripts/**/*.js', { passthrough: true }))
    .pipe(concat('main-1.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('listing-7-2', function() {
  const coffeeStream = gulp.src('src/scripts/**/*.coffee')
    .pipe(coffeelint())
    .pipe(coffeelint.reporter())
    .pipe(coffeelint.reporter('fail'))
    .pipe(coffee());

  const jsStream = gulp.src('src/scripts/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter())
    .pipe(jshint.reporter('fail'));

  return merge(coffeeStream, jsStream)
    .pipe(concat('main-2.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
});
