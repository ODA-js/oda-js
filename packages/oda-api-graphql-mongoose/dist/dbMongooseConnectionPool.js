"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const oda_logger_1 = __importDefault(require("oda-logger"));
const mongoose_1 = __importDefault(require("mongoose"));
let p = 'Promise';
mongoose_1.default[p] = global.Promise;
const muri_1 = __importDefault(require("muri"));
mongoose_1.default.set('useCreateIndex', true);
mongoose_1.default.set('useNewUrlParser', true);
let logger = oda_logger_1.default('oda-api-graphql:db-connection-pool');
class DbMongooseConnectionPool {
    constructor(args) {
        this.dbPool = new Map();
        this.dbConnectionList = [];
        this.maxRetry = 10;
        this.maxRetryTime = 100;
        logger.trace('constructor');
        if (this.checkConnectionStringIsValid(args.defaultUrl)) {
            this.defaultConnection = args.defaultUrl;
        }
        if (args.maxRetry && args.maxRetry > 3) {
            this.maxRetry = args.maxRetry;
        }
        if (args.maxRetryTime && args.maxRetryTime > 100) {
            this.maxRetryTime = args.maxRetryTime;
        }
    }
    checkConnectionStringIsValid(conn) {
        logger.trace('checkConnectionStringIsValid');
        try {
            muri_1.default(conn);
        }
        catch (e) {
            logger.error('checkConnectionStringIsValid:invalid');
            return false;
        }
        return true;
    }
    release() {
        return __awaiter(this, void 0, void 0, function* () {
            logger.trace('release');
            let list = this.dbConnectionList.slice(0);
            let db;
            for (let i = 0, len = list.length; i < len; i++) {
                db = list[i];
                if (db) {
                    if (!(4 === db.readyState)) {
                        yield db.close();
                        logger.trace(`close ${i}`);
                    }
                    else {
                        logger.trace(`already closed ${i}`);
                    }
                }
            }
            this.dbPool.clear();
            this.dbConnectionList.length = 0;
        });
    }
    remove(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let db;
            if (this.dbPool.has(name)) {
                logger.trace(`remove ${name}`);
                db = this.dbPool.get(name);
                if (!(99 === db.readyState || 0 === db.readyState)) {
                    yield new Promise((res, rej) => db.close(err => (err ? rej(err) : res())));
                    logger.trace(`close ${name}`);
                }
                this.dbPool.delete(name);
                logger.trace(`delete ${name}`);
            }
        });
    }
    set(name, connection) {
        logger.trace(`set ${name}`);
        this.dbPool.set(name, connection);
        this.dbConnectionList.push(connection);
    }
    createConnection(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.trace(`createConnection ${connection}`);
            return new Promise((res, rej) => {
                try {
                    let result = mongoose_1.default.createConnection(connection, err => {
                        if (err) {
                            rej(err);
                        }
                        else {
                            res(result);
                        }
                    });
                }
                catch (err) {
                    rej(err);
                }
            });
        });
    }
    get(name, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.trace(`get ${name} ${connection}`);
            if (this.dbPool.has(name)) {
                let db = this.dbPool.get(name);
                if (!(4 === db.readyState)) {
                    logger.trace(`existing one for ${name} ${connection}`);
                    return Promise.resolve(db);
                }
                else {
                    logger.trace(`close inconsistent ${name} ${connection}`);
                    yield this.remove(name);
                }
            }
            let connectString = connection || this.defaultConnection;
            if (this.checkConnectionStringIsValid(connectString)) {
                let tryCount = 0;
                let hasError = false;
                let db;
                while (tryCount < this.maxRetry) {
                    logger.trace(`try ${tryCount}`);
                    db = undefined;
                    tryCount++;
                    hasError = false;
                    try {
                        db = yield this.createConnection(connectString);
                    }
                    catch (e) {
                        logger.error(e);
                        hasError = true;
                        yield waitFor(this.maxRetryTime);
                    }
                    if (!hasError) {
                        logger.trace(`done ${tryCount}`);
                        break;
                    }
                }
                if (hasError) {
                    logger.error(`max retry count exceed ${this.maxRetry}`);
                    return Promise.reject(new Error('max retry count exceed'));
                }
                if (db) {
                    this.set(name, db);
                    return Promise.resolve(db);
                }
                else {
                    logger.error('unkonwn connection error');
                    return Promise.reject(new Error('unkonwn connection error'));
                }
            }
            else {
                logger.error('invalid connection string');
                return Promise.reject(new Error('invalid connection string'));
            }
        });
    }
}
exports.default = DbMongooseConnectionPool;
function waitFor(ms) {
    return new Promise((res, rej) => {
        logger.error(`waitFor ${ms}`);
        setTimeout(res, ms);
    });
}
//# sourceMappingURL=dbMongooseConnectionPool.js.map