<#@ chunks "$$$main$$$" -#>
<#@ alias 'mutations-delete-many-types'#>
<#@ context 'entity'#>

<#- chunkStart(`./mutations/deleteMany/deleteMany${entity.name}Input.ts`); -#>
import { Input } from '../../../../common';
import gql from 'graphql-tag';

export default new Input({
  schema: gql`
    input deleteMany#{entity.name}Input {
<#- for (let field of entity.unique){#>
      #{field.name}: #{field.type}
<#-}#>
    }
  `,
});

<#- chunkStart(`./mutations/deleteMany/deleteMany${entity.name}Payload.ts`); -#>

import { Type } from '../../../../common';
import gql from 'graphql-tag';

export default new Type({
  schema: gql`
    type deleteMany#{entity.name}Payload {
      deletedItemId: ID
      #{entity.payloadName}: #{entity.name}
    }
  `,
});
