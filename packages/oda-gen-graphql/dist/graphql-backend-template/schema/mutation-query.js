"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function mapper(mutation, pack, typeMapper) {
    const mapToTSTypes = typeMapper.typescript;
    const mapToGQLTypes = typeMapper.graphql;
    return {
        name: mutation.name,
        args: mutation.args.map(arg => ({
            name: arg.name,
            type: {
                ts: mapToTSTypes(arg.type),
                gql: `${mapToGQLTypes(arg.type)}${utils_1.printRequired(arg)}`,
            },
        })),
        payload: mutation.payload.map(arg => ({
            name: arg.name,
            type: {
                ts: mapToTSTypes(arg.type),
                gql: `${mapToGQLTypes(arg.type)}${utils_1.printRequired(arg)}`,
            },
        })),
    };
}
exports.mapper = mapper;
//# sourceMappingURL=mutation-query.js.map