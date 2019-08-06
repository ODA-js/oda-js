"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
exports.template = 'mutation/types.graphql.njs';
function generate(te, mutation, pack, role, aclAllow, typeMapper) {
    return te.run(mapper(mutation, pack, typeMapper), exports.template);
}
exports.generate = generate;
function mapper(mutation, pack, typeMapper) {
    const mapToGQLTypes = typeMapper.graphql;
    return {
        name: mutation.name,
        args: mutation.args.map(arg => ({
            name: arg.name,
            type: `${mapToGQLTypes(arg.type)}${utils_1.printRequired(arg)}`,
        })),
        payload: mutation.payload.map(arg => ({
            name: arg.name,
            type: `${mapToGQLTypes(arg.type)}${utils_1.printRequired(arg)}`,
        })),
    };
}
exports.mapper = mapper;
//# sourceMappingURL=types.graphql.js.map