import { Entity, ModelPackage, BelongsToMany } from 'oda-model';
import { capitalize, decapitalize, mapToTSTypes } from '../../../utils';
import { Factory } from 'fte.js';
import { utils } from 'oda-api-graphql';
let get = utils.get;

export const template = 'entity/data/mongoose/connector.ts.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage) {
  return te.run(mapper(entity, pack), template);
}

export interface MapperOutupt {
  name: string;
  needOwner: boolean;
  description: string;
  unique: string[];
  complexUniqueIndex: any[]; /* {
    fields: {
      [key: string]: number,
    };
    options: {
      sparse?: boolean,
      unique: boolean,
    };
  };*/
  loaders: string[];
  fields: string[];
  filterAndSort: { type: string, name: string, gqlType: string }[];
  search: { type: string, name: string, gqlType: string, rel: boolean }[];
  updatableRels: string[];
  ownerFieldName: string;
  cOwnerFieldName: string;
  args: {
    create: { name: string; type: string; }[];
    update: {
      find: { name: string; type: string; cName: string; }[];
      payload: { name: string; type: string; }[];
    };
    remove: { name: string; type: string; cName: string; }[];
    getOne: { name: string; type: string; cName: string; }[];
  };
  relations: {
    field: string;
    relationName: string;
    verb: string,
    addArgs: { name: string; type: string; }[];
    removeArgs: { name: string; type: string; }[];
    ref: {
      backField: string;
      usingField: string;
      field: string;
      entity: string;
      fields: string[];
      using: {
        backField: string;
        entity: string;
        field: string;
      }
    }
  }[];
}

import {
  getUniqueFieldNames,
  getFields,
  indexedFields,
  persistentFields,
  singleStoredRelationsExistingIn,
  mutableFields,
  identityFields,
  persistentRelations,
  getRelationNames,
  complexUniqueIndex,
} from '../../../queries';

export function mapper(entity: Entity, pack: ModelPackage): MapperOutupt {
  const singleStoredRelations = singleStoredRelationsExistingIn(pack);
  const persistentRelation = persistentRelations(pack);
  let needOwner = true;
  let aclRead = get(entity.metadata, 'acl.read');
  if (Array.isArray(aclRead)) {
    needOwner = aclRead.indexOf('public') === -1;
  } else {
    needOwner = aclRead !== 'public';
  }
  return {
    name: entity.name,
    needOwner: get(entity.metadata, 'acl.read') !== 'public',
    unique: getUniqueFieldNames(entity),
    complexUniqueIndex: complexUniqueIndex(entity).map(i => {
      let fields = Object.keys(i.fields)
        .map(fn => entity.fields.get(fn))
        .map(f => ({
          name: f.name,
          uName: capitalize(f.name),
          type: mapToTSTypes(f.type),
        })).sort((a, b) => {
          if (a.name > b.name) return 1
          else if (a.name < b.name) return -1;
          else return 0;
        });
      return {
        fields,
      };
    }),
    loaders: getUniqueFieldNames(entity).map(capitalize),
    fields: getFields(entity)
      .filter(persistentFields)
      .map(f => f.name),
    filterAndSort: getFields(entity)
      .filter(f => persistentFields(f) && indexedFields(f))
      .map(f => ({ name: f.name, type: mapToTSTypes(f.type), gqlType: f.type })),
    search: [
      { name: 'id', _name: '_id', type: 'string', relation: false },
      ...getFields(entity)
        .filter(f => indexedFields(f) || singleStoredRelations(f))]
      .map(f => ({ name: f.name, type: mapToTSTypes(f.type), gqlType: f.type, rel: !!f.relation, _name: (f._name || f.name) })),
    ownerFieldName: decapitalize(entity.name),
    cOwnerFieldName: capitalize(entity.name),
    description: entity.description,
    updatableRels: getFields(entity)
      .filter(f => singleStoredRelations(f))
      .map(f => f.name),
    args: {
      create: [
        { name: 'id', type: 'string' },
        ...getFields(entity)
          .filter(f => singleStoredRelations(f) || mutableFields(f))
          .map(f => ({
            name: f.name,
            type: mapToTSTypes(f.type),
          }))],
      update: {
        find: [
          { name: 'id', type: 'string', cName: 'Id' },
          ...getFields(entity)
            .filter(identityFields)
            .map(f => ({
              name: f.name,
              type: mapToTSTypes(f.type),
              cName: capitalize(f.name),
            }))],
        payload: getFields(entity)
          .filter(f => singleStoredRelations(f) || mutableFields(f))
          .map(f => ({
            name: f.name,
            type: mapToTSTypes(f.type),
          })),
      },
      remove: [
        { name: 'id', type: 'string', cName: 'Id' },
        ...getFields(entity)
          .filter(identityFields)
          .map(f => ({
            name: f.name,
            type: mapToTSTypes(f.type),
            cName: capitalize(f.name),
          }))],
      getOne: [
        { name: 'id', type: 'string', cName: 'Id' },
        ...getFields(entity)
          .filter(identityFields)
          .map(f => ({
            name: f.name,
            type: mapToTSTypes(f.type),
            cName: capitalize(f.name),
          }))],
    },
    relations: getFields(entity)
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
        let refFieldName = `${f.relation.ref.entity}${sameEntity ? capitalize(f.name) : ''}`;
        let addArgs = [
          {
            name: decapitalize(entity.name),
            type: 'string',
          },
          {
            name: decapitalize(refFieldName),
            type: 'string',
          },
        ];
        let removeArgs = [...addArgs];

        if (verb === 'BelongsToMany') {
          let current = (f.relation as BelongsToMany);
          ref.using.entity = current.using.entity;
          ref.using.field = current.using.field;
          ref.backField = current.using.backField;
          //from oda-model/model/belongstomany.ts ensure relation class
          let refe = pack.entities.get(ref.entity);
          let opposite = getRelationNames(refe)
            // по одноименному классу ассоциации
            .filter(r => (current.opposite && current.opposite == r) || ((refe.fields.get(r).relation instanceof BelongsToMany)
              && (refe.fields.get(r).relation as BelongsToMany).using.entity === (f.relation as BelongsToMany).using.entity))
            .map(r => refe.fields.get(r).relation)
            .filter(r => r instanceof BelongsToMany && (current !== r))[0] as BelongsToMany;
          /// тут нужно получить поле по которому opposite выставляет свое значение,
          // и значение
          if (opposite) {
            ref.usingField = opposite.using.field;
            ref.backField = opposite.ref.field;
          } else {
            ref.usingField = decapitalize(ref.entity);
          }
          if (f.relation.fields && f.relation.fields.length > 0) {
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
          relationName: capitalize(f.relation.fullName),
          shortName: capitalize(f.relation.shortName),
          refFieldName: decapitalize(refFieldName),
          verb,
          addArgs,
          removeArgs,
          ref,
        };
      }),
  };
}
