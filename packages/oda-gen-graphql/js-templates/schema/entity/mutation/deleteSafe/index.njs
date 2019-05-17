<#@ chunks "$$$main$$$" -#>
<#@ alias 'mutations-delete-safe-index'#>
<#@ context 'ctx'#>

<#-chunkStart(`./mutations/deleteSafe/index.ts`); -#>
import gql from 'graphql-tag';
import { Schema } from '../../../../common';

import {
  logger,
  mutateSafe,
} from '../../../../common';

export default new Schema({
  name: '#{ctx.types.name}.mutation.delete.safe',
  schema: gql`
    extend type Mutation {
      deleteMany#{ctx.types.name}Safe(input: [deleteMany#{ctx.types.name}Input!]): [deleteMany#{ctx.types.name}Payload]
      delete#{ctx.types.name}Safe(input: delete#{ctx.types.name}Input!): delete#{ctx.types.name}Payload
    }
  `,
  resolver: {
    Mutation : {
      deleteMany#{ctx.types.name}Safe: mutateSafe ( async (root, args, context:{resolvers:any;}, info) => {
        logger.trace('deleteMany#{ctx.types.name}Safe');
        return context.resolvers.Mutation.deleteMany#{ctx.types.name}(root,args,context,info);
      }),
      delete#{ctx.types.name}Safe: mutateSafe ( async (root, args, context:{resolvers:any;}, info) => {
        logger.trace('delete#{ctx.types.name}Safe');
        return context.resolvers.Mutation.delete#{ctx.types.name}(root,args,context,info);
      }),
    }
  }
});
<#- chunkEnd(); -#>



