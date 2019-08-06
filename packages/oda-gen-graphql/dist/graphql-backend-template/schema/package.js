"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
exports.template = 'schema/package';
function prepare(pack, role, aclAllow, typeMapper, adapter) {
    return { ctx: mapper(pack, role, aclAllow, typeMapper, adapter), template: exports.template };
}
exports.prepare = prepare;
const queries_1 = require("../queries");
const mutation_query_1 = require("./mutation-query");
const mixins_1 = require("./mixins");
function mapper(pack, role, aclAllow, typeMapper, adapter) {
    const mapToGQLTypes = typeMapper.graphql;
    return {
        name: utils_1.capitalize(pack.name),
        entities: queries_1.getRealEntities(pack).map((e) => ({
            name: e.name,
            adapter: e.getMetadata('storage.adapter', 'mongoose'),
        })),
        scalars: queries_1.getScalars(pack).map((s) => ({
            name: s.name,
        })),
        directives: queries_1.getDirvectives(pack).map((s) => ({
            name: s.name,
            args: utils_1.printArguments(s, mapToGQLTypes),
            on: s.on.join('|'),
        })),
        enums: queries_1.getEnums(pack).map((s) => ({
            name: s.name,
            items: s.items,
            hasCustomValue: s.items.some(i => !!i.value),
        })),
        mutations: queries_1.getMutations(pack).map(m => mutation_query_1.mapper(m, pack, typeMapper)),
        queries: queries_1.getQueries(pack).map(q => mutation_query_1.mapper(q, pack, typeMapper)),
        unions: queries_1.getUnions(pack).map((u) => ({
            name: u.name,
            items: u.items,
        })),
        mixins: queries_1.getMixins(pack).map(u => mixins_1.mapper(u, pack, role, aclAllow, typeMapper, adapter)),
    };
}
exports.mapper = mapper;
//# sourceMappingURL=package.js.map