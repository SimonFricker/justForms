var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifyCss = require('gulp-uglifycss');
var plumber = require('gulp-plumber');
var gulpif = require('gulp-if');
var notify = require("gulp-notify");
var gutil = require('gulp-util');
var argv = require('minimist');
var autoprefixer = require('gulp-autoprefixer');


gulp.task('watch', ['browserSync', 'concat-min'], function(){
  gulp.watch('app/invest/assets/css/**/*.scss', ['sass', 'concat-min'])
  gulp.watch('app/**/*.php', browserSync.reload);
  gulp.watch('app/invest/assets/js/working/*.js',['concat-min-js']);
  gulp.watch('app/invest/assets/js/*.js', browserSync.reload);
})

gulp.task('browserSync', function(){
  browserSync.init({
      proxy: "http://localhost/investor-page-base/app/"
  });
});

gulp.task('sass', function(){
  return gulp.src('app/invest/assets/css/styles.scss')
    .pipe(plumber())
        .pipe(sass({includePaths: ['./app/invest/assets/css/**/*']}, {errLogToConsole: true}))
        .on('error', reportError)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./app/invest/assets/css/'))
        .pipe(concat('styles.min.css'))
        .pipe(uglifyCss())
        .pipe(gulp.dest('app/invest/assets/css/'))
        .pipe(browserSync.reload({stream: true}));
});



gulp.task('concat-min-js', function(){
  return gulp.src([
    'app/invest/assets/js/working/libs/*.js',
    'app/invest/assets/js/working/app.js',
  ])
  .pipe(plumber())
    .pipe(concat('theme.min.js'))
    .pipe(uglify({errLogToConsole: true}))
    .on('error', reportError)
    .pipe(gulp.dest('app/invest/assets/js/'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('concat-min', ['concat-min-js']);


/// error handeling
var reportError = function (error) {
    // [log]
    //console.log(error);

    // Format and ouput the whole error object
    //console.log(error.toString());


    // ----------------------------------------------
    // Pretty error reporting

    var report = '\n';
    var chalk = gutil.colors.white.bgRed;

    if (error.plugin) {
        report += chalk('PLUGIN:') + ' [' + error.plugin + ']\n';
    }

    if (error.message) {
        report += chalk('ERROR:\040') + ' ' + error.message + '\n';
    }

    console.error(report);


    // ----------------------------------------------
    // Notification

    if (error.line && error.column) {
        var notifyMessage = 'LINE ' + error.line + ':' + error.column + ' -- ';
    } else {
        var notifyMessage = '';
    }

    notify({
        title: 'FAIL: ' + error.plugin,
        message: notifyMessage + 'See console.',
        sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
    }).write(error);

    gutil.beep(); // System beep (backup)


    // ----------------------------------------------
    // Prevent the 'watch' task from stopping

    this.emit('end');
}
