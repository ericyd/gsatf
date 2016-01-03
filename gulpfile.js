// from my limited understanding, the `require()` method returns a module, defined by the argument

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    htmlmin = require('gulp-htmlmin'),
    cssmin = require('gulp-minify-css'),
    changed = require('gulp-changed'),
    sass = require('gulp-sass'),
    dest = 'dist';
    


gulp.task('default', function() {
    return; 
});

gulp.task('watch', function(){
    var watcher = gulp.watch(['src/**/*'], ['js', 'css', 'html']);
    watcher.on('change', function (event) {
        console.log('Event type: ' + event.type); // added, changed, or deleted
        console.log('Event path: ' + event.path); // The path of the modified file
    });
});


// gulp tasks can be called with `gulp <taskName>` where <taskName> is the first argument of gulp.task    
gulp.task('js', function() {
    // define what the task 'minify' actually does
    gulp.src('src/js/assets/*.js', { base: 'src' })
        .pipe(changed(dest))
        .pipe(gulp.dest(dest));
    // read for more detail http://www.smashingmagazine.com/2014/06/building-with-gulp/
    return gulp.src(['src/js/controllers/*.js', 'src/js/directives/*.js', 'src/js/factories/*.js'])
        // only continues with files that have changed
        //.pipe(changed(dest))
        // looks for errors and prints them
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        // minifies the contents with uglify
        .pipe(uglify())
        // concatenates all js files into one main file named 'main.js'
        .pipe(concat('app.js'))
        // pipes the output to the destination folder
        .pipe(gulp.dest('dist/js'));
    
});

gulp.task('css', function() {
    // define what the task 'minify' actually does
    // move unchaged files to final location
    gulp.src('src/css/**/*.min.css', { base: 'src' })
        .pipe(changed(dest))
        .pipe(gulp.dest(dest));
    gulp.src(['src/css/**/*.css', '!src/css/**/*.min.css'], { base: 'src' })
        .pipe(changed(dest))
        .pipe(gulp.dest(dest));
    // read for more detail http://www.smashingmagazine.com/2014/06/building-with-gulp/
    return gulp.src(['src/css/**/*.scss', '!src/css/**/*.min.css'], { base: 'src' })
        .pipe(changed(dest))
        .pipe(sass())
        .pipe(cssmin())
        .pipe(concat('main.css'))
        .pipe(gulp.dest(dest));
});

gulp.task('html', function() {
    
    return gulp.src('src/**/*.html', { base: 'src' })
        .pipe(changed(dest))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            removeCommentsFromCDATA: true,
            conservativeCollapse: true,
        }))
        .pipe(gulp.dest(dest));
        
});

gulp.task('build', ['js', 'css', 'html']);