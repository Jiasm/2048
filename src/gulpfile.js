/**
 * 新版的gulpfile
 * 任务清单：
 *   1. build   执行编译、压缩、上传并删除public文件夹
 *   2. watch   执行编译并监听文件变化
 *   3. default 执行编译
 */

'use strict'

const path = require('path')
const appName = path.resolve(__dirname, '../').split('/').pop() // 项目的名称
const publicPath = '../dist'                                    // 静态资源输出目录

const jsFiles = ['./js/*.js']                                   // js文件
const cssFiles = ['./css/*.scss', './css/*.css']                // css文件
const htmlFiles = ['./html/*.html']                             // html文件
const imgFiles = ['./img/*.png', './img/*.jpg', './img/*.gif']  // img文件
const watchPath = jsFiles.concat(cssFiles.concat(htmlFiles))    // 监听文件变化的路径

const jsOutput = `${publicPath}/js`                             // js输出目录
const cssOutput = `${publicPath}/css`                           // css输出目录
const imgOutput = `${publicPath}/img`                           // img输出目录
const htmlOutput = publicPath                                   // html输出目录

var gulp = require('gulp')
var sass = require('gulp-sass')
var babel = require('gulp-babel')
var concat = require('gulp-concat')
var flatten = require('gulp-flatten')
var sourcemaps = require('gulp-sourcemaps')
var runSequence = require('gulp-sequence')
var autoprefixer = require('gulp-autoprefixer')

gulp.task('js', () =>
  gulp.src(jsFiles)
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(flatten())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(jsOutput))
)

gulp.task('css', () =>
  gulp.src(cssFiles)
  .pipe(autoprefixer({
    browsers: ['last 40 versions'],
    cascade: false
  }))
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(flatten())
  .pipe(concat(`${appName}.css`))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(cssOutput))
)

gulp.task('tpl', () =>
  gulp.src(htmlFiles)
  .pipe(gulp.dest(htmlOutput))
)

gulp.task('img', () =>
  gulp.src(imgFiles)
  .pipe(gulp.dest(imgOutput))
)

gulp.task('default', cb => {
  runSequence('js', 'css', 'img', 'tpl')(cb)
})

gulp.task('watch', () => {
  gulp.watch(watchPath, ['default'])
})
