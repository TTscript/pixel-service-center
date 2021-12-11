const { src, dest, series, watch } = require('gulp');

const htmlmin = require('gulp-htmlmin');
const del = require('del');
const cleancss = require('gulp-clean-css');
const csso = require('gulp-csso');
const fileinclude = require('gulp-file-include');
const sync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const { stream } = require('browser-sync');

function html() {
    return src('src/**.html')
        .pipe(fileinclude({
            prefix: '@@'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest('build'))
};

function scss() {
    return src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions']
         }))
        .pipe(csso())
        .pipe(concat('style.min.css'))
        .pipe(cleancss(( {level: { 1: {specialComments: 0 } } } )))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'))
        .pipe(sync.stream())
};

function clear() {
    return del('build');
}

function serve() {
    sync.init({
        server: 'build'
    })

    watch('src/**.html', series(html)).on('change', sync.reload);
    watch('src/scss/**/*.scss', series(scss)).on('change', sync.reload);
}

function copyimages() {
    return src('src/img/**/*.{png,jpg,svg}')
        .pipe(dest('build/img'))
}

function copy() {
    return src(['src/fonts/**.{woff,woff2}'])
        .pipe(dest('build/fonts'))
}

exports.build = series(clear, scss, html);
exports.serve = series(clear, copy, copyimages, scss, html, serve);
