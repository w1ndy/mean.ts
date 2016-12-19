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
      es = require('event-stream'),
      csso = require('csso'),
      Buffer = require('buffer').Buffer,
      _ = require('lodash');

const JS_MODULES_DIR = 'dist/modules/';

gulp.task('env:dev', () => process.env.NODE_ENV = 'development');
gulp.task('env:prod', () => process.env.NODE_ENV = 'production');

const launchNodeMonitor = function (debug) {
    let sources = _.union(
            defaultAssets.server.views,
            defaultAssets.server.sources,
            defaultAssets.server.config);
    sources = sources.map(src => {
        if (/\.ts$/.test(src)) {
            return path.join('dist/', src).slice(0, -2) + 'js';
        } else {
            return src;
        }
    });
    return plugins.nodemon({
        script: 'server.js',
        nodeArgs: debug ? ['--debug --inspect'] : [],
        ext: 'js,html',
        verbose: debug,
        watch: sources
    });
}

gulp.task('nodemon', () => launchNodeMonitor(false));
gulp.task('nodemon-debug', () => launchNodeMonitor(true));

gulp.task('watch', () => {
    const isProduction = process.env.NODE_ENV === 'production';

    if (!isProduction)
        plugins.livereload.listen();

    const watches = [
        gulp.watch(defaultAssets.server.views),
        gulp.watch(defaultAssets.server.sources, ['compile']),
        gulp.watch(defaultAssets.client.ts,
            [isProduction ? 'build' : 'compile']),
        gulp.watch(defaultAssets.client.css,
            isProduction ? ['build'] : undefined),
        gulp.watch(defaultAssets.client.views,
            isProduction ? ['build'] : undefined)
    ];

    if (!isProduction) {
        for (let w of watches)
            w.on('change', plugins.livereload.changed);
    }
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

gulp.task('compile', () => {
    const tsProject = plugins.typescript.createProject('tsconfig.json'),
          transformer = process.env.NODE_ENV !== 'production'
            ? plugins.util.noop() : es.map((data, callback) => {
                let source = data.contents.toString('utf8'),
                    modified = false;
                const templateUrl = source.match(/templateUrl\s*:\s*(["'])(.*)\1/);
                if (templateUrl) {
                    const templatePath = path.join(
                        path.dirname(data.path), templateUrl[2]);
                    if (!fs.existsSync(templatePath)) {
                        plugins.util.log(plugins.util.colors.red(`Warning: cannot locate template ${templatePath}`))
                    } else {
                        const template = fs.readFileSync(templatePath, 'utf8');
                        source = source.replace(templateUrl[0],
                            'template:' + JSON.stringify(template));
                        modified = true;
                    }
                }
                const styleUrls = source.match(/styleUrls\s*:\s*\[(.*)\]/);
                if (styleUrls) {
                    const replaceTarget = styleUrls[0],
                          urls = styleUrls[1].split(',').map(
                                    p => p.trim().slice(1, -1));
                    let cached = [], uncached = [];
                    for (let url of urls) {
                        const absUrl = path.join(path.dirname(data.path), url);
                        if (!fs.existsSync(absUrl)) {
                            plugins.util.log(plugins.util.colors.red(`Warning: cannot locate stylesheet ${absUrl}`));
                            uncached.push(`'${url}'`);
                        } else {
                            const style = fs.readFileSync(absUrl, 'utf8');
                            cached.push(JSON.stringify(
                                csso.minify(style).css));
                        }
                    }
                    source = source.replace(replaceTarget, `styles:[${cached.join(',')}],styleUrls:[${uncached.join(',')}]`);
                    modified = true;
                }
                if (modified)
                    data.contents = Buffer.from(source);
                callback(null, data);
            });
    return tsProject.src()
        .pipe(transformer)
        .pipe(tsProject())
        .js
        .pipe(gulp.dest('dist'));
});

gulp.task('build', (done) => {
    runSequence('compile', ['bundleRxJS', 'bundle'], done);
});

gulp.task('debug', (done) => {
    runSequence('env:dev', 'copyLocalEnvConfig', 'compile', ['nodemon-debug', 'watch'], done);
});

gulp.task('default', (done) => {
    runSequence('env:dev', 'copyLocalEnvConfig', 'compile', ['nodemon', 'watch'], done);
});

gulp.task('prod', (done) => {
    runSequence('env:prod', 'copyLocalEnvConfig', 'build', ['nodemon', 'watch'], done);
});
