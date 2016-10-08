// Simple module declaration for express-hbs
declare module 'express-hbs' {
namespace hbs {
    export interface HBSOptions {
        extname?: string;
    }
    export function express4(options?: HBSOptions): Function;
}
export = hbs;
}

declare module 'lusca' {
    import createRouter = require('~express/lib/router/index');
    function lusca(options?: {}): createRouter.HandlerArgument;
    export = lusca;
}

declare const PRODUCTION: boolean;
