"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const oda_lodash_1 = require("oda-lodash");
const interfaces_1 = require("../interfaces");
const resourceOperation_1 = __importDefault(require("../resourceOperation"));
const constants_1 = require("../../../constants");
class default_1 extends resourceOperation_1.default {
    get query() {
        return (params) => this.resource.queries.getManyReference(this.resource.resourceContainer.fragments, this.resource.queries)[params.target];
    }
    get resultQuery() {
        return (params) => this.resource.queries.getManyReferenceResult(this.resource.resourceContainer.fragments, this.resource.queries)[params.target];
    }
    constructor(options) {
        super(options);
        if (!this._parseResponse) {
            this._parseResponse = (response, params) => {
                const data = oda_lodash_1.reshape(this.resultQuery(params), response.data);
                return {
                    data: data.items.data,
                    total: data.items.total,
                };
            };
        }
        if (!this._orderBy) {
            this._orderBy = params => params.sort.field !== 'id'
                ? `${params.sort.field}${constants_1.SortOrder[params.sort.order]}`
                : undefined;
        }
        if (!this._filterBy) {
            this._filterBy = params => {
                const useOpposite = this._resource.fields[params.target].ref.type ===
                    interfaces_1.refType.BelongsToMany;
                return !useOpposite
                    ? {
                        [params.target]: { eq: params.id },
                    }
                    : undefined;
            };
        }
        if (!this._variables) {
            this._variables = params => ({
                id: params.id,
                target: params.target,
                skip: (params.pagination.page - 1) * params.pagination.perPage,
                limit: params.pagination.perPage,
                orderBy: this.orderBy(params),
                filter: this.filterBy(params, this),
            });
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=getManyReference.js.map