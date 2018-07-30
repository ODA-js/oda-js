<#@ chunks "$$$main$$$" -#>
<#@ context 'pkg' #>

<#- chunkStart(`../../gql/common.ts`); -#>

import * as log4js from 'log4js';
let logger = log4js.getLogger('graphql:query');
import * as get from 'lodash/get';

import {
  globalIdField,
  emptyConnection,
  idToCursor,
  pagination,
  detectCursorDirection,
  consts,
  mutateAndGetPayload,
} from 'oda-api-graphql';
import { lib } from 'oda-gen-common';

import { fromGlobalId, toGlobalId } from 'oda-isomorfic';

import { PubSubEngine } from 'graphql-subscriptions';

const { selectionTree: traverse } = lib;

import { utils } from 'oda-api-graphql';
import RegisterConnectors from '../graphql-gen/data/registerConnectors';

const { validId } = utils;

<#- pkg.entities.forEach( ent => {#>
export * from './#{ent.name}/helpers';
<#-})#>

import {
  Enum,
  Input,
  Interface,
  ModelType,
  Mutation,
  ObjectResolver,
  EnumResolver,
  FieldDefinition,
  IGQLInput,
  ModelTypes,
  Query,
  Resolver,
  ResolverFunction,
  Scalar,
  ScalarResolver,
  Type,
  Union,
  Schema,
  UnionInterfaceResolverFunction,
} from './typedef';

export {
  Enum,
  Input,
  Interface,
  ModelType,
  Mutation,
  ObjectResolver,
  EnumResolver,
  FieldDefinition,
  IGQLInput,
  ModelTypes,
  Query,
  Resolver,
  ResolverFunction,
  Scalar,
  ScalarResolver,
  Type,
  Union,
  Schema,
  UnionInterfaceResolverFunction,
};

export function getValue(value) {
  if (typeof value === 'string') {
    return validId(value) ? value : fromGlobalId(value).id;
  } else {
    return value;
  }
}

export async function fixCount(
  length: number,
  cursor: { skip?: number; limit?: number },
  getCount: () => Promise<Number>,
) {
  const count = await getCount();
  if (count > 0) {
    if (length == cursor.limit) {
      return count;
    }
    if (length < cursor.limit) {
      return cursor.skip + length;
    } else {
      return count;
    }
  }
  return count;
}

export {
  RegisterConnectors,
  validId,
  get,
  traverse,
  pagination,
  detectCursorDirection,
  idToCursor,
  logger,
  consts,
  emptyConnection,
  PubSubEngine,
  mutateAndGetPayload,
  fromGlobalId,
  toGlobalId,
  globalIdField,
};
