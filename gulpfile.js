var gulp = require('gulp');
var bs = require('browser-sync').create();
var eslint = require('gulp-eslint');
var sass = require('gulp-sass');

var config = {
  tmp: './.tmp/',
  src: './app/',
  dist: './dist/'
};

gulp.task('browser-sync', function() {
  bs.init({
    server: [config.tmp, config.src],
    open: 'external'
  });
});

gulp.task('eslint', function() {
  return gulp.src(config.src + '**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(bs.reload({ stream: true }));
});

gulp.task('sass', function() {
  return gulp.src(config.src + '**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest(config.tmp))
    .pipe(bs.reload({ stream: true }));
});

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch(config.src + '**/*.js', ['eslint']);
  gulp.watch(config.src + '**/*.scss', ['sass']);
  gulp.watch([config.src + '*.html', config.src + 'images/']).on('change', bs.reload);
});

gulp.task('serve', ['watch']);
