const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");
const browserSync = require("browser-sync").create();

const webpack = require("webpack-stream");

// javascript
gulp.task("javascript", () => {
  return gulp
    .src("./src/js/**/*.js")
    .pipe(
      webpack({
        mode: "production",
        output: {
          filename: "main.js",
        },
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-env"],
                },
              },
            },
          ],
        },
      })
    )
    .pipe(gulp.dest("./dist/js"));
});

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
gulp.task("default", gulp.series("styles", "javascript", "html"));
