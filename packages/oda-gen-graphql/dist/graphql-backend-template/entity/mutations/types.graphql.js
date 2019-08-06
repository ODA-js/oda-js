"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./../../utils");
exports.template = 'entity/mutations/types.graphql.njs';
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
    const mapToGQLInputTypes = typeMapper.graphqlInput;
    return {
        name: entity.name,
        plural: entity.plural,
        payloadName: utils_1.decapitalize(entity.name),
        relations: fieldsAcl.filter(queries_1.relationFieldsExistsIn(pack)).map(f => {
            let verb = f.relation.verb;
            let fields = [];
            if (verb === 'BelongsToMany' &&
                f.relation.fields &&
                f.relation.fields.size > 0) {
                f.relation.fields.forEach(field => {
                    fields.push({ name: field.name, type: mapToGQLTypes(field.type) });
                });
            }
            let refEntity;
            if (fields.length > 0) {
                refEntity = exports.mapper(pack.get(f.relation.ref.entity), pack, role, aclAllow, typeMapper);
            }
            return {
                persistent: f.persistent,
                derived: f.derived,
                field: f.name,
                embedded: f.relation.embedded,
                single: verb === 'BelongsTo' || verb === 'HasOne',
                fields,
                cField: utils_1.capitalize(f.name),
                ref: {
                    entity: f.relation.ref.entity,
                    eEntity: refEntity,
                },
            };
        }),
        create: [
            ...ids.map(f => ({
                name: f.name,
                type: 'ID',
                required: false,
            })),
            ...fieldsAcl.filter(queries_1.mutableFields),
        ].map(f => ({
            name: f.name,
            type: `${mapToGQLTypes(f.type)}${utils_1.printRequired(f)}`,
        })),
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
        unique: [
            ...[
                ...ids.map(f => ({
                    name: f.name,
                    type: 'ID',
                })),
                ...fieldsAcl.filter(queries_1.identityFields),
            ].map(f => ({
                name: f.name,
                type: mapToGQLTypes(f.type),
            })),
        ],
    };
}
exports._mapper = _mapper;
//# sourceMappingURL=types.graphql.js.map