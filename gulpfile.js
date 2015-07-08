var gulp = require('gulp');
var concat = require('gulp-concat');
//var plumber = require('gulp-plumber');
//var webserver = require('gulp-webserver');
//var gutil = require('gulp-util');
//var fs = require('fs');
//var prettify = require('gulp-prettify');
var connect = require('gulp-connect');


gulp.task('default', ['watch-app', 'watch-html', 'connect']);

var cors = function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
};

gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true,
    port: 8000,
    middleware: function() {
        return [cors];
    }
  });
});

gulp.task('html-reload', function () {
  gulp.src('./app/**/*.html')
    .pipe(connect.reload());
});
 
gulp.task('watch-html', function () {
  gulp.watch(['./app/**/*.html'], ['html-reload']);
});

gulp.task('watch-app', function() {
	gulp.watch('./app/modules/app/*.js', ['js-concat-app']);
	gulp.watch('./app/modules/auth/**/*.js', ['js-concat-auth']);
	gulp.watch('./app/modules/pages/**/*.js', ['js-concat-pages']);
	gulp.watch('./app/modules/core/**/*.js', ['js-concat-core']);
});

gulp.task('webserver', function() {
	gulp.src('./')
		.pipe(webserver({
			livereload: false,
			directoryListing: {
				enable: true
			},
			open: true
		}));
});

gulp.task('js-concat-app', function() {
	gulp.src('./app/modules/app/**/*.js')
		.pipe(concat('module.app.js'))
		.on('error', swallowError)
		.pipe(gulp.dest('./app/distr/modules/app'));
});

gulp.task('js-concat-auth', function() {
	gulp.src('./app/modules/auth/**/*.js')
		.pipe(concat('module.auth.js'))
		.on('error', swallowError)
		.pipe(gulp.dest('./app/distr/modules/auth'));
});

gulp.task('js-concat-pages', function() {
	gulp.src('./app/modules/pages/**/*.js')
		.pipe(concat('module.pages.js'))
		.on('error', swallowError)
		.pipe(gulp.dest('./app/distr/modules/pages'));
});

var basePath = '/app/modules/core/';

gulp.task('js-concat-core', function() {
	gulp.src(['/app/modules/core/**/*.js'])
		.pipe(concat('module.core.js'))
		.on('error', swallowError)
		.pipe(gulp.dest('./app/distr/modules/core'));
});

function swallowError(error) {
	//If you want details of the error in the console
	console.log(error.toString());
	this.emit('end');
}