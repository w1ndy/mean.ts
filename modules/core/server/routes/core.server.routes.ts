import express = require('express');

import { CoreController } from '../controllers/core.server.controller';

export = function (app: express.Application): void {
    const core = new CoreController();

    app.route('/server-error').get(core.renderServerError);
    app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);
    app.route('/*').get(core.renderIndex);
}
