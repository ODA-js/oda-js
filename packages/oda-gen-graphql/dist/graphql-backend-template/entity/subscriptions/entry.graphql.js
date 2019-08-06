"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queries_1 = require("../../queries");
exports.template = 'entity/subscriptions/entry.graphql.njs';
function generate(te, entity, pack, role, aclAllow, typeMapper) {
    return te.run(exports.mapper(entity, pack, role, aclAllow, typeMapper), exports.template);
}
exports.generate = generate;
exports.mapper = queries_1.memoizeEntityMapper(exports.template, _mapper);
function _mapper(entity, pack, role, aclAllow, typeMapper) {
    return {
        name: entity.name,
    };
}
exports._mapper = _mapper;
//# sourceMappingURL=entry.graphql.js.map