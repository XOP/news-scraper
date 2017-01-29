var path = require('path');

var gulp = require('gulp');

// auto-load gulp-* plugins
// babel
// exit
// nodemon
// postcss
// sass
// sourcemaps
var $ = require('gulp-load-plugins')();

// other modules
var runSequence = require('run-sequence');
var merge = require('merge2');

// js transform
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var vueify = require('vueify');
var babel = require('babelify');

// config
var cfg = require('./config.js');

var paths = {
    data: cfg.output.path,
    assets: {
        input: cfg.assets.path,
        output: 'public'
    },
    js: {
        input: 'src',
        output: 'dist'
    },
    publish: 'public',
    templates: 'templates'
};

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
        gulp.src(path.join(paths.assets.input, 'main.scss'))
            .pipe($.sass().on('error', $.sass.logError))
            .pipe($.postcss(preCssPlugins, {parser: scssSyntax}))
    )
        .pipe($.concatCss('main.css', {
            rebaseUrls: false
        }))
        .pipe($.postcss(postCssPlugins))
        .pipe(gulp.dest(paths.assets.output));
});

//
// Fonts

gulp.task('fonts', function () {
    return gulp.src([path.join(paths.assets.input, 'fonts/*')])
            .pipe(gulp.dest(path.join(paths.assets.output, 'fonts')));
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
        port: 3000,
        files: [
            paths.js.output + '/server/**/*.js',
            paths.data + '/**/*.*',
            paths.publish + '/**/*.*',
            paths.templates + '/**/*.*'
        ]
    });
});

// -----------------------------------------------------------------------------------------------------------------

//
// server

gulp.task('demon', function (cb) {
    return $.nodemon({
        script: paths.js.output + '/server/index.js',
        watch: [
            paths.js.output + '/server/**/*.js',
            paths.templates + '/**/*.*'
        ]
    })
        .once('start', function () {
            setTimeout(function () {
                cb();
            }, 1000);
        })
        .on('restart', function () {
            setTimeout(function () {
                reload({ stream: false });
            }, 2000);
        });
});

// -----------------------------------------------------------------------------------------------------------------

//
// transpile

gulp.task('transpile', () => {
    return gulp.src([
        paths.js.input + '/add-sources/**/*.js',
        paths.js.input + '/helpers/**/*.js',
        paths.js.input + '/server/**/*.js',
        paths.js.input + '/utils/**/*.js'
    ], { base: path.join('./', paths.js.input) })
        .pipe($.babel({
            presets: ['es2015'],
            plugins: ['add-module-exports']
        }))
        .pipe(gulp.dest(paths.js.output));
});

gulp.task('transpile-server', () => {
    return gulp.src(paths.js.input + '/server/index.js')
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(path.join(paths.js.output, 'server')));
});

// -----------------------------------------------------------------------------------------------------------------

//
// client JS

function compile (watch) {
    var bundler = watchify(
        browserify({
            entries: [paths.js.input + '/client/index.js'],
            debug: true,
            extensions: ['js', 'vue']
        })
            .transform(babel, {
                presets: ['es2015']
            })
            .transform(vueify)
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
            .pipe(gulp.dest(paths.publish + '/scripts'));
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
        'styles',
        'fonts'
    );
});

gulp.task('default', ['assets'], function () {
    runSequence(
        'transpile',
        'js-watch',
        'sync',
        function () {
            gulp.watch(paths.assets.input + '/**/*.scss', ['styles']);

            gulp.watch(paths.js.input + '/helpers/**/*.js', ['transpile']);
            gulp.watch(paths.js.input + '/server/**/*.js', ['transpile']);
            gulp.watch(paths.js.input + '/utils/**/*.js', ['transpile']);

            gulp.watch(paths.js.input + '/server/index.js', ['transpile-server']);
        }
    );
});
