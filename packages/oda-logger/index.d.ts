export declare const levels: {
    ALL: string;
    DEBUG: string;
    ERROR: string;
    FATAL: string;
    INFO: string;
    OFF: string;
    TRACE: string;
    WARN: string;
};
export declare function getLogger(name: string): {
    trace: any;
    debug: any;
    info: any;
    warn: any;
    error: any;
    fatal: any;
};
export declare function configure(): void;
