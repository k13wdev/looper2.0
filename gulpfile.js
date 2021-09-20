const autoprefixer = require('autoprefixer');
const browsersync = require('browser-sync').create();
const del = require('del');
const {dest, src, watch, series, parallel} = require('gulp');
const csso = require('gulp-csso');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const posthtml = require('gulp-posthtml');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const svgstore = require('gulp-svgstore');
const webp = require('gulp-webp');
const sortmediaqueries = require('postcss-sort-media-queries');
const include = require('posthtml-include');
const concat = require('gulp-concat');

function clean() {
    return del("./dist")
}

function fonts() {
    return src("src/fonts/**/*.{woff,woff2}", {base: "src"})
           .pipe(dest("./dist/"));
}

function image() {
    return src("src/img/**/[^icon]*.{png,jpg,svg}")
           .pipe(imagemin([
                imagemin.mozjpeg({quality: 75, progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo()
           ]))
           .pipe(dest("./dist/img"));
}

function wbp() {
    return src("src/img/**/*.{png,jpg}")
           .pipe(webp({quality: 90}))
           .pipe(dest("./dist/img"));
}

function svg() {
    return src("src/img/icon-*.svg")
           .pipe(svgstore({
               inlineSvg: true
           }))
           .pipe(rename("sprite.svg"))
           .pipe(dest("src/img"));
    
}

function html() {
    return src(["src/views/pages/*.html", "src/views/*.html"], {base: "src/views"})
           .pipe(plumber())
           .pipe(posthtml([
               include()
           ]))
           .pipe(dest("./dist/"));
}

function css() {
    return src("src/styles/style.scss")
           .pipe(plumber())
           .pipe(sass())
           .pipe(postcss([
                autoprefixer(),
                sortmediaqueries({
                    sort: 'mobile-first'
                })
           ]))
           .pipe(dest("./dist/styles/"))
           .pipe(csso())
           .pipe(rename("style.min.css"))
           .pipe(dest("./dist/styles/"));
}

function js() {
    return src(['src/js/**/*.js', 'src/blocks/**/*.js'])
    .pipe(concat('index.js'))
    .pipe(dest('./dist/js/'));
}

function server() {  
    browsersync.init({
        server: "./dist/"
    })
}

function wtch() {
    watch(["src/blocks/**/*.scss", "src/styles/**/*.scss"], series(css)).on("change", browsersync.reload);
    watch(["src/blocks/**/*.html", "src/views/**/*.html"], series(html)).on("change", browsersync.reload);
    watch(["src/blocks/**/*.js", "src/js/**/*.js"], series(js)).on("change", browsersync.reload);
    watch("src/fonts/**/*.{woff, woff2}", series(fonts)).on("change", browsersync.reload);
    watch("src/img/**/*.{jpg, png, svg, webp}", parallel(image, wbp, svg)).on("change", browsersync.reload);
}

exports.build = series(clean, image, wbp, svg, fonts, html, css, js)
exports.dev = series(clean, image, wbp, svg, fonts, html, css, js,  parallel(wtch, server))