import { Assets } from "../types";

const defaultAssets: Assets = {
    client: {
        systemjs: {
            paths: {
                'npm:': 'node_modules/'
            },
            map: {
                app: 'dist',

                '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
                '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
                '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
                '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
                '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
                '@angular/router': 'npm:@angular/router/bundles/router.umd.js',

                'rxjs': 'npm:rxjs',
            },
            packages: {
                app: {
                    main: './modules/client/core/init.js',
                    defaultExtension: 'js'
                },
                rxjs: {
                    defaultExtension: 'js'
                }
            }
        },
        js: [],
        css: [
            'modules/*/client/css/*.css'
        ],
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
        allJS: ['server.js', 'config/**/*.ts', 'modules/*/server/**/*.ts'],
        models: 'modules/*/server/models/**/*.ts',
        routes: ['modules/!(core)/server/routes/**/*.ts', 'modules/core/server/routes/**/*.ts'],
        config: ['modules/*/server/config/*.ts'],
        views: ['modules/*/server/views/*.html']
    }
};

export = defaultAssets;
