"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const operations_1 = require("./operations");
const resourceOperation_1 = __importDefault(require("./resourceOperation"));
class default_1 {
    constructor(options) {
        this._fields = {};
        if (options) {
            if (options.overrides) {
                if (options.overrides.name) {
                    this._name = options.overrides.name;
                }
                else {
                    throw new Error('name is required param');
                }
                this.override(lodash_1.merge({
                    operations: {
                        GET_LIST: {},
                        GET_ONE: {},
                        GET_MANY: {},
                        GET_MANY_REFERENCE: {},
                        CREATE: {},
                        UPDATE: {},
                        DELETE: {},
                    },
                }, options.overrides));
            }
            if (options.resourceContainer) {
                this.connect(options.resourceContainer);
            }
        }
    }
    get fragments() {
        return this._fragments;
    }
    get queries() {
        return this._queries;
    }
    get fields() {
        return this._fields;
    }
    get name() {
        return this._name;
    }
    get operations() {
        return this._operations;
    }
    get resourceContainer() {
        return this._resourceContainer;
    }
    override(overrides) {
        if (overrides.fields) {
            const { fields } = overrides;
            if (fields) {
                Object.keys(fields).reduce((res, cur) => {
                    res[cur] = fields[cur];
                    return res;
                }, this._fields);
            }
        }
        if (overrides.fragments) {
            if (this._fragments) {
                this._fragments = Object.assign({}, this._fragments, overrides.fragments);
            }
            else {
                this._fragments = overrides.fragments;
            }
        }
        if (overrides.queries) {
            if (this._queries) {
                this._queries = Object.assign({}, this._queries, overrides.queries);
            }
            else {
                this._queries = overrides.queries;
            }
        }
        if (overrides.operations) {
            if (!this._operations) {
                this._operations = {};
            }
            if (overrides.operations.CREATE) {
                if (!this._operations.CREATE) {
                    this._operations.CREATE =
                        overrides.operations.CREATE instanceof resourceOperation_1.default
                            ? overrides.operations.CREATE.connect(this)
                            : new operations_1.Create({
                                overrides: overrides.operations.CREATE,
                                resource: this,
                            });
                }
                else {
                    this._operations.CREATE.override(overrides.operations.CREATE);
                }
            }
            if (overrides.operations.UPDATE) {
                if (!this._operations.UPDATE) {
                    this._operations.UPDATE =
                        overrides.operations.UPDATE instanceof resourceOperation_1.default
                            ? overrides.operations.UPDATE.connect(this)
                            : new operations_1.Update({
                                overrides: overrides.operations.UPDATE,
                                resource: this,
                            });
                }
                else {
                    this._operations.UPDATE.override(overrides.operations.UPDATE);
                }
            }
            if (overrides.operations.DELETE) {
                if (!this._operations.DELETE) {
                    this._operations.DELETE =
                        overrides.operations.DELETE instanceof resourceOperation_1.default
                            ? overrides.operations.DELETE.connect(this)
                            : new operations_1.Delete({
                                overrides: overrides.operations.DELETE,
                                resource: this,
                            });
                }
                else {
                    this._operations.DELETE.override(overrides.operations.DELETE);
                }
            }
            if (overrides.operations.GET_ONE) {
                if (!this._operations.GET_ONE) {
                    this._operations.GET_ONE =
                        overrides.operations.GET_ONE instanceof resourceOperation_1.default
                            ? overrides.operations.GET_ONE.connect(this)
                            : new operations_1.GetOne({
                                overrides: overrides.operations.GET_ONE,
                                resource: this,
                            });
                }
                else {
                    this._operations.GET_ONE.override(overrides.operations.GET_ONE);
                }
            }
            if (overrides.operations.GET_LIST) {
                if (!this._operations.GET_LIST) {
                    this._operations.GET_LIST =
                        overrides.operations.GET_LIST instanceof resourceOperation_1.default
                            ? overrides.operations.GET_LIST.connect(this)
                            : new operations_1.GetList({
                                overrides: overrides.operations.GET_LIST,
                                resource: this,
                            });
                }
                else {
                    this._operations.GET_LIST.override(overrides.operations.GET_LIST);
                }
            }
            if (overrides.operations.GET_MANY) {
                if (!this._operations.GET_MANY) {
                    this._operations.GET_MANY =
                        overrides.operations.GET_MANY instanceof resourceOperation_1.default
                            ? overrides.operations.GET_MANY.connect(this)
                            : new operations_1.GetMany({
                                overrides: overrides.operations.GET_MANY,
                                resource: this,
                            });
                }
                else {
                    this._operations.GET_MANY.override(overrides.operations.GET_MANY);
                }
            }
            if (overrides.operations.GET_MANY_REFERENCE) {
                if (!this._operations.GET_MANY_REFERENCE) {
                    this._operations.GET_MANY_REFERENCE =
                        overrides.operations.GET_MANY_REFERENCE instanceof resourceOperation_1.default
                            ? overrides.operations.GET_MANY_REFERENCE.connect(this)
                            : new operations_1.GetManyReference({
                                overrides: overrides.operations.GET_MANY_REFERENCE,
                                resource: this,
                            });
                }
                else {
                    this._operations.GET_MANY_REFERENCE.override(overrides.operations.GET_MANY_REFERENCE);
                }
            }
        }
        return this;
    }
    connect(resourceContainer) {
        this._resourceContainer = resourceContainer;
        return this;
    }
}
exports.default = default_1;
//# sourceMappingURL=resource.js.map