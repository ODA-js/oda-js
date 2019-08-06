"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let memoizeCache = {};
exports.resetCache = () => {
    memoizeCache = {};
};
exports.getPackages = (model) => Array.from(model.packages.values());
exports.getRealEntities = (pack) => Array.from(pack.entities.values()).filter((f) => !f.abstract);
exports.getUIEntities = (pack) => Array.from(pack.entities.values());
exports.getScalars = (pack) => Array.from(pack.scalars.values());
exports.getDirvectives = (pack) => Array.from(pack.directives.values());
exports.getEnums = (pack) => Array.from(pack.enums.values());
exports.getUnions = (pack) => Array.from(pack.unions.values());
exports.getMixins = (pack) => [
    ...Array.from(pack.mixins.values()),
    ...Array.from(pack.entities.values()).filter((e) => e.abstract),
];
exports.fields = (f) => !f.relation;
exports.relations = (f) => !!f.relation;
exports.getMutations = (pack) => Array.from(pack.mutations.values());
exports.getQueries = (pack) => Array.from(pack.queries.values());
const falseFilter = () => false;
exports.canUpdateBy = (f) => {
    let result;
    if (typeof f.type === 'string') {
        const type = f.type.toLocaleLowerCase();
        result = type !== 'fileupload' && type !== 'imageupload';
    }
    else if (f.type && typeof f.type === 'object') {
        result = f.type.type === 'enum';
    }
    else {
        result = true;
    }
    return result;
};
exports.oneUniqueInIndex = (entity) => {
    let indexList = entity.getMetadata('storage.indexes');
    if (indexList !== null && typeof indexList === 'object') {
        return (f) => {
            let result = false;
            let iNames = Object.keys(indexList);
            for (let i = 0, len = iNames.length; i < len; i++) {
                let iName = iNames[i];
                if (indexList[iName].options.unique &&
                    indexList[iName].fields[f.name]) {
                    result = Object.keys(indexList[iName].fields).length === 1;
                    if (result) {
                        break;
                    }
                }
            }
            return result;
        };
    }
    else {
        return falseFilter;
    }
};
exports.oneFieldIndex = (entity) => {
    let indexList = entity.getMetadata('storage.indexes');
    if (indexList !== null && typeof indexList === 'object') {
        return (f) => {
            let result = false;
            let iNames = Object.keys(indexList);
            for (let i = 0, len = iNames.length; i < len; i++) {
                let iName = iNames[i];
                if (indexList[iName].fields[f.name]) {
                    result = Object.keys(indexList[iName].fields).length === 1;
                    if (result) {
                        break;
                    }
                }
            }
            return result;
        };
    }
    else {
        return falseFilter;
    }
};
exports.complexUniqueIndex = (entity) => {
    let indexList = entity.getMetadata('storage.indexes');
    if (indexList) {
        return Object.keys(indexList)
            .filter(i => indexList[i].options.unique &&
            Object.keys(indexList[i].fields).length > 1)
            .map(i => {
            return Object.assign({ name: i }, indexList[i]);
        });
    }
    else {
        return [];
    }
};
exports.complexUniqueFields = (entity) => exports.complexUniqueIndex(entity).reduce((result, cur) => {
    result.push(...Object.keys(cur.fields));
    return result;
}, []);
exports._getFieldNames = (entity) => Array.from(entity.fields.values()).map((f) => f.name);
exports.getFieldNames = (entity) => {
    if (!memoizeCache.hasOwnProperty('getFieldNames')) {
        memoizeCache.getFieldNames = {};
    }
    const cache = memoizeCache.getFieldNames;
    if (!cache.hasOwnProperty(entity.name)) {
        cache[entity.name] = exports._getFieldNames(entity);
    }
    return cache[entity.name];
};
exports.getOrderBy = (role) => (allow, entity) => exports.searchParamsForAcl(allow, role, entity).filter(f => {
    const field = entity.fields.get(f);
    return field.persistent && !field.relation;
});
exports.searchParamsForAcl = (allow, role, entity) => exports.getFieldNames(entity)
    .filter(i => allow(role, entity.fields.get(i).getMetadata('acl.read', role)));
