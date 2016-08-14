var gulp = require('gulp');
var path = require('path');

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

gulp.task('styles', function() {

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
// browser sync

var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('sync', function(){
    browserSync.init({
        server: {
            baseDir: cfg.output.path
        },
        files: [cfg.output.path + '/*.css'],
        port: 3000
    });
});

// -----------------------------------------------------------------------------------------------------------------

//
// dev mode

gulp.task('build', function(){
    return runSequence(
        'styles'
    );
});

gulp.task('default', ['build'], function(){
    runSequence(
        'sync',
        function(){
            gulp.watch(cfg.assets.path + '/**/*.scss', ['styles']);
        });
});
