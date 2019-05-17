<#@ chunks "$$$main$$$" -#>
<#@ alias 'mutations-update-safe-index'#>
<#@ context 'ctx'#>

<#-chunkStart(`./mutations/updateSafe/index.ts`); -#>
import gql from 'graphql-tag';
import { Schema } from '../../../../common';

import {
  logger,
  mutateSafe,
} from '../../../../common';

export default new Schema({
  name: '#{ctx.types.name}.mutation.update.safe',
  schema: gql`
    extend type Mutation {
      updateMany#{ctx.types.name}Safe(input: [updateMany#{ctx.types.name}Input!]): [updateMany#{ctx.types.name}Payload]
      update#{ctx.types.name}Safe(input: update#{ctx.types.name}Input!): update#{ctx.types.name}Payload
    }
  `,
  resolver: {
    Mutation : {
      updateMany#{ctx.types.name}Safe: mutateSafe ( async (root, args, context:{resolvers:any;}, info) => {
        logger.trace('updateMany#{ctx.types.name}Safe');
        return context.resolvers.Mutation.updateMany#{ctx.types.name}(root,args,context,info);
      }),
      update#{ctx.types.name}Safe: mutateSafe ( async (root, args, context:{resolvers:any;}, info) => {
        logger.trace('update#{ctx.types.name}Safe');
        return context.resolvers.Mutation.update#{ctx.types.name}(root,args,context,info);
      }),
    }
  }
});
<#- chunkEnd(); -#>



