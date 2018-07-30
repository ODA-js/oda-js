<#@ chunks "$$$main$$$" -#>
<#@ alias 'mutations-delete-mutation'#>
<#@ context 'entity'#>

<#-chunkStart(`../../../gql/${entity.name}/mutations/delete/delete${entity.name}.ts`); -#>

import {
  ModelType,
  logger,
  RegisterConnectors,
  mutateAndGetPayload,
  PubSubEngine,
  Mutation,
  fromGlobalId,
  toGlobalId,
  idToCursor,
  #{slot('import-common-mutation-delete-slot')}
} from '../../../common';
import gql from 'graphql-tag';

export default new Mutation({
  type: ModelType.mutation,
  schema: gql`
    extend type RootMutation {
      delete#{entity.name}(input: delete#{entity.name}Input!): delete#{entity.name}Payload
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
    },
    context: {
      connectors: RegisterConnectors,
      pubsub: PubSubEngine,
      userGQL: (args: any)=>Promise<any> },
    info,
  ) => {
    logger.trace('delete#{entity.name}');
    let result;
    try {
      if (args.id) {
<# slot('import-common-mutation-delete-slot',`unlink${entity.name}FromAll`) -#>
        await unlink#{entity.name}FromAll([{
          key: 'id',
          type: 'ID',
          value: args.id,
        }],
          context,
        );

        result = await context.connectors.#{entity.name}.findOneByIdAndRemove(fromGlobalId(args.id).id);
      <#- for (let f of entity.args.remove.find) {#>
      } else if (args.#{f.name}) {
<# slot('import-common-mutation-delete-slot',`unlink${entity.name}FromAll`) -#>
        await unlink#{entity.name}FromAll([{
          key: '#{f.name}',
          type: '#{f.gqlType}',
          value: args.#{f.name},
        }],
          context,
        );

        result = await context.connectors.#{entity.name}.findOneBy#{f.cName}AndRemove(args.#{f.name});
      <#-}#>
      <#- for (let f of entity.complexUnique) {
        let findBy = f.fields.map(f=>f.uName).join('And');
        let loadArgs = `${f.fields.map(f=>`args.${f.name}`).join(', ')}`;
        let condArgs = `${f.fields.map(f=>`args.${f.name}`).join(' && ')}`;
        #>
      } else if (#{condArgs}) {
<# slot('import-common-mutation-delete-slot',`unlink${entity.name}FromAll`) -#>
        await unlink#{entity.name}FromAll([
          <#-f.fields.forEach((f, i)=>{#>
          <#-if(i>0){#>, <#}#>{
            key: '#{f.name}',
            type: '#{f.gqlType}',
            value: args.#{f.name},
          }
          <#-});-#>],
          context,
        );

        result = await context.connectors.#{entity.name}.findOneBy#{findBy}AndRemove(#{loadArgs});
      <#-}#>
      }
    } catch (err) {
      throw err;
    }

    if (!result) {
      throw new Error('Specified item not found!');
    }

    if (context.pubsub) {
      context.pubsub.publish('#{entity.name}', {
        #{entity.name}: {
          mutation: 'DELETE',
          node: result,
          previous: null,
          updatedFields: [],
          payload: args,
        }
      });
    }

    return {
      deletedItemId: toGlobalId('#{entity.name}', result.id),
      #{entity.ownerFieldName}: result,
    };
  }),
})
