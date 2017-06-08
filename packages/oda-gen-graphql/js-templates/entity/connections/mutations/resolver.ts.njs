<#@ context 'entity' -#>
import * as log4js from 'log4js';
let logger = log4js.getLogger('graphql:mutations:#{entity.name}');

import {
  fromGlobalId,
} from 'graphql-relay';

import RegisterConnectors from '../../../../../data/registerConnectors';
import { mutateAndGetPayload, idToCursor } from 'oda-api-graphql';
import {PubSubEngine} from 'graphql-subscriptions';

export const mutation = {
<#- for (let connection of entity.connections) {#>
  addTo#{connection.relationName}: mutateAndGetPayload(
    async (
      args: {
    <#- for (let f of connection.addArgs) {#>
        #{f.name}?: #{f.type},
    <#-}#>
      },
      context: { connectors: RegisterConnectors, pubsub: PubSubEngine },
      info
    ) => {
      logger.trace('addTo#{connection.relationName}');
      let { id: #{entity.ownerFieldName} } = fromGlobalId(args.#{entity.ownerFieldName});
      let { id: #{connection.refFieldName} } = fromGlobalId(args.#{connection.refFieldName});
      await context.connectors.#{entity.name}.addTo#{connection.shortName}({
        #{entity.ownerFieldName},
        #{connection.refFieldName},
<#-
for (let fname of connection.ref.fields){
  if (fname !== 'id') { #>
        #{fname}: args.#{fname},
<#-
  }
}#>
      });

      let source = await context.connectors.#{entity.name}.findOneById(#{entity.ownerFieldName});
      let dest = await context.connectors.#{connection.refEntity}.findOneById(#{connection.refFieldName});
      // let #{entity.ownerFieldName}Edge = {
      //   cursor: idToCursor(item._id),
      //   node: item,
      // };

      context.pubsub.publish('#{entity.name}', {
        #{entity.name}: {
          mutation: 'LINK',
          node: source,
          payload: {
            //название ассоциации
          }
        }
      });

      context.pubsub.publish('#{connection.refEntity}', {
        #{connection.refEntity}: {
          mutation: 'LINK',
          node: dest,
          payload: {
            //название ассоциации если такая есть.... смотри opposite
          }
        }
      });

      return {
        // #{entity.ownerFieldName}: #{entity.ownerFieldName}Edge,
        #{entity.ownerFieldName}: source,
      };
    },
  ),

  removeFrom#{connection.relationName}: mutateAndGetPayload(
    async (
      args: {
      <#- for (let f of connection.removeArgs) {#>
        #{f.name}?: #{f.type},
      <#-}#>
      },
      context: { connectors: RegisterConnectors, pubsub: PubSubEngine },
      info
    ) => {
      logger.trace('removeFrom#{connection.relationName}');
      let { id: #{entity.ownerFieldName} } = fromGlobalId(args.#{entity.ownerFieldName});
      let { id: #{connection.refFieldName} } = fromGlobalId(args.#{connection.refFieldName});
      await context.connectors.#{entity.name}.removeFrom#{connection.shortName}({
        #{entity.ownerFieldName},
        #{connection.refFieldName},
      });

      let item = await context.connectors.#{entity.name}.findOneById(#{entity.ownerFieldName});

      context.pubsub.publish('#{entity.name}', {
        #{entity.name}: {
          mutation: 'UNLINK',
          node: item,
        }
      });

      return {
        #{entity.ownerFieldName}: item,
      };
    },
  ),

<#- } #>
};