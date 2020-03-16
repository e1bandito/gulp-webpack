'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var sassGlob = require('gulp-sass-glob');
var sourcemaps = require('gulp-sourcemaps');
var server = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var webp = require('gulp-webp');
var svgstore = require("gulp-svgstore");
var del = require('del');
var gcmq = require('gulp-group-css-media-queries');
var webpack = require('webpack-stream');
var pug = require('gulp-pug');
var prettify = require('gulp-jsbeautifier');
const getData = require('jade-get-data')('src/data');

let webpackConf = {
  output: {
    filename: 'main.min.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/'
      }
    ]
  }
};

// Автопрефиксы и минификация стилей
gulp.task('style', (done) => {
  gulp.src('src/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gcmq())
    .pipe(gulp.dest('build/css'))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
    done()
});


// Минификация js
gulp.task('js', () => {
  return gulp.src(['src/js/*.js', '!js/**/*.min.js'])
    .pipe(plumber())
    .pipe(webpack(webpackConf))
    .pipe(gulp.dest('build/js'))
    .pipe(server.stream());
});


// html
gulp.task('html', () => {
  return gulp.src('src/pages/*.html')
    .pipe(gulp.dest('build'))
    .pipe(server.stream());
});

gulp.task('pug', () => {
  return gulp.src('src/pug/pages/*.pug')
    .pipe(plumber())
    .pipe(pug({ data: { getData } }))
    .pipe(pug())
    .pipe(prettify({
      braceStyle: 'expand',
      indent_size: 2,
      indentInnerHtml: true,
      preserveNewlines: true,
      endWithNewline: true,
      wrapLineLength: 120,
      maxPreserveNewlines: 50,
      wrapAttributesIndentSize: 1,
      unformatted: ['use'],
    }))
    .pipe(gulp.dest('build'))
    .pipe(server.stream());
});

// Оптимизация изображений
gulp.task('images', () => {
  return gulp.src('src/img/**/*.{png,jpg,svg}')
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest('src/img'));
});


// Конвертация в webp
gulp.task('webp', () => {
  return gulp.src('src/img/**/*.{png,jpg}')
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest('src/img'));
});

// svg-sprite
gulp.task("sprite", () => {
  return gulp.src("src/img/sprite-*.svg")
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("src/img"));
});

// Очиска build
gulp.task('clean', () => {
  return del('build');
});

// Копирование в build
gulp.task('copy', () => {
  return gulp.src([
    'src/fonts/**/*.{eot,svg,ttf,woff,woff2}',
    'src/img/**',
    // 'src/pages/*.html',
  ], {
    base: 'src/'
  })
  .pipe(gulp.dest('build'));
});

// Watcher
gulp.task('serve',() => {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
  gulp.watch('src/blocks/**/*.scss', gulp.series('style'));
  gulp.watch('src/sass/**/*.scss', gulp.series('style'));
  gulp.watch('src/js/**', gulp.series('js'));
  gulp.watch('src/pug/pages/*.pug', gulp.series('pug'));
  gulp.watch('src/blocks/**/*.pug', gulp.series('pug'));
  gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
});

// Сборка в build
gulp.task('build', gulp.series('clean', 'copy', 'style', 'js', 'pug'));
