import express = require('express');

export class ExpressAdapter {
    app: express.Application;

    private initLocalVariables() {
        this.app.locals.title = '';
    }

    constructor() {
        this.app = express();
    }
}
