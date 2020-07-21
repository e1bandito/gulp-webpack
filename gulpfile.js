'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const server = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const del = require('del');
const gcmq = require('gulp-group-css-media-queries');
const webpack = require('webpack-stream');
const pug = require('gulp-pug');
const prettify = require('gulp-jsbeautifier');
const getData = require('jade-get-data')('src/data');
const svgSymbols = require('gulp-svg-symbols');
const gulpIf = require('gulp-if');
const argv = require('yargs').argv;


const isDev = true;
const isProd = !isDev;


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
  },
  mode: argv.dev ? 'development' : 'production',
  devtool: argv.dev ? 'eval-source-map' : 'none'
};

// Автопрефиксы и минификация стилей
gulp.task('style', (done) => {
  gulp.src('src/sass/style.scss')
    .pipe(plumber())
    .pipe(gulpIf(argv.dev, sourcemaps.init()))
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulpIf(argv.prod, gcmq()))
    .pipe(gulpIf(argv.prod, csso()))
    .pipe(gulpIf(argv.dev, sourcemaps.write()))
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


// pug

gulp.task('pug', () => {
  return gulp.src('src/pug/pages/*.pug')
    .pipe(plumber())
    .pipe(pug({ data: { getData } }))
    .pipe(pug({ pretty: true }))
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
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true }),
    ]))
    .pipe(gulp.dest('src/img'));
});


// Конвертация в webp
gulp.task('webp', () => {
  return gulp.src('src/img/**/*.{png,jpg}')
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest('src/img'));
});

// svg-sprite
gulp.task("sprite", () => {
  return gulp.src("src/img/svg-sprite/*.svg")
    .pipe(svgSymbols({
      title: false,
      id: 'icon_%f',
      class: '%f',
      templates: ['default-svg'],
    }))
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          { optimizationLevel: 3 },
          { progessive: true },
          { interlaced: true },
          { removeViewBox: false },
          { removeUselessStrokeAndFill: true },
          { cleanupIDs: false },
          { cleanupAttrs: true },
          { removeMetadata: true },
          { removeTitle: true },
          { removeAttrs: { attrs: '(fill|stroke|data-name)' } },
        ],
      }),
    ]))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest("src/img"));
});

// Очиска build
gulp.task('clean', () => {
  return del('build');
});

// Копирование в build
gulp.task('copy', () => {
  return gulp.src([
    'src/fonts/**',
    'src/img/**',
  ], {
    base: 'src/'
  })
    .pipe(gulp.dest('build'));
});

// Watcher
gulp.task('serve', () => {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
  gulp.watch('src/components/**/*.scss', gulp.series('style'));
  gulp.watch('src/blocks/**/*.scss', gulp.series('style'));
  gulp.watch('src/sass/**/*.scss', gulp.series('style'));
  gulp.watch('src/js/**', gulp.series('js'));
  gulp.watch('src/components/**/*.js', gulp.series('js'));
  gulp.watch('src/blocks/**/*.js', gulp.series('js'));
  gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
  gulp.watch('src/data/**/*.json', gulp.series('pug'));
  gulp.watch('src/components/**/*.pug', gulp.series('pug'));
  gulp.watch('src/blocks/**/*.pug', gulp.series('pug'));
  gulp.watch('src/fonts/*', gulp.series('copy'));
  gulp.watch('src/img/*', gulp.series('copy'));
});

// Сборка в build
gulp.task('build', gulp.series('clean', gulp.parallel('copy', 'style', 'js', 'pug')));
