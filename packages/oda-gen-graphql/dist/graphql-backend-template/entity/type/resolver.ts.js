"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oda_model_1 = require("oda-model");
const utils_1 = require("../../utils");
const queries_1 = require("../../queries");
exports.template = 'entity/type/resolver.ts.njs';
function generate(te, entity, pack, role, allowAcl, typeMapper) {
    return te.run(exports.mapper(entity, pack, role, allowAcl, typeMapper), exports.template);
}
exports.generate = generate;
const queries_2 = require("../../queries");
exports.mapper = queries_1.memoizeEntityMapper(exports.template, _mapper);
function _mapper(entity, pack, role, aclAllow, typeMapper, adapter) {
    let fieldsAcl = queries_2.getFieldsForAcl(role, pack)(aclAllow, entity);
    const fieldMap = queries_2.getFieldsForAcl(role, pack);
    return {
        name: entity.name,
        adapter,
        ownerFieldName: utils_1.decapitalize(entity.name),
        description: entity.description,
        relations: fieldsAcl.filter(queries_2.relationFieldsExistsIn(pack)).map(f => {
            let verb = f.relation.verb;
            let ref = {
                usingField: '',
                backField: f.relation.ref.backField,
                entity: f.relation.ref.entity,
                usingIndex: '',
                field: f.relation.ref.field,
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
                let opposite = queries_2.getRelationNames(refe)
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
                ref.usingIndex = utils_1.capitalize(ref.backField);
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
                embedded: f.relation.embedded,
                single: f.relation.single,
                idMap: fieldMap(aclAllow, pack.entities.get(ref.entity))
                    .filter(queries_2.relationFieldsExistsIn(pack))
                    .map(fld => ({
                    verb: fld.relation.verb,
                    type: pack
                        .get(fld.relation.ref.entity)
                        .fields.get(fld.relation.ref.field).type,
                    field: fld.name,
                }))
                    .filter(fld => fld.type === 'ID' && fld.verb === 'BelongsTo')
                    .map(fld => fld.field),
            };
        }),
        fields: fieldsAcl
            .filter(queries_2.derivedFields)
            .map(f => {
            return {
                derived: f.derived,
                field: f.name,
                name: utils_1.capitalize(f.name),
            };
        }),
    };
}
exports._mapper = _mapper;
//# sourceMappingURL=resolver.ts.js.map