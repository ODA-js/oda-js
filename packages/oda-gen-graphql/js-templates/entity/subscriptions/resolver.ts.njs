<#@ context 'entity' -#>
import * as log4js from 'log4js';
let logger = log4js.getLogger('graphql:mutations:#{entity.name}');

import {
  fromGlobalId,
  toGlobalId,
} from 'graphql-relay';

import { mutateAndGetPayload, idToCursor } from 'oda-api-graphql';
import { pubsub } from '../../../../../model/pubsub';
import { withFilter } from 'graphql-subscriptions';

export const subscriptions = {
  #{entity.name}: {
    subscribe: withFilter(() => pubsub.asyncIterator('#{entity.name}'), ({ #{entity.name} }, args) => {
      if(args.filter && args.filter.mutation){
        return #{entity.name}.mutation === args.filter.mutation;
      } else {
        return true;
      }
    }),
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
