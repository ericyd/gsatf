var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var cssmin = require('gulp-minify-css');
var changed = require('gulp-changed');
var sass = require('gulp-sass');
var browserify = require('browserify');
var globby = require('globby');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var through = require('through2');
var dest = './dist';
    





gulp.task('default', function() {
    return; 
});




gulp.task('build', ['jslint', 'js', 'css', 'html']);




gulp.task('watch', function(){
    var watcher = gulp.watch(['./src/**/*'], ['build']);
    watcher.on('change', function (event) {
        console.log('Event type: ' + event.type); // added, changed, or deleted
        console.log('Event path: ' + event.path); // The path of the modified file
    });
});




gulp.task('browserify', function() {
    globby(['src/js/controllers/*.js', 'src/js/directives/*.js', 'src/js/factories/*.js', 'src/js/*.js']).then(function(entries) {
        var b = browserify({
            entries: ['./src/js/requires.js'],
            debug: true
        });
        
        return b.bundle()
        .pipe(source('appbundle2.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(concat('appbundle.js'))
        .pipe(gulp.dest('dist/js')); 
    });
    
});
    
    
    
    
gulp.task('js', function() {
    gulp.src('./src/js/assets/*.js', { base: 'src' })
        .pipe(changed(dest))
        .pipe(gulp.dest(dest));

    return gulp.src(['./src/js/controllers/*.js', './src/js/directives/*.js', './src/js/factories/*.js', './src/js/*.js'])
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js'));
    
});




gulp.task('css', function() {
    gulp.src('./src/css/**/*.min.css', { base: 'src' })
        .pipe(changed(dest))
        .pipe(gulp.dest(dest));
    gulp.src(['./src/css/**/*.css', '!./src/css/**/*.min.css'], { base: 'src' })
        .pipe(changed(dest))
        .pipe(gulp.dest(dest));
    return gulp.src(['./src/css/**/*.scss', '!./src/css/**/*.min.css'], { base: 'src' })
        .pipe(changed(dest))
        .pipe(sass())
        .pipe(cssmin())
        .pipe(concat('main.css'))
        .pipe(gulp.dest(dest));
});




gulp.task('html', function() {
    
    return gulp.src('./src/**/*.html', { base: 'src' })
        .pipe(changed(dest))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            removeCommentsFromCDATA: true,
            conservativeCollapse: true,
        }))
        .pipe(gulp.dest(dest));
        
});




gulp.task('jslint', function() {
    return gulp.src()
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
})