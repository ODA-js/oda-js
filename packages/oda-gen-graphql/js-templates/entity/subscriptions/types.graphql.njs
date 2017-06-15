<#@ context 'entity' -#>

# Input types for basic CUD

# input type for #{entity.name}
type Update#{entity.name}SubscriptionPayload {
<#- for (let field of entity.update){#>
  #{field.name}: #{field.type}
<#-}#>
}

#union #{entity.name}SubscriptionPayload = Update#{entity.name}SubscriptionPayload <#if(entity.hasConnections){#> | #{entity.name}ConnectionsSubscriptionPayload <#}#>

type #{entity.name}Subscription {
  mutation: MutationKind!
  node: #{entity.name}!
  payload: JSON# #{entity.name}Payload
}

input #{entity.name}SubscriptionFilter {
  mutation: MutationKind!
}