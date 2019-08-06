"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oda_model_1 = require("oda-model");
const utils_1 = require("../../utils");
exports.template = 'entity/subscriptions/resolver.ts.njs';
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
        ownerFieldName: utils_1.decapitalize(entity.name),
        unionCheck: [
            ...ids.map(f => ({
                name: f.name,
                type: 'ID',
                required: false,
            })),
            ...fieldsAcl.filter(queries_1.mutableFields),
        ].map(f => f.name),
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
        relations: fieldsAcl.filter(queries_1.relationFieldsExistsIn(pack)).map(f => {
            let verb = f.relation.verb;
            let ref = {
                usingField: '',
                backField: f.relation.ref.backField,
                entity: f.relation.ref.entity,
                field: f.relation.ref.field,
                type: pack.get(f.relation.ref.entity).fields.get(f.relation.ref.field)
                    .type,
                cField: utils_1.capitalize(f.relation.ref.field),
                fields: [],
                using: {
                    backField: '',
                    entity: '',
                    field: '',
                },
            };
            if (verb === 'BelongsToMany' && f.relation.using) {
                let current = f.relation;
                ref.using.entity = current.using.entity;
                ref.using.field = current.using.field;
                ref.backField = current.using.backField;
                let refe = pack.entities.get(ref.entity);
                let opposite = queries_1.getRelationNames(refe)
                    .filter(r => (current.opposite && current.opposite === r) ||
                    (refe.fields.get(r).relation instanceof oda_model_1.BelongsToMany &&
                        refe.fields.get(r).relation.using &&
                        refe.fields.get(r).relation.using.entity ===
                            f.relation.using.entity))
                    .map(r => refe.fields.get(r).relation)
                    .filter(r => r instanceof oda_model_1.BelongsToMany && current !== r)[0];
                if (opposite) {
                    ref.usingField = opposite.using.field;
                    ref.backField = opposite.ref.field;
                }
                else {
                    ref.usingField = utils_1.decapitalize(ref.entity);
                }
                if (f.relation.fields && f.relation.fields.size > 0) {
                    f.relation.fields.forEach(field => {
                        ref.fields.push(field.name);
                    });
                }
            }
            let sameEntity = entity.name === f.relation.ref.entity;
            let refFieldName = `${f.relation.ref.entity}${sameEntity ? utils_1.capitalize(f.name) : ''}`;
            return {
                derived: f.derived,
                field: f.name,
                name: utils_1.capitalize(f.name),
                refFieldName: utils_1.decapitalize(refFieldName),
                verb,
                ref,
            };
        }),
    };
}
exports._mapper = _mapper;
//# sourceMappingURL=resolver.ts.js.map