"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
exports.template = 'entity/dataPump/config.ts.njs';
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
        dcPlural: utils_1.decapitalize(entity.plural),
        plural: entity.plural,
        complexUnique: queries_1.complexUniqueIndex(entity).map(i => {
            let fields = Object.keys(i.fields)
                .map(fn => entity.fields.get(fn))
                .map(f => ({
                name: f.name,
                uName: utils_1.capitalize(f.name),
            }))
                .sort((a, b) => {
                if (a.name > b.name) {
                    return 1;
                }
                else if (a.name < b.name) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
            return {
                name: i.name,
                fields,
            };
        }),
        unique: [
            ...ids.map(f => ({
                name: f.name,
                type: 'ID',
            })),
            ...fieldsAcl.filter(queries_1.identityFields).filter(queries_1.oneUniqueInIndex(entity)),
        ].map(f => ({
            name: f.name,
            type: mapToGQLTypes(f.type),
            cName: utils_1.capitalize(f.name),
        })),
        fields: [
            ...queries_1.getFields(entity).filter(queries_1.idField),
            ...fieldsAcl.filter(f => queries_1.mutableFields(f)),
        ].map(f => ({
            name: f.name,
        })),
        relations: fieldsAcl
            .filter(queries_1.relationFieldsExistsIn(pack))
            .map(f => {
            let verb = f.relation.verb;
            return {
                persistent: f.persistent,
                derived: f.derived,
                field: f.name,
                name: f.relation.fullName,
                embedded: f.relation.embedded,
                cField: utils_1.capitalize(f.name),
                single: verb === 'BelongsTo' || verb === 'HasOne',
                ref: {
                    entity: f.relation.ref.entity,
                    fieldName: utils_1.decapitalize(f.relation.ref.entity),
                },
            };
        })
            .filter(f => f.persistent),
    };
}
exports._mapper = _mapper;
//# sourceMappingURL=config.ts.js.map