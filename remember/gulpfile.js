'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const debug = require('gulp-debug'); // Выводит имена файлов прошедшие через него
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const del = require('del');
const newer = require('gulp-newer'); // gulp-changed
const remember = require('gulp-remember');
const autoprefixer = require('gulp-autoprefixer');
const path = require('path'); // позволяет получить из относительного абсолютный путь

sass.compiler = require('node-sass');
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'dev';

gulp.task('styles', () => {
  return gulp.src('frontend/styles/**/*.sass', {since: gulp.lastRun('styles')}) // отбирает только новые и измененные файлы с момента первого запуска
    .pipe(sass().on('error', sass.logError))
    .pipe(debug({title: 'sass'}))
    .pipe(remember('styles')) // Запоминает все файлы в своем кеше(параметр имя кеша) которые проходили через него и если их нет добовляет их
    .pipe(debug({title: 'remember'}))
    .pipe(concat('all.css'))
    .pipe(gulp.dest('public'));
});

gulp.task('clean', () => {
  return del('public');
});

gulp.task('assets', () => {
  return gulp.src('frontend/assets/**', {since: gulp.lastRun('assets')}) // since: применяется только к тем файлам которые изменились с заданной даты  gulp.lastRun - дата последнего запуска задачи
    .pipe(newer('public')) // Пропускает только новые файлы или новые версии уже имеющихся файлов 
    .pipe(debug({title: 'assets'}))
    .pipe(gulp.dest('public'));
});

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('styles', 'assets')
  )
);

gulp.task('watch', () => {
  // gulp.watch('frontend/styles/**/*.sass', gulp.series('styles'));
  gulp.watch('frontend/styles/**/*.sass', gulp.series('styles')).on('unlink', filepath => {
    remember.forget('styles', path.resolve(filepath)); // застаялет remember очистить кеш по и мени style, для того что бы при удалении файла, не добовлялся в поток отсутсвующий файл
  }); // не будет рабоатать т.к. в кешь попадает файл css а событие пытается очистить из кеша sass. Нужно заменить в filepath расширение файла на css
  gulp.watch('frontend/assets/**', gulp.series('assets'));
});

gulp.task( 'dev', gulp.series('build', 'watch'));