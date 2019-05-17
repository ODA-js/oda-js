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
    extend type Mutation {
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
    logger.trace('deleteMany#{entity.name}');
    const result = args.map((input) => {
      return context.resolvers.Mutation.delete#{entity.name}(undefined, {input}, context, info);
    });

    return await Promise.all(result);
  }),
})
