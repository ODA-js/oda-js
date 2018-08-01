<#@ context 'items' #>
<#@ alias 
  'export-connection-index-slot'
  'export-helpers-index-slot'
  'import-common-mutation-create-slot'
  'import-common-mutation-update-slot'
  'import-common-mutation-delete-slot'
  'export-subscriptions-slot'
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