<#@ chunks "$$$main$$$" -#>
<#@ alias 'connection-mutations-input-payload'#>
<#@ context 'entity'#>

<#- for (let connection of entity.connections) {
  const ctx = {
    entity,
    connection,
  }
#>

#{partial(ctx,'connection-mutations-addTo-input')}
#{partial(ctx,'connection-mutations-addTo-payload')}
#{partial(ctx,'connection-mutations-removeFrom-input')}
#{partial(ctx,'connection-mutations-removeFrom-payload')}

<#- } -#>