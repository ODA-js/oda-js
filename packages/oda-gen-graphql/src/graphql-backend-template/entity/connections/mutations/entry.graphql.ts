import { Entity, ModelPackage } from 'oda-model';
import { Factory } from 'fte.js';
import { persistentRelations, getFieldsForAcl } from '../../../queries';
export const template = 'entity/connections/mutations/entry.graphql.njs';

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
  connections: {
    relationName: string;
  }[];
}

export function mapper(
  entity: Entity,
  pack: ModelPackage,
  role: string,
  aclAllow,
  typeMapper: { [key: string]: (string) => string },
): MapperOutput {
  return {
    name: entity.name,
    connections: getFieldsForAcl(aclAllow, role, pack)(entity)
      .filter(persistentRelations(pack))
      .map(f => ({
        relationName: f.relation.fullName,
      })),
  };
}
