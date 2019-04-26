"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
exports.levels = {
    ALL: '*',
    DEBUG: 'debug',
    ERROR: 'error',
    FATAL: 'fatal',
    INFO: 'info',
    OFF: '',
    TRACE: 'trace',
    WARN: 'warn',
};
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
function getLogger(name) {
    return {
        trace: tracer(name, logType.trace),
        debug: tracer(name, logType.debug),
        info: tracer(name, logType.info),
        warn: tracer(name, logType.warn),
        error: tracer(name, logType.error),
        fatal: tracer(name, logType.fatal),
    };
}
exports.getLogger = getLogger;
function configure() { }
exports.configure = configure;
//# sourceMappingURL=index.js.map