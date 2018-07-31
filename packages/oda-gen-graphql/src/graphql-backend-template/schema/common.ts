import { Entity, ModelPackage, BelongsToMany } from 'oda-model';
import { Factory } from 'fte.js';
export const template = 'schema/common.ts.njs';

import * as entityMappers from './../entity';
import * as ensure from './ensure';

type MapperOutput = {};

export function prepare(
  entity: Entity,
  pack: ModelPackage,
  role: string,
  aclAllow,
  typeMapper: { [key: string]: (string) => string },
  adapter: string,
) {
  return {
    ctx: mapper(entity, pack, role, aclAllow, typeMapper, adapter),
    template,
  };
}

export function mapper(
  entity: Entity,
  pack: ModelPackage,
  role: string,
  aclAllow,
  typeMapper: { [key: string]: (string) => string },
  adapter: string,
): MapperOutput {
  return {
    name: entity.name,
    type: {
      resolver: entityMappers.type.resolver.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
      ),
      entry: entityMappers.type.entry.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
      ),
    },
    connections: {
      types: entityMappers.connections.types.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
      ),
      mutations: {
        resolver: entityMappers.connections.mutations.resolver.mapper(
          entity,
          pack,
          role,
          aclAllow,
          typeMapper,
        ),
        types: entityMappers.connections.mutations.types.mapper(
          entity,
          pack,
          role,
          aclAllow,
          typeMapper,
        ),
      },
    },
    mutations: {
      resolver: entityMappers.mutations.resolver.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
      ),
      types: entityMappers.mutations.types.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
      ),
    },
    query: {
      resolver: entityMappers.query.resolver.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
        adapter,
      ),
      entry: entityMappers.query.entry.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
      ),
      sortOrder: entityMappers.type.enums.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
      ),
      filter: entityMappers.type.entry.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
      ),
    },
    ensure: ensure.mapper(entity, pack, role, aclAllow, typeMapper),
  };
}
