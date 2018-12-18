var gulp = require('gulp');
var compass = require('gulp-compass'); //编译compass
var uglify = require('gulp-uglify'); //压缩Js
var rename = require('gulp-rename'); //重命名
var imagemin = require('gulp-imagemin'); //压缩图片
var pngquant = require('imagemin-pngquant');
var supervisor = require('gulp-supervisor');
var cssBase64 = require('gulp-css-base64');

var config = {
  scssPath: './client/resources/sass/',
  jsPath: './client/resources/js/',
  imagePath: './client/resources/image/',
  scssDistPath: './client/assets/css/',
  jsDistPath: './client/assets/js/',
  imageDistPath: './client/assets/image/',
};

//编译compass
gulp.task('compass', function() {
  gulp.src(config.scssPath + "**/*.scss")
    .pipe(compass({
      config_file: './config.rb',
      css: config.scssDistPath,
      sass: config.scssPath
    }))
    .on('error', function(error) {
      console.log(error);
      this.emit('end');
    })
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(config.scssDistPath));
});

//js压缩
gulp.task('compress', function() {
  gulp.src(config.jsPath + '**/*.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(config.jsDistPath))
});

//压缩图片
gulp.task('imagemin', function() {
  return gulp.src(config.imagePath + "**/**")
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }], //不要移除svg的viewbox属性
      use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
    }))
    .pipe(gulp.dest(config.imageDistPath))
});

//启动项目
gulp.task('server', function() {
  supervisor('./bin/www-test');
})

//监听项目
gulp.task('watch', ['compass', 'compress', 'imagemin'], function() {
  gulp.watch(config.scssPath + "**/*.scss", ['compass']);
  gulp.watch(config.jsPath + "**/*.js", ['compress']);
  gulp.watch(config.imagePath + "**/**", ['imagemin']);
})

//编译项目
gulp.task('build', ['compass', 'compress', 'imagemin']);

gulp.task('base64', function() {
  return gulp.src('client/assets/css/father/*.css')
    .pipe(cssBase64())
    .pipe(gulp.dest('dist'));
});
