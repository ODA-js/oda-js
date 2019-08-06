declare enum logType {
    trace = "trace",
    debug = "debug",
    info = "info",
    warn = "warn",
    error = "error",
    fatal = "fatal"
}
export declare type Config<T extends void | Promise<any>> = {
    trace?: (name: string, type: logType) => T;
    debug?: (name: string, type: logType) => T;
    info?: (name: string, type: logType) => T;
    warn?: (name: string, type: logType) => T;
    error?: (name: string, type: logType) => T;
    fatal?: (name: string, type: logType) => T;
};
export declare class Logger<T extends void | Promise<any>> {
    constructor(name: string, config?: Config<T>);
    trace: (...obj: any) => T;
    debug: (...obj: any) => T;
    info: (...obj: any) => T;
    warn: (...obj: any) => T;
    error: (...obj: any) => T;
    fatal: (...obj: any) => T;
}
export default function <T extends void | Promise<any>>(name: string, config?: Config<T>): Logger<T>;
export declare function connectLogger<T extends void | Promise<any>>(name: string, config: Config<T>, middleware?: (logger: Logger<T>, req: object, res: object, next: () => void) => void): (req: any, res: any, next: any) => void;
export {};
//# sourceMappingURL=index.d.ts.map