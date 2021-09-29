const autoprefixer = require('autoprefixer')
const browsersync = require('browser-sync').create()
const del = require('del')
const {dest, src, watch, series, parallel} = require('gulp')
const csso = require('gulp-csso')
const imagemin = require('gulp-imagemin')
const plumber = require('gulp-plumber')
const postcss = require('gulp-postcss')
const posthtml = require('gulp-posthtml')
const rename = require('gulp-rename')
const sass = require('gulp-sass')(require('sass'))
const svgstore = require('gulp-svgstore')
const webp = require('gulp-webp')
const sortmediaqueries = require('postcss-sort-media-queries')
const include = require('posthtml-include')
const concat = require('gulp-concat')
const browserSync = require('browser-sync')

function clean() {
    return del("./dist")
}

function fonts() {
    return src("src/fonts/**/*.{woff,woff2}", {base: "src"})
           .pipe(dest("./dist/"))
}

function image() {
    return src("src/img/*.{png,jpg,svg}", {base: "src"})
           .pipe(imagemin([
                imagemin.mozjpeg({quality: 75, progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo()
           ]))
           .pipe(dest("./dist/"))
}

function wbp() {
    return src("src/img/*.{png,jpg}", {base: "src"})
           .pipe(webp({quality: 90}))
           .pipe(dest("./dist/"))
}

function svg() {
    return src("src/img/icon/*.svg")
           .pipe(svgstore({
               inlineSvg: true
           }))
           .pipe(rename("sprite.svg"))
           .pipe(dest("src/img"))
    
}

function html() {
    return src(["src/views/pages/*.html", "src/views/*.html"], {base: "src/views"})
           .pipe(plumber())
           .pipe(posthtml([
               include()
           ]))
           .pipe(dest("./dist/"))
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
           .pipe(dest("./dist/styles/"))
}

function js() {
    return src(['src/js/**/*.js', 'src/blocks/**/*.js'])
    .pipe(concat('index.js'))
    .pipe(dest('./dist/js/'))
}

function server() {  
    browsersync.init({
        server: "dist"
    })
}

function wtch() {
    watch(["src/blocks/**/*.scss", "src/styles/**/*.scss"]).on("change", series(css, browsersync.reload))
    watch(["src/blocks/**/*.html", "src/views/**/*.html"]).on("change", series(html, browsersync.reload))
    watch(["src/blocks/**/*.js", "src/js/**/*.js"]).on("change", series(css, browsersync.reload))
    watch("src/fonts/**/*.{woff, woff2}").on("change", series(fonts, browsersync.reload))
    watch("src/img/**/*.{jpg, png, svg, webp}").on("change", series(image, wbp, svg, browsersync.reload))
}

exports.build = series(clean, image, wbp, svg, fonts, html, css, js)
exports.dev = series(clean, image, wbp, svg, fonts, html, css, js,  parallel(wtch, server))