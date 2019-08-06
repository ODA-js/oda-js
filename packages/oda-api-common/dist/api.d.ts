import express from 'express';
export declare class Server {
    app: express.Application;
    logger?: {
        name: string;
        path: string;
        level: any;
    };
    service: {
        name?: string;
        description?: string;
        version?: string;
        binding: {
            host: string;
            port: number | string;
        };
        urls?: {
            src: string;
            dst: string;
        }[];
        statics?: {
            path: string;
            route: string;
        }[];
    };
    constructor(service: any, logger: any);
    svc(): void;
    config(): void;
    RegisterSvc(): Promise<void>;
    initLogger(): void;
    initStatics(): void;
    errorHandling(): void;
}
//# sourceMappingURL=api.d.ts.map