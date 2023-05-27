const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sassLint = require('gulp-sass-lint');
const browserSync = require('browser-sync').create();

const webpack = require('webpack-stream');
const eslint = require('gulp-eslint');

// watch
gulp.task('watch', () => {
	browserSync.init({
		notify: false,
		server: {
			baseDir: './dist',
		},
	});
	gulp.watch('./src/styles/**/*.scss').on('change', gulp.series('styles'));
	gulp.watch('./src/js/**/*.js').on('change', gulp.series('javascript', browserSync.reload));
	gulp.watch('./src/*.html').on('change', gulp.series('html', browserSync.reload));
});

// javascript
gulp.task('javascript', () => {
	return gulp
		.src('./src/js/**/*.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
		.pipe(
			webpack({
				mode: 'development',
				output: {
					filename: 'main.js',
				},
				module: {
					rules: [
						{
							test: /\.js$/,
							exclude: /node_modules/,
							use: {
								loader: 'babel-loader',
								options: {
									babelrc: true,
								},
							},
						},
					],
				},
			})
		)
		.pipe(gulp.dest('./dist/js'));
});

// styles
gulp.task('lint', () => {
	return gulp
		.src('./src/styles/**/*.scss')
		.pipe(sassLint({ configFile: 'sass-lint.yaml' }))
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError());
});

gulp.task(
	'styles',
	gulp.series('lint', function resolveStyles() {
		return gulp
			.src('./src/styles/**/*.scss')
			.pipe(sass())
			.pipe(postcss([autoprefixer('last 2 versions')]))
			.pipe(cleanCSS())
			.pipe(gulp.dest('./dist/styles'))
			.pipe(browserSync.stream());
	})
);
// html
gulp.task('html', () => {
	return gulp.src('src/*.{html,ico}').pipe(gulp.dest('./dist'));
});

// default
gulp.task('default', gulp.series('javascript', 'html', 'styles', 'watch'));
