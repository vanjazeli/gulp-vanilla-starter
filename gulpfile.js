const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");
const browserSync = require("browser-sync").create();

// styles
gulp.task("styles", () => {
  return gulp
    .src("./src/scss/**.scss")
    .pipe(sass())
    .pipe(postcss([autoprefixer("last 2 versions")]))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
});

// html
gulp.task("html", () => {
  return gulp.src("src/*.{html,ico}").pipe(gulp.dest("./dist"));
});

// default
gulp.task("default", gulp.series("styles", "html"));
