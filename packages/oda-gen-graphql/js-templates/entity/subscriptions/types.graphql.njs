<#@ context 'entity' -#>

# Input types for basic CUD

# input type for #{entity.name}
input create#{entity.name}Input {
  clientMutationId: String
<#- for (let field of entity.create){#>
  #{field.name}: #{field.type}
<#-}#>
}

# Payload type for #{entity.name}
type create#{entity.name}Payload {
  clientMutationId: String
  viewer: Viewer
  #{entity.payloadName}: #{entity.plural}Edge
}

# input type for #{entity.name}
input update#{entity.name}Input {
  clientMutationId: String
<#- for (let field of entity.update){#>
  #{field.name}: #{field.type}
<#-}#>
}

# Payload type for #{entity.name}
type update#{entity.name}Payload {
  clientMutationId: String
  viewer: Viewer
  #{entity.payloadName}: #{entity.name}
}

# input type for #{entity.name}
input delete#{entity.name}Input {
  clientMutationId: String
<#- for (let field of entity.unique){#>
  #{field.name}: #{field.type}
<#-}#>
}

# Payload type for #{entity.name}
type delete#{entity.name}Payload {
  clientMutationId: String
  viewer: Viewer
  deletedItemId: ID
  #{entity.payloadName}: #{entity.name}
}
