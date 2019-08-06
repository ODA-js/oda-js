"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const oda_logger_1 = __importDefault(require("oda-logger"));
let logger = oda_logger_1.default('oda-api-graphql:api-mongoose');
const oda_api_graphql_1 = require("oda-api-graphql");
const { forward } = oda_api_graphql_1.listIterator;
const { DIRECTION } = oda_api_graphql_1.consts;
const { Filter } = oda_api_graphql_1.Filter;
function unfoldQuery(obj, operations, parent, res) {
    logger.trace('unfoldQuery');
    if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
            return obj.map(item => unfoldQuery(item, operations, parent));
        }
        else {
            if (!res) {
                res = {};
            }
            Object.keys(obj).forEach(key => {
                let setKey = key;
                let index = setKey.match(/^at_(\d*)$/);
                if (index && index[1]) {
                    setKey = index[1];
                }
                if (operations.hasOwnProperty(key)) {
                    if (operations[key] === 'array') {
                        res[key] = unfoldQuery(obj[key], operations, parent);
                    }
                    else {
                        res[parent.join('.')] = obj;
                    }
                }
                else {
                    unfoldQuery(obj[key], operations, [...parent, setKey], res);
                }
            });
            return res;
        }
    }
    else {
        return obj;
    }
}
class FilterMongoose {
    static parse(node, idMap = { id: '_id' }, id = false) {
        logger.trace('parse %o', node);
        let result = Filter.parse(node, idMap, id);
        if (typeof result === 'object') {
            return unfoldQuery(result, Filter.types, []);
        }
        return result;
    }
}
exports.FilterMongoose = FilterMongoose;
class MongooseApi extends oda_api_graphql_1.ConnectorsApiBase {
    constructor({ mongoose, connectors, name, securityContext, }) {
        super({ connectors, securityContext, name });
        this.mongoose = mongoose;
    }
    initSchema(name, schema) {
        logger.trace('%s unfoldQuery', name);
        this.schema = schema;
        if (!this.mongoose.models[name]) {
            this.model = this.mongoose.model(name, schema);
        }
        else {
            this.model = this.mongoose.model(name);
        }
    }
    getCount(args) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.trace('getCount %o', args);
            let query = this.getFilter(args);
            if (query.hasOwnProperty().length > 0) {
                logger.trace('getCount use countDocuments %o', query);
                return yield this.model.countDocuments(query);
            }
            else {
                logger.trace('getCount use estimatedDocumentCount');
                return yield this.model.estimatedDocumentCount();
            }
        });
    }
    getFilter(args) {
        logger.trace('getFilter %o', args);
        if (args.filter) {
            return FilterMongoose.parse(args.filter, args.idMap);
        }
        else {
            return {};
        }
    }
    toJSON(obj) {
        logger.trace('%s toJSON', this.name);
        return super.toJSON(obj && obj.toObject ? obj.toObject() : obj);
    }
    ensureId(obj) {
        logger.trace('%s ensureId', this.name);
        if (obj) {
            return this.toJSON(Object.assign({}, obj, { id: obj._id }));
        }
        else {
            return obj;
        }
    }
    _getList(args, checkExtraCriteria) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            logger.trace('%s _getList', this.name);
            let hasExtraCondition = typeof checkExtraCriteria !== 'undefined';
            let query = this.getFilter(args);
            let sort = oda_api_graphql_1.detectCursorDirection(args);
            let cursor = oda_api_graphql_1.pagination(args);
            let result = [];
            let move = {};
            if (cursor.after || cursor.before) {
                const detect = (name, value) => ({
                    [name]: sort[name] === DIRECTION.BACKWARD
                        ? { [cursor.after ? '$lt' : '$gt']: value }
                        : { [cursor.before ? '$lt' : '$gt']: value },
                });
                let sortKeys = Object.keys(sort);
                if (sortKeys.length > 1) {
                    let current = yield this.findOneById(cursor.after || cursor.before);
                    let find = sortKeys.filter(f => f !== '_id');
                    find.push('_id');
                    const or = [];
                    while (find.length > 0) {
                        const len = find.length;
                        or.push(find.reduce((prev, f, index) => {
                            const curr = index === len - 1
                                ? detect(f, current[f])
                                : {
                                    [f]: { $eq: current[f] },
                                };
                            prev = Object.assign({}, prev, curr);
                            return prev;
                        }, {}));
                        find.pop();
                    }
                    move = { $or: or };
                }
                else {
                    move = {
                        _id: {
                            [sort._id === DIRECTION.FORWARD ? '$gt' : '$lt']: cursor.after || cursor.before,
                        },
                    };
                }
            }
            if (Object.keys(query).length > 0) {
                if (Object.keys(move).length > 0) {
                    query = {
                        $and: [move, query],
                    };
                }
            }
            else {
                if (Object.keys(move).length > 0) {
                    query = move;
                }
            }
            let pageSize = 10;
            let iterator = forward((step) => __awaiter(this, void 0, void 0, function* () {
                logger.trace('%s _getList:forward', this.name);
                return yield new Promise((res, rej) => {
                    let rz = this.model
                        .find(query)
                        .sort(sort)
                        .skip(cursor.skip + step * pageSize)
                        .limit(pageSize);
                    if (this.connectors &&
                        this.connectors.transaction &&
                        this.connectors.transaction.session &&
                        this.connectors.transaction.session.mongoose) {
                        rz = rz.session(this.connectors.transaction.session.mongoose);
                    }
                    rz.exec((err, data) => {
                        if (err) {
                            logger.error('%s _getList:forward:error', this.name);
                            rej(err);
                        }
                        else {
                            logger.trace('%s _getList:forward:done', this.name);
                            res(data);
                        }
                    });
                });
            }), pageSize);
            try {
                for (var iterator_1 = __asyncValues(iterator), iterator_1_1; iterator_1_1 = yield iterator_1.next(), !iterator_1_1.done;) {
                    let source = iterator_1_1.value;
                    if ((cursor.limit && result.length < cursor.limit) ||
                        (!cursor.limit || cursor.limit <= 0)) {
                        logger.trace('%s _getList:more', this.name);
                        if (yield this.readSecure(source)) {
                            if (hasExtraCondition) {
                                if (yield checkExtraCriteria(this.toJSON(source))) {
                                    result.push(source);
                                }
                            }
                            else {
                                result.push(source);
                            }
                        }
                    }
                    else {
                        logger.trace('%s _getList:limit', this.name);
                        break;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (iterator_1_1 && !iterator_1_1.done && (_a = iterator_1.return)) yield _a.call(iterator_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.storeToCache(result);
            return result;
        });
    }
    _create(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.trace('%s _create', this.name);
            let res = new this.model(obj);
            if (this.connectors &&
                this.connectors.transaction &&
                this.connectors.transaction.session &&
                this.connectors.transaction.session.mongoose) {
                res.$session(this.connectors.transaction.session.mongoose);
            }
            else {
                res.$session(undefined);
            }
            return yield res.save();
        });
    }
    _update(record, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.trace('%s _update', this.name);
            for (let f in obj) {
                if (obj.hasOwnProperty(f)) {
                    record.set(f, obj[f]);
                }
            }
            if (this.connectors &&
                this.connectors.transaction &&
                this.connectors.transaction.session &&
                this.connectors.transaction.session.mongoose) {
                record.$session(this.connectors.transaction.session.mongoose);
            }
            else {
                record.$session(undefined);
            }
            return yield record.save();
        });
    }
    _remove(record) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.trace('%s _remove', this.name);
            if (this.connectors &&
                this.connectors.transaction &&
                this.connectors.transaction.session &&
                this.connectors.transaction.session.mongoose) {
                record.$session(this.connectors.transaction.session.mongoose);
            }
            else {
                record.$session(undefined);
            }
            return yield record.remove();
        });
    }
    sync({ force = false }) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.trace('%s sync empty', this.name);
            return;
        });
    }
}
exports.default = MongooseApi;
//# sourceMappingURL=mongoose.js.map