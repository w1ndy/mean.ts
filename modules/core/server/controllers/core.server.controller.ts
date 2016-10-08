import express = require('express');

export class CoreController {
    renderIndex(req: express.Request, res: express.Response): void {
        res.render('modules/core/server/views/index', {
            serverAddress: req.hostname
        });
    }

    renderServerError(req: express.Request, res: express.Response): void {
        res.status(500).render('modules/core/server/views/500', {
            error: 'Oops! Something went wrong...'
        });
    }

    renderNotFound(req: express.Request, res: express.Response): void {
        res.status(404).format({
            'text/html': () => {
                res.render('modules/core/server/views/404', {
                    url: req.originalUrl
                });
            },
            'application/json': () => {
                res.json({
                    error: 'Path not found'
                });
            },
            'default': () => {
                res.send('Path not found');
            }
        });
    }
}
