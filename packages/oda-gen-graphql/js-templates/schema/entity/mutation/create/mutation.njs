<#@ chunks "$$$main$$$" -#>
<#@ alias 'mutations-create-mutation'#>
<#@ context 'entity'#>

<#-chunkStart(`./mutations/create/create${entity.name}.ts`); -#>
import {
  logger,
  RegisterConnectors,
  mutateAndGetPayload,
  PubSubEngine,
  Mutation,
  #{slot('import-common-mutation-create-slot')}
} from '../../../../common';
import gql from 'graphql-tag';

export default new Mutation({
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
      create.id = args.id;
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
      cursor: result.id,
      node: result,
    };

    <#- for (let r of entity.relations) {#>

    if (args.#{r.field}<#if(!r.single){#> && Array.isArray(args.#{r.field}) && args.#{r.field}.length > 0<#}#> ) {
    <#if(!r.single){#>
      for (let i = 0, len = args.#{r.field}.length; i < len; i++) {
    <#}#>
      let $item = args.#{r.field}<#if(!r.single){#>[i]<#}#> as { id,<#r.fields.forEach(f=>{#> #{f.name},<#})#> };
      if ($item) {
<#- slot('import-common-mutation-create-slot',`ensure${r.ref.entity}`) -#>
        let #{r.field} = await ensure#{r.ref.entity}({
          args: $item,
          context,
          create: true,
        });
<#- slot('import-common-mutation-create-slot',`link${entity.name}To${r.cField}`) -#>
        await link#{entity.name}To#{r.cField}({
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
