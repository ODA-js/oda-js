import { Entity, ModelPackage } from 'oda-model';
import { mapToGraphqlTypes, printRequired, decapitalize, capitalize } from './../../utils';

import { Factory } from 'fte.js';

export const template = 'entity/subscriptions/types.graphql.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow) {
  return te.run(mapper(entity, pack, role, aclAllow), template);
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
  updatePaylopadFields,
  persistentRelations,
} from '../../queries';

export function mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow): MapperOutput {
  let fieldsAcl = getFieldsForAcl(aclAllow)(role)(entity);
  return {
    name: entity.name,
    plural: entity.plural,
    ownerFieldName: decapitalize(entity.name),
    update: fieldsAcl
      .filter(updatePaylopadFields)
      .map(f => ({
        name: f.name,
        type: `${mapToGraphqlTypes(f.type)}`,
      })),
    connections: fieldsAcl
      .filter(persistentRelations(pack))
      .map(f => {
        let relFields = [];
        if (f.relation.fields && f.relation.fields.length > 0) {
          f.relation.fields.forEach(field => {
            relFields.push({
              name: field.name,
              type: `${mapToGraphqlTypes(field.type)}${printRequired(field)}`,
            });
          });
        }
        let sameEntity = entity.name === f.relation.ref.entity;
        let refFieldName = `${f.relation.ref.entity}${sameEntity ? capitalize(f.name) : ''}`;
        return {
          refFieldName: decapitalize(refFieldName),
          name: f.relation.fullName,
          fields: relFields,
          single: f.relation.single,
        };
      },
    ),
  };
}

