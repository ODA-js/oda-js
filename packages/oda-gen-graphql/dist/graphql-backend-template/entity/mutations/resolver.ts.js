"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
exports.template = 'entity/mutations/resolver.ts.njs';
function generate(te, entity, pack, role, aclAllow, typeMapper) {
    return te.run(exports.mapper(entity, pack, role, aclAllow, typeMapper), exports.template);
}
exports.generate = generate;
const queries_1 = require("../../queries");
exports.mapper = queries_1.memoizeEntityMapper(exports.template, _mapper);
function _mapper(entity, pack, role, aclAllow, typeMapper) {
    const relsInPackage = queries_1.relationFieldsExistsIn(pack);
    let fieldsAcl = queries_1.getFieldsForAcl(role, pack)(aclAllow, entity);
    let ids = queries_1.getFields(entity).filter(queries_1.idField);
    const mapToTSTypes = typeMapper.typescript;
    const mapToGQLTypes = typeMapper.graphql;
    const relations = fieldsAcl.filter(relsInPackage).map(f => {
        let verb = f.relation.verb;
        let sameEntity = entity.name === f.relation.ref.entity;
        let refFieldName = `${f.relation.ref.entity}${sameEntity ? utils_1.capitalize(f.name) : ''}`;
        let fields = [];
        if (f.relation.fields && f.relation.fields.size > 0) {
            f.relation.fields.forEach(field => {
                fields.push({ name: field.name, type: mapToTSTypes(field.type) });
            });
        }
        return {
            persistent: f.persistent,
            derived: f.derived,
            field: f.name,
            name: f.relation.fullName,
            cField: utils_1.capitalize(f.name),
            embedded: f.relation.embedded,
            single: verb === 'BelongsTo' || verb === 'HasOne',
            fields,
            ref: {
                entity: f.relation.ref.entity,
                fieldName: utils_1.decapitalize(refFieldName),
            },
        };
    });
    const complexUnique = queries_1.complexUniqueIndex(entity)
        .map(i => {
        let fields = Object.keys(i.fields)
            .map(fn => entity.fields.get(fn))
            .map(f => ({
            name: f.name,
            uName: utils_1.capitalize(f.name),
            type: mapToTSTypes(f.type),
            gqlType: mapToGQLTypes(f.type),
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
    })
        .filter(f => !f.fields.some(fld => !queries_1.canUpdateBy(entity.fields.get(fld.name))));
    return {
        name: entity.name,
        ownerFieldName: utils_1.decapitalize(entity.name),
        relEntities: fieldsAcl
            .filter(queries_1.relationFieldsExistsIn(pack))
            .map(f => f.relation.ref.entity)
            .reduce((prev, curr) => {
            if (prev.indexOf(curr) === -1) {
                prev.push(curr);
            }
            return prev;
        }, [])
            .map(e => pack.get(e))
            .map(e => {
            let fieldsEntityAcl = queries_1.getFieldsForAcl(role, pack)(aclAllow, e);
            return {
                name: e.name,
                findQuery: utils_1.decapitalize(e.name),
                ownerFieldName: utils_1.decapitalize(e.name),
                fields: fieldsEntityAcl
                    .filter(f => queries_1.persistentFields(f) || (queries_1.relations(f) && !f.derived))
                    .map(f => ({
                    name: f.name,
                    type: mapToTSTypes(f.type),
                })),
                unique: {
                    find: [
                        ...fieldsEntityAcl
                            .filter(queries_1.identityFields)
                            .filter(queries_1.oneUniqueInIndex(e))
                            .filter(queries_1.canUpdateBy)
                            .map(f => ({
                            name: f.name,
                            type: mapToGQLTypes(f.type),
                            cName: utils_1.capitalize(f.name),
                        })),
                    ],
                    complex: complexUnique,
                },
            };
        }),
        complexUnique,
        relations,
        persistent: relations.filter(f => f.persistent),
        fields: [...ids, ...fieldsAcl.filter(f => queries_1.mutableFields(f))].map(f => ({
            name: f.name,
        })),
        args: {
            create: {
                args: [
                    ...[
                        ...ids,
                        ...fieldsAcl.filter(f => queries_1.mutableFields(f)),
                    ].map(f => ({
                        name: f.name,
                        type: mapToTSTypes(f.type),
                    })),
                ],
                find: fieldsAcl
                    .filter(f => queries_1.mutableFields(f))
                    .map(f => ({
                    name: f.name,
                    type: mapToTSTypes(f.type),
                })),
            },
            update: {
                args: [
                    ...[
                        ...ids,
                        ...fieldsAcl.filter(f => queries_1.mutableFields(f)),
                    ].map(f => ({
                        name: f.name,
                        type: mapToTSTypes(f.type),
                    })),
                ],
                find: [
                    ...fieldsAcl
                        .filter(queries_1.identityFields)
                        .filter(queries_1.oneUniqueInIndex(entity))
                        .map(f => ({
                        name: f.name,
                        type: mapToTSTypes(f.type),
                        cName: utils_1.capitalize(f.name),
                    })),
                ],
                payload: fieldsAcl
                    .filter(f => queries_1.mutableFields(f))
                    .map(f => ({
                    name: f.name,
                    type: mapToTSTypes(f.type),
                })),
            },
            remove: {
                args: [
                    ...[
                        ...ids,
                        ...fieldsAcl
                            .filter(queries_1.identityFields)
                            .filter(queries_1.oneUniqueInIndex(entity)),
                    ].map(f => ({
                        name: f.name,
                        type: mapToTSTypes(f.type),
                    })),
                ],
                find: [
                    ...fieldsAcl
                        .filter(queries_1.identityFields)
                        .filter(queries_1.oneUniqueInIndex(entity))
                        .map(f => ({
                        name: f.name,
                        type: mapToTSTypes(f.type),
                        gqlType: mapToGQLTypes(f.type),
                        cName: utils_1.capitalize(f.name),
                    })),
                ],
            },
        },
    };
}
exports._mapper = _mapper;
//# sourceMappingURL=resolver.ts.js.map