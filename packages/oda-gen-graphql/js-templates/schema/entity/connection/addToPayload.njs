<#@ chunks "$$$main$$$" -#>
<#@ alias 'connection-mutations-addTo-payload'#>
<#@ context 'ctx'#>

<#- 
const {entity, connection} = ctx;
chunkStart(`../../../gql/${entity.name}/connections/addTo${connection.name}Payload.ts`); -#>
<# slot('import-connection-index-slot',`addTo${connection.name}Payload`) #>
<# slot('export-connection-index-slot',`addTo${connection.name}Payload`) #>
import { ModelType, Type } from '../../common';
import gql from 'graphql-tag';

export default new Type({
  schema: gql`
    type addTo#{connection.name}Payload {
      clientMutationId: String
      viewer: Viewer
      #{entity.ownerFieldName}: #{entity.name}
    }
  `,
});
