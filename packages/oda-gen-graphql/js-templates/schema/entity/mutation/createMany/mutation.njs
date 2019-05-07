<#@ chunks "$$$main$$$" -#>
<#@ alias 'mutations-create-many-mutation'#>
<#@ context 'entity'#>

<#-chunkStart(`./mutations/createMany/createMany${entity.name}.ts`); -#>
import {
  logger,
  RegisterConnectors,
  mutateAndGetPayload,
  PubSubEngine,
  Mutation,
  #{slot('import-common-mutation-create-many-slot')}
} from '../../../../common';
import gql from 'graphql-tag';

export default new Mutation({
  schema: gql`
    extend type RootMutation {
      createMany#{entity.name}(input: [createMany#{entity.name}Input!]): [createMany#{entity.name}Payload]
    }
  `,
  resolver: mutateAndGetPayload( async (args: {
    <#- for (let f of entity.args.create.args) {#>
      #{f.name}?: #{f.type},
    <#-}#>
    <#- for (let r of entity.relations) {#>
      #{r.field}?: object/*#{r.ref.entity}*/<#if(!r.single){#>[]<#}#>,
    <#-}#>
    }[],
    context: {
      connectors: RegisterConnectors;
      pubsub: PubSubEngine;
      resolvers:any;
      },
    info
  ) => {
    logger.trace('createMany#{entity.name}');
    const result = args.map((input) => {
      return context.resolvers.RootMutation.createPerson(undefined, {input}, context, info);
    });

    return Promise.all(result);
  }),
});
