"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_link_1 = require("apollo-link");
const apollo_utilities_1 = require("apollo-utilities");
const gql_1 = require("./gql");
exports.LodashLink = new apollo_link_1.ApolloLink((operation, forward) => {
    const { transform, apply } = gql_1.graphqlLodash(operation.query, operation.operationName);
    operation.query = apollo_utilities_1.removeDirectivesFromDocument([{ name: '_', remove: true }], operation.query);
    return forward(operation).map(response => {
        if (apply) {
            return transform(response);
        }
        else {
            return response;
        }
    });
});
//# sourceMappingURL=link.js.map