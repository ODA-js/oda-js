<#@ chunks "$$$main$$$" -#>
<#@ alias 'connection-mutations'#>
<#@ context 'entity'#>

<#- for (let connection of entity.connections) {
  const ctx = {
    entity,
    connection,
  }
#>

#{partial(ctx,'connection-mutations-addTo')}
#{partial(ctx,'connection-mutations-removeFrom')}

<#- } -#>