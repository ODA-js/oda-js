<#@ context 'entity' -#>
import * as log4js from 'log4js';
let logger = log4js.getLogger('graphql:mutations:#{entity.name}');

import {
  fromGlobalId,
  toGlobalId,
} from 'graphql-relay';

import { mutateAndGetPayload, idToCursor, Filter } from 'oda-api-graphql';
import { pubsub } from '../../../../../model/pubsub';
import { withFilter } from 'graphql-subscriptions';

function filterIt(args, payload, queryCheck) {
  let res = false;
  if (args && args.mutation) {
    res = payload.mutation === args.mutation;
  } else {
    res = true;
  }
  if (res) {
    res = queryCheck(payload.node);
  }
  return res;
}

export const subscriptions = {
  #{entity.name}: {
    subscribe: Filter.withContext(withFilter(() => pubsub.asyncIterator('#{entity.name}'), ({ #{entity.name} }, args, context, info) =>
    {
      let allow = context.connectors.#{entity.name}.canView(#{entity.name}.node);
      if (allow) {
        filterIt(args, #{entity.name}, context.queryCheck))),
      } else {
        return false;
      }
    }
  },
};

export const resolver = {
  <#if(entity.connections.length > 0){#>
  #{entity.name}SubscriptionPayload : {
    __resolveType(obj, context, info) {
      if (
  <#-entity.unionCheck.forEach((fname, index)=>{-#><#-if(index > 0){#> || <#}-#>obj.#{fname}
  <#-})-#>) {
        return "Update#{entity.name}SubscriptionPayload";
      }
  <#-for ( let connection of entity.connections ) {#>
      if (obj.args && obj.args.#{entity.ownerFieldName} && obj.args.#{connection.refFieldName}) {
        return "#{connection.name}SubscriptionPayload";
      }
  <#-}#>
      return null;
    }
  },
  <#}#>
};
