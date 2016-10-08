import { Assets } from "../types";

const defaultAssets: Assets = {
    client: {
        systemjs: {
            paths: {
                'npm:': 'node_modules/'
            },
            map: {
                core: 'modules/core/client/',

                '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
                '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
                '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
                '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
                '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
                '@angular/router': 'npm:@angular/router/bundles/router.umd.js',

                'rxjs': 'npm:rxjs',
            },
            packages: {
                core: {
                    main: './app/init.js',
                    defaultExtension: 'js'
                },
                rxjs: {
                    defaultExtension: 'js'
                }
            }
        },
        lib: {
            js: [
                'public/node_modules/core-js/client/shim.min.js',
                'public/node_modules/zone.js/dist/zone.js',
                'public/node_modules/reflect-metadata/Reflect.js',
                'public/node_modules/systemjs/dist/system.src.js'
            ],
            css: []
        },
        bundles: 'public/bundles/*.js',
        ts: 'modules/*/client/**/*.ts',
        // No module CSS is loaded by default. Specify styleUrls in angular modules to load stylesheets on the fly.
        css: [],
        img: [
            'modules/**/*/img/**/*.jpg',
            'modules/**/*/img/**/*.png',
            'modules/**/*/img/**/*.gif',
            'modules/**/*/img/**/*.svg'
        ],
        views: [
            'modules/*/client/views/**/*.html'
        ]
    },
    server: {
        gruntConfig: ['gruntfile.js'],
        gulpConfig: ['gulpfile.js'],
        sources: ['server.js', 'config/**/*.ts', 'modules/*/server/**/*.ts'],
        models: 'modules/*/server/models/**/*.ts',
        routes: ['modules/!(core)/server/routes/**/*.ts', 'modules/core/server/routes/**/*.ts'],
        config: ['modules/*/server/config/*.ts'],
        views: ['modules/*/server/views/*.html']
    }
};

export = defaultAssets;
