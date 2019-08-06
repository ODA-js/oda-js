"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./../../utils");
exports.template = 'entity/subscriptions/types.graphql.njs';
function generate(te, entity, pack, role, aclAllow, typeMapper) {
    return te.run(exports.mapper(entity, pack, role, aclAllow, typeMapper), exports.template);
}
exports.generate = generate;
const queries_1 = require("../../queries");
exports.mapper = queries_1.memoizeEntityMapper(exports.template, _mapper);
function _mapper(entity, pack, role, aclAllow, typeMapper) {
    let fieldsAcl = queries_1.getFieldsForAcl(role, pack)(aclAllow, entity);
    let ids = queries_1.getFields(entity).filter(queries_1.idField);
    const mapToGQLTypes = typeMapper.graphql;
    return {
        name: entity.name,
        plural: entity.plural,
        ownerFieldName: utils_1.decapitalize(entity.name),
        update: [
            ...ids.map(f => ({
                name: f.name,
                type: 'ID',
                required: false,
            })),
            ...fieldsAcl.filter(queries_1.mutableFields),
        ].map(f => ({
            name: f.name,
            type: `${mapToGQLTypes(f.type)}`,
        })),
        connections: fieldsAcl.filter(queries_1.persistentRelations(pack)).map(f => {
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