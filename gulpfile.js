/* DEPENDENCIES */

var gulp = require('gulp'),
    stylish = require('jshint-stylish'),
    compass = require('compass'),
    browserSync = require('browser-sync');

var plugins = require('gulp-load-plugins')(); 


/* FILE DESTINATIONS (RELATIVE TO ASSSETS FOLDER) */
var basePaths = {
    root: './',
    src: './assets/',
    dest: './assets/'
};
var paths = {
    html: {
        src: basePaths.root + 'html-templates/',
        fragments: basePaths.root + 'html-templates/html-fragments/',
        dest: basePaths.root
    },
    images: {
        src: basePaths.src + 'images/',
        dest: basePaths.dest + 'images/min/'
    },
    scripts: {
        src: basePaths.src + 'scripts/',
        concat: basePaths.src + 'scripts/_concat/',
        dest: basePaths.dest + 'scripts/'
    },
    styles: {
        src: basePaths.src + 'scss/',
        dest: basePaths.dest + 'css/'
    }
};
var appFiles = {
    html: paths.html.src + '*.tpl.html',
    styles: paths.styles.src + '**/**/*.scss',
    scripts: [paths.scripts.src + '**/*.js']
};
var watchAppFiles = {
    html: paths.html.dest + '*.html',
    styles: paths.styles.dest + '*.css',
    scripts: [paths.scripts.dest + '**/*.js']
}


var target = {
    js_lint_src : [                                         // all js that should be linted
        'js/build/app.js',
        'js/build/custom/switch.js',
        'js/build/custom/scheme-loader.js'
    ],
    js_uglify_src : [                                   // all js files that should not be concatinated
        './assets/scripts/scheme-loader.js'
    ],
    js_concat_src : [                                   // all js files that should be concatinated
        './assets/scripts/_concat/*.js'
    ],
    js_dest : 'assets/scripts'                                      // where to put minified js
};

/* HTML TASKS */
gulp.task('fileinclude', function() {
    return gulp.src(appFiles.html)
    .pipe(plugins.fileInclude({
        prefix: '@@',
        basepath : paths.html.fragments
    }))
    .pipe(plugins.rename({
        extname : ''
    }))
    .pipe(plugins.rename({
        extname : '.html'
    }))
    .pipe(gulp.dest(paths.html.dest));
});

gulp.task('prettify', function() {
    return gulp.src(watchAppFiles.html)
    .pipe(plugins.prettify({indent_size: 4, indent_inner_html: true}))
    .pipe(gulp.dest(paths.html.dest));
});

/* SASS TASK */

gulp.task('sass', function() {
    return gulp.src(appFiles.styles)                           // get the files
    .pipe(plugins.plumber())
    .pipe(plugins.compass({
            config_file: './config.rb',
            // project: basePaths.src,
            css: 'css',
            sass: 'scss',
            debug: true
        }))						
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer('last 2 version', '> 1%', 'ie 8', 'ie 9', 'ios 6', 'android 4'))
    //.pipe(plugins.minifyCss())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(plugins.notify({message: 'SCSS processed!'}));    // notify when done
});

gulp.task('compass', function() {
    gulp.src(appFiles.styles)
        .pipe(plugins.compass({
            config_file: './config.rb',
            // project: basePaths.src,
            css: 'assets/css',
            sass: 'assets/scss',
            debug: true
        }))
        .pipe(gulp.dest(paths.styles.dest))
        //.pipe(notify({ message: 'Compass processed!'}));     // notify when done
});

/* JS TASKS */

// lint my custom js
gulp.task('js-lint', function() {
    return gulp.src(appFiles.scripts)                        // get the files
        .pipe(plugins.jshint())                                 // lint the files
        .pipe(plugins.jshint.reporter(stylish))                 // present the results in a beautiful way
});

// minify & concatinate all other js
gulp.task('js-concat', function() {
    return gulp.src(paths.scripts.concat)                      // get the files
        .pipe(plugins.uglify())                                 // uglify the files
        .pipe(plugins.concat('scripts.min.js'))                 // concatinate to one file
        .pipe(gulp.dest(paths.scripts.dest))                // where to put the files
        .pipe(plugins.notify({message: 'JS processed!'}));      // notify when done
});


/* BROWSER SYNC */

gulp.task('browser-sync', function() {
    browserSync.init([watchAppFiles.styles, watchAppFiles.scripts, watchAppFiles.html], {        // files to inject
        server: {
            host: "local.dev",
            baseDir: "./"
        }
    });
});


/* GULP TASKS */
gulp.task('watch', function (){
    gulp.watch(appFiles.styles, ['sass']);
    gulp.watch([watchAppFiles.html, appFiles.html], ['fileinclude', 'prettify']);
    gulp.watch(watchAppFiles.scripts, ['js-lint', 'js-concat']);
});

gulp.task('default', ['watch', 'fileinclude', 'prettify', 'sass', 'js-concat', 'browser-sync']);


