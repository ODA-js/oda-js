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
const apollo_1 = __importDefault(require("./apollo"));
const constants_1 = require("./constants");
exports.default = ({ client: clientOptions, resources, role, fetchPolicy = 'network-only', }) => {
    const client = clientOptions &&
        (clientOptions.constructor === Object ||
            clientOptions.__proto__ === {}.__proto__)
        ? apollo_1.default(clientOptions)
        : clientOptions;
    return (type, resourceName, params) => __awaiter(this, void 0, void 0, function* () {
        let resource;
        resource = resources.resource(resourceName);
        if (!resource) {
            throw new Error(`No matching resource found for name ${resourceName}`);
        }
        if (!resource.operations[type]) {
            throw new Error(`No ${type} method found for name ${resourceName}`);
        }
        const operation = resource.operations[type];
        const variables = typeof operation.variables === 'function'
            ? operation.variables(params)
            : operation.variables;
        const shouldFakeExecute = typeof operation.shouldFakeExecute === 'function'
            ? operation.shouldFakeExecute(variables)
            : operation.shouldFakeExecute;
        const currentFetchPolicy = typeof operation.fetchPolicy === 'function'
            ? operation.fetchPolicy(params)
            : operation.fetchPolicy || fetchPolicy;
        const reFetchQueries = typeof operation.reFetchQueries === 'function'
            ? operation.reFetchQueries(variables)
            : operation.reFetchQueries;
        const update = typeof operation.update === 'function' ? operation.update : false;
        const query = typeof operation.query === 'function'
            ? operation.query(params)
            : operation.query;
        if (!shouldFakeExecute) {
            let action;
            if (constants_1.QUERY_TYPES.includes(type)) {
                const apolloQuery = {
                    query,
                    variables,
                };
                if (fetchPolicy) {
                    apolloQuery.fetchPolicy = currentFetchPolicy;
                }
                action = client.query(apolloQuery);
            }
            else {
                const apolloQuery = {
                    mutation: operation.query,
                    variables,
                };
                if (reFetchQueries) {
                    apolloQuery.reFetchQueries = reFetchQueries;
                }
                if (update) {
                    apolloQuery.update = update;
                }
                action = client.mutate(apolloQuery);
            }
            return action.then(response => operation.parseResponse(response, params));
        }
        else {
            return Promise.resolve(shouldFakeExecute);
        }
    });
};
//# sourceMappingURL=client.js.map