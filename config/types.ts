export interface ServerAssets {
    models?: string[] | string;
    routes?: string[] | string;
    config?: string[] | string;
    gruntConfig?: string[] | string;
    gulpConfig?: string[] | string;
    allJS?: string[] | string;
    views?: string[] | string;
}

export interface LibraryAssets {
    js?: string[] | string;
    css?: string[] | string;
}

export interface ClientAssets {
    js?: string[] | string;
    css?: string[] | string;
    lib?: LibraryAssets;
    img?: string[] | string;
    views?: string[] | string;
}

export interface Assets {
    server?: ServerAssets;
    client?: ClientAssets;
}

export interface ApplicationConfiguration {
    title?: string;
    description?: string;
    keywords?: string;
}

export interface DatabaseOptionsConfiguration {
    user?: string;
    pass?: string;
}

export interface DatabaseConfiguration {
    uri?: string;
    options?: DatabaseOptionsConfiguration;
    debug?: boolean;
}

export interface FileLoggerConfiguration {
    directoryPath?: string;
    fileName?: string;
    maxsize?: number;
    maxFiles?: number;
    json?: boolean;
}

export interface LogConfiguration {
    format?: string;
    fileLogger?: FileLoggerConfiguration;
}

export interface SessionCookieConfiguration {
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
}

export interface CSRFConfiguration {
    csrf?: boolean;
    csp?: boolean;
    xframe?: string;
    p3p?: string;
    xssProtection?: boolean;
}

export interface SecureConfiguration {
    privateKey?: string;
    certificate?: string;
    ssl?: boolean;
}

export interface Configuration {
    app?: ApplicationConfiguration;
    db?: DatabaseConfiguration;
    log?: LogConfiguration;

    host?: string;
    port?: number;

    domain?: string;

    sessionCookie?: SessionCookieConfiguration;
    sessionSecret?: string;
    sessionKey?: string;
    sessionCollection?: string;

    csrf?: CSRFConfiguration;
    secure?: SecureConfiguration;

    logo?: string;
    favicon?: string;

    livereload?: boolean;
}
