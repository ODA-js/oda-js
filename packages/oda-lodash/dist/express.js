"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_core_1 = require("apollo-server-core");
const gql_1 = require("./gql");
function graphqlLodashExpress(options) {
    if (!options) {
        throw new Error('Apollo Server requires options.');
    }
    if (arguments.length > 1) {
        throw new Error(`Apollo Server expects exactly one argument, got ${arguments.length}`);
    }
    return (req, res, next) => {
        const originalQuery = req.method === 'POST' ? req.body : req.query;
        let transform, apply, isBatch = false;
        if (Array.isArray(originalQuery)) {
            isBatch = true;
            let res = originalQuery.map(q => gql_1.graphqlLodash(q.query, q.operationName));
            transform = res.map(t => t.transform);
            apply = res.map(t => t.apply);
        }
        else {
            let res = gql_1.graphqlLodash(originalQuery.query, originalQuery.operationName);
            transform = res.transform;
            apply = res.apply;
        }
        apollo_server_core_1.runHttpQuery([req, res], {
            method: req.method,
            options: options,
            query: originalQuery,
            request: apollo_server_core_1.convertNodeHttpToRequest(req),
        })
            .then(({ graphqlResponse, responseInit }) => {
            if (isBatch) {
                const result = JSON.parse(graphqlResponse);
                return {
                    graphqlResponse: JSON.stringify(result.map((r, i) => {
                        if (apply[i]) {
                            return transform[i](r);
                        }
                        else {
                            return r;
                        }
                    })),
                    responseInit,
                };
            }
            else {
                if (apply) {
                    return {
                        graphqlResponse: JSON.stringify({
                            data: transform(JSON.parse(graphqlResponse).data),
                        }),
                        responseInit,
                    };
                }
                else {
                    return { graphqlResponse, responseInit };
                }
            }
        })
            .then(({ graphqlResponse, responseInit }) => {
            if (responseInit.headers) {
                for (const [name, value] of Object.entries(responseInit.headers)) {
                    res.setHeader(name, value);
                }
            }
            res.write(graphqlResponse);
            res.end();
        }, (error) => {
            if ('HttpQueryError' !== error.name) {
                return next(error);
            }
            if (error.headers) {
                for (const [name, value] of Object.entries(error.headers)) {
                    res.setHeader(name, value);
                }
            }
            res.statusCode = error.statusCode;
            res.write(error.message);
            res.end();
        });
    };
}
exports.graphqlLodashExpress = graphqlLodashExpress;
//# sourceMappingURL=express.js.map