var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var babel = require('gulp-babel');





gulp.task('default', function() {
    return; 
});


gulp.task('watch', function(){
    var watcher = gulp.watch(['./es6/**/*'], ['js']);
    watcher.on('change', function (event) {
        console.log(event.type + ": " + event.path);
    });
});


gulp.task('js', function() {
    return gulp.src('./es6/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('tests.js'))
        .pipe(gulp.dest('./es5'));
    
});

