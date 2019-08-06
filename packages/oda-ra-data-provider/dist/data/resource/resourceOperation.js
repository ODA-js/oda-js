"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
class default_1 {
    get query() {
        throw new Error('unimplemented');
    }
    get resultQuery() {
        throw new Error('unimplemented');
    }
    get parseResponse() {
        return this._parseResponse;
    }
    get update() {
        return this._update;
    }
    get variables() {
        return this._variables;
    }
    get resource() {
        return this._resource;
    }
    get type() {
        return this._type;
    }
    get fetchPolicy() {
        return this._fetchPolicy;
    }
    get orderBy() {
        return this._orderBy;
    }
    get filterBy() {
        return this._filterBy;
    }
    get reFetchQueries() {
        return this._reFetchQueries;
    }
    get shouldFakeExecute() {
        return this._shouldFakeExecute;
    }
    override({ parseResponse, update, variables, orderBy, filterBy, fetchPolicy = 'network-only', reFetchQueries, shouldFakeExecute, }) {
        if (parseResponse) {
            this._parseResponse = parseResponse;
        }
        if (update) {
            this._update = update;
        }
        if (variables) {
            this._variables = variables;
        }
        if (orderBy) {
            this._orderBy = orderBy;
        }
        if (filterBy) {
            this._filterBy = filterBy;
        }
        if (fetchPolicy) {
            this._fetchPolicy = fetchPolicy;
        }
        if (reFetchQueries) {
            this._reFetchQueries = reFetchQueries;
        }
        if (shouldFakeExecute) {
            this._shouldFakeExecute = shouldFakeExecute;
        }
        return this;
    }
    initDefaults({ shouldFakeExecute, update, }) {
        if (!update) {
            this._update = this.defaultUpdate;
        }
        if (!shouldFakeExecute) {
            this._shouldFakeExecute = false;
        }
    }
    constructor(options) {
        if (options) {
            if (options.overrides) {
                this.initDefaults(options.overrides);
                this.override(options.overrides);
            }
            if (options.resource) {
                this.connect(options.resource);
            }
        }
    }
    connect(resource) {
        if (resource) {
            this._resource = resource;
        }
        return this;
    }
    defaultUpdate(store, response) {
    }
    defaultOrderBy(params) {
        return params.sort.field !== 'id'
            ? `${params.sort.field}${constants_1.SortOrder[params.sort.order]}`
            : undefined;
    }
}
exports.default = default_1;
//# sourceMappingURL=resourceOperation.js.map