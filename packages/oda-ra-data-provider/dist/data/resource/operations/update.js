"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const oda_lodash_1 = require("oda-lodash");
const interfaces_1 = require("../interfaces");
const resourceOperation_1 = __importDefault(require("../resourceOperation"));
const updateField_1 = __importDefault(require("./../../updateField"));
const updateMany_1 = __importDefault(require("./../../updateMany"));
const updateSingle_1 = __importDefault(require("./../../updateSingle"));
class default_1 extends resourceOperation_1.default {
    get query() {
        return this.resource.queries.update(this.resource.resourceContainer.fragments, this.resource.queries);
    }
    get resultQuery() {
        return this.resource.queries.updateResult(this.resource.resourceContainer.fragments, this.resource.queries);
    }
    constructor(options) {
        super(options);
        if (!this._parseResponse) {
            this._parseResponse = response => {
                const data = oda_lodash_1.reshape(this.resultQuery, response.data);
                return { data: data.item };
            };
        }
        if (!this._shouldFakeExecute) {
            this._shouldFakeExecute = (variables) => Object.keys(variables.input).length === 1 && !variables.files
                ? { data: variables.input }
                : false;
        }
        if (!this._variables) {
            this._variables = params => {
                const { data, previousData } = params;
                const result = {};
                let input = {
                    id: data.id,
                };
                Object.keys(this.resource.fields).forEach(f => {
                    if (this.resource.fields[f].ref) {
                        if (this.resource.fields[f].ref.type === interfaces_1.refType.HasMany ||
                            this.resource.fields[f].ref.type === interfaces_1.refType.BelongsToMany) {
                            input = Object.assign({}, input, updateMany_1.default(data, previousData, Object.assign({ name: f }, this.resource.fields[f]), this.resource.resourceContainer));
                        }
                        else {
                            input = Object.assign({}, input, updateSingle_1.default(data, previousData, Object.assign({ name: f }, this.resource.fields[f]), this.resource.resourceContainer));
                        }
                    }
                    else {
                        input = Object.assign({}, input, updateField_1.default(data, previousData, f));
                    }
                });
                if (data.files) {
                    result.files = data.files;
                }
                result.input = input;
                return result;
            };
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=update.js.map