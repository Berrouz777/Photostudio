const gulp = require('gulp');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const csso = require('postcss-csso');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const htmlmin = require('gulp-htmlmin');
const uglify = require("gulp-uglify-es").default;
const autoprefixer = require('autoprefixer');
const del = require('del');
const sync = require('browser-sync').create();

const styles = () => {
  return gulp.src('source/scss/styles.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(sourcemap.write('.'))
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(sync.stream());
}

exports.styles = styles;

const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'))
}

exports.html = html;

const scripts = () => {
  return gulp.src("source/js/script.js")
    .pipe(uglify())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

const images = () => {
  return gulp.src('source/images/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.mozjpeg({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('build/images'))
}

exports.images = images;

const createWebp = () => {
  return gulp.src('source/images/**/*.{png,jpg}')
    .pipe(webp({ quality: 75 }))
    .pipe(gulp.dest('build/images'))
}

exports.createWebp = createWebp;

const sprite = () => {
  return gulp.src('source/images/**/*.svg')
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite_auto.svg'))
    .pipe(gulp.dest('build/images'));
}

exports.sprite = sprite;

const copy = () => {
  return gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/icons/*.ico',
    'source/images/**/*.{jpg,png,svg}',
    'source/css/normalize.css'
  ],
    {
      base: 'source'
    })
    .pipe(gulp.dest('build'));
}

exports.copy = copy;

const clean = () => {
  return del('build');
}

exports.clean = clean;

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

const build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    scripts,
    copy,
    sprite,
    images,
    createWebp
  )
)

exports.build = build;

const reload = done => {
  sync.reload();
  done();
}

const watcher = () => {
  gulp.watch("source/scss/**/*.scss", gulp.series("styles"));
  gulp.watch("source/js/script.js", gulp.series(scripts));
  gulp.watch("source/*.html", gulp.series(html, reload));
}

exports.default = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    scripts,
    copy,
    sprite,
    createWebp
  ),
  gulp.series(
    server, watcher
  )
);