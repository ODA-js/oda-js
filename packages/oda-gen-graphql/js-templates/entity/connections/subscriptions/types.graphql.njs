<#@ context 'entity' -#>
<#-for ( let connection of entity.connections ) {#>
type #{connection.name}SubscriptionPayload {
  #{entity.ownerFieldName}:ID!
  #{connection.refFieldName}:ID!
<#- if (connection.fields.length > 0){#>
  #additional Edge fields
<# connection.fields.forEach(f=>{-#>
  #{f.name}: #{f.type}
<# });-#>
<#-}#>
}
<# }-#>
<#- if(entity.connections.length > 0) {#>
union #{entity.name}ConnectionsSubscriptionPayload = <# entity.connections.forEach(function(item, index){-#>
<#- if(index > 0){#> | <#} -#>
#{item.name}SubscriptionPayload
<#- })-#>
<#}-#>