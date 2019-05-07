<#@ chunks "$$$main$$$" -#>
<#@ alias 'mutations-create-many-types'#>
<#@ context 'entity'#>

<#- chunkStart(`./mutations/createMany/createMany${entity.name}Input.ts`); -#>
import { Input } from '../../../../common';
import gql from 'graphql-tag';

export default new Input({
  schema: gql`
    input createMany#{entity.name}Input {
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

<#- chunkStart(`./mutations/createMany/createMany${entity.name}Payload.ts`); -#>

import { Type } from '../../../../common';
import gql from 'graphql-tag';

export default new Type({
  schema: gql`
    type createMany#{entity.name}Payload {
      #{entity.payloadName}: #{entity.plural}Edge
    }
  `,
});
