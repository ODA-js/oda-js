<#@ chunks "$$$main$$$" -#>
<#@ alias 'mutations-update-types'#>
<#@ context 'entity'#>

<#- chunkStart(`./mutations/update/update${entity.name}Input.ts`); -#>
import { Input } from '../../../common';
import gql from 'graphql-tag';

export default new Input({
  schema: gql`
    input update#{entity.name}Input {
      clientMutationId: String
    <#- for (let field of entity.update){#>
      #{field.name}: #{field.type}
    <#-}#>
    <#- for (let rel of entity.relations.filter(f=>f.persistent)){

    const createName = rel.fields.length > 0 ? `embed${rel.ref.entity}CreateInto${entity.name}${rel.cField}Input` : `create${rel.ref.entity}Input`;
    const updateName = rel.fields.length > 0 ? `embed${rel.ref.entity}UpdateInto${entity.name}${rel.cField}Input` : `embed${rel.ref.entity}Input`;
    #>
      #{rel.field}: <#if(!rel.single){#>[<#}#>#{updateName}<#if(!rel.single){#>]<#}#>
      #{rel.field}Unlink: <#if(!rel.single){#>[<#}#>#{updateName}<#if(!rel.single){#>]<#}#>
      #{rel.field}Create: <#if(!rel.single){#>[<#}#>#{createName}<#if(!rel.single){#>]<#}#>
    <#-}#>
    }
  `,
});

<#- chunkStart(`./mutations/update/update${entity.name}Payload.ts`); -#>

import { Type } from '../../../common';
import gql from 'graphql-tag';

export default new Type({
  schema: gql`
    type update#{entity.name}Payload {
      clientMutationId: String
      viewer: Viewer
      #{entity.payloadName}: #{entity.name}
    }
  `,
});
