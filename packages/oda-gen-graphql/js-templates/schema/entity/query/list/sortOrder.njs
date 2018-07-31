<#@ chunks "$$$main$$$" -#>
<#@ alias 'query-list-sort-order'#>
<#@ context 'entity'#>

<#-chunkStart(`./query/list/${entity.name}SortOrder.ts`); -#>
import { Input } from '../../../common';
import gql from 'graphql-tag';

export default new Input({
  schema: gql`
    enum #{entity.name}SortOrder {<#
      if(entity.fields.length > 0){
      for (let key of entity.fields){
    #>
      #{key}Asc
      #{key}Desc
    <#-
        }
      } else {
    #>
      native
      <#}#>
    }
  `,
});
