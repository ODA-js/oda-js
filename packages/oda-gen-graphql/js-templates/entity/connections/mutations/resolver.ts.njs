<#@ context 'entity' -#>
import * as log4js from 'log4js';
let logger = log4js.getLogger('graphql:mutations:#{entity.name}');

import {
  fromGlobalId,
} from 'graphql-relay';

import RegisterConnectors from '../../../../../data/registerConnectors';
import { mutateAndGetPayload, idToCursor } from 'oda-api-graphql';

export const mutation = {
<#- for (let connection of entity.connections) {#>
  addTo#{connection.relationName}: mutateAndGetPayload(
    async (
      args: {
    <#- for (let f of connection.addArgs) {#>
        #{f.name}?: #{f.type},
    <#-}#>
      },
      context: { connectors: RegisterConnectors },
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

      let item = await context.connectors.#{entity.name}.findOneById(#{entity.ownerFieldName});
      // let #{entity.ownerFieldName}Edge = {
      //   cursor: idToCursor(item._id),
      //   node: item,
      // };

      return {
        // #{entity.ownerFieldName}: #{entity.ownerFieldName}Edge,
        #{entity.ownerFieldName}: item,
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
      context: { connectors: RegisterConnectors },
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
      return {
        #{entity.ownerFieldName}: item,
      };
    },
  ),

<#- } #>
};