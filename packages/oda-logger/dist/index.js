"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
var logType;
(function (logType) {
    logType["trace"] = "trace";
    logType["debug"] = "debug";
    logType["info"] = "info";
    logType["warn"] = "warn";
    logType["error"] = "error";
    logType["fatal"] = "fatal";
})(logType || (logType = {}));
function tracer(name, type) {
    const logger = debug_1.default(`${name}:${type}`);
    return logger;
}
class Logger {
    constructor(name, config) {
        if (config) {
            this.trace = config.trace ? config.trace : tracer(name, logType.trace);
            this.debug = config.debug ? config.debug : tracer(name, logType.debug);
            this.info = config.info ? config.info : tracer(name, logType.info);
            this.warn = config.warn ? config.warn : tracer(name, logType.warn);
            this.error = config.error ? config.error : tracer(name, logType.error);
            this.fatal = config.fatal ? config.fatal : tracer(name, logType.fatal);
        }
        else {
            this.trace = tracer(name, logType.trace);
            this.debug = tracer(name, logType.debug);
            this.info = tracer(name, logType.info);
            this.warn = tracer(name, logType.warn);
            this.error = tracer(name, logType.error);
            this.fatal = tracer(name, logType.fatal);
        }
    }
}
exports.Logger = Logger;
function default_1(name, config) {
    return new Logger(name, config);
}
exports.default = default_1;
function connectLogger(name, config, middleware) {
    const logger = new Logger(name, config);
    return (req, res, next) => {
        let nextCalled = false;
        if (middleware) {
            middleware(logger, req, res, () => {
                nextCalled = true;
                next();
            });
        }
        if (!nextCalled) {
            next();
        }
    };
}
exports.connectLogger = connectLogger;
//# sourceMappingURL=index.js.map