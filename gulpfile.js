/*******************************************************************************
DEPENDENCIES
*******************************************************************************/

var gulp = require('gulp'),                             // gulp core
    sass = require('gulp-sass'),                        // sass compiler
    compass = require('gulp-compass'),					// compass compiler
    uglify = require('gulp-uglify'),                    // uglifies the js
    jshint = require('gulp-jshint'),                    // check if js is ok
    rename = require("gulp-rename"),                    // rename files
    concat = require('gulp-concat'),                    // concatinate js
    notify = require('gulp-notify'),                    // send notifications to osx
    plumber = require('gulp-plumber'),                  // disable interuption
    stylish = require('jshint-stylish'),                // make errors look good in shell
    minifycss = require('gulp-minify-css'),             // minify the css files
    fileinclude = require('gulp-file-include'),         // build html files by including files
    browserSync = require('browser-sync'),              // inject code to all devices
    autoprefixer = require('gulp-autoprefixer');        // sets missing browserprefixes


/*******************************************************************************
FILE DESTINATIONS (RELATIVE TO ASSSETS FOLDER)
*******************************************************************************/

var target = {
    html : [{
        src : './templates/*.tpl.html',
        dest : './',
        watch : './**/*.html'
    }],
    sass : [{
        src : './assets/scss/**/*.scss',
        dest : './assets/css',
        watch : './assets/css/*.css'
    }],
    sass_src : './assets/scss/*.scss',                        // all sass files
    css_dest : './assets/css',                                // where to put minified css
    js_lint_src : [                                         // all js that should be linted
        'js/build/app.js',
        'js/build/custom/switch.js',
        'js/build/custom/scheme-loader.js'
    ],
    js_uglify_src : [                                   // all js files that should not be concatinated
        './assets/scripts/scheme-loader.js',
        './assets/scripts/modernizr.js'
    ],
    js_concat_src : [                                   // all js files that should be concatinated
        './assets/scripts/_concat/*.js'
    ],
    js_dest : 'assets/scripts'                                      // where to put minified js
};

/*******************************************************************************
HTML TASKS
*******************************************************************************/
gulp.task('fileinclude', function() {
    gulp.src('./templates/*.tpl.html')
    .pipe(fileinclude({
        basepath : './html-fragments/'
    }))
    .pipe(rename({
        extname : ""
    }))
    .pipe(rename({
        extname : ".html"
    }))
    .pipe(gulp.dest('./'));
});

/*******************************************************************************
SASS TASK
*******************************************************************************/

gulp.task('sass', function() {
    gulp.src('target.sass.src')                           // get the files
        .pipe(plumber())                                // make sure gulp keeps running on errors
        .pipe(compass())								//compile all compass
        .pipe(sass())                                   // compile all sass
        .pipe(autoprefixer(                             // complete css with correct vendor prefixes
            'last 2 version',
            '> 1%',
            'ie 8',
            'ie 9',
            'ios 6',
            'android 4'
        ))
        .pipe(minifycss())                              // minify css
        .pipe(gulp.dest('target.sass.dest'))               // where to put the file
        .pipe(notify({message: 'SCSS processed!'}));    // notify when done
});

gulp.task('compass', function() {
    gulp.src('target.sass.src')
        .pipe(compass({
            config_file: './config.rb',
            css: 'assets/css',
            sass: 'assets/scss'
        }))
        .pipe(gulp.dest('target.sass.dest'))
        .pipe(notify({ message: 'Compass processed!'}));     // notify when done
});

/*******************************************************************************
JS TASKS
*******************************************************************************/

// lint my custom js
gulp.task('js-lint', function() {
    gulp.src(target.js_lint_src)                        // get the files
        .pipe(jshint())                                 // lint the files
        .pipe(jshint.reporter(stylish))                 // present the results in a beautiful way
});

// minify all js files that should not be concatinated
gulp.task('js-uglify', function() {
    gulp.src(target.js_uglify_src)                      // get the files
        .pipe(uglify())                                 // uglify the files
        .pipe(rename(function(dir,base,ext){            // give the files a min suffix
            var trunc = base.split('.')[0];
            return trunc + '.min' + ext;
        }))
        .pipe(gulp.dest(target.js_dest))                // where to put the files
        .pipe(notify({ message: 'JS processed!'}));     // notify when done
});

// minify & concatinate all other js
gulp.task('js-concat', function() {
    gulp.src(target.js_concat_src)                      // get the files
        .pipe(uglify())                                 // uglify the files
        .pipe(concat('scripts.min.js'))                 // concatinate to one file
        .pipe(gulp.dest(target.js_dest))                // where to put the files
        .pipe(notify({message: 'JS processed!'}));      // notify when done
});


/*******************************************************************************
BROWSER SYNC
*******************************************************************************/

gulp.task('browser-sync', function() {
    browserSync.init(['./assets/**/*.css', './assets/scripts/*.js', './**/*.html'], {        // files to inject
        server: {
            host: "local.dev",
            baseDir: "./"
        }
    });
});


/*******************************************************************************
GULP TASKS
*******************************************************************************/

gulp.task('default', function() {
    gulp.run('fileinclude', 'sass', 'js-lint', 'js-uglify', 'js-concat', 'browser-sync');
    gulp.watch('./assets/scss/**/*.scss', function() {
        gulp.run('compass', 'sass');
    });
    gulp.watch('./**/*.html', function() {
        gulp.run('fileinclude');
    });
    gulp.watch(target.js_lint_src, function() {
        gulp.run('js-lint');
    });
    gulp.watch(target.js_minify_src, function() {
        gulp.run('js-uglify');
    });
    gulp.watch(target.js_concat_src, function() {
        gulp.run('js-concat');
    });
});