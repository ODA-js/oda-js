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
let logger = oda_logger_1.default('oda-api-graphql:api:base');
class ConnectorsApiBase {
    constructor({ name, connectors, securityContext, }) {
        this.name = name;
        this.connectors = connectors;
        this.securityContext = securityContext;
        this.storeToCache = this.updateLoaders('All Fields');
    }
    toJSON(obj) {
        const result = Object.keys(obj).reduce((ret, item) => {
            if (obj[item] !== null && obj[item].toJSON) {
                ret[item] = obj[item].toJSON();
            }
            else {
                ret[item] = obj[item];
            }
            return ret;
        }, {});
        logger.info('%s toJSON:result ret %o', this.name, result);
        return result;
    }
    secure(action, obj) {
        const result = this.securityContext.acls[action].allow(this.securityContext.group, this.name)(this.securityContext, obj);
        logger.info('%s secure %o', this.name, result);
        return result;
    }
    _defaultAccess(context, obj) {
        let result = obj.source;
        logger.info('%s _defaultAccess %o', this.name, result);
        return result;
    }
    _defaultCreate(context, obj) {
        let result = obj.payload;
        logger.info('%s _defaultCreate %o', this.name, result);
        return result;
    }
    _getList(args, checkExtraCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.trace('%s default _getList', this.name);
            return [];
        });
    }
    getList(args, checkExtraCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('%s getList args %o', this.name, args);
            let result = yield this._getList(args, checkExtraCriteria);
            result = result
                .map(r => (r && r.toJSON ? r.toJSON() : r))
                .map(r => this.ensureId(r));
            logger.info('%s getList result %o', this.name, result);
            return result;
        });
    }
    readSecure(source) {
        return __awaiter(this, void 0, void 0, function* () {
            if (source) {
                logger.trace('%s readSecure %o', this.name, source);
                let result;
                if (this.securityContext) {
                    result = this.secure('read', { source });
                    if (!result) {
                        logger.error('%s readSecure:prohibited', this.name);
                    }
                    else {
                        logger.trace('%s readSecure:allowed %o', this.name, result);
                    }
                }
                else {
                    result = source;
                    logger.trace('%s readSecure:allowed as is', this.name);
                }
                return result;
            }
            else {
                logger.error('%s readSecure empty', this.name);
                return source;
            }
        });
    }
    createSecure(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (payload) {
                let result;
                logger.trace('%s createSecure % o', this.name, payload);
                if (this.securityContext) {
                    if (this.secure('create', { payload })) {
                        result = yield this._create(payload);
                    }
                    else {
                        logger.error('%s createSecure:prohibit', this.name);
                        throw new Error(`can't create item due to security issue`);
                    }
                }
                else {
                    result = yield this._create(payload);
                }
                logger.trace('%s createSecure %o', this.name, result);
                return result;
            }
            else {
                logger.error('%s createSecure empty', this.name);
                return payload;
            }
        });
    }
    _create(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.error('%s _create not implemented', this.name);
            throw new Error('not implemented');
        });
    }
    updateSecure(source, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (source && payload) {
                let result;
                logger.trace('%s updateSecure:payload  %o', this.name, payload);
                logger.trace('%s updateSecure:source %o', this.name, source);
                if (this.securityContext) {
                    if (this.secure('update', { source, payload })) {
                        result = yield this._update(source, payload);
                    }
                    else {
                        logger.error('%s updateSecure:prohibit', this.name);
                        throw new Error(`can't update item due to security issue`);
                    }
                }
                else {
                    result = yield this._update(source, payload);
                }
                logger.trace('%s updateSecure %o', this.name, result);
                return result;
            }
            else {
                logger.error('%s updateSecure empty', this.name);
                return source;
            }
        });
    }
    _update(source, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.error('%s _update not implemented', this.name);
            throw new Error('not implemented');
        });
    }
    removeSecure(source) {
        return __awaiter(this, void 0, void 0, function* () {
            if (source) {
                let result;
                if (this.securityContext) {
                    if (this.secure('remove', { source })) {
                        result = yield this._remove(source);
                    }
                    else {
                        logger.error('%s removeSecure:prohibit %o', this.name, source);
                        throw new Error(`can't remove item due to security issue`);
                    }
                }
                else {
                    result = yield this._remove(source);
                }
                logger.trace('%s removeSecure:done %o', this.name, source);
                return result;
            }
            else {
                logger.error('%s removeSecure empty', this.name);
                return source;
            }
        });
    }
    _remove(record) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.error('%s _remove', this.name);
            throw new Error('not implemented');
        });
    }
    getPayload(args) {
        logger.error('default getPayload %o', args);
        return {};
    }
    initSchema(name, schema) {
        logger.error('default name %j', name);
        logger.error('default initSchema %j', schema);
        throw new Error('not implemented');
    }
    updateLoaders(name) {
        return items => {
            logger.trace('%s updateLoaders %s', this.name, name);
            for (let curr of Object.keys(this.loaders)) {
                if (curr === name) {
                    continue;
                }
                let key = this.loaderKeys[curr];
                for (let item of items) {
                    if (item) {
                        let cacheKey = typeof key === 'function' ? key(item) : item[key];
                        this.loaders[curr].clear(cacheKey).prime(cacheKey, item);
                    }
                }
            }
            if (this.securityContext) {
                return items.map(source => this.readSecure.call(this, source));
            }
            else {
                return items;
            }
        };
    }
    getCount(args) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.error('%s getCount not implemented', this.name);
            throw new Error('not implemented');
        });
    }
    ensureId(obj) {
        logger.error('%s ensureId not implemented', this.name);
        throw new Error('not implemented');
    }
    findOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.error('%s findOneById not implemented', this.name);
            throw new Error('not implemented');
        });
    }
    sync({ force = false }) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.error('%s sync not implemented', this.name);
            throw new Error('not implemented');
        });
    }
}
exports.default = ConnectorsApiBase;
//# sourceMappingURL=api.js.map