"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queries_1 = require("../../queries");
exports.template = 'entity/type/enums.graphql.njs';
function generate(te, entity, pack, role, allowAcl, typeMapper) {
    return te.run(exports.mapper(entity, pack, role, allowAcl, typeMapper), exports.template);
}
exports.generate = generate;
const queries_2 = require("../../queries");
exports.mapper = queries_1.memoizeEntityMapper(exports.template, _mapper);
function _mapper(entity, pack, role, allowAcl, typeMapper) {
    return {
        name: entity.name,
        fields: queries_2.getOrderBy(role)(allowAcl, entity),
    };
}
exports._mapper = _mapper;
//# sourceMappingURL=enums.graphql.js.map