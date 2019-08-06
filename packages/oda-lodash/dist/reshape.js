"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_anywhere_1 = __importDefault(require("graphql-anywhere"));
const gql_1 = require("./gql");
function filter(doc, data) {
    const resolver = (fieldName, root, args, context, info) => {
        if (root.hasOwnProperty(fieldName)) {
            return root[fieldName];
        }
        else {
            return root[info.resultKey];
        }
    };
    return graphql_anywhere_1.default(resolver, doc, data);
}
exports.filter = filter;
function reshape(doc, data) {
    const { transform, apply } = gql_1.graphqlLodash(doc);
    const result = filter(doc, data);
    if (apply) {
        return transform(result);
    }
    return result;
}
exports.default = reshape;
//# sourceMappingURL=reshape.js.map