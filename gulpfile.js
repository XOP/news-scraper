var path = require('path');

var gulp = require('gulp');

// auto-load gulp-* plugins
var $ = require('gulp-load-plugins')();

// other modules
var del = require('del');
var runSequence = require('run-sequence');
var merge = require('merge2');

// js transform
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');

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
        .pipe(gulp.dest(cfg.publish.path));
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
        serveStatic: [
            cfg.publish.path,
            cfg.output.path
        ],
        port: 3000,
        files: [
            'dist/server.js',
            cfg.publish.path + '/**/*.*',
            cfg.output.path + '/**/*.*'
        ]
    });
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
            }, 2000);
        });
});

// -----------------------------------------------------------------------------------------------------------------

//
// transpile

// NB: workaround for the babel
// todo: gulp-babel

var transpile = require('./bin/transpile.js');
var transpileServer = require('./bin/transpile-server.js');

// all "src/" dir
gulp.task('transpile', function () {
    return transpile();
});

// only "src/server.js"
gulp.task('transpile-server', function () {
    return transpileServer();
});

// -----------------------------------------------------------------------------------------------------------------

//
// client JS

function compile (watch) {
    var bundler = watchify(
        browserify({
            entries: ['src/client.js'],
            debug: true,
            extensions: ['js']
        })
            .transform(babel, {
                presets: ['es2015']
            })
    );

    function rebundle () {
        return bundler
            .bundle()
            .on('error', function (err) {
                console.error(err);

                this.emit('end');
            })
            .pipe(source('main.js'))
            .pipe(buffer())
            .pipe($.sourcemaps.init({ loadMaps: true }))
            .pipe($.sourcemaps.write('./'))
            .pipe(gulp.dest('./public/scripts'));
    }

    if (watch) {
        bundler.on('update', function () {
            console.log('-> bundling...');

            rebundle();
        });

        rebundle();
    } else {
        rebundle().pipe($.exit());
    }
}

gulp.task('js', function () {
    return compile();
});

gulp.task('js-watch', function () {
    return compile(true);
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
        'js-watch',
        function () {
            gulp.watch(cfg.assets.path + '/**/*.scss', ['styles']);
            gulp.watch('src/**/*.js', ['transpile']);
        }
    );
});

gulp.task('server', ['assets', 'transpile-server'], function () {
    runSequence(
        'sync',
        'js-watch',
        function () {
            gulp.watch(cfg.assets.path + '/**/*.scss', ['styles']);
            gulp.watch('src/server.js', ['transpile-server']);
        }
    );
});
