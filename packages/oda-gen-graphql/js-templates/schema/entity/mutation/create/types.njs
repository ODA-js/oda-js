<#@ chunks "$$$main$$$" -#>
<#@ alias 'mutations-create-types'#>
<#@ context 'entity'#>

<#- chunkStart(`../../../gql/${entity.name}/mutations/create/create${entity.name}Input.ts`); -#>
import { Input } from '../../../common';
import gql from 'graphql-tag';

export default new Input({
  schema: gql`
    input create#{entity.name}Input {
      clientMutationId: String
<#- for (let field of entity.create){#>
      #{field.name}: #{field.type}
<#-}#>
<#- for (let rel of entity.relations.filter(f=>f.persistent)){
const refName = rel.fields.length > 0 ? `embed${rel.ref.entity}CreateInto${entity.name}${rel.cField}Input` : `embed${rel.ref.entity}Input`;
#>
      #{rel.field}: <#if(!rel.single){#>[<#}#>#{refName}<#if(!rel.single){#>]<#}#>
<#-}#>
    }
  `,
});

<#- chunkStart(`../../../gql/${entity.name}/mutations/create/create${entity.name}Payload.ts`); -#>

import { Type } from '../../../common';
import gql from 'graphql-tag';

export default new Type({
  schema: gql`
    type create#{entity.name}Payload {
      clientMutationId: String
      viewer: Viewer
      #{entity.payloadName}: #{entity.plural}Edge
    }
  `,
});
