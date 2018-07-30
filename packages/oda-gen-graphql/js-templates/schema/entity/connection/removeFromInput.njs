<#@ chunks "$$$main$$$" -#>
<#@ alias 'connection-mutations-removeFrom-input'#>
<#@ context 'ctx'#>

<#- 
const {entity, connection} = ctx;
chunkStart(`../../../gql/${entity.name}/connections/removeFrom${connection.name}Input.ts`); -#>
<# slot('import-connection-index-slot',`removeFrom${connection.name}Input`) #>
<# slot('export-connection-index-slot',`removeFrom${connection.name}Input`) #>
import { Input } from '../../common';
import gql from 'graphql-tag';

export default new Input({
  schema: gql`
    input removeFrom#{connection.name}Input {
      clientMutationId: String
      #{connection.refFieldName}:ID!
      #{entity.ownerFieldName}:ID!
    }
  `,
});
