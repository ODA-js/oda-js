import { Entity, ModelPackage, FieldType } from 'oda-model';
export const template = 'schema/common.ts.njs';

import * as entityMappers from './../entity';
import * as ensure from './ensure';
import AclDefault from '../../acl';
import { fields } from '../queries';

type MapperOutput = {};

export function prepare(
  entity: Entity,
  pack: ModelPackage,
  role: string,
  aclAllow,
  typeMapper: { [key: string]: (i: FieldType) => string },
  adapter: string,
) {
  return {
    ctx: mapper(entity, pack, role, aclAllow, typeMapper, adapter),
    template,
  };
}
/// здесь нужно строить ACL свою для каждого пакета... и тут как раз и включаются значения по-умолчанию
export type ACLInput = {
  create: string | string[];
  read: string | string[];
  update: string | string[];
  delete: string | string[];
  subscribe: string | string[];
  type: string | string[];
  relations?:
    | {
        [relation: string]:
          | string
          | string[]
          | {
              query: string | string[];
              mutate: string | string[];
            };
      }
    | boolean;
  fields?:
    | {
        [relation: string]:
          | string
          | string[]
          | {
              query: string | string[];
              mutate: string | string[];
            };
      }
    | boolean;
};

export type ACLOutput = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  subscribe: boolean;
  type: boolean;
  relations?:
    | {
        [relation: string]:
          | boolean
          | {
              // делать запросы к данным по связям
              query: boolean;
              // использовать во всех мутациях
              mutate: boolean;
              // просто оставить и взять из json
              embed: boolean;
            };
      }
    | boolean;
  fields?:
    | {
        [relation: string]:
          | boolean
          | {
              // запрашивать в запросах
              query: boolean;
              // обновлять мутациями
              mutate: boolean;
            };
      }
    | boolean;
};

function getRels(
  acl: Required<ACLInput['relations']>,
  role: string,
  defaults: Required<ACLOutput['relations']>,
): ACLOutput['relations'] {
  if (typeof acl === 'boolean') {
    return acl;
  }
  if (acl && typeof acl === 'object') {
    const result = {};
    for (const relName in Object.keys(acl)) {
      const rel = acl[relName];
      if (Array.isArray(rel) || typeof rel === 'string') {
        result[relName] = isIn(rel, role);
      } else if (typeof rel === 'object') {
        result[relName] = {
          query: isIn(rel.query, role),
          mutate: isIn(rel.mutate, role),
        };
      }
    }
    return result;
  } else {
    return defaults;
  }
}

function isIn(source: string | string[], role: string) {
  if (typeof source === 'string') {
    return source === role;
  } else {
    return source.some(r => r === role);
  }
}

function buildACL(acl: ACLInput, role: string, defaults: ACLOutput): ACLOutput {
  const result: ACLOutput = {
    read: (acl && acl.read && isIn(acl.read, role)) || defaults.read,
    create:
      (acl && acl.create && isIn(acl.create, role)) ||
      defaults.create ||
      defaults.read,
    update:
      (acl && acl.update && isIn(acl.update, role)) ||
      defaults.update ||
      defaults.read,
    delete:
      (acl && acl.delete && isIn(acl.delete, role)) ||
      defaults.delete ||
      defaults.read,
    subscribe:
      (acl && acl.subscribe && isIn(acl.subscribe, role)) ||
      defaults.subscribe ||
      defaults.read,
    type:
      (acl && acl.type && isIn(acl.type, role)) ||
      defaults.type ||
      defaults.read,
    relations:
      (acl && acl.relations && acl.relations
        ? getRels(acl.relations, role, defaults.relations)
        : defaults.relations) || defaults.read,
  };
  return result;
}

