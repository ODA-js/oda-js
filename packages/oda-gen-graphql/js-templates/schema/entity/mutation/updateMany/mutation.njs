<#@ chunks "$$$main$$$" -#>
<#@ alias 'mutations-update-many-mutation'#>
<#@ context 'entity'#>

<#-chunkStart(`./mutations/updateMany/updateMany${entity.name}.ts`); -#>

import {
  logger,
  RegisterConnectors,
  mutateAndGetPayload,
  PubSubEngine,
  Mutation,
  #{slot('import-common-mutation-update-many-slot')}
} from '../../../../common';
import gql from 'graphql-tag';
import { merge } from 'lodash';

export default new Mutation({
  schema: gql`
    extend type RootMutation {
      updateMany#{entity.name}(input: [updateMany#{entity.name}Input!]): [updateMany#{entity.name}Payload]
    }
  `,
  resolver: mutateAndGetPayload( async (args: {
    <#- for (let f of entity.args.update.args) {#>
      #{f.name}?: #{f.type},
    <#-}#>
    <#- for (let r of entity.relations) {#>
      #{r.field}?: object/*#{r.ref.entity}*/<#if(!r.single){#>[]<#}#>,
      #{r.field}Unlink?: object/*#{r.ref.entity}*/<#if(!r.single){#>[]<#}#>,
      #{r.field}Create?: object/*#{r.ref.entity}*/<#if(!r.single){#>[]<#}#>,
    <#-}#>
    }[],
    context: {
      connectors: RegisterConnectors;
      pubsub: PubSubEngine;
      resolvers:any;
      },
    info
  ) => {
    logger.trace('updateMany#{entity.name}');
    const result = args.map((input) => {
      return context.resolvers.RootMutation.updatePerson(undefined, {input}, context, info);
    });

    return Promise.all(result);
  }),
});
