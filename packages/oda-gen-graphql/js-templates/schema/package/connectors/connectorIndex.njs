<#@ context 'pack' -#>
<#@ alias 'connectorIndex' #>
<#- debugger; for(let entity of pack.entities){#>
import #{entity.name} from './#{entity.name}/adapter/connector';
<#- }#>

export {
<#- for(let entity of pack.entities){#>
  #{entity.name},
<#- }#>
}
