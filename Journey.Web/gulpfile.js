var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('components', function (cb) {
    return gulp.src('./Scripts/app/components/**/*.js')
        .pipe(concat('components.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('ngapp', function (cb) {
    return gulp.src('./Scripts/app/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('vendor', function () {
    return gulp.src(['./Scripts/vendor/angular.min.js','./Scripts/vendor/Chart.min.js','./Scripts/vendor/**/*.js'])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./dist/'));
});


gulp.task('default', ['components', 'vendor', 'ngapp']);





























//var gulp = require('gulp');
//var less = require('gulp-less');
//var path = require('path');
//var uglify = require('gulp-uglify');
//var concat = require('gulp-concat');


//gulp.task('app', function() {
//  gulp.src(['scripts/app/*.js','scripts/app/components/**/*.js'])
//  .pipe(uglify())
//  .pipe(concat('app.js'))
//  .pipe(gulp.dest('dist'))
//});


//gulp.task('vendor', function() {
//  gulp.src(['scripts/vendor/jquery-1.10.2.min','scripts/vendor/angular.min.js','scripts/vendor/angular-route.min.js','scripts/vendor/ui-bootstrap.min.js','scripts/vendor/jquery.signalR-2.2.2.min.js','scripts/vendor/Chart.min.js','scripts/vendor/angular-chart.js','scripts/vendor/scrollglue.js'])
//  .pipe(uglify())
//  .pipe(concat('vendor.js'))
//  .pipe(gulp.dest('dist'))
//});

//gulp.task('less', function () {
//  return gulp.src('content/**/*.less')
//    .pipe(less({
//      paths: [ path.join(__dirname, 'less', 'includes') ]
//    }))
//    .pipe(gulp.dest('content/css'));
//});

////Enables reading errors
////gulp.task('pump', function(cb) {
////	pump([
////  gulp.src('scripts/app/**/*.js'),
////  uglify(),
////  gulp.dest('dist')
////  ],cb);
////});
