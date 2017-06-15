import { Entity, ModelPackage } from 'oda-model';
import { capitalize, decapitalize, mapToTSTypes, mapToGraphqlTypes, printRequired } from '../../utils';
import { Factory } from 'fte.js';

export const template = 'entity/subscriptions/resolver.ts.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow) {
  return te.run(mapper(entity, pack, role, aclAllow), template);
}

export interface MapperOutupt {
  name: string;
  ownerFieldName: string;
  unionCheck: string[];
  connections: {
    refFieldName: string;
    name: string;
    fields: {
      name: string;
      type: string;
    }[];
  }[];
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
  updatePaylopadFields,
  persistentRelations,
} from '../../queries';

export function mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow): MapperOutupt {
  const singleStoredRelations = singleStoredRelationsExistingIn(pack);
  let fieldsAcl = getFieldsForAcl(aclAllow)(role)(entity);
  return {
    name: entity.name,
    ownerFieldName: decapitalize(entity.name),
    unionCheck: fieldsAcl
      .filter(updatePaylopadFields)
      .map(f => f.name),
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
