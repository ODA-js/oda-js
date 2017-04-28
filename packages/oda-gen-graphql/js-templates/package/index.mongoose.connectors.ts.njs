<#@ context 'pack' -#>
<#- for(let entity of pack.entities){#>
import #{entity.name} from './#{entity.name}/mongoose/connector';
<#- }#>

export {
<#- for(let entity of pack.entities){#>
  #{entity.name},
<#- }#>
}
