<#@ context 'items' #>
<#@ alias
  'export-connection-index-slot'
  'export-helpers-index-slot'
  'import-common-mutation-create-slot'
  'import-common-mutation-update-slot'
  'import-common-mutation-delete-slot'
  'import-common-mutation-create-many-slot'
  'import-common-mutation-update-many-slot'
  'import-common-mutation-delete-many-slot'
  'export-subscriptions-slot'
  'item-query-list-index-slot'
  'use-embed-entity-create-rel-mutation-types'
  'use-embed-entity-update-rel-mutation-types'
  'use-embed-entity-create-many-rel-mutation-types'
  'use-embed-entity-update-many-rel-mutation-types'
#>
<#- const separatedItems = Object.keys(items
  .reduce((res, it) => {
    it.split(',')
      .map(i=>i.trim())
      .filter(f=>f)
      .reduce((r,cur)=>{
        r[cur]=1;
        return r;
      },res);
    return res;
  }, {}));
-#>
<#- if(separatedItems.length > 0){-#>
<#-
    separatedItems.forEach(item=>{
#>
#{item},
<#-  });-#>
<#}-#>
