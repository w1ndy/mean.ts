import path = require('path');

import express = require('express');
import compress = require('compression');
import favicon = require('serve-favicon');
import bodyParser = require('body-parser');
import methodOverride = require('method-override');
import cookieParser = require('cookie-parser');
import hbs = require('express-hbs');
import session = require('express-session');
import mongoConnector = require('connect-mongo');
import mongoose = require('mongoose');
import lusca = require('lusca');
import helmet = require('helmet');
import _ = require('lodash');

import { FrameworkConfiguration } from '../config';

const fc: FrameworkConfiguration = FrameworkConfiguration.get();
const MongoStoreFactory: mongoConnector.MongoStoreFactory =
    mongoConnector(session);

export interface ListenCallbackFunction {
    (): any;
}

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
        this.app.use(compress({
            filter: (req: express.Request, res: express.Response) => {
                return (/json|text|javascript|css|font|svg/)
                    .test(res.getHeader('Content-Type'));
            },
            level: 9
        }));

        this.app.use(favicon(this.app.locals.favicon));

        if (_.has(fc.config, 'log.format')) {
            // TODO: use morgan
        }

        if (process.env.NODE_ENV as string === 'development') {
            this.app.set('view cache', false);
        } else if (process.env.NODE_ENV as string === 'production') {
            this.app.locals.cache = 'memory';
        }

        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(methodOverride());
        this.app.use(cookieParser());
    }

    private _initViewEngine(): void {
        this.app.engine('server.view.html', hbs.express4({
            extname: '.server.view.html'
        }));
        this.app.set('view engine', 'server.view.html');
        this.app.set('views', path.resolve('./'));
    }

    private _initSession(): void {
        this.app.use(session({
            saveUninitialized: true,
            resave: true,
            secret: fc.config.sessionSecret,
            cookie: {
                maxAge: fc.config.sessionCookie.maxAge,
                httpOnly: fc.config.sessionCookie.httpOnly,
                secure: fc.config.sessionCookie.secure && fc.config.secure.ssl
            },
            name: fc.config.sessionKey,
            store: new MongoStoreFactory({
                mongooseConnection: this.db.connection,
                collection: fc.config.sessionCollection
            })
        }));

        this.app.use(lusca(fc.config.csrf));
    }

    private _initModulesConfiguration(): void {
        for (let configPath of fc.assets.server.config)
            require(path.resolve(configPath))(this.app, this.db);
    }

    private _initHelmetHeaders(): void {
        const SIX_MONTHS = 15778476000;
        this.app.use(helmet.frameguard());
        this.app.use(helmet.xssFilter());
        this.app.use(helmet.noSniff());
        this.app.use(helmet.ieNoOpen());
        this.app.use(helmet.hsts({
            maxAge: SIX_MONTHS,
            includeSubdomains: true,
            force: true
        }));

        this.app.disable('x-powered-by');
    }

    private _initModulesClientRoutes(): void {
        this.app.use('/', express.static(path.resolve('./public')));
        for (let p of fc.folders) {
            let jsRegex: RegExp = new RegExp('\.js$', 'i'),
                jsProvider: express.RequestHandler =
                    express.static(path.resolve('./dist/', p)),
                assetProvider: express.RequestHandler =
                    express.static(path.resolve('.', p));

            this.app.use(p, (
                    req: express.Request,
                    res: express.Response,
                    next: express.NextFunction): void => {
                if (jsRegex.test(req.originalUrl))
                    jsProvider(req, res, next);
                else
                    assetProvider(req, res, next);
            });
        }
    }

    private _initModulesServerRoutes(): void {
        for (let f of fc.assets.server.routes)
            require(path.resolve(f))(this.app);
    }

    private _initErrorRoutes(): void {
        this.app.use(function (
                err: Error,
                req: express.Request,
                res: express.Response,
                next: express.NextFunction): any {
            if (!err) return next();
            console.log(err.stack);
            res.redirect('/server-error');
        });
    }

    listen(callbackFn: ListenCallbackFunction): void {
        this.app.listen(fc.config.port, fc.config.host, callbackFn);
    }

    constructor(private db: mongoose.Mongoose) {
        this.app = express();
        this._initLocalVariables();
        this._initMiddleware();
        this._initViewEngine();
        this._initHelmetHeaders();
        this._initModulesClientRoutes();
        this._initSession();
        this._initModulesServerRoutes();
        this._initErrorRoutes();
    }
}
