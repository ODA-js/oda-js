<#@ chunks "$$$main$$$" -#>
<#@ alias 'mutations-delete-many-mutation'#>
<#@ context 'entity'#>

<#-chunkStart(`./mutations/deleteMany/deleteMany${entity.name}.ts`); -#>

import {
  logger,
  RegisterConnectors,
  mutateAndGetPayload,
  PubSubEngine,
  Mutation,
  #{slot('import-common-mutation-delete-many-slot')}
} from '../../../../common';
import gql from 'graphql-tag';

export default new Mutation({
  schema: gql`
    extend type RootMutation {
      deleteMany#{entity.name}(input: [deleteMany#{entity.name}Input!]): [deleteMany#{entity.name}Payload]
    }
  `,
  resolver: mutateAndGetPayload( async (args: {
   <#- for (let f of entity.args.remove.args) {#>
      #{f.name}?: #{f.type},
    <#-}#>
    <#- for (let f of entity.complexUnique) {
      let args = `${f.fields.map(f=>`${f.name}?: ${f.type}`).join(', ')}`;
      #>
      // #{f.name}
      #{args},
    <#-}#>
    }[],
    context: {
      connectors: RegisterConnectors;
      pubsub: PubSubEngine;
      resolvers:any;
      },
    info
  ) => {
    const needCommit = await context.connectors.ensureTransaction();
    const txn = await context.connectors.transaction;
    logger.trace('deleteMany#{entity.name}');
    const result = args.map((input) => {
      return context.resolvers.RootMutation.deletePerson(undefined, {input}, context, info);
    });

    try {
      const res = await Promise.all(result);
      if(needCommit){
        return txn.commit().then(() => res);
      } else {
        return res;
      }
    } catch (err) {
      await txn.abort()
      throw err;
    }
  }),
})
