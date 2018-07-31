import { Entity, ModelPackage } from 'oda-model';
import { printRequired, decapitalize, capitalize } from './../../utils';

import { Factory } from 'fte.js';

export const template = 'entity/subscriptions/types.graphql.njs';

export function generate(
  te: Factory,
  entity: Entity,
  pack: ModelPackage,
  role: string,
  aclAllow,
  typeMapper: { [key: string]: (string) => string },
) {
  return te.run(mapper(entity, pack, role, aclAllow, typeMapper), template);
}

export interface MapperOutput {
  name: string;
  plural: string;
  ownerFieldName: string;
  update: {
    name: string;
    type: string;
  }[];
  connections: {
    refFieldName: string;
    name: string;
    fields: {
      name: string;
      type: string;
    }[];
  }[];
}

import {
  getFieldsForAcl,
  identityFields,
  mutableFields,
  persistentRelations,
  getFields,
  idField,
} from '../../queries';

export function mapper(
  entity: Entity,
  pack: ModelPackage,
  role: string,
  aclAllow,
  typeMapper: { [key: string]: (string) => string },
): MapperOutput {
  let fieldsAcl = getFieldsForAcl(role, pack)(aclAllow, entity);
  let ids = getFields(entity).filter(idField);

  return {
    name: entity.name,
    plural: entity.plural,
    ownerFieldName: decapitalize(entity.name),
    update: [
      ...ids.map(f => ({
        name: f.name,
        type: 'ID',
        required: false,
      })),
      ...fieldsAcl.filter(mutableFields),
    ].map(f => ({
      name: f.name,
      type: `${typeMapper.graphql(f.type)}`,
    })),
    connections: fieldsAcl.filter(persistentRelations(pack)).map(f => {
      let relFields = [];
      if (f.relation.fields && f.relation.fields.size > 0) {
        f.relation.fields.forEach(field => {
          relFields.push({
            name: field.name,
            type: `${typeMapper.graphql(field.type)}${printRequired(field)}`,
          });
        });
      }
      let sameEntity = entity.name === f.relation.ref.entity;
      let refFieldName = `${f.relation.ref.entity}${
        sameEntity ? capitalize(f.name) : ''
      }`;
      return {
        refFieldName: decapitalize(refFieldName),
        name: f.relation.fullName,
        fields: relFields,
        single: f.relation.single,
      };
    }),
  };
}
