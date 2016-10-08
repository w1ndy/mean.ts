'use strict';

const fs = require('fs'),
      ts = require('typescript'),
      mkdirp = require('mkdirp');

(function () {
    if (!fs.existsSync('./dist/config/assets/default.js')) {
        const source = fs.readFileSync('./config/assets/default.ts', 'utf-8'),
              library = ts.transpile(source);
        mkdirp.sync('./dist/config/assets/');
        fs.writeFileSync('./dist/config/assets/default.js', library);
    }
}());

const gulp = require('gulp'),
      plugins = require('gulp-load-plugins')(),
      defaultAssets = require('./dist/config/assets/default'),
      path = require('path'),
      merge = require('merge-stream'),
      uglifyjs = require('uglify-js'),
      minifier = require('gulp-uglify/minifier'),
      runSequence = require('run-sequence'),
      SystemJSBuilder = require('systemjs-builder'),
      glob = require('glob'),
      _ = require('lodash');

const JS_MODULES_DIR = 'dist/modules/';

gulp.task('env:dev', () => process.env.NODE_ENV = 'development');
gulp.task('env:prod', () => process.env.NODE_ENV = 'production');

gulp.task('watch', () => {
    plugins.livereload.listen();

    const watches = [
        gulp.watch(defaultAssets.server.views),
        gulp.watch(defaultAssets.server.sources),
        gulp.watch(defaultAssets.client.ts),
        gulp.watch(defaultAssets.client.css),
        gulp.watch(defaultAssets.client.views)
    ];

    for (let w of watches)
        w.on('change', plugins.livereload.changed);
});

const moduleBundler = (function () {
    mkdirp.sync('./public/bundles/');
    const bundler = plugins.systemjsBuilder('./dist/');
    bundler.config(defaultAssets.client.systemjs);
    return bundler;
}());

gulp.task('bundleRxJS', () => {
    if (fs.existsSync('./public/bundles/rx.min.js'))
        return;

    const rxjsBundler = plugins.systemjsBuilder('./public/');

    let rxjsBundleConfig = { map: { rxjs: 'node_modules/rxjs' }, meta: {} };
    for (let bundle of glob.sync('node_modules/rxjs/bundles/*.js'))
        rxjsBundleConfig.meta[bundle] = { build: false };
    rxjsBundler.config(rxjsBundleConfig);

    return rxjsBundler.bundle('[node_modules/rxjs/**/*.js]')
        .pipe(minifier({}, uglifyjs))
        .pipe(plugins.rename('rx.min.js'))
        .pipe(gulp.dest('./public/bundles/'));
});

gulp.task('bundle', () => {
    const tasks = glob.sync('modules/*/').map(path => {
        const moduleName = path.match(/\/(.+)\//)[1];
        return moduleBundler.bundle(`[${path}client/**/*.js]`)
            .pipe(minifier({}, uglifyjs))
            .pipe(plugins.rename(`${moduleName}.min.js`))
            .pipe(gulp.dest('./public/bundles/'));
    });
    return merge(tasks);
});

gulp.task('copyLocalEnvConfig', () => {
    if (fs.existsSync('config/env/local.ts'))
        return;
    return gulp.src('config/env/local.example.ts')
        .pipe(plugins.rename('local.ts'))
        .pipe(gulp.dest('config/env'));
});

const tsProject = plugins.typescript.createProject('tsconfig.json');

gulp.task('compile', () => {
    return tsProject.src()
        .pipe(tsProject())
        .js
        .pipe(gulp.dest('dist'));
});

gulp.task('build', (done) => {
    runSequence('compile', ['bundleRxJS', 'bundle'], done);
});

gulp.task('default', (done) => {
    runSequence('env:dev', ['compile', 'copyLocalEnvConfig'], done);
});

gulp.task('prod', (done) => {
    runSequence('env:prod', ['copyLocalEnvConfig', 'build'], done);
});
