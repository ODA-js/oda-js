import { Entity, ModelPackage, BelongsToMany } from 'oda-model';
import { capitalize, decapitalize, mapToTSTypes, mapToGraphqlTypes } from '../../utils';
import { Factory } from 'fte.js';

export const template = 'entity/mutations/resolver.ts.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow) {
  return te.run(mapper(entity, pack, role, aclAllow), template);
}

export interface MapperOutupt {
  name: string;
  ownerFieldName: string;
  // unique: {
  //   args: { name: string, type: string }[];
  //   find: { name: string, type: string, cName: string }[];
  //   complex: { name: string, fields: { name: string, uName: string, type: string }[] }[];
  // }
  complexUnique: { name: string, fields: { name: string, uName: string, type: string }[] }[];
  relEntities: any[];
  relations: {
    derived: boolean;
    persistent: boolean;
    field: string;
    single: boolean;
    name: string;
    ref: {
      entity: string;
    }
  }[];
  args: {
    create: {
      args: { name: string; type: string; }[];
      find: { name: string; type: string; }[];
    };
    update: {
      args: { name: string; type: string; }[];
      find: { name: string; type: string; cName: string }[];
      payload: { name: string; type: string; }[];
    };
    remove: {
      args: { name: string; type: string; }[]
      find: { name: string; type: string; cName: string }[],
    };
  };
}

// для каждой операции свои параметры с типами должны быть.
// специальный маппер типов для ts где ID === string

import {
  getFieldsForAcl,
  singleStoredRelationsExistingIn,
  mutableFields,
  identityFields,
  getRelationNames,
  relationFieldsExistsIn,
  oneUniqueInIndex,
  complexUniqueIndex,
} from '../../queries';

export function mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow): MapperOutupt {
  const singleStoredRelations = singleStoredRelationsExistingIn(pack);
  let fieldsAcl = getFieldsForAcl(aclAllow)(role)(entity);
  return {
    name: entity.name,
    ownerFieldName: decapitalize(entity.name),
    relEntities: fieldsAcl
      .filter(relationFieldsExistsIn(pack))
      .map(f => f.relation.ref.entity)
      .reduce((prev, curr) => {
        if (prev.indexOf(curr) === -1) {
          prev.push(curr);
        }
        return prev;
      }, [])
      .map(entity => pack.get(entity))
      .map(entity => {
        let fieldsEntityAcl = getFieldsForAcl(aclAllow)(role)(entity);
        return {
          name: entity.name,
          findQuery: decapitalize(entity.name),
          ownerFieldName: decapitalize(entity.name),
          unique: {
            args: [
              { name: 'id', type: 'string' },
              ...fieldsEntityAcl
                .filter(identityFields)
                .filter(oneUniqueInIndex(entity))
                .map(f => ({
                  name: f.name,
                  type: mapToGraphqlTypes(f.type),
                })),
            ],
            find: [
              ...fieldsEntityAcl
                .filter(identityFields)
                .filter(oneUniqueInIndex(entity))
                .map(f => ({
                  name: f.name,
                  type: mapToGraphqlTypes(f.type),
                  cName: capitalize(f.name),
                })),
            ],
            complex: complexUniqueIndex(entity).map(i => {
              let fields = Object.keys(i.fields)
                .map(fn => entity.fields.get(fn))
                .map(f => ({
                  name: f.name,
                  uName: capitalize(f.name),
                  type: mapToGraphqlTypes(f.type),
                })).sort((a, b) => {
                  if (a.name > b.name) return 1
                  else if (a.name < b.name) return -1;
                  else return 0;
                });
              return {
                name: i.name,
                fields,
              };
            }),
          },
        }
      }),

    complexUnique: complexUniqueIndex(entity).map(i => {
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
        });;
      return {
        name: i.name,
        fields,
      };
    }),
    relations: fieldsAcl
      .filter(relationFieldsExistsIn(pack))
      .map(f => {
        let verb = f.relation.verb;
        return {
          persistent: f.persistent,
          derived: f.derived,
          field: f.name,
          name: f.relation.fullName,
          cField: capitalize(f.name),
          single: (verb === 'BelongsTo' || verb === 'HasOne'),
          ref: {
            entity: f.relation.ref.entity,
            fieldName: decapitalize(f.relation.ref.entity),
          },
        };
      }),
    args: {
      create: {
        args: [
          { name: 'id', type: 'string' },
          ...fieldsAcl
            .filter(f => /*singleStoredRelations(f) ||*/ mutableFields(f))
            .map(f => ({
              name: f.name,
              type: mapToTSTypes(f.type),
            }))],
        find: fieldsAcl
          .filter(f => /*singleStoredRelations(f) ||*/ mutableFields(f))
          .map(f => ({
            name: f.name,
            type: mapToTSTypes(f.type),
          })),
      },
      update: {
        args: [
          { name: 'id', type: 'string' },
          ...fieldsAcl
            .filter(f => /*singleStoredRelations(f) ||*/ mutableFields(f))
            .map(f => ({
              name: f.name,
              type: mapToTSTypes(f.type),
            }))],
        find: [
          ...fieldsAcl
            .filter(identityFields)
            .filter(oneUniqueInIndex(entity))
            .map(f => ({
              name: f.name,
              type: mapToTSTypes(f.type),
              cName: capitalize(f.name),
            }))],
        payload: fieldsAcl
          .filter(f => /*singleStoredRelations(f) ||*/ mutableFields(f))
          .map(f => ({
            name: f.name,
            type: mapToTSTypes(f.type),
          })),
      },
      remove: {
        args: [
          { name: 'id', type: 'string' },
          ...fieldsAcl
            .filter(identityFields)
            .filter(oneUniqueInIndex(entity))
            .map(f => ({
              name: f.name,
              type: mapToTSTypes(f.type),
            }))],
        find: [
          ...fieldsAcl
            .filter(identityFields)
            .filter(oneUniqueInIndex(entity))
            .map(f => ({
              name: f.name,
              type: mapToTSTypes(f.type),
              cName: capitalize(f.name),
            }))],
      },
    },
  };
}
