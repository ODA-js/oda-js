<#@ chunks "$$$main$$$" -#>
<#@ alias 'mutations-create-mutation'#>
<#@ context 'entity'#>

<#-chunkStart(`../../../gql/${entity.name}/mutations/create/create${entity.name}.ts`); -#>
import * as log4js from 'log4js';
let logger = log4js.getLogger('graphql:mutations:#{entity.name}');

import {
  ModelType,
  logger,
  RegisterConnectors,
  mutateAndGetPayload,
  PubSubEngine,
  Mutation,
  fromGlobalId,
  linkToUser,
  idToCursor,
  ensureUser,
} from '../../../common';
import gql from 'graphql-tag';

export default new Mutation({
  type: ModelType.mutation,
  schema: gql`
    extend type RootMutation {
      create#{entity.name}(input: create#{entity.name}Input!): create#{entity.name}Payload
    }
  `,
  resolver: mutateAndGetPayload( async (args: {
    <#- for (let f of entity.args.create.args) {#>
      #{f.name}?: #{f.type},
    <#-}#>
    <#- for (let r of entity.relations) {#>
      #{r.field}?: object/*#{r.ref.entity}*/<#if(!r.single){#>[]<#}#>,
    <#-}#>
    },
    context: { connectors: RegisterConnectors, pubsub: PubSubEngine },
    info,
  ) => {
    logger.trace('create#{entity.name}');
    let create: any = {
    <#- for (let f of entity.args.create.find) {#>
      #{f.name}: args.#{f.name},
    <#-}#>
    };

    if(args.id) {
      create.id = fromGlobalId(args.id).id;
    }

    let result = await context.connectors.#{entity.name}.create(create);

    if (context.pubsub) {
      context.pubsub.publish('#{entity.name}', {
        #{entity.name}: {
          mutation: 'CREATE',
          node: result,
          previous: null,
          updatedFields: [],
          payload: args,
        }
      });
    }

    let #{entity.ownerFieldName}Edge = {
      cursor: idToCursor(result.id),
      node: result,
    };

    <#- for (let r of entity.relations) {#>

    if (args.#{r.field}<#if(!r.single){#> && Array.isArray(args.#{r.field}) && args.#{r.field}.length > 0<#}#> ) {
    <#if(!r.single){#>
      for (let i = 0, len = args.#{r.field}.length; i < len; i++) {
    <#}#>
      let $item = args.#{r.field}<#if(!r.single){#>[i]<#}#> as { id,<#r.fields.forEach(f=>{#> #{f.name},<#})#> };
      if ($item) {
        let #{r.field} = await ensure#{r.ref.entity}({
          args: $item,
          context,
          create: true,
        });

        await linkTo#{r.cField}({
          context,
          #{r.field},
          #{entity.ownerFieldName}: result,
          <#-r.fields.forEach(f=>{#>
          #{f.name}: $item.#{f.name},
          <#-})#>
        });
      }
    <#if(!r.single){#>
      }
    <#}#>
    }

    <#-}#>
    return {
      #{entity.ownerFieldName}: #{entity.ownerFieldName}Edge,
    };
  }),
});
