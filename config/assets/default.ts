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
            'modules/core/client/app/config.ts',
            'modules/core/client/app/init.ts',
            'modules/*/client/*.ts',
            'modules/*/client/**/*.ts'
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
