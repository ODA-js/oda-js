"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oda_model_1 = require("oda-model");
const utils_1 = require("../../../utils");
const oda_gen_common_1 = require("oda-gen-common");
let get = oda_gen_common_1.lib.get;
exports.template = {
    mongoose: 'entity/data/mongoose/connector.ts.njs',
    sequelize: 'entity/data/sequelize/connector.ts.njs',
};
function generate(te, entity, pack, role, aclAllow, typeMapper, adapter) {
    return te.run(exports.mapper(entity, pack, role, aclAllow, typeMapper, adapter), exports.template[adapter]);
}
exports.generate = generate;
const queries_1 = require("../../../queries");
exports.mapper = queries_1.memoizeEntityMapper('data.adapter.connector', _mapper);
function _mapper(entity, pack, role, aclAllow, typeMapper, adapter) {
    const mapToTSTypes = typeMapper.typescript;
    const mapToGQLTypes = typeMapper.graphql;
    const singleStoredRelations = queries_1.singleStoredRelationsExistingIn(pack);
    const persistentRelation = queries_1.persistentRelations(pack);
    let aclRead = get(entity.metadata, 'acl.read');
    let singleUnique = queries_1.oneUniqueInIndex(entity);
    let ids = queries_1.getFields(entity).filter(queries_1.idField);
    let embedded = queries_1.getFields(entity).filter(f => f.relation && f.relation.embedded);
    return {
        name: entity.name,
        unique: queries_1.getUniqueFieldNames(entity),
        complexUniqueIndex: queries_1.complexUniqueIndex(entity).map(i => {
            let fields = Object.keys(i.fields)
                .map(fn => entity.fields.get(fn))
                .map(f => ({
                name: f.name,
                uName: utils_1.capitalize(f.name),
                type: mapToTSTypes(f.type),
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
                fields,
            };
        }),
        loaders: queries_1.getUniqueFieldNames(entity).map(i => ({
            loader: utils_1.capitalize(i),
            field: i,
        })),
        fields: queries_1.getFields(entity)
            .filter(queries_1.persistentFields)
            .map(f => f.name),
        filterAndSort: queries_1.getFields(entity)
            .filter(f => queries_1.persistentFields(f) && queries_1.indexedFields(f))
            .map(f => ({
            name: f.name,
            type: mapToTSTypes(f.type),
            gqlType: mapToGQLTypes(f.type),
        })),
        search: [
            ...ids,
            ...queries_1.getFields(entity).filter(f => queries_1.indexedFields(f) || singleStoredRelations(f)),
        ].map(f => ({
            name: f.name,
            type: mapToTSTypes(f.type),
            gqlType: mapToGQLTypes(f.type),
            rel: !!f.relation,
            _name: f['_name'] || f.name,
        })),
        ownerFieldName: utils_1.decapitalize(entity.name),
        cOwnerFieldName: utils_1.capitalize(entity.name),
        description: entity.description,
        updatableRels: queries_1.getFields(entity)
            .filter(f => singleStoredRelations(f))
            .map(f => f.name),
        args: {
            create: [
                ...[
                    ...ids,
                    ...queries_1.getFields(entity).filter(f => singleStoredRelations(f) ||
                        queries_1.mutableFields(f) ||
                        (f.relation && f.relation.embedded)),
                ].map(f => ({
                    name: f.name,
                    type: mapToTSTypes(f.type),
                    relation: queries_1.relations(f) ? f.relation : false,
                })),
            ],
            update: {
                find: [
                    ...[
                        ...ids,
                        ...queries_1.getFields(entity)
                            .filter(queries_1.identityFields)
                            .filter(singleUnique),
                    ].map(f => ({
                        name: f.name,
                        type: mapToTSTypes(f.type),
                        cName: utils_1.capitalize(f.name),
                    })),
                ],
                payload: queries_1.getFields(entity)
                    .filter(f => singleStoredRelations(f) || queries_1.mutableFields(f))
                    .map(f => ({
                    name: f.name,
                    type: mapToTSTypes(f.type),
                })),
            },
            remove: [
                ...ids,
                ...queries_1.getFields(entity)
                    .filter(queries_1.identityFields)
                    .filter(singleUnique),
            ].map(f => ({
                name: f.name,
                type: mapToTSTypes(f.type),
                cName: utils_1.capitalize(f.name),
            })),
            getOne: [...ids, ...queries_1.getFields(entity).filter(queries_1.identityFields)].map(f => ({
                name: f.name,
                type: mapToTSTypes(f.type),
                cName: utils_1.capitalize(f.name),
            })),
        },
        embedded: Object.keys(embedded
            .map(f => f.relation.ref.entity)
            .reduce((res, i) => {
            res[i] = 1;
            return res;
        }, {})),
        relations: queries_1.getFields(entity)
            .filter(persistentRelation)
            .map(f => {
            let verb = f.relation.verb;
            let ref = {
                usingField: '',
                backField: f.relation.ref.backField,
                entity: f.relation.ref.entity,
                field: f.relation.ref.field,
                fields: [],
                using: {
                    backField: '',
                    entity: '',
                    field: '',
                },
            };
            let sameEntity = entity.name === f.relation.ref.entity;
            let refFieldName = `${f.relation.ref.entity}${sameEntity ? utils_1.capitalize(f.name) : ''}`;
            let refe = pack.entities.get(ref.entity);
            let addArgs = [
                {
                    name: utils_1.decapitalize(entity.name),
                    type: mapToTSTypes(ids[0].type),
                },
                {
                    name: utils_1.decapitalize(refFieldName),
                    type: f.relation.embedded
                        ? `Partial${f.relation.ref.entity}`
                        : mapToTSTypes(refe.fields.get(ref.field).type),
                },
            ];
            let removeArgs = f.relation.embedded ? [addArgs[0]] : [...addArgs];
            if (verb === 'BelongsToMany' && f.relation.using) {
                let current = f.relation;
                ref.using.entity = current.using.entity;
                ref.using.field = current.using.field;
                ref.backField = current.using.backField;
                let opposite = queries_1.getRelationNames(refe)
                    .filter(r => (current.opposite && current.opposite === r) ||
                    (refe.fields.get(r).relation instanceof oda_model_1.BelongsToMany &&
                        refe.fields.get(r).relation.using &&
                        refe.fields.get(r).relation.using
                            .entity === f.relation.using.entity))
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
                        addArgs.push({
                            name: field.name,
                            type: mapToTSTypes(field.type),
                        });
                    });
                }
            }
            return {
                field: f.name,
                relationName: utils_1.capitalize(f.relation.fullName),
                shortName: utils_1.capitalize(f.relation.shortName),
                refFieldName: utils_1.decapitalize(refFieldName),
                verb,
                addArgs,
                removeArgs,
                ref,
                single: f.relation.single,
                embedded: f.relation.embedded ? f.relation.ref.entity : false,
            };
        }),
    };
}
exports._mapper = _mapper;
//# sourceMappingURL=connector.ts.js.map