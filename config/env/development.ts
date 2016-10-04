import { Configuration } from "../types";

import defaultConfiguration = require('./default');

const developmentConfig: Configuration = {
    db: {
        uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/mean-dev',
        options: {
            user: '',
            pass: ''
        },
        debug: process.env.MONGODB_DEBUG || false
    },
    log: {
        format: 'dev',
        fileLogger: {
            directoryPath: process.cwd(),
            fileName: 'app.log',
            maxsize: 10485760,
            maxFiles: 2,
            json: false
        }
    },
    app: {
        title: defaultConfiguration.app.title + ' - Development Environment'
    },

    livereload: true
};

export = developmentConfig;
