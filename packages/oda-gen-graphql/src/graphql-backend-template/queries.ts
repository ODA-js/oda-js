//common queries that is used in code generation
// const memoizeCache: any = {};
import { Entity, Field, ModelPackage, MetaModel, Mutation } from 'oda-model';

export const getPackages = (model: MetaModel) =>
  Array.from(model.packages.values());

export const getEntities = (pack: ModelPackage) =>
  Array.from(pack.entities.values());

export const fields = (f: Field): boolean => !f.relation;

export const relations = (f: Field): boolean => !!f.relation;

export const getMutations = (pack: ModelPackage): Mutation[] =>
  Array.from(pack.mutations.values());

const falseFilter = () => false;
export const oneUniqueInIndex = (entity: Entity) => {
  let indexes = entity.getMetadata('storage.indexes');
  if (indexes !== null && typeof indexes === 'object') {
    return (f: Field) => {
      let result = false;
      let iNames = Object.keys(indexes);
      for (let i = 0, len = iNames.length; i < len; i++) {
        let iName = iNames[i];
        if (indexes[iName].options.unique && indexes[iName].fields[f.name]) {
          // only one in unique index
          result = Object.keys(indexes[iName].fields).length === 1;
          if (result) {
            break;
          }
        }
      }
      return result;
    };
  } else return falseFilter;
};

export const complexUniqueIndex = (entity: Entity) => {
  let indexList = entity.getMetadata('storage.indexes') || {};
  return Object.keys(indexList)
    .filter(
      i =>
        indexList[i].options.unique &&
        Object.keys(indexList[i].fields).length > 1,
    )
    .map(i => {
      return {
        name: i,
        ...indexList[i],
      };
    });
};

export const complexUniqueFields = (entity: Entity) =>
  complexUniqueIndex(entity).reduce((result, cur) => {
    return [...result, ...Object.keys(cur.fields)];
  }, []);

// Array.from(entity.identity).filter(trulyUnique(entity));

// export const uniqueSearchParamsForAcl = (role: string) => (entity: Entity) => [
//   ...getUniqueFieldNames(entity),
//   ...complexUniqueFields(entity),
// ]
//   .filter(i => allow(role, entity.fields.get(i).getMetadata('acl.read', role)));

export const getFieldNames = (entity: Entity) =>
  Array.from(entity.fields.values()).map((f: { name: string }) => f.name);

export const getOrderBy = (role: string, pack: ModelPackage) => (
  allow,
  entity: Entity,
) =>
  searchParamsForAcl(allow, role, pack, entity).filter(f => {
    const field = entity.fields.get(f);
    return field.persistent && !field.relation;
  });

export const searchParamsForAcl = (
  allow,
  role: string,
  pack: ModelPackage,
  entity: Entity,
) =>
  getFieldNames(entity)
    // .filter(i => i !== 'id')
    .filter(i =>
      allow(role, entity.fields.get(i).getMetadata('acl.read', role)),
    );

export const filterForAcl = (allow, role: string, pack: ModelPackage) => (
  entity: Entity,
) => {
  const existingRel = relationFieldsExistsIn(pack);
  return Object.keys(
    getFieldNames(entity)
      .concat(Array.from(entity.relations))
      .reduce((res, cur) => {
        res[cur] = 1;
        return res;
      }, {}),
  ).filter(f => {
    const field = entity.fields.get(f);
    return (
      (!relations(field) || existingRel(field)) &&
      allow(role, field.getMetadata('acl.read', role))
    );
  });
};

/*
export const filterSubscriptionsForAcl = (allow) => (role: string) => (entity: Entity) =>
  Array.from(entity.fields.values())
    .filter(f => !f.relation)
    .map(f => f.name)
    .filter(i => allow(role, entity.fields.get(i).getMetadata('acl.read', role)));
*/
export const getRelationNames = (entity: Entity) =>
  Array.from(entity.relations);

export const derivedFields = (f: Field): boolean => fields(f) && f.derived;

export const derivedFieldsAndRelations = (f: Field): boolean => f.derived;

export const getFields = (entity: Entity): Field[] =>
  Array.from(entity.fields.values());

// export const getFields = (entity: Entity): Field[] => {
//   if (!memoizeCache.hasOwnProperty('getFields')) {
//     memoizeCache.getFields = {};
//   }
//   const cache = memoizeCache.getFields;
//   if (!cache.hasOwnProperty(entity.name)) {
//     cache[entity.name] = _getFields(entity);
//   }
//   return cache[entity.name];
// };

export const idField = (f: Field): boolean =>
  fields(f) && (f.name === 'id' || f.name === '_id');

export const getFieldsForAcl = (role: string, pack: ModelPackage) => {
  const existingRel = relationFieldsExistsIn(pack);
  return (allow, entity: Entity): Field[] =>
    getFields(entity)
      .filter(f => !relations(f) || existingRel(f))
      .filter(f => allow(role, f.getMetadata('acl.read', role)));
};

// export const getFieldsForAcl = function(role: string, pack: ModelPackage) {
//   const cv = role + pack.name;
//   if (!memoizeCache.hasOwnProperty('getFieldsForAcl')) {
//     memoizeCache.getFieldsForAcl = {};
//   }
//   const cache = memoizeCache.getFieldsForAcl;
//   if (!cache.hasOwnProperty(cv)) {
//     cache[cv] = _getFieldsForAcl(role, pack);
//   }
//   return cache[cv];
// };

export const relationFieldsExistsIn = (pack: ModelPackage) => (
  f: Field,
): boolean => relations(f) && pack.entities.has(f.relation.ref.entity);

export const persistentFields = (f: Field): boolean =>
  fields(f) && f.persistent;

export const indexedFields = (f: Field): boolean =>
  fields(f) && f.indexed && !idField(f);

export const indexedRelations = (f: Field): boolean =>
  relations(f) && f.indexed && !idField(f);

export const identityFields = (f: Field): boolean =>
  fields(f) && f.identity && !idField(f);

export const mutableFields = (f: Field): boolean =>
  fields(f) && !idField(f) && f.persistent;

export const nonIdFields = (f: Field): boolean =>
  fields(f) && !idField(f) && f.persistent;

export const getUniqueFieldNames = (entity: Entity) => [
  'id',
  ...getFields(entity)
    .filter(oneUniqueInIndex(entity))
    .filter(identityFields)
    .map(f => f.name),
];

export const indexes = (e: Entity) => {
  let result = [];
  let _indexes = e.getMetadata('storage.indexes', {});
  let keys = Object.keys(_indexes);
  for (let i = 0, len = keys.length; i < len; i++) {
    result.push(_indexes[keys[i]]);
  }
  return result;
};

export const singleStoredRelationsExistingIn = (pack: ModelPackage) => (
  f: Field,
): boolean =>
  relationFieldsExistsIn(pack)(f) &&
  f.relation.single &&
  f.relation.stored &&
  f.persistent;

export const storedRelationsExistingIn = (pack: ModelPackage) => (
  f: Field,
): boolean =>
  relationFieldsExistsIn(pack)(f) && f.relation.stored && f.persistent;

// get persistent fields with relations of entity in package
export const persistentRelations = (pack: ModelPackage) => f =>
  relationFieldsExistsIn(pack)(f) && f.persistent;
