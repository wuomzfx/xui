const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const buildCss = require('./build/css')

gulp.task('nodemon', ['default'], () => {
  return nodemon({
    script: './index.js',
    ext: 'scss',
    tasks (changedFiles) {
      buildCss(changedFiles)
      return []
    },
    ignore: ['build/**', 'dist/**', '.git', 'node_modules/**']
  })
})
gulp.task('default', () => buildCss())
