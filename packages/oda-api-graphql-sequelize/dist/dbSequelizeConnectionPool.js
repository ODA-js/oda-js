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
const url_1 = __importDefault(require("url"));
const sequelize_1 = __importDefault(require("sequelize"));
class DbSequelizeConnectionPool {
    constructor(args) {
        this.dbPool = new Map();
        this.dbConnectionList = [];
        this.maxRetry = 10;
        this.maxRetryTime = 100;
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
        try {
            url_1.default.parse(conn);
        }
        catch (e) {
            return false;
        }
        return true;
    }
    release() {
        return __awaiter(this, void 0, void 0, function* () {
            let list = this.dbConnectionList.slice(0);
            let db;
            for (let i = 0, len = list.length; i < len; i++) {
                db = list[i];
                if (db) {
                    if (!(4 === db.readyState)) {
                        yield new Promise((res, rej) => db.close(err => (err ? rej(err) : res())));
                    }
                }
            }
            this.dbPool.clear();
            this.dbConnectionList.length = 0;
        });
    }
    isValid(db) {
        return __awaiter(this, void 0, void 0, function* () {
            if (db.validate instanceof Function) {
                let valid = true;
                try {
                    yield db.validate(db);
                }
                catch (e) {
                    valid = false;
                }
                return valid;
            }
            else {
                return db;
            }
        });
    }
    remove(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let db;
            if (this.dbPool.has(name)) {
                db = this.dbPool.get(name);
                const valid = this.isValid(db);
                if (typeof valid === 'boolean') {
                    if (valid) {
                        yield new Promise((res, rej) => db.close(err => (err ? rej(err) : res())));
                    }
                }
                else {
                    yield new Promise((res, rej) => db.close(err => (err ? rej(err) : res())));
                }
                this.dbPool.delete(name);
            }
        });
    }
    set(name, connection) {
        this.dbPool.set(name, connection);
        this.dbConnectionList.push(connection);
    }
    createConnection(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                try {
                    let result = new sequelize_1.default(connection);
                    result
                        .authenticate()
                        .then(() => {
                        res(result);
                    })
                        .catch(e => {
                        rej(e);
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
            if (this.dbPool.has(name)) {
                let db = this.dbPool.get(name);
                const valid = this.isValid(db);
                if (typeof valid === 'boolean') {
                    if (valid) {
                        return Promise.resolve(db);
                    }
                    else {
                        yield new Promise((res, rej) => db.close(err => (err ? rej(err) : res())));
                        yield this.remove(name);
                    }
                }
                else {
                    return Promise.resolve(db);
                }
            }
            let connectString = connection || this.defaultConnection;
            if (this.checkConnectionStringIsValid(connectString)) {
                let tryCount = 0;
                let hasError = false;
                let db;
                while (tryCount < this.maxRetry) {
                    db = undefined;
                    tryCount++;
                    hasError = false;
                    try {
                        db = yield this.createConnection(connectString);
                    }
                    catch (e) {
                        console.log(e);
                        hasError = true;
                        yield waitFor(this.maxRetryTime);
                    }
                    if (!hasError) {
                        break;
                    }
                }
                if (hasError) {
                    return Promise.reject(new Error('max retry count exceed'));
                }
                if (db) {
                    this.set(name, db);
                    return Promise.resolve(db);
                }
                else {
                    return Promise.reject(new Error(' unkonwn connection error'));
                }
            }
            else {
                return Promise.reject(new Error('invalid connection string'));
            }
        });
    }
}
exports.default = DbSequelizeConnectionPool;
function waitFor(ms) {
    return new Promise((res, rej) => {
        setTimeout(res, ms);
    });
}
//# sourceMappingURL=dbSequelizeConnectionPool.js.map