import { Entity, ModelPackage } from 'oda-model';
import { mapToGraphqlTypes, printRequired, decapitalize } from './../../utils';

import { Factory } from 'fte.js';

export const template = 'entity/subscriptions/types.graphql.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow) {
  return te.run(mapper(entity, pack, role, aclAllow), template);
}

export interface MapperOutput {
  name: string;
  plural: string;
  payloadName: string;
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
} from '../../queries';

export function mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow): MapperOutput {
  let fieldsAcl = getFieldsForAcl(aclAllow)(role)(entity);
  return {
    name: entity.name,
    plural: entity.plural,
    payloadName: decapitalize(entity.name),
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


