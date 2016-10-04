import { Assets } from "../types";

const defaultAssets: Assets = {
    client: {
        lib: {
            css: [
                // bower:css
                // endbower
            ],
            js: [
                // bower:js
                // endbower
            ]
        },
        css: [
            'modules/*/client/css/*.css'
        ],
        js: [
            'modules/core/client/app/config.js',
            'modules/core/client/app/init.js',
            'modules/*/client/*.js',
            'modules/*/client/**/*.js'
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
        allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
        models: 'modules/*/server/models/**/*.js',
        routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
        config: ['modules/*/server/config/*.js'],
        views: ['modules/*/server/views/*.html']
    }
};

export = defaultAssets;
