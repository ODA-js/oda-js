<#@ context 'entity' -#>
<#- if(entity.description){#>
# #{entity.description}
<# }#>

type #{entity.name} implements Node{
<#- entity.fields.forEach(field => { -#>
<# if(field.description){#>
  # #{field.description}
<#- }#>
  #{field.name}#{field.args}: #{field.type}
<#-})-#>

<#- entity.relations.forEach(rel => { -#>
<# if(rel.description){#>
  # #{rel.description}
<#- }#>
  <#-if(rel.single) {-#>

  #{rel.name}#{rel.args}: #{rel.type}

  <#-} else {-#>
  <#if(rel.derived){#>
  #{rel.name}(#{rel.args} ): #{rel.connectionName}
  <#} else {#>
  #{rel.name}(after: String, first: Int, before: String, last: Int, limit: Int, skip: Int, orderBy: [#{rel.entity}SortOrder], filter:String #{rel.indexed} #{rel.args} ): #{rel.connectionName}
  <#-}-#>
  <#-}-#>
<#-})#>
}


