const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");
const stylelint = require("gulp-stylelint");
const browserSync = require("browser-sync").create();

const webpack = require("webpack-stream");

// watch
gulp.task("watch", () => {
  browserSync.init({
    notify: false,
    server: {
      baseDir: "./dist",
    },
  });
  gulp.watch("./src/scss/**/*.scss").on("change", gulp.series("styles"));
  gulp
    .watch("./src/js/**/*.js")
    .on("change", gulp.series("javascript", browserSync.reload));
  gulp
    .watch("./src/*.html")
    .on("change", gulp.series("html", browserSync.reload));
});

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
                  babelrc: true,
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
gulp.task("lint", () => {
  return gulp.src("./src/scss/**/*.scss").pipe(
    stylelint({
      reporters: [{ formatter: "string", console: true }],
    })
  );
});

gulp.task(
  "styles",
  gulp.series("lint", () => {
    return gulp
      .src("./src/scss/**/*.scss")
      .pipe(sass())
      .pipe(postcss([autoprefixer("last 2 versions")]))
      .pipe(cleanCSS())
      .pipe(gulp.dest("./dist/css"))
      .pipe(browserSync.stream());
  })
);
// html
gulp.task("html", () => {
  return gulp.src("src/*.{html,ico}").pipe(gulp.dest("./dist"));
});

// default
gulp.task("default", gulp.series("javascript", "html", "styles", "watch"));
