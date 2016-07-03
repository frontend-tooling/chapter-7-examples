const gulp = require('gulp');
const coffee = require('gulp-coffee');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const coffeelint = require('gulp-coffeelint');
const eslint = require('gulp-eslint');
const babel  = require('gulp-babel');
const mainBowerFiles = require('main-bower-files');
const less = require('gulp-less')
const queue  = require('streamqueue').obj;
const cssimport  = require('gulp-cssimport');
const autoprefixer = require('gulp-autoprefixer');

const merge = require('merge2');
const combiner = require('stream-combiner2');

/** Listing 7.1 **/

gulp.task('listing-7-1', function() {
  return gulp.src('src/scripts/**/*.coffee')
    .pipe(coffee())
    .pipe(gulp.src('src/scripts/**/*.js', { passthrough: true }))
    .pipe(concat('main-1.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
});

/** Listing 7.2 **/

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

/** Listing 7.3 **/

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

/** Listing 7.5 **/

const variations = [
  {
    linttask: coffeelint,
    fail: coffeelint.reporter('fail'),
    compiletask: coffee,
    directory: 'src/scripts/',
    type: 'coffee',
    bundle: 'main-5.1.js'
  },
  {
    linttask: coffeelint,
    fail: coffeelint.reporter('fail'),
    compiletask: coffee,
    directory: 'src/scripts-coffee/',
    type: 'coffee',
    bundle: 'main-5.2.js'
  },{
    linttask: eslint,
    fail: eslint.failAfterError(),
    compiletask: babel,
    directory: 'src/scripts-es6/',
    type: 'es',
    bundle: 'main-5.3.js'
  }
];

gulp.task('listing-7-5', function() {
  const streams = variations.map(function(el) {
     return compileScripts(el);
  });
  return merge(streams);
});

/** Listing 7.6 **/

function combine(output) {
  return combiner.obj(
    concat(output),
    uglify()
  );
}

gulp.task('listing-7-6', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('fail'))
    .pipe(combine('main-6.js'))
    .pipe(gulp.dest('dist/scripts'));
});

/** Listing 7.7 **/

gulp.task('listing-7-7', function() {
  return queue(gulp.src(mainBowerFiles('**/*.css')),
    gulp.src('styles/lib/lib.css')
      .pipe(cssimport()),
    gulp.src('styles/less/main.less')
      .pipe(less())
  ).pipe(autoprefixer())
  .pipe(concat('main.css'))
  .pipe(gulp.dest('dist/styles'));
});
