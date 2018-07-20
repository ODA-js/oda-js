<#@ context "ctx" -#>
<#@ alias 'edit-field' -#>
<#-
const {entity, f} = ctx;
const type = `${f.type}Input`;
if(f.type === 'JSON'){
  slot('import-from-ra-ui-components-form',`${type}`);
} else {
  slot('import-from-react-admin-form',`${type}`);
}
-#>
<#{f.type}Input
  <#-if(f.defaultValue){#>
  defaultValue={#{f.defaultValue}}<#}#>
  label="resources.#{entity.name}.fields.#{f.name}"
  source="#{f.name}"
  <# if (!f.required){-#>
  allowEmpty<#} else {-#>
<#- slot('import-from-react-admin-form', 'required')-#>
  validate={required()}<#}#> 
/>