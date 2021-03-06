const gulp = require('gulp')
const sass = require('gulp-sass')
const concatCSS = require('gulp-concat-css')
const postcss = require('gulp-postcss')
const cssnano = require('cssnano')
const clean = require('gulp-clean')
const rename = require('gulp-rename')
const changed = require('gulp-changed')
const { cssFileName, cssFilesPath, cssBundlePath, sassSrcPath } = require('./config')

const deleteFiles = (files) => {
  return new Promise((resolve, reject) => {
    return gulp.src(files)
      .pipe(clean())
      .on('error', resolve)
      .on('data', () => {}) // fix end emit, listen the data
      .on('end', resolve)
  })
}

const buildScss = async (files) => {
  // 判断是否存在不需要编译（既是被引用的）的文件，如果是则需要重新编译全部文件。
  const hasBeImportFiles = !!(files || []).find(f => f.indexOf('/_') >= 0 || f.indexOf('\_') >= 0)
  const changeFiles =
        hasBeImportFiles ?
        gulp.src(sassSrcPath) :
        gulp.src(sassSrcPath)
            .pipe(changed(cssFilesPath, {extension: '.css'}))
  return new Promise((resolve, reject) => {
    return changeFiles
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(postcss())
      .pipe(gulp.dest(cssFilesPath))
      // .on('data', console.log) // 打印编译的文件
      .on('end', resolve)
  })
}

const concatFiles = async () => {
  return new Promise((resolve, reject) => {
    return gulp.src(`${cssFilesPath}/**/*.css`)
      .pipe(concatCSS(cssFileName))
      .pipe(gulp.dest(cssBundlePath))
      .on('end', resolve)
  })
}

const minifyCss = async () => {
  return new Promise((resolve, reject) => {
    return gulp.src('./dist/*.css')
      .pipe(postcss([cssnano()]))
      .pipe(rename(filePath => {
        filePath.basename += '.min'
      }))
      .pipe(gulp.dest(cssBundlePath))
      .on('end', resolve)
  })
}

module.exports = async (files) => {
  if (files) {
    await deleteFiles('./dist/*.css')
  } else {
    await deleteFiles('./dist/**/*.css')
  }
  await buildScss(files)
  await concatFiles()
  await minifyCss()
  console.log('build scss end')
}

