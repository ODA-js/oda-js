import { Entity, ModelPackage } from 'oda-model';
import { capitalize, decapitalize, mapToTSTypes } from '../../utils';
import { Factory } from 'fte.js';

export const template = 'entity/mutations/resolver.ts.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow) {
  return te.run(mapper(entity, pack, role, aclAllow), template);
}

export interface MapperOutupt {
  name: string;
  ownerFieldName: string;
  complexUnique: { name: string, fields: { name: string, uName: string, type: string }[] }[];
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
  oneUniqueInIndex,
  complexUniqueIndex,
} from '../../queries';

export function mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow): MapperOutupt {
  const singleStoredRelations = singleStoredRelationsExistingIn(pack);
  let fieldsAcl = getFieldsForAcl(aclAllow)(role)(entity);
  return {
    name: entity.name,
    ownerFieldName: decapitalize(entity.name),
    complexUnique: complexUniqueIndex(entity).map(i => {
      let fields = Object.keys(i.fields)
        .map(fn => entity.fields.get(fn))
        .map(f => ({
          name: f.name,
          uName: capitalize(f.name),
          type: mapToTSTypes(f.type),
        }));
      return {
        name: i.name,
        fields,
      };
    }),
    args: {
      create: {
        args: [
          { name: 'id', type: 'string' },
          ...fieldsAcl
            .filter(f => singleStoredRelations(f) || mutableFields(f))
            .map(f => ({
              name: f.name,
              type: mapToTSTypes(f.type),
            }))],
        find: fieldsAcl
          .filter(f => singleStoredRelations(f) || mutableFields(f))
          .map(f => ({
            name: f.name,
            type: mapToTSTypes(f.type),
          })),
      },
      update: {
        args: [
          { name: 'id', type: 'string' },
          ...fieldsAcl
            .filter(f => singleStoredRelations(f) || mutableFields(f))
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
          .filter(f => singleStoredRelations(f) || mutableFields(f))
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
