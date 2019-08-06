"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_client_1 = require("apollo-client");
const apollo_link_http_1 = require("apollo-link-http");
const apollo_cache_inmemory_1 = require("apollo-cache-inmemory");
exports.default = ({ uri }) => {
    const httpLink = new apollo_link_http_1.HttpLink({ uri });
    return new apollo_client_1.ApolloClient({
        link: httpLink,
        cache: new apollo_cache_inmemory_1.InMemoryCache(),
    });
};
//# sourceMappingURL=apollo.js.map