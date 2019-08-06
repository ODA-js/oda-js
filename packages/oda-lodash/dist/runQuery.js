"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const apollo_utilities_1 = require("apollo-utilities");
const gql_1 = require("./gql");
function runQueryLodash(options) {
    const { transform, apply } = gql_1.graphqlLodash(options.document, options.operationName);
    if (apply) {
        options.document = apollo_utilities_1.removeDirectivesFromDocument([{ name: '_' }], options.document);
        return runQuery(options).then(result => (Object.assign({}, result, { data: transform(result.data) })));
    }
    else {
        return runQuery(options);
    }
}
exports.runQueryLodash = runQueryLodash;
function runQuery(options) {
    return __awaiter(this, void 0, void 0, function* () {
        return graphql_1.execute(options);
    });
}
//# sourceMappingURL=runQuery.js.map