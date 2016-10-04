import express = require('express');

import compress = require('compression');
import favicon = require('serve-favicon');

import { FrameworkConfiguration } from '../config';

const fc = FrameworkConfiguration.get();

export class ExpressAdapter {
    app: express.Application;

    private _initLocalVariables(): void {
        this.app.locals.title = fc.config.app.title;
        this.app.locals.description = fc.config.app.description;
        if (fc.config.secure && fc.config.secure.ssl)
            this.app.locals.secure = true;
        this.app.locals.keywords = fc.config.app.keywords;
        this.app.locals.jsFiles = fc.assets.client.js;
        this.app.locals.cssFiles = fc.assets.client.css;
        this.app.locals.livereload = fc.config.livereload;
        this.app.locals.logo = fc.config.logo;
        this.app.locals.favicon = fc.config.favicon;
        this.app.locals.env = process.env.NODE_ENV as string;
        this.app.locals.domain = fc.config.domain;

        this.app.use((
                req: express.Request,
                res: express.Response,
                next: express.NextFunction) => {
            res.locals.host = `${req.protocol}://${req.hostname}`;
            res.locals.url = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
            next();
        });
    }

    private _initMiddleware(): void {
        // TODO: initialize middleware
    }

    constructor() {
        this.app = express();
    }
}
