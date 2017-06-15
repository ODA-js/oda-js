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
