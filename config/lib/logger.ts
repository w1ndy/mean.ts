import winston = require('winston');
import path = require('path');
import fs = require('fs');
import chalk = require('chalk');
import _ = require('lodash');

import { FrameworkConfiguration } from '../config';

const fc = FrameworkConfiguration.get();

export class Logger extends winston.Logger {
    constructor() {
        super({
            transports: [
                new winston.transports.Console({
                    level: 'info',
                    colorize: true,
                    showLevel: true,
                    handleExceptions: true,
                    humanReadableUnhandledException: true
                })
            ],
            exitOnError: false
        });

        this.setupFileLogger();
    }

    logStream: {} = {
        write: (msg: string): void => {
            this.info(msg);
        }
    }

    getLogOptions(): winston.FileTransportOptions {
        const config = fc.config.log.fileLogger;
        if (!_.has(config, 'directoryPath') || !_.has(config, 'fileName')) {
            console.log('unable to find logging file configuration');
            return null;
        }

        const logPath = path.join(config.directoryPath, config.fileName);

        return {
            level: 'debug',
            colorize: false,
            filename: logPath,
            maxsize: 'maxsize' in config ? config.maxsize : 10485760,
            maxFiles: 'maxFiles' in config ? config.maxFiles : 2,
            json: 'json' in config ? config.json : false,
            eol: '\n',
            tailable: true,
            showLevel: true,
            handleExceptions: true,
            humanReadableUnhandledException: true
        };
    }

    setupFileLogger(): void {
        const fileLoggerTransport = this.getLogOptions();
        if (!fileLoggerTransport) return;

        try {
            if (fs.openSync(fileLoggerTransport.filename, 'a+'))
                this.add(winston.transports.File, fileLoggerTransport);
            return;
        } catch (err) {
            console.log();
            console.log(chalk.red('An error has occured during the creation of the File transport logger.'));
            console.log(chalk.red(err));
            console.log();
        }
    }

    getMorganOptions(): {} {
        return {
            stream: this.logStream
        };
    }

    getLogFormat(): string {
        const validFormats = ['combined', 'common', 'dev', 'short', 'tiny'];
        let format = fc.config.log.format;

        if (!_.includes(validFormats, format)) {
            format = 'combined';
            console.log();
            console.log(chalk.yellow(`Warning: An invalid format was provided. The logger will use the default format of "${format}"`));
            console.log();
        }
        return format;
    }
}
