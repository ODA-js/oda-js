<#@ context "ctx" -#>
<#@ alias 'edit-rel-single-embed' -#>
<#-
  const {entity, f} = ctx;
-#>
<#- let current = entity.UI.embedded.names[f.field]; -#>
<#-
  let embededEntity = entity.UI.embedded.items[current].entity;
-#>
<#-if(f.inheritedFrom){-#>
uix.#{f.inheritedFrom}.Fragments.#{f.name}.edit({uix, source})
<#-} else {-#>
uix.#{embededEntity}.getFields({name:'all', uix, type: 'edit', source: `${source}#{f.field}`})
<#-}-#>