exports._filterForAcl = (role, pack) => {
    const existingRel = exports.relationFieldsExistsIn(pack);
    return (allow, entity) => {
        return Object.keys(exports.getFieldNames(entity)
            .concat(exports.getRelationNames(entity))
            .reduce((res, cur) => {
            res[cur] = 1;
            return res;
        }, {})).filter(f => {
            const field = entity.fields.get(f);
            return ((!exports.relations(field) || existingRel(field)) &&
                allow(role, field.getMetadata('acl.read', role)));
        });
    };
};
exports.filterForAcl = (role, pack) => {
    if (!memoizeCache.hasOwnProperty('filterForAcl')) {
        memoizeCache.filterForAcl = {};
    }
    const cv = role + pack.name;
    const cache = memoizeCache.filterForAcl;
    if (!cache.hasOwnProperty(cv)) {
        cache[cv] = exports._filterForAcl(role, pack);
    }
    return cache[cv];
};
exports.getRelationNames = (entity) => Array.from(entity.relations);
exports.derivedFields = (f) => exports.fields(f) && f.derived;
exports.derivedFieldsAndRelations = (f) => f.derived;
exports._getFields = (entity) => Array.from(entity.fields.values());
exports.getFields = (entity) => {
    if (!memoizeCache.hasOwnProperty('getFields')) {
        memoizeCache.getFields = {};
    }
    const cache = memoizeCache.getFields;
    if (!cache.hasOwnProperty(entity.name)) {
        cache[entity.name] = exports._getFields(entity);
    }
    return cache[entity.name];
};
exports.idField = (f) => exports.fields(f) && (f.name === 'id' || f.name === '_id');
exports._getFieldsForAcl = (role, pack) => {
    const existingRel = exports.relationFieldsExistsIn(pack);
    return (allow, entity) => exports.getFields(entity)
        .filter(f => !exports.relations(f) || existingRel(f))
        .filter(f => allow(role, f.getMetadata('acl.read', role)));
};
exports.getFieldsForAcl = function (role, pack) {
    const cv = role + pack.name;
    if (!memoizeCache.hasOwnProperty('getFieldsForAcl')) {
        memoizeCache.getFieldsForAcl = {};
    }
    const cache = memoizeCache.getFieldsForAcl;
    if (!cache.hasOwnProperty(cv)) {
        cache[cv] = exports._getFieldsForAcl(role, pack);
    }
    return cache[cv];
};
exports.relationFieldsExistsIn = (pack) => (f) => exports.relations(f) && pack.entities.has(f.relation.ref.entity);
exports.persistentFields = (f) => exports.fields(f) && f.persistent;
exports.indexedFields = (f) => exports.fields(f) && f.indexed && !exports.idField(f);
exports.indexedRelations = (f) => exports.relations(f) && f.indexed && !exports.idField(f);
exports.identityFields = (f) => exports.fields(f) && f.identity && !exports.idField(f);
exports.mutableFields = (f) => exports.fields(f) && !exports.idField(f) && f.persistent;
exports.nonIdFields = (f) => exports.fields(f) && !exports.idField(f) && f.persistent;
exports.getUniqueFieldNames = (entity) => [
    'id',
    ...exports.getFields(entity)
        .filter(exports.oneUniqueInIndex(entity))
        .filter(exports.identityFields)
        .map(f => f.name),
];
exports.indexes = (e) => {
    let result = [];
    let _indexes = e.getMetadata('storage.indexes', {});
    let keys = Object.keys(_indexes);
    for (let i = 0, len = keys.length; i < len; i++) {
        result.push(_indexes[keys[i]]);
    }
    return result;
};
exports.singleStoredRelationsExistingIn = (pack) => (f) => exports.relationFieldsExistsIn(pack)(f) &&
    f.relation.single &&
    f.relation.stored &&
    f.persistent;
exports.storedRelationsExistingIn = (pack) => (f) => exports.relationFieldsExistsIn(pack)(f) && f.relation.stored && f.persistent;
exports.persistentRelations = (pack) => f => exports.relationFieldsExistsIn(pack)(f) && f.persistent;
exports.memoizeEntityMapper = (name, mapper) => (entity, pack, role, aclAllow, typeMapper, defaultAdapter) => {
    let adapter = entity.getMetadata('storage.adapter', defaultAdapter || 'mongoose');
    if (!memoizeCache.hasOwnProperty(name)) {
        memoizeCache[name] = {};
    }
    const cv = (role || 'system') + (pack.name || 'system') + entity.name + adapter;
    const cache = memoizeCache[name];
    if (!cache.hasOwnProperty(cv)) {
        cache[cv] = mapper(entity, pack, role, aclAllow, typeMapper, adapter);
    }
    return cache[cv];
};
//# sourceMappingURL=queries.js.map