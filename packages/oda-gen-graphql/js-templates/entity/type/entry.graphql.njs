<#@ context 'entity' -#>
<#- if(entity.description){#>
# #{entity.description}
<# }#>

input Embed#{entity.name}Filter {
  or: [Embed#{entity.name}FilterItem]
  and: [Embed#{entity.name}FilterItem]
  some: #{entity.name}Filter
  none: #{entity.name}Filter
  every: #{entity.name}Filter
}

input Embed#{entity.name}FilterItem {
  some: #{entity.name}Filter
  none: #{entity.name}Filter
  every: #{entity.name}Filter
}

input #{entity.name}Filter {
  or: [#{entity.name}FilterItem]
  and: [#{entity.name}FilterItem]
<#-entity.filter.forEach((item, index)=>{#>
  #{item}
<#-})#>
}

input #{entity.name}ComplexFilter {
  or: [#{entity.name}FilterItem]
  and: [#{entity.name}FilterItem]
<#-entity.filterEmbed.forEach((item, index)=>{#>
  #{item}
<#-})#>
}

input #{entity.name}FilterItem {
<#-entity.filterEmbed.forEach((item, index)=>{#>
  #{item}
<#-})#>
}

input #{entity.name}FilterSubscriptions {
  or: [#{entity.name}FilterSubscriptions]
  and: [#{entity.name}FilterSubscriptions]
<#-entity.filter.forEach((item, index)=>{#>
  #{item}
<#-})#>
}

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
  #{rel.name}(after: String, first: Int, before: String, last: Int, limit: Int, skip: Int, orderBy: [#{rel.entity}SortOrder], filter:#{rel.entity}Filter ): #{rel.connectionName}
  <#-}-#>
  <#-}-#>
<#-})#>
}


