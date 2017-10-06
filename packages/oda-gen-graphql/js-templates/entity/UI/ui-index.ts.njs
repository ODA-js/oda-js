<#@ context 'pack' -#>
<# for(let entity of pack.entities){-#>
import #{entity.name}Query from './#{entity.name}/queries';
<#}-#>

<# for(let entity of pack.entities){-#>
import #{entity.name}UIX from './#{entity.name}/uix';
<#}-#>

export const queries = () => ({
<# for(let entity of pack.entities){-#>
  #{entity.name}: #{entity.name}Query,
<#}-#>
});

export const uix = () => ({
<# for(let entity of pack.entities){-#>
  #{entity.name}: #{entity.name}UIX,
<#}-#>
});
