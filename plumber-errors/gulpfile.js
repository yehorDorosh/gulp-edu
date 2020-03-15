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
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify'); // обработчик ошибок
const plumber = require('gulp-plumber'); // навешивает обрадотчик ошибок на все потоки таски

sass.compiler = require('node-sass');
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'dev';

// gulp.task('styles', () => {
//   return gulp.src('frontend/styles/**/*.sass', {base: 'frontend'}) // {base: 'frontend'} - явно указать свойство объекта file.base для того что бы в dest создалась папка styles содержащая стили алтернатива задать src путь frontend/**/*.sass
//     .pipe(debug({title: 'src'})) // title - добавит подпись в консоле для текущего процесса
//     .pipe(sass().on('error', sass.logError))
//     .pipe(debug({title: 'sass'}))
//     .pipe(concat('all.css'))
//     .pipe(debug({title: 'concat'}))
//     .pipe(gulp.dest('public'));
// });

gulp.task('styles', () => {
  return gulp.src('frontend/styles/main.sass')
    .pipe(plumber({ // применяет обработчик ошибок ко всем потокам сразу
      errorHandler: notify.onError(err => {
        return {
          title: 'Styles',
          message: err.message
        };
      })
    }))
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(sass())
    // .on('error', notify.onError(err => {
    //   return {
    //     title: 'Styles',
    //     message: err.message
    //   }
    // })) //  sass.logError - обработчик ошибок от сасс из коробки. console.log(err.message); this.end(); - это стандартный обработчик ошибок
    .pipe(gulpIf(isDev, sourcemaps.write('.'))) // по умолчанию сорсмап пишется в тот же файл как коментарий, параметр '.' создаст отдельный файл для соср мапа
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
  gulp.watch('frontend/styles/**/*.sass', gulp.series('styles'));
  gulp.watch('frontend/assets/**', gulp.series('assets'));
});

gulp.task('serve', () =>{
  browserSync.init({
    server: 'public' // можно убрать параметр, тогда нужно в ручную добавить на страницу скрип, в консоле пропишется штмл вставки
  });
  browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task( 'dev', gulp.series('build', gulp.parallel('watch', 'serve')));