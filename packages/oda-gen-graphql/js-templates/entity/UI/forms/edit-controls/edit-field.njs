<#@ context "ctx" -#>
<#@ alias 'edit-field' -#>
<#-
  const {entity, f} = ctx;
-#>
<#- slot('import-from-react-admin-form', `${f.type}Input`)-#>
<#{f.type}Input
  <#-if(f.defaultValue){#>
  defaultValue={#{f.defaultValue}}<#}#>
  label="resources.#{entity.name}.fields.#{f.name}"
  source="#{f.name}"
  <# if (!f.required){#>allowEmpty<#} else {#>validate={required()}<#}#> 
/>