import { src, dest, parallel, series, watch } from 'gulp';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import wrap from 'gulp-wrap';


const path = {
  src: './src/*',
  dist: './dist',
  js: './src/*.js',
  css: './src/*.css',
  dts: './src/*.d.ts'
};

function createMinifyJs(type) {
const source = type === "umd" ? "./umd-wrapper.js" : "./esm-wrapper.js";
const babelOpts = type === "umd" ? {} : { caller: { supportsStaticESM: true } };
const dist = `${path.dist}/${type}`;
return (
function minifyJS() {
  return src(path.js)
  .pipe(wrap({src: source}, {}, { parse: false }))
  .pipe(babel({ retainLines: true, ...babelOpts }))
    .pipe(replace('"use strict";', ''))
    // Output the non-minified version
    .pipe(dest(dist))
    // Minify and rename to *.min.js
    .pipe(uglify({
      output: {
        comments: /^!/
      }
    }))
    .pipe(rename(function (path) {
      path.basename += '.min';
    }))
    .pipe(dest(dist));
}
)}

function minifyCSS() {
  return src(path.css)
    .pipe(cleanCSS())
    .pipe(rename(function (path) {
      path.basename += '.min';
    }))
    .pipe(dest(path.dist));
}

function copySourceCSS() {
    return src(path.css).pipe(dest(path.dist));
}

function copySourceDts() {
  return src(path.dts).pipe(dest(path.dist));
}

function copyPackageJsonEsm() {
  return src("./package-json/esm/package.json").pipe(dest(`${path.dist}/esm`));
}

function copyPackageJsonUmd() {
  return src("./package-json/umd/package.json").pipe(dest(`${path.dist}/umd`));
}

function watchFiles() {
  watch(path.js, createMinifyJs("umd"));
  watch(path.js, createMinifyJs("esm"));
  watch(path.css, parallel(minifyCSS, copySourceCSS, copySourceDts));
}

export const build = parallel(createMinifyJs("umd"), createMinifyJs("esm"), minifyCSS, copySourceCSS, copySourceDts, copyPackageJsonEsm, copyPackageJsonUmd);

export default series(build, watchFiles);


