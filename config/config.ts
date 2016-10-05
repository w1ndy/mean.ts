import glob = require('glob');
import chalk = require('chalk');
import _ = require('lodash');
import fs = require('fs');
import path = require('path');

import { Assets, Configuration } from './types';

import defaultAssets = require('./assets/default');
import developmentAssets = require('./assets/development');
import productionAssets = require('./assets/production');

import defaultConfig = require('./env/default');
import developmentConfig = require('./env/development');
import productionConfig = require('./env/production');
import localConfig = require('./env/local');

export class FrameworkConfiguration {
    assets: Assets;
    folders: string[];
    config: Configuration;

    public getGlobbedPaths(
            globPatterns: string[] | string,
            excludes?: string): string[] {
        const urlRegex: RegExp = new RegExp('^(?:[a-z]+:)?\/\/', 'i');
        const tsRegex: RegExp = new RegExp('\.ts$', 'i');

        let output: string[];

        if (globPatterns instanceof Array) {
            output = [];
            for (let pat of globPatterns)
                output = _.union(output, this.getGlobbedPaths(pat, excludes));
        } else {
            if (tsRegex.test(globPatterns))
                globPatterns = 'dist/' + globPatterns.slice(0, -2) + 'js';

            if (urlRegex.test(globPatterns)) {
                output = [globPatterns];
            } else {
                output = glob.sync(globPatterns);
                if (excludes)
                    output = output.map(f => f.replace(excludes, ''));
            }
        }

        return output;
    }

    private _getEnvironmentAssets(): Assets {
        console.log();
        switch (process.env.NODE_ENV as string) {
            case 'development':
                return developmentAssets;
            case 'production':
                return productionAssets;
            default:
                if (process.env.NODE_ENV) {
                    console.error(chalk.red(`+ Error: No configuration file found for ${process.env.NODE_ENV} environment, using development instead`));
                } else {
                    console.error(chalk.red('+ Error: NODE_ENV is not defined! Using default development environment'));
                }
                process.env.NODE_ENV = 'development';
                console.log(chalk.white(''));
                return developmentAssets;
        }
    }

    private _getEnvironmentConfig(): Configuration {
        switch (process.env.NODE_ENV as string) {
            case 'production':
                return productionConfig;
            case 'development':
            default:
                return developmentConfig;
        }
    }

    private _initGlobalConfigFolders(): void {
        this.folders = this.getGlobbedPaths('modules/*/client/');
    }

    private _initGlobalConfigFiles(assets: Assets): void {
        this.assets = { server: {}, client: {} };

        this.assets.server.models =
            this.getGlobbedPaths(assets.server.models);
        this.assets.server.routes =
            this.getGlobbedPaths(assets.server.routes);
        this.assets.server.config =
            this.getGlobbedPaths(assets.server.config);

        this.assets.client.js =
            this.getGlobbedPaths(assets.client.lib.js, 'public/')
            .concat(this.getGlobbedPaths(assets.client.js, 'public/'));
        this.assets.client.css =
            this.getGlobbedPaths(assets.client.lib.css, 'public/')
            .concat(this.getGlobbedPaths(assets.client.css, 'public/'));
    }

    private _validateDomainIsSet(): void {
        if (!this.config.domain) {
            console.log(chalk.red('+ Important warning: config.domain is empty. It should be set to the fully qualified domain of the app.'));
        }
    }

    private _validateSecureMode(): void {
        if (!this.config.secure || !this.config.secure.ssl)
            return ;

        const privateKey = fs.existsSync(
            path.resolve(this.config.secure.privateKey));
        const certificate = fs.existsSync(
            path.resolve(this.config.secure.certificate));

        if (!privateKey || !certificate) {
            console.log(chalk.red('+ Error: Certificate file or key file is missing, falling back to non-SSL mode'));
            console.log(chalk.red('  To create them, simply run the following from your shell: sh ./scripts/generate-ssl-certs.sh'));
            console.log();
            this.config.secure.ssl = false;
        }
    }

    private _validateSessionSecret(): void {
        if (process.env.NODE_ENV as string !== 'production')
            return

        if (this.config.sessionSecret === 'MEAN') {
            console.log(chalk.red('+ WARNING: It is strongly recommended that you change sessionSecret config while running in production!'));
            console.log(chalk.red('  Please add `sessionSecret: process.env.SESSION_SECRET || \'super amazing secret\'` to '));
            console.log(chalk.red('  `config/env/production.ts` or `config/env/local.ts`'));
            console.log();
        }
    }

    private constructor() {
        console.log('initializing FrameworkConfiguration...');

        const environmentAssets: Assets = this._getEnvironmentAssets();
        const environmentConfig: Configuration = this._getEnvironmentConfig();

        let assets: Assets = _.merge(defaultAssets, environmentAssets);
        this._initGlobalConfigFiles(assets);
        this._initGlobalConfigFolders();

        this.config = _.merge(defaultConfig, environmentConfig, localConfig);

        this._validateSecureMode();
        this._validateSessionSecret();
        this._validateDomainIsSet();
    }

    private static _instance?: FrameworkConfiguration = undefined;
    public static get(): FrameworkConfiguration {
        if (!this._instance)
            this._instance = new FrameworkConfiguration();
        return this._instance;
    }
}
