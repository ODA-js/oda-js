"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oda_gen_common_1 = require("oda-gen-common");
let get = oda_gen_common_1.lib.get;
exports.template = {
    mongoose: 'entity/data/mongoose/schema.ts.njs',
    sequelize: 'entity/data/sequelize/schema.ts.njs',
};
function generate(te, entity, pack, role, aclAllow, typeMapper, adapter) {
    return te.run(exports.mapper(entity, pack, role, aclAllow, typeMapper, adapter), exports.template[adapter]);
}
exports.generate = generate;
const queries_1 = require("../../../queries");
exports.mapper = queries_1.memoizeEntityMapper(exports.template, _mapper);
function _mapper(entity, pack, role, aclAllow, typeMapper, adapter) {
    let ids = queries_1.getFields(entity)
        .filter(queries_1.idField)
        .filter(f => f.type !== 'ID');
    let useDefaultPK = ids.length === 0;
    let embedded = queries_1.getFields(entity).filter(f => f.relation && f.relation.embedded);
    return {
        name: entity.name,
        plural: entity.plural,
        strict: get(entity.metadata, 'storage.schema.strict'),
        collectionName: get(entity.metadata, 'storage.collectionName') ||
            entity.plural.toLowerCase(),
        description: entity.description,
        useDefaultPK,
        fields: [
            ...ids.map(f => ({
                name: f.name === 'id' && adapter === 'sequelize' ? f.name : '_id',
                type: adapter === 'sequelize' ? `${f.type}_pk` : f.type,
                required: true,
                defaultValue: f.defaultValue,
                primaryKey: true,
            })),
            ...queries_1.getFields(entity).filter(queries_1.mutableFields),
        ].map(f => {
            return {
                name: f.name,
                type: typeMapper[adapter](f.type),
                required: f.required,
                primaryKey: !!f['primaryKey'],
                defaultValue: f.defaultValue,
            };
        }),
        embedded: Object.keys(embedded
            .map(f => f.relation.ref.entity)
            .reduce((res, i) => {
            res[i] = 1;
            return res;
        }, {})),
        relations: [
            ...queries_1.getFields(entity)
                .filter(queries_1.singleStoredRelationsExistingIn(pack))
                .filter(r => r.relation.ref.backField !== r.name),
            ...embedded,
        ].map(f => {
            let retKeyType = pack.entities
                .get(f.relation.ref.entity)
                .fields.get(f.relation.ref.field).type;
            return {
                name: f.name,
                type: typeMapper[adapter](retKeyType),
                indexed: true,
                single: f.relation.single,
                embedded: f.relation.embedded ? f.relation.ref.entity : false,
                required: !!f.required,
            };
        }),
        indexes: adapter === 'sequelize'
            ? queries_1.indexes(entity).map(i => ({
                fields: i.fields,
                options: i.options,
                name: i.name,
            }))
            : queries_1.indexes(entity)
                .filter(i => i.name !== 'id')
                .map(i => ({
                fields: i.fields,
                options: i.options,
                name: i.name,
            })),
    };
}
exports._mapper = _mapper;
//# sourceMappingURL=schema.ts.js.map