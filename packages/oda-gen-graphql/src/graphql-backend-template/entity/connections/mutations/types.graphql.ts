import { Entity, ModelPackage } from 'oda-model';
import { capitalize, decapitalize, printRequired } from '../../../utils';
import { Factory } from 'fte.js';
import {
  persistentRelations,
  getFieldsForAcl,
  memoizeEntityMapper,
} from '../../../queries';

export const template = 'entity/connections/mutations/types.graphql.njs';

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
  connections: {
    refFieldName: string;
    name: string;
    fields: {
      name: string;
      type: string;
    }[];
  }[];
}

export const mapper = memoizeEntityMapper(template, _mapper);

export function _mapper(
  entity: Entity,
  pack: ModelPackage,
  role: string,
  aclAllow,
  typeMapper: { [key: string]: (string) => string },
): MapperOutput {
  return {
    name: entity.name,
    plural: entity.plural,
    ownerFieldName: decapitalize(entity.name),
    connections: getFieldsForAcl(role, pack)(aclAllow, entity)
      .filter(persistentRelations(pack))
      .map(f => {
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
