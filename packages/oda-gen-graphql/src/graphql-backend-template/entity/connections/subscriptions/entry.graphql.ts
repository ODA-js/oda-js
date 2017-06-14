import { Entity, ModelPackage } from 'oda-model';
import { Factory } from 'fte.js';
import { persistentRelations, getFieldsForAcl } from '../../../queries';
export const template = 'entity/connections/subscriptions/entry.graphql.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow) {
  return te.run(mapper(entity, pack, role, aclAllow), template);
}

export interface MapperOutput {
  name: string;
  connections: {
    relationName: string;
  }[];
}

export function mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow): MapperOutput {
  return {
    name: entity.name,
    connections: getFieldsForAcl(aclAllow)(role)(entity)
      .filter(persistentRelations(pack))
      .map(f => ({
        relationName: f.relation.fullName,
      })),
  };
}
