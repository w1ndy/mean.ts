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
}
