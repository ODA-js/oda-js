"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const oda_lodash_1 = require("oda-lodash");
const resourceOperation_1 = __importDefault(require("../resourceOperation"));
const constants_1 = require("../../../constants");
class default_1 extends resourceOperation_1.default {
    get query() {
        return this.resource.queries.getList(this.resource.resourceContainer.fragments, this.resource.queries);
    }
    get resultQuery() {
        return this.resource.queries.getListResult(this.resource.resourceContainer.fragments, this.resource.queries);
    }
    constructor(options) {
        super(options);
        if (!this._parseResponse) {
            this._parseResponse = response => {
                const data = oda_lodash_1.reshape(this.resultQuery, response.data);
                return {
                    data: data.items.data,
                    total: data.items.total,
                };
            };
        }
        if (!this._orderBy) {
            this._orderBy = (params) => {
                return params.sort.field !== 'id'
                    ? `${params.sort.field}${constants_1.SortOrder[params.sort.order]}`
                    : undefined;
            };
        }
        if (!this._filterBy) {
            this._filterBy = params => Object.keys(params.filter).reduce((acc, key) => {
                if (key === 'ids') {
                    return Object.assign({}, acc, { id: { in: params.filter[key] } });
                }
                if (key === 'q') {
                    return acc;
                }
                return lodash_1.set(acc, key.replace('-', '.'), params.filter[key]);
            }, {});
        }
        if (!this._variables) {
            this._variables = params => ({
                skip: (params.pagination.page - 1) * params.pagination.perPage,
                limit: params.pagination.perPage,
                orderBy: this.orderBy(params),
                filter: this.filterBy(params, this),
            });
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=getList.js.map