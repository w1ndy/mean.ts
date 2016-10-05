import mongoose = require('mongoose');
import chalk = require('chalk');

import { FrameworkConfiguration } from '../config';
import { ExpressAdapter } from './express';
import { MongooseAdapter } from './mongoose';

export class Application {
    readonly fc: FrameworkConfiguration = FrameworkConfiguration.get();

    expressAdapter: ExpressAdapter;
    mongooseAdapter: MongooseAdapter;

    private constructor() {
        this.mongooseAdapter = new MongooseAdapter();
        this.mongooseAdapter.connect((db: mongoose.Mongoose): void => {
            this.expressAdapter = new ExpressAdapter(db);
            this.expressAdapter.listen((): void => {
                const port = this.fc.config.port === 80
                    ? '' : `:${this.fc.config.port}`;
                const protocol = this.fc.config.secure &&
                        this.fc.config.secure.ssl
                    ? 'https' : 'http';
                const server = `${protocol}://${this.fc.config.host}${port}`;

                console.log('--');
                console.log(chalk.green(this.fc.config.app.title));
                console.log();
                console.log(chalk.green(`Environment:      ${process.env.NODE_ENV}`));
                console.log(chalk.green(`Server:           ${server}`));
                console.log(chalk.green(`Database:         ${this.fc.config.db.uri}`));
                console.log('--');
            });
        });
    }

    private static _instance: Application = null;

    public static run(): void {
        if (this._instance) {
            console.error('Application already running!');
        } else {
            this._instance = new Application();
        }
    }

    public static get(): Application {
        if (!this._instance) {
            console.error('Application is not running.');
            return null;
        } else {
            return this._instance;
        }
    }
}
