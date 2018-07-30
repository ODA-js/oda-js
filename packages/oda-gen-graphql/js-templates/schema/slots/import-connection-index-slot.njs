<#@ context 'items' #>
<#@ alias 
  'import-connection-index-slot'
  'import-helpers-index-slot'
-#>
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
import #{item} from './#{item}';
<#-  });-#>
<#}-#>