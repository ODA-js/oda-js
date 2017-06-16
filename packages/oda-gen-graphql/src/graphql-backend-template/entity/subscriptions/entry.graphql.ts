import { Entity, ModelPackage } from 'oda-model';
import { Factory } from 'fte.js';

export const template = 'entity/subscriptions/entry.graphql.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow) {
  return te.run(mapper(entity, pack, role, aclAllow), template);
}

export interface MapperOutput {
  name: string;
}

export function mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow): MapperOutput {
  return {
    name: entity.name,
  };
}


