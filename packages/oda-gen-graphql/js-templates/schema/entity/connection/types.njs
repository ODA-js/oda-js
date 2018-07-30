<#@ chunks "$$$main$$$" -#>
<#@ alias 'connection-types'#>
<#@ context 'entity'#>

<#- chunkStart(`../../../gql/${entity.name}/query/list/${entity.name}Edge.ts`); -#>
import { Type } from '../../../common';
import gql from 'graphql-tag';

export default new Type({
  schema: gql`
    type #{entity.plural}Edge {
      node: #{entity.name}
      cursor: String!
      # put here your additiona edge fields
    }
  `,
});

<#- chunkStart(`../../../gql/${entity.name}/query/list/${entity.name}Connection.ts`); -#>
import { Type } from '../../../common';
import gql from 'graphql-tag';

export default new Type({
  schema: gql`
    type #{entity.plural}Connection {
      pageInfo: PageInfo!
      edges: [#{entity.plural}Edge]
      # put here your additional connection fields
    }
  `,
});
<#- chunkEnd() -#>

<#
if(entity.connections.length > 0){
  entity.connections.forEach(connection => {
#>

<#- chunkStart(`../../../gql/${entity.name}/query/list/${connection.connectionName}Connection.ts`); -#>
import { Type } from '../../../common';
import gql from 'graphql-tag';

export default new Type({
  schema: gql`
    type #{connection.connectionName}Connection {
      pageInfo: PageInfo!
      edges: [#{connection.connectionName}Edge]
      # put here your additional connection fields
    }
  `,
});

<#- chunkStart(`../../../gql/${entity.name}/query/list/${entity.name}Edge.ts`); -#>
import { Type } from '../../../common';
import gql from 'graphql-tag';

export default new Type({
  schema: gql`
    type #{connection.connectionName}Edge {
      node: #{connection.refType}
      cursor: String!
    <#- if(connection.fields.length > 0){#>
      #additional Edge fields
    <#
    connection.fields.forEach(f=>{#>
    <#-if(f.description){#>
      # #{f.description}
    <#}-#>
      #{f.name}#{f.argsString}: #{f.type}
    <#- });-#>
    <#}#>
      # put here your additiona edge fields
    }
  `,
});
<#- chunkEnd() -#>
<#-})
}-#>