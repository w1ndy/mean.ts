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
    import core = require('express-serve-static-core');
    function lusca(options?: {}): core.RequestHandler;
    export = lusca;
}

declare const PRODUCTION: boolean;
