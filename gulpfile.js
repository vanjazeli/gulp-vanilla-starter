const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sassLint = require('gulp-sass-lint');
const browserSync = require('browser-sync').create();

const webpack = require('webpack-stream');
const eslint = require('gulp-eslint');

const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');

const fs = require('fs-extra');

gulp.task('watch', () => {
	browserSync.init({
		notify: false,
		server: {
			baseDir: './dist',
		},
	});
	gulp.watch('./src/styles/**/*.scss').on('change', gulp.series('stylesDev'));
	gulp.watch('./src/js/**/*.js').on('change', gulp.series('javascriptDev', browserSync.reload));
	gulp.watch('./src/*.html').on('change', gulp.series('html', browserSync.reload));
});

gulp.task('iconfont', () => {
	return gulp
		.src('./src/assets/icons/*.svg')
		.pipe(
			iconfontCss({
				fontName: 'svgicons',
				cssClass: 'icon',
				path: './src/styles/iconfont/iconfont-template.scss',
				targetPath: '../../../src/styles/iconfont/_iconfont.scss',
				fontPath: '../assets/fonts/',
			})
		)
		.pipe(
			iconfont({
				fontName: 'svgicons',
				prependUnicode: false,
				formats: ['ttf', 'woff'],
				normalize: true,
				centerHorizontally: true,
			})
		)
		.on('glyphs', function (glyphs, options) {
			console.log(glyphs, options);
		})
		.pipe(gulp.dest('./src/assets/fonts'));
});

gulp.task('fonts', () => {
	return gulp.src('./src/assets/fonts/*').pipe(gulp.dest('./dist/assets/fonts'));
});

gulp.task('assets', () => {
	return gulp
		.src('./src/assets/**')
		.pipe(gulp.dest('./dist/assets'))
		.on('end', () => {
			fs.remove('./dist/assets/icons');
		});
});

gulp.task('javascriptDev', () => {
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
			})
		)
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('javascriptProd', () => {
	return gulp
		.src('./src/js/**/*.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
		.pipe(
			webpack({
				mode: 'production',
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

gulp.task('lint', () => {
	return gulp
		.src(['./src/styles/**/*.scss', '!./src/styles/iconfont/_iconfont.scss', '!./src/styles/iconfont/iconfont-template.scss'])
		.pipe(sassLint({ configFile: 'sass-lint.yaml' }))
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError());
});

gulp.task(
	'stylesDev',
	gulp.series('lint', function stylePrep() {
		return gulp
			.src(['./src/styles/**/*.scss', '!./src/styles/iconfont/iconfont-template.scss'])
			.pipe(sass())
			.pipe(postcss([autoprefixer('last 2 versions')]))
			.pipe(gulp.dest('./dist/styles'))
			.pipe(browserSync.stream());
	})
);

gulp.task(
	'stylesProd',
	gulp.series('lint', function stylePrep() {
		return gulp
			.src(['./src/styles/**/*.scss', '!./src/styles/iconfont/iconfont-template.scss'])
			.pipe(sass())
			.pipe(postcss([autoprefixer('last 2 versions')]))
			.pipe(cleanCSS())
			.pipe(gulp.dest('./dist/styles'))
			.pipe(browserSync.stream());
	})
);

gulp.task('html', () => {
	return gulp.src('src/*.{html,ico}').pipe(gulp.dest('./dist'));
});

gulp.task('production', gulp.series('javascriptProd', 'html', 'iconfont', 'assets', 'stylesProd', 'watch'));

gulp.task('development', gulp.series('javascriptDev', 'html', 'iconfont', 'assets', 'stylesDev', 'watch'));
