import { Entity, ModelPackage } from 'oda-model';
import { capitalize, decapitalize, mapToGraphqlTypes, printRequired } from '../../../utils';
import { Factory } from 'fte.js';
import { persistentRelations, getFieldsForAcl } from '../../../queries';

export const template = 'entity/connections/subscriptions/resolver.ts.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow) {
  return te.run(mapper(entity, pack, role, aclAllow), template);
}

export interface MapperOutput {
  name: string;
  plural: string;
  ownerFieldName: string;
  connections: {
    refFieldName: string;
    name: string;
    fields: {
      name: string;
      type: string;
    }[];
  }[];
}

export function mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow): MapperOutput {
  return {
    name: entity.name,
    plural: entity.plural,
    ownerFieldName: decapitalize(entity.name),
    connections: getFieldsForAcl(aclAllow)(role)(entity)
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
