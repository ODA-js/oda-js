<#@ context 'entity' -#>
import * as log4js from 'log4js';
let logger = log4js.getLogger('graphql:mutations:#{entity.name}');

import {
  fromGlobalId,
  toGlobalId,
} from 'graphql-relay';

import RegisterConnectors from '../../../../data/registerConnectors';
import { mutateAndGetPayload, idToCursor } from 'oda-api-graphql';
import { PubSubEngine } from 'graphql-subscriptions';

export const mutation = {
  create#{entity.name}: mutateAndGetPayload( async (args: {
    <#- for (let f of entity.args.create.args) {#>
      #{f.name}?: #{f.type},
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
          payload: result,
        }
      });
    }

    let #{entity.ownerFieldName}Edge = {
      cursor: idToCursor(result._id),
      node: result,
    };

    return {
      #{entity.ownerFieldName}: #{entity.ownerFieldName}Edge,
    };
  }),

  update#{entity.name}:  mutateAndGetPayload( async (args:  {
    <#- for (let f of entity.args.update.args) {#>
      #{f.name}?: #{f.type},
    <#-}#>
    },
    context: { connectors: RegisterConnectors, pubsub: PubSubEngine },
    info,
  ) => {
    logger.trace('update#{entity.name}');
    let payload = {
    <#- for (let f of entity.args.update.payload) {#>
      #{f.name}: args.#{f.name},
    <#-}#>
    };

    let result;
    if (args.id) {
      result = await context.connectors.#{entity.name}.findOneByIdAndUpdate(fromGlobalId(args.id).id, payload);
    <#- for (let f of entity.args.update.find) {#>
    } else if (args.#{f.name}) {
      delete payload.#{f.name};
      result = await context.connectors.#{entity.name}.findOneBy#{f.cName}AndUpdate(args.#{f.name}, payload);
    <#-}#>
    <#- for (let f of entity.complexUnique) {
      let findBy = f.fields.map(f=>f.uName).join('And');
      let loadArgs = `${f.fields.map(f=>`args.${f.name}`).join(', ')}`;
      let condArgs = `${f.fields.map(f=>`args.${f.name}`).join(' && ')}`;
    #>
    } else if (#{condArgs}) {
      <#-for(let fn of f.fields){#>
      delete payload.#{fn.name};
      <#-}#>
      result = await context.connectors.#{entity.name}.findOneBy#{findBy}AndUpdate(#{loadArgs}, payload);
    <#-}#>
    }

    if (context.pubsub) {
      context.pubsub.publish('#{entity.name}', {
        #{entity.name}: {
          mutation: 'UPDATE',
          node: result,
          payload,
        }
      });
    }

    return {
      #{entity.ownerFieldName}: result,
    };
  }),

  delete#{entity.name}:  mutateAndGetPayload(async (args: {
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
    context: { connectors: RegisterConnectors, pubsub: PubSubEngine },
    info,
  ) => {
    logger.trace('delete#{entity.name}');
    let result;
    if (args.id) {
      result = await context.connectors.#{entity.name}.findOneByIdAndRemove(fromGlobalId(args.id).id);
    <#- for (let f of entity.args.remove.find) {#>
    } else if (args.#{f.name}) {
      result = await context.connectors.#{entity.name}.findOneBy#{f.cName}AndRemove(args.#{f.name});
    <#-}#>
    <#- for (let f of entity.complexUnique) {
      let findBy = f.fields.map(f=>f.uName).join('And');
      let loadArgs = `${f.fields.map(f=>`args.${f.name}`).join(', ')}`;
      let condArgs = `${f.fields.map(f=>`args.${f.name}`).join(' && ')}`;
      #>
    } else if (#{condArgs}) {
      result = await context.connectors.#{entity.name}.findOneBy#{findBy}AndRemove(#{loadArgs});
    <#-}#>
    }

    if (context.pubsub) {
      context.pubsub.publish('#{entity.name}', {
        #{entity.name}: {
          mutation: 'DELETE',
          node: result,
          payload: result,
        }
      });
    }

    return {
      deletedItemId: toGlobalId('#{entity.name}', result.id),
      #{entity.ownerFieldName}: result,
    };
  }),
}
;
