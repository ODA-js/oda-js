<#@ context 'entity' -#>

# Input types for basic CUD

# input type for #{entity.name}
input create#{entity.name}Input {
  clientMutationId: String
<#- for (let field of entity.create){#>
  #{field.name}: #{field.type}
<#-}#>
<#- for (let rel of entity.relations.filter(f=>f.persistent)){#>
  #{rel.field}: <#if(!rel.single){#>[<#}#>embed#{rel.ref.entity}Input<#if(!rel.single){#>]<#}#>
<#-}#>
}

input embed#{entity.name}Input {
  clientMutationId: String
<#- for (let field of entity.update){#>
  #{field.name}: #{field.type}
<#-}#>
<#- for (let rel of entity.relations.filter(f=>f.persistent)){#>
  #{rel.field}: <#if(!rel.single){#>[<#}#>embed#{rel.ref.entity}Input<#if(!rel.single){#>]<#}#>
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
<#- for (let rel of entity.relations.filter(f=>f.persistent)){#>
  #{rel.field}: <#if(!rel.single){#>[<#}#>embed#{rel.ref.entity}Input<#if(!rel.single){#>]<#}#>
  #{rel.field}Unlink: <#if(!rel.single){#>[<#}#>embed#{rel.ref.entity}Input<#if(!rel.single){#>]<#}#>
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
