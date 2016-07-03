const gulp = require('gulp');
const coffee = require('gulp-coffee');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

gulp.task('listing-7-1', function() {
  return gulp.src('src/scripts/**/*.coffee')
    .pipe(coffee())
    .pipe(gulp.src('src/scripts/**/*.js', { passthrough: true }))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
});
