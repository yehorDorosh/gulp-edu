'use strict';

const gulp = require('gulp');

gulp.task('task1', () => {
  return gulp.src('src/**/*.*')
    .pipe(gulp.dest('dest'));
});

gulp.task('task2', () => {
  return gulp.src('src/**/*.*')
    .on('data', file => { // show copyed files in console
      console.log(file);
    })
    .pipe(gulp.dest('dest'));
});

gulp.task('task3', () => {
  return gulp.src('src/**/*.*')
    .on('data', file => { // show copyed files in console
      console.log({
        contents: file.contents, // if {read: false} then content null
        path: file.path, // D:\\frontend\\education\\gulp\\src\\dir1\\second.txt
        cwd: file.cwd, // D:\\frontend\\education\\gulp
        base: file.base, // D:\\frontend\\education\\gulp\\src
        relative: file.relative,  // dir1\\second.txt
        dirname: file.dirname,   // parent dir name
        basename: file.basename, // file name + file type
        stem: file.stem,        // file name
        extname: file.extname   // file type example '.js'
      });
    })
    .pipe(gulp.dest('dest'));
});

gulp.task('default', () => {
  return gulp.src('src/**/*.*') // minimatch
    .pipe(gulp.dest(file => { // Check file type and copy file to appropriate dir
      return file.extname == '.js' ? 'dest/js' :
      file.extname == '.css' ? 'dest/css' : 'dest';
    }));
});