function expandEntityACL(
  entity: Entity,
): {
  relations: Required<ACLOutput['relations']>;
  fields: Required<ACLOutput['relations']>;
} {
  const result = { relations: {}, fields: {} };
  entity.fields.forEach(field => {
    const acl = field.metadata.acl;
    if (fields(field)) {
      result.fields[field.name] = true;
      if (acl) {
        result.fields[field.name] = {};
        if (acl.read) {
          if (Array.isArray(acl.read)) {
            result.fields[field.name].query = [...acl.read];
          } else {
            result.fields[field.name].query = [acl.read];
          }
          if (result.fields[field.name].query.indexOf('system') < 0) {
            result.fields[field.name].query.push('system');
          }
        } else {
          result.fields[field.name] = { query: ['system'] };
        }
        if (acl.update) {
          if (Array.isArray(acl.update)) {
            result.fields[field.name].mutate = [...acl.update];
          } else {
            result.fields[field.name].mutate = [acl.update];
          }
          if (result.fields[field.name].mutate.indexOf('system') < 0) {
            result.fields[field.name].mutate.push('system');
          }
        } else {
          result.fields[field.name].mutate = ['system'];
        }
      }
    } else {
      result.relations[field.name] = true;
      if (acl) {
        result.relations[field.name] = {};
        if (acl.read) {
          if (Array.isArray(acl.read)) {
            result.relations[field.name].query = [...acl.read];
          } else {
            result.relations[field.name].query = [acl.read];
          }
          if (result.relations[field.name].query.indexOf('system') < 0) {
            result.relations[field.name].query.push('system');
          }
        } else {
          result.relations[field.name] = { query: ['system'] };
        }
        if (acl.update) {
          if (Array.isArray(acl.update)) {
            result.relations[field.name].mutate = [...acl.update];
          } else {
            result.relations[field.name].mutate = [acl.update];
          }
          if (result.relations[field.name].mutate.indexOf('system') < 0) {
            result.relations[field.name].mutate.push('system');
          }
        } else {
          result.relations[field.name].mutate = ['system'];
        }
        if (acl.shape) {
          if (Array.isArray(acl.shape)) {
            result.relations[field.name].shape = [...acl.shape];
          } else {
            result.relations[field.name].shape = [acl.shape];
          }
          // remove all
          result.relations[field.name].shape.forEach(profile => {
            if (result.relations[field.name].query.indexOf(profile) > -1) {
              result.relations[field.name].query.splice(
                result.relations[field.name].query.indexOf(profile),
                1,
              );
            }
            if (result.relations[field.name].mutate.indexOf(profile) > -1) {
              result.relations[field.name].mutate.splice(
                result.relations[field.name].mutate.indexOf(profile),
                1,
              );
            }
          });
        } else {
          result.relations[field.name].shape = [];
        }
      }
    }
  });
  return result;
}

export function mapper(
  entity: Entity,
  pack: ModelPackage,
  role: string,
  aclAllow,
  typeMapper: { [key: string]: (i: FieldType) => string },
  adapter: string,
): MapperOutput {
  const eACL = expandEntityACL(entity);
  const acl = buildACL(entity.metadata.acl, role, pack.metadata.acl);

  return {
    name: entity.name,
    acl,
    type: {
      resolver: entityMappers.type.resolver.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
        adapter,
      ),
      entry: entityMappers.type.entry.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
        adapter,
      ),
    },
    connections: {
      types: entityMappers.connections.types.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
        adapter,
      ),
      mutations: {
        resolver: entityMappers.connections.mutations.resolver.mapper(
          entity,
          pack,
          role,
          aclAllow,
          typeMapper,
          adapter,
        ),
        types: entityMappers.connections.mutations.types.mapper(
          entity,
          pack,
          role,
          aclAllow,
          typeMapper,
          adapter,
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
        adapter,
      ),
      types: entityMappers.mutations.types.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
        adapter,
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
        adapter,
      ),
      sortOrder: entityMappers.type.enums.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
        adapter,
      ),
      filter: entityMappers.type.entry.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
        adapter,
      ),
    },
    subscriptions: {
      ...entityMappers.subscriptions.resolver.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
        adapter,
      ),
      ...entityMappers.subscriptions.types.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
        adapter,
      ),
    },
    ensure: ensure.mapper(entity, pack, role, aclAllow, typeMapper, adapter),
    data: {
      name: entity.name,
      adapter,
      schema: entityMappers.data.adapter.schema.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
        adapter,
      ),
      connector: entityMappers.data.adapter.connector.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
        adapter,
      ),
      model: entityMappers.data.types.model.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
        adapter,
      ),
    },
    dataPump: {
      config: entityMappers.dataPump.config.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
        adapter,
      ),
      queries: entityMappers.dataPump.queries.mapper(
        entity,
        pack,
        role,
        aclAllow,
        typeMapper,
        adapter,
      ),
    },
  };
}
