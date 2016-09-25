var path = require('path');

var gulp = require('gulp');

// auto-load gulp-* plugins
var $ = require('gulp-load-plugins')();

// other modules
var del = require('del');
var runSequence = require('run-sequence');
var merge = require('merge2');

// config
var cfg = require('./config.js');

// -----------------------------------------------------------------------------------------------------------------

//
// CSS

var scssSyntax = require('postcss-scss');
var nano = require('cssnano');
var autoprefixer = require('autoprefixer');
var Browsers = ['last 2 versions'];

gulp.task('styles', function () {

    var preCssPlugins = [
        autoprefixer({ browsers: Browsers })
    ];

    var postCssPlugins = [
        nano()
    ];

    return merge(
        // normalize
        gulp.src(path.resolve(__dirname, 'node_modules/normalize.css/normalize.css')),

        // main
        gulp.src(path.join(cfg.assets.path, 'main.scss'))
            .pipe($.sass().on('error', $.sass.logError))
            .pipe($.postcss(preCssPlugins, {parser: scssSyntax}))
    )
        .pipe($.concatCss('main.css', {
            rebaseUrls: false
        }))
        .pipe($.postcss(postCssPlugins))
        .pipe(gulp.dest(cfg.output.path));
});

// -----------------------------------------------------------------------------------------------------------------

//
// server

gulp.task('demon', function (cb) {
    return $.nodemon({
        script: 'dist/server.js',
        watch: [
            'dist/server.js',
            'templates/**/*.*'
        ]
    })
        .once('start', cb)
        .on('restart', function () {
            setTimeout(function () {
                reload({ stream: false });
            }, 1000);
        });
});

// -----------------------------------------------------------------------------------------------------------------

//
// browser sync

var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('sync', ['demon'], function () {
    browserSync.init(null, {
        proxy: {
            target: 'http://localhost:9000',
            ws: true
        },
        serveStatic: [cfg.output.path],
        port: 3000,
        files: [
            'dist/server.js',
            cfg.output.path + '/**/*.*'
        ]
    });
});

// -----------------------------------------------------------------------------------------------------------------

//
// transpile

// NB: workaround for the babel

// all "src/" dir
gulp.task('transpile', function () {
    return require('./bin/transpile.js');
});

// only "src/server.js"
gulp.task('transpile-server', function () {
    return require('./bin/transpile-server.js');
});

// -----------------------------------------------------------------------------------------------------------------

//
// dev mode

gulp.task('assets', function () {
    return runSequence(
        'styles'
    );
});

gulp.task('default', ['assets', 'transpile'], function () {
    runSequence(
        'sync',
        function () {
            gulp.watch(cfg.assets.path + '/**/*.scss', ['styles']);
            gulp.watch('src/**/*.js', ['transpile']);
        }
    );
});

gulp.task('server', ['assets', 'transpile-server'], function () {
    runSequence(
        'sync',
        function () {
            gulp.watch(cfg.assets.path + '/**/*.scss', ['styles']);
            gulp.watch('src/server.js', ['transpile-server']);
        }
    );
});
