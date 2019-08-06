"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema = __importStar(require("./index"));
const queries_1 = require("../queries");
exports.template = 'entity/type.index.ts.njs';
function generate(te, entity, pack, role, allowAcl, typeMapper) {
    return te.run(exports.mapper(entity, pack, role, allowAcl, typeMapper), exports.template);
}
exports.generate = generate;
exports.mapper = queries_1.memoizeEntityMapper(exports.template, _mapper);
function _mapper(entity, pack, role, allowAcl, typeMapper) {
    return {
        name: entity.name,
        partials: {
            enums: schema.type.enums.mapper(entity, pack, role, allowAcl, typeMapper),
            type: schema.type.entry.mapper(entity, pack, role, allowAcl, typeMapper),
            'connections.types': schema.connections.types.mapper(entity, pack, role, allowAcl, typeMapper),
            'connections.mutation': schema.connections.mutations.types.mapper(entity, pack, role, allowAcl, typeMapper),
            'connections.mutation.entry': schema.connections.mutations.entry.mapper(entity, pack, role, allowAcl, typeMapper),
            'mutation.types': schema.mutations.types.mapper(entity, pack, role, allowAcl, typeMapper),
            'mutation.entry': schema.mutations.entry.mapper(entity, pack, role, allowAcl, typeMapper),
            'subscription.types': schema.subscriptions.types.mapper(entity, pack, role, allowAcl, typeMapper),
            'subscription.entry': schema.subscriptions.entry.mapper(entity, pack, role, allowAcl, typeMapper),
            'query.entry': schema.query.entry.mapper(entity, pack, role, allowAcl, typeMapper),
            'viewer.entry': schema.viewer.entry.mapper(entity, pack, role, allowAcl, typeMapper),
        },
    };
}
exports._mapper = _mapper;
//# sourceMappingURL=type.index.ts.js.map