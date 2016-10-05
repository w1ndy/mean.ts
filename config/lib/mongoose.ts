import chalk = require('chalk');
import path = require('path');
import mongoose = require('mongoose');

import { FrameworkConfiguration } from '../config';

const fc: FrameworkConfiguration = FrameworkConfiguration.get();

export interface ConnectCallbackFunction {
    (db: mongoose.Mongoose): any;
}

export interface DisconnectCallbackFunction {
    (err: any): any;
}

export interface LoadModuleCallbackFunction {
    (): any;
}

export class MongooseAdapter {
    db?: mongoose.Mongoose;

    constructor() {
        this.db = null;
    }

    connect(callbackFn?: ConnectCallbackFunction): void {
        this.db = mongoose.connect(fc.config.db.uri, fc.config.db.options,
            (err: any): void => {
                if (err) {
                    console.error(chalk.red('Could not connect to MongoDB!'));
                    console.log(err.toString());
                } else {
                    mongoose.set('debug', fc.config.db.debug);
                    if (callbackFn) callbackFn(this.db);
                }
            });
    }

    disconnect(callbackFn?: DisconnectCallbackFunction): void {
        mongoose.disconnect((err: any): void => {
            console.info(chalk.yellow('Disconnected from MongoDB'));
            this.db = null;
            if (callbackFn) callbackFn(err);
        });
    }

    isConnected(): boolean {
        return this.db !== null;
    }

    loadModels(callbackFn?: LoadModuleCallbackFunction): void {
        for (let modelPath of fc.assets.server.models)
            require(path.resolve(modelPath));
    }
}
