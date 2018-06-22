<#@ context "ctx" -#>
<#@ alias 'show-field' -#>
<#-
  const {entity, f} = ctx;
-#>
<#{f.type=="Number" ? "Text" : f.type}Field 
  label="resources.#{entity.name}.fields.#{f.name}" 
  source="#{f.name}"
  <#- if (!f.required){#>
  allowEmpty<#}#>
/>