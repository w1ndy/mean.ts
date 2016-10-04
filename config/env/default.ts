import { Configuration } from "../types";

const defaultConfiguration: Configuration = {
    app: {
        title: 'MEAN.TS',
        description: 'Full-Stack TypeScript with MongoDB, Express, AngularJS 2, and Node.js',
        keywords: 'mongodb, express, angularjs, node.js, mongoose, typescript'
    },
    port: process.env.PORT ? process.env.PORT as number : 3000,
    host: process.env.HOST ? process.env.HOST as string : '0.0.0.0',

    domain: process.env.DOMAIN as string,

    sessionCookie: {
        maxAge: 24 * (60 * 60 * 1000),
        httpOnly: true,
        secure: false
    },
    sessionSecret: process.env.SESSION_SECRET ? process.env.SESSION_SECRET as string : 'MEAN',
    sessionKey: 'sessionId',
    sessionCollection: 'sessions',

    csrf: {
        csrf: false,
        csp: false,
        xframe: 'SAMEORIGIN',
        p3p: 'ABCDEF',
        xssProtection: true
    },

    logo: 'modules/core/client/img/brand/logo.png',
    favicon: 'modules/core/client/img/brand/favicon.ico'
};

export = defaultConfiguration;
