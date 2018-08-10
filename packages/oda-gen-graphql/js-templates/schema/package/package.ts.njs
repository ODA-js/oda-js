<#@ chunks "$$$main$$$" -#>
<#@ alias 'schema/package' #>
<#@ context 'pkg' #>

#{partial(pkg, 'node-interface')}
#{partial(pkg, 'viewer')}

<#- chunkStart(`./index.ts`); -#>
<#- pkg.entities.forEach( ent => {#>
import #{ent.name} from './#{ent.name}';
<#-})#>
import Node from './node';
import Viewer from './viewer';
import Types from './_Types';
import Scalars from './scalars';
import Directives from './directives';
import Enums from './enums';
import Queries from './queries';
import Mutations from './mutations';
import { Schema } from 'oda-gen-common';
import gql from 'graphql-tag';

export {
  Node,
  Viewer,
  Types,
  Directives,
  Scalars,
  Enums,
  Queries,
  Mutations,
<#- pkg.entities.forEach( ent => {#>
  #{ent.name},
<#-})#>
}

export default new Schema({
  name: '#{pkg.name}',
  schema: gql`
    schema {
      query: RootQuery
      mutation: RootMutation
      subscription: RootSubscription
    }
  `,
  items: [
    Node,
    Viewer,
    Types,
    Directives,
    Scalars,
    Enums,
    Queries,
    Mutations,
<#- pkg.entities.forEach( ent => {#>
    #{ent.name},
<#-})#>],
})

<#- chunkStart(`./common.ts`); -#>

import * as log4js from 'log4js';
let logger = log4js.getLogger('graphql:query');
import * as get from 'lodash/get';

import { pubsub } from '../../model/pubsub';

export function filterIt(payload, queryCheck) {
  return queryCheck(payload);
}

import {
  emptyConnection,
  idToCursor,
  pagination,
  detectCursorDirection,
  consts,
  mutateAndGetPayload,
  Filter,
} from 'oda-api-graphql';
import { lib } from 'oda-gen-common';

import { PubSubEngine, withFilter } from 'graphql-subscriptions';

const { selectionTree: traverse } = lib;

import { utils, getWithType } from 'oda-api-graphql';
import RegisterConnectors from '../../graphql-gen/data/registerConnectors';

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
  Directive,
  Subscription,
  ScalarResolver,
  Type,
  Union,
  Schema,
  UnionInterfaceResolverFunction,
// } from '../typedef';
} from 'oda-gen-common';

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
  Directive,
  ScalarResolver,
  Subscription,
  Type,
  Union,
  Schema,
  UnionInterfaceResolverFunction,
  getWithType,
};

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
  withFilter,
  Filter,
  pubsub,
  mutateAndGetPayload,
};

#{partial(pkg,'scalars/index')}
#{partial(pkg,'directives/index')}
#{partial(pkg,'enums/index')}
#{partial(pkg,'queries/index')}
#{partial(pkg,'mutations/index')}
#{partial(pkg,'unions/index')}
#{partial(pkg,'data-connectors/index')}