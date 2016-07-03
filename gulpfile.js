const gulp = require('gulp');
const coffee = require('gulp-coffee');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const coffeelint = require('gulp-coffeelint');
const eslint = require('gulp-eslint');
const babel  = require('gulp-babel');

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


function compileScripts(param) {
  const transpileStream = gulp.src(param.directory + '**/*.' + param.type)
    .pipe(param.linttask())
    .pipe(param.fail)
    .pipe(param.compiletask());
  const jsStream = gulp.src(param.directory + '**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('fail'));

  return merge(transpileStream, jsStream)
    .pipe(concat(param.bundle))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
}

gulp.task('coffee-listing-7-3', function() {
  return compileScripts({
    linttask: coffeelint,
    fail: coffeelint.reporter('fail'),
    compiletask: coffee,
    directory: 'src/scripts/',
    type: 'coffee',
    bundle: 'main-3.1.js'
  });
});

gulp.task('es6-listing-7-3', function() {
  return compileScripts({
    linttask: eslint,
    fail: eslint.failAfterError(),
    compiletask: babel,
    directory: 'src/scripts-es6/',
    type: 'es',
    bundle: 'main-3.2.js'
  });
});

gulp.task('listing-7-3', gulp.parallel('coffee-listing-7-3', 'es6-listing-7-3'));
