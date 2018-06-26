<#@ context "ctx" -#>
<#@ alias 'show-field' -#>
<#-
  const {entity, f} = ctx;
-#>
<#-
const type = f.type=="Number" ? "Text" : f.type + 'Field';
slot('import-from-react-admin-show',`${type},\n`);
#>
<#{type} 
  label="resources.#{entity.name}.fields.#{f.name}" 
  source="#{f.name}"
  <#- if (!f.required){#>
  allowEmpty<#}#>
/>