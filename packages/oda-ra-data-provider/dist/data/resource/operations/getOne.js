"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const oda_lodash_1 = require("oda-lodash");
const resourceOperation_1 = __importDefault(require("../resourceOperation"));
class default_1 extends resourceOperation_1.default {
    get query() {
        return this.resource.queries.getOne(this.resource.resourceContainer.fragments, this.resource.queries);
    }
    get resultQuery() {
        return this.resource.queries.getOneResult(this.resource.resourceContainer.fragments, this.resource.queries);
    }
    constructor(options) {
        super(options);
        if (!this._parseResponse) {
            this._parseResponse = response => {
                const data = oda_lodash_1.reshape(this.resultQuery, response.data);
                return { data: data.item };
            };
        }
        if (!this._variables) {
            this._variables = params => ({
                id: params.id,
            });
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=getOne.js.map