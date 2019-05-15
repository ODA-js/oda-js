<#@ chunks "$$$main$$$" -#>
<#@ alias 'mutations-delete-mutation'#>
<#@ context 'entity'#>

<#-chunkStart(`./mutations/delete/delete${entity.name}.ts`); -#>

import {
  logger,
  RegisterConnectors,
  mutateAndGetPayload,
  PubSubEngine,
  Mutation,
  #{slot('import-common-mutation-delete-slot')}
} from '../../../../common';
import gql from 'graphql-tag';

export default new Mutation({
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
    const needCommit = await context.connectors.ensureTransaction();
    const txn = await context.connectors.transaction;
    logger.trace('delete#{entity.name}');
    try {
    let result;
    let deletePromise = [];
    if (args.id) {
<# slot('import-common-mutation-delete-slot',`unlink${entity.name}FromAll`) -#>
  deletePromise.push(
    unlink#{entity.name}FromAll([{
      key: 'id',
      type: 'ID',
      value: args.id,
    }],
      context,
    )
  )
  deletePromise.push(context.connectors.#{entity.name}.findOneByIdAndRemove(args.id).then(res => result = res))
    <#- for (let f of entity.args.remove.find) {#>
    } else if (args.#{f.name}) {
<# slot('import-common-mutation-delete-slot',`unlink${entity.name}FromAll`) -#>
    deletePromise.push(
      unlink#{entity.name}FromAll([{
        key: '#{f.name}',
        type: '#{f.gqlType}',
        value: args.#{f.name},
      }],
        context,
      ));
      deletePromise.push(context.connectors.#{entity.name}.findOneBy#{f.cName}AndRemove(args.#{f.name}).then(res => result = res));
    <#-}#>
    <#- for (let f of entity.complexUnique) {
      let findBy = f.fields.map(f=>f.uName).join('And');
      let loadArgs = `${f.fields.map(f=>`args.${f.name}`).join(', ')}`;
      let condArgs = `${f.fields.map(f=>`args.${f.name}`).join(' && ')}`;
      #>
    } else if (#{condArgs}) {
<# slot('import-common-mutation-delete-slot',`unlink${entity.name}FromAll`) -#>
  deletePromise.push(
    unlink#{entity.name}FromAll([
        <#-f.fields.forEach((f, i)=>{#>
        <#-if(i>0){#>, <#}#>{
          key: '#{f.name}',
          type: '#{f.gqlType}',
          value: args.#{f.name},
        }
        <#-});-#>],
        context,
      ));
     deletePromise.push(context.connectors.#{entity.name}.findOneBy#{findBy}AndRemove(#{loadArgs}).then(res => result = res)));
    <#-}#>
    }

    await Promise.all(deletePromise)
      ;

    if (!result) {
      throw new Error('item of type #{entity.name} is not found for delete');
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

    if(needCommit) {
      return txn.commit().then(() => ({
        deletedItemId: result.id,
        #{entity.ownerFieldName}: result,
      }));
    } else {
      return {
        deletedItemId: result.id,
        #{entity.ownerFieldName}: result,
      };
    }
    } catch (e) {
      await txn.abort()
      throw e;
    }
  }),
})
