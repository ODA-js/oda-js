"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.template = 'mutation/resolver.ts.njs';
function generate(te, mutation, pack, role, aclAllow, typeMapper) {
    return te.run(mapper(mutation, pack, typeMapper), exports.template);
}
exports.generate = generate;
function mapper(mutation, pack, typeMapper) {
    const mapToTSTypes = typeMapper.typescript;
    return {
        name: mutation.name,
        args: mutation.args.map(arg => ({
            name: arg.name,
            type: mapToTSTypes(arg.type),
        })),
        payload: mutation.payload.map(arg => ({
            name: arg.name,
            type: mapToTSTypes(arg.type),
        })),
    };
}
exports.mapper = mapper;
//# sourceMappingURL=resolver.ts.js.map