import { Entity, ModelPackage, BelongsToMany } from 'oda-model';
import { mapToGraphqlTypes, printRequired, decapitalize, capitalize } from './../../utils';

import { Factory } from 'fte.js';

export const template = 'entity/mutations/types.graphql.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow) {
  return te.run(mapper(entity, pack, role, aclAllow), template);
}

export interface MapperOutput {
  name: string;
  plural: string;
  payloadName: string;
  relations: {
    derived: boolean;
    persistent: boolean;
    field: string;
    single: boolean,
    ref: {
      entity: string;
    }
  }[];
  create: {
    name: string;
    type: string;
  }[];
  update: {
    name: string;
    type: string;
  }[];
  unique: {
    name: string;
    type: string;
  }[];
}

import {
  getFieldsForAcl,
  identityFields,
  mutableFields,
  updatePaylopadFields,
  relationFieldsExistsIn,
  getRelationNames,
} from '../../queries';

export function mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow): MapperOutput {
  let fieldsAcl = getFieldsForAcl(aclAllow)(role)(entity);
  return {
    name: entity.name,
    plural: entity.plural,
    payloadName: decapitalize(entity.name),
    relations: fieldsAcl
      .filter(relationFieldsExistsIn(pack))
      .map(f => {
        let verb = f.relation.verb;
        return {
          persistent: f.persistent,
          derived: f.derived,
          field: f.name,
          single: (verb === 'BelongsTo' || verb === 'HasOne'),
          ref: {
            entity: f.relation.ref.entity,
          },
        };
      }),
    create: [
      { name: 'id', type: 'ID', required: false },
      ...fieldsAcl
        .filter(mutableFields)]
      .map(f => ({
        name: f.name,
        type: `${mapToGraphqlTypes(f.type)}${printRequired(f)}`,
      })),
    update: fieldsAcl
      .filter(updatePaylopadFields)
      .map(f => ({
        name: f.name,
        type: `${mapToGraphqlTypes(f.type)}`,
      })),
    unique: [
      { name: 'id', type: 'ID' },
      ...fieldsAcl
        .filter(identityFields)
        .map(f => ({
          name: f.name,
          type: mapToGraphqlTypes(f.type),
        }))],
  };
}


