"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.template = 'mutation/entry.graphql.njs';
function generate(te, mutation, pack, role, aclAllow, typeMapper) {
    return te.run(mapper(mutation, pack, typeMapper), exports.template);
}
exports.generate = generate;
function mapper(mutation, pack, typeMapper) {
    return {
        name: mutation.name,
    };
}
exports.mapper = mapper;
//# sourceMappingURL=entry.graphql.js.map