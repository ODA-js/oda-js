import { Entity, ModelPackage, BelongsToMany } from 'oda-model';
import { capitalize, decapitalize, mapToTSTypes, mapToGraphqlTypes } from '../../utils';
import { Factory } from 'fte.js';

export const template = 'entity/dataPump/queries.graphql.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow) {
  return te.run(mapper(entity, pack, role, aclAllow), template);
}

export interface MapperOutupt {
  name: string;
  plural: string;
  dcPlural: string;
  ownerFieldName: string;
  // unique: {
  //   args: { name: string, type: string }[];
  //   find: { name: string, type: string, cName: string }[];
  //   complex: { name: string, fields: { name: string, uName: string, type: string }[] }[];
  // }
  complexUnique: { name: string, fields: { name: string, uName: string; type: string }[] }[];
  unique: { name: string, cName: string; type: string; }[];
  fields: { name: string }[]
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
    dcPlural: decapitalize(entity.plural),
    plural: entity.plural,
    complexUnique: complexUniqueIndex(entity).map(i => {
      let fields = Object.keys(i.fields)
        .map(fn => entity.fields.get(fn))
        .map(f => ({
          name: f.name,
          type: mapToGraphqlTypes(f.type),
          uName: capitalize(f.name),
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
    unique: [
      { name: 'id', cName: 'Id', type: 'ID' },
      ...fieldsAcl
        .filter(identityFields)
        .filter(oneUniqueInIndex(entity))
        .map(f => ({
          name: f.name,
          type: mapToGraphqlTypes(f.type),
          cName: capitalize(f.name),
        }))],
    fields: [
      { name: 'id' },
      ...fieldsAcl
        .filter(f => mutableFields(f))
        .map(f => ({
          name: f.name,
        }))],
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
      }).filter(f => f.persistent),
  };
}
