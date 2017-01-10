var gulp = require('gulp');
var bs = require('browser-sync').create();
var eslint = require('gulp-eslint');
var sass = require('gulp-sass');
var clean = require('gulp-clean');

var config = {
  tmp: './.tmp/',
  src: './app/',
  dist: './dist/'
};

gulp.task('browser-sync', function() {
  bs.init({
    server: {
      baseDir: [config.tmp, config.src],
      routes: {
        '/plugins': 'plugins'
      }
    },
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

gulp.task('clean', function() {
  return gulp.src('./.tmp', { read: false })
    .pipe(clean());
});

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch(config.src + '**/*.js', ['eslint']);
  gulp.watch(config.src + '**/*.scss', ['sass']);
  gulp.watch([config.src + '*.html', config.src + 'images/']).on('change', bs.reload);
});

gulp.task('serve', ['clean', 'sass', 'watch']);
