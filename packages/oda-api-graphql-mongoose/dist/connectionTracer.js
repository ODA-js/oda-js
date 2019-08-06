"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const oda_logger_1 = require("oda-logger");
let logger = new oda_logger_1.Logger('db:connections');
const mongoose_1 = __importDefault(require("mongoose"));
let connections = 0;
let openConnections = 0;
let errorCount = 0;
exports.default = () => {
    if (!mongoose_1.default.___createConnection) {
        mongoose_1.default.___createConnection = mongoose_1.default.createConnection;
        mongoose_1.default.createConnection = function () {
            let sl = new Error().stack.split('\n')[2];
            let conId = ++connections;
            let connection;
            connection = this.___createConnection.apply(this, arguments);
            logger.info(`created: state: ${connection.readyState}\nsource\n${sl}`);
            connection.on('connected', function () {
                logger.info(`connected: ${conId} opened: ${++openConnections}`);
            });
            connection.on('connecting', function () {
                logger.info(`connecting: ${conId}`);
            });
            connection.on('reconnected', function () {
                logger.info(`reconnected: ${conId}`);
            });
            connection.on('close', function () {
                logger.info(`closed: ${conId} opened ${--openConnections}`);
            });
            connection.on('error', function (err) {
                logger.error(`error: ${conId}, opened: ${openConnections}, 'errors: ${++errorCount}\n ${err}`);
            });
            return connection;
        };
    }
};
//# sourceMappingURL=connectionTracer.js.map