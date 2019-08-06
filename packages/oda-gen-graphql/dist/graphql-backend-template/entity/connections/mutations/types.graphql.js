"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../utils");
const queries_1 = require("../../../queries");
exports.template = 'entity/connections/mutations/types.graphql.njs';
function generate(te, entity, pack, role, aclAllow, typeMapper) {
    return te.run(exports.mapper(entity, pack, role, aclAllow, typeMapper), exports.template);
}
exports.generate = generate;
exports.mapper = queries_1.memoizeEntityMapper(exports.template, _mapper);
function _mapper(entity, pack, role, aclAllow, typeMapper) {
    const mapToGQLTypes = typeMapper.graphql;
    return {
        name: entity.name,
        plural: entity.plural,
        ownerFieldName: utils_1.decapitalize(entity.name),
        connections: queries_1.getFieldsForAcl(role, pack)(aclAllow, entity)
            .filter(queries_1.persistentRelations(pack))
            .map(f => {
            let relFields = [];
            if (f.relation.fields && f.relation.fields.size > 0) {
                f.relation.fields.forEach(field => {
                    relFields.push({
                        name: field.name,
                        type: `${mapToGQLTypes(field.type)}${utils_1.printRequired(field)}`,
                    });
                });
            }
            let sameEntity = entity.name === f.relation.ref.entity;
            let refFieldName = `${f.relation.ref.entity}${sameEntity ? utils_1.capitalize(f.name) : ''}`;
            return {
                embedded: f.relation.embedded,
                entity: f.relation.ref.entity,
                refFieldName: utils_1.decapitalize(refFieldName),
                name: f.relation.fullName,
                fields: relFields,
                single: f.relation.single,
            };
        }),
    };
}
exports._mapper = _mapper;
//# sourceMappingURL=types.graphql.js.map