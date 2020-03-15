'use strict';

const gulp = require('gulp');

gulp.task('hello', callback => { // name of the task could consist from two words, for example task1:task2
  console.log('Hello');
  callback(); // Required. Need for mark that task is finished.
});

gulp.task('example:promise', () => { // Task could return the Promise
  console.log('Hello');
  return new Promise((resolve, reject) => {
    //....
    resolve('result');
  });
});

gulp.task('example:stream', () => { // Task could return stream
  console.log('Hello');
  return require('fs').createReadStream(__filename);
});

gulp.task('example:process', () => { // Task could return child procces
  console.log('Hello');
  return require('child_process').spawn('ls', ['node_modules'], {stdio: 'inherit'});
});

gulp.task('example:all', gulp.series('hello', 'example:promise', 'example:stream'));
gulp.task('example:all:par', gulp.parallel('hello', 'example:promise', 'example:stream'));