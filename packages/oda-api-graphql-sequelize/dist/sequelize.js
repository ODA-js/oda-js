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
const oda_api_graphql_1 = require("oda-api-graphql");
const sequelize_1 = __importDefault(require("sequelize"));
const filter_1 = require("./filter");
const { forward } = oda_api_graphql_1.listIterator;
const { DIRECTION } = oda_api_graphql_1.consts;
class SequelizeApi extends oda_api_graphql_1.ConnectorsApiBase {
    constructor({ sequelize, connectors, name, securityContext, }) {
        super({ connectors, securityContext, name });
        this.sequelize = sequelize;
    }
    initSchema(name, schema) {
        this.schema = schema;
        if (!this.sequelize.isDefined(name)) {
            this.model = this.schema(this.sequelize, sequelize_1.default);
        }
        else {
            this.model = this.sequelize.model(name);
        }
    }
    getCount(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = this.getFilter(args);
            return yield this.model.count(query);
        });
    }
    getFilter(args) {
        if (args.filter) {
            return filter_1.FilterSequelize.parse(args.filter, args.idMap);
        }
        else {
            return {};
        }
    }
    ensureId(obj) {
        if (obj) {
            return this.toJSON(Object.assign({}, obj, { _id: obj.id }));
        }
        else {
            return obj;
        }
    }
    _getList(args, checkExtraCriteria) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
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
                            const curr = index == len - 1
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
                return yield this.model.findAll({
                    offset: cursor.skip + step * pageSize,
                    limit: pageSize,
                    where: query,
                    order: Object.keys(sort).reduce((order, curr) => {
                        order.push([
                            curr === '_id' ? 'id' : curr,
                            sort[curr] === DIRECTION.FORWARD ? 'ASC' : 'DESC',
                        ]);
                        return order;
                    }, []),
                });
            }), pageSize);
            try {
                for (var iterator_1 = __asyncValues(iterator), iterator_1_1; iterator_1_1 = yield iterator_1.next(), !iterator_1_1.done;) {
                    let source = iterator_1_1.value;
                    if ((cursor.limit && result.length < cursor.limit) ||
                        (!cursor.limit || cursor.limit <= 0)) {
                        if (yield this.readSecure(source)) {
                            if (hasExtraCondition) {
                                if (yield checkExtraCriteria(source)) {
                                    result.push(source);
                                }
                            }
                            else {
                                result.push(source);
                            }
                        }
                    }
                    else {
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
            return yield this.model.create(obj);
        });
    }
    _update(record, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield record.update(obj);
        });
    }
    _remove(record) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield record.destroy();
        });
    }
    sync({ force = false }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.sync({ force });
        });
    }
}
exports.default = SequelizeApi;
//# sourceMappingURL=sequelize.js.map