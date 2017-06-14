import { Entity, ModelPackage } from 'oda-model';
import { Factory } from 'fte.js';
import * as schema from './index';

export const template = 'entity/type.index.ts.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, allowAcl) {
  return te.run(mapper(entity, pack, role, allowAcl), template);
}

export interface MapperOutupt {
  name: string;
  partials: {
    'enums': schema.type.enums.MapperOutput;
    'type': schema.type.entry.MapperOutput;
    'connections.types': schema.connections.types.MapperOutput;
    'connections.mutation': schema.connections.mutations.types.MapperOutput;
    'connections.mutation.entry': schema.connections.mutations.entry.MapperOutput;
    'connections.subscription': schema.connections.mutations.types.MapperOutput;
    'connections.subscription.entry': schema.connections.mutations.entry.MapperOutput;
    'mutation.types': schema.mutations.types.MapperOutput;
    'mutation.entry': schema.mutations.entry.MapperOutput;
    'subscription.types': schema.mutations.types.MapperOutput;
    'subscription.entry': schema.mutations.entry.MapperOutput;
    'query.entry': schema.query.entry.MapperOutput;
    'viewer.entry': schema.viewer.entry.MapperOutput;
  };
}

export function mapper(entity: Entity, pack: ModelPackage, role: string, allowAcl): MapperOutupt {
  return {
    name: entity.name,
    partials: {
      'enums': schema.type.enums.mapper(entity, pack, role, allowAcl),
      'type': schema.type.entry.mapper(entity, pack, role, allowAcl),
      'connections.types': schema.connections.types.mapper(entity, pack, role, allowAcl),
      'connections.mutation': schema.connections.mutations.types.mapper(entity, pack, role, allowAcl),
      'connections.mutation.entry': schema.connections.mutations.entry.mapper(entity, pack, role, allowAcl),
      'connections.subscription': schema.connections.subscriptions.types.mapper(entity, pack, role, allowAcl),
      'connections.subscription.entry': schema.connections.subscriptions.entry.mapper(entity, pack, role, allowAcl),
      'mutation.types': schema.mutations.types.mapper(entity, pack, role, allowAcl),
      'mutation.entry': schema.mutations.entry.mapper(entity, pack, role, allowAcl),
      'subscription.types': schema.subscriptions.types.mapper(entity, pack, role, allowAcl),
      'subscription.entry': schema.subscriptions.entry.mapper(entity, pack, role, allowAcl),
      'query.entry': schema.query.entry.mapper(entity, pack, role, allowAcl),
      'viewer.entry': schema.viewer.entry.mapper(entity, pack, role, allowAcl),
    },
  };
}
