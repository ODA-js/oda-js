"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const oda_isomorfic_1 = require("oda-isomorfic");
function globalIdField(typeName, idFetcher) {
    return {
        name: 'id',
        description: 'The ID of an object',
        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID),
        resolve: (obj, args, context, info) => oda_isomorfic_1.toGlobalId(typeName || info.parentType.name, idFetcher ? idFetcher(obj, context, info) : obj.id),
    };
}
exports.globalIdField = globalIdField;
//# sourceMappingURL=globalId.js.map