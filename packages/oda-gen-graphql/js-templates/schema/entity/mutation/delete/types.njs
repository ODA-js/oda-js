<#@ chunks "$$$main$$$" -#>
<#@ alias 'mutations-delete-types'#>
<#@ context 'entity'#>

<#- chunkStart(`../../../gql/${entity.name}/mutations/delete/delete${entity.name}Input.ts`); -#>
import { ModelType, Input, Type } from '../../../common';
import gql from 'graphql-tag';

export default new Input({
  type: ModelType.input,
  schema: gql`
    input delete#{entity.name}Input {
      clientMutationId: String
<#- for (let field of entity.unique){#>
      #{field.name}: #{field.type}
<#-}#>
    } 
  `,
});

<#- chunkStart(`../../../gql/${entity.name}/mutations/delete/delete${entity.name}Payload.ts`); -#>

import { ModelType, Input, Type } from '../../../common';
import gql from 'graphql-tag';

export default new Type({
  type: ModelType.type,
  schema: gql`
    type delete#{entity.name}Payload {
      clientMutationId: String
      viewer: Viewer
      deletedItemId: ID
      #{entity.payloadName}: #{entity.name}
    }
  `,
});
