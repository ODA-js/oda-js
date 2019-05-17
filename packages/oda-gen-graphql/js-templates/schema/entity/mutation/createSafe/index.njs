<#@ chunks "$$$main$$$" -#>
<#@ alias 'mutations-create-safe-index'#>
<#@ context 'ctx'#>

<#-chunkStart(`./mutations/createSafe/index.ts`); -#>
import gql from 'graphql-tag';
import { Schema } from '../../../../common';

import {
  logger,
  mutateSafe,
} from '../../../../common';

export default new Schema({
  name: '#{ctx.types.name}.mutation.create.safe',
  schema: gql`
    extend type Mutation {
      createMany#{ctx.types.name}Safe(input: [createMany#{ctx.types.name}Input!]): [createMany#{ctx.types.name}Payload]
      create#{ctx.types.name}Safe(input: create#{ctx.types.name}Input!): create#{ctx.types.name}Payload
    }
  `,
  resolver: {
    Mutation : {
      createMany#{ctx.types.name}Safe: mutateSafe ( async (root, args, context:{resolvers:any;}, info) => {
        logger.trace('createMany#{ctx.types.name}Safe');
        return context.resolvers.Mutation.createMany#{ctx.types.name}(root,args,context,info);
      }),
      create#{ctx.types.name}Safe: mutateSafe ( async (root, args, context:{resolvers:any;}, info) => {
        logger.trace('create#{ctx.types.name}Safe');
        return context.resolvers.Mutation.create#{ctx.types.name}(root,args,context,info);
      }),
    }
  }
});
<#- chunkEnd(); -#>



