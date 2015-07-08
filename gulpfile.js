var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');

gulp.task('default', ['generate-distr','watch-app', 'watch-html', 'connect']);

var cors = function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
};

gulp.task('connect', function() {
  connect.server({
    root: '',
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

gulp.task('generate-distr', function() {
    gulp.start('js-concat-app');
    gulp.start('js-concat-auth');
    gulp.start('js-concat-pages');
    gulp.start('js-concat-core');
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


gulp.task('js-concat-core', function() {
	gulp.src(['./app/modules/core/**/*.js'])
		.pipe(concat('module.core.js'))
		.on('error', swallowError)
		.pipe(gulp.dest('./app/distr/modules/core'));
});

function swallowError(error) {
	//If you want details of the error in the console
	console.log(error.toString());
	this.emit('end');
}