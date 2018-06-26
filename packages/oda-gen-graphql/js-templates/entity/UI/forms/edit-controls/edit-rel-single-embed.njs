<#@ context "ctx" -#>
<#@ alias 'edit-rel-single-embed' -#>
<#-
  const {entity, f} = ctx;
-#>
<#- slot('import-from-react-admin-form', 'ReferenceInput,\n')#>
<#- slot('import-from-react-admin-form', 'SelectInput,\n')#>
<#- slot('import-from-react-admin-form', 'required,\n')#>
<#- slot('import-from-react-admin-form', 'AutocompleteInput,\n')#>
<#- slot('use-action-type', true)#>
<#- slot('use-action-type-func', true)#>
<#- slot('use-single-rel',true) -#>
<ReferenceInput label="resources.#{entity.name}.fields.#{f.field}" source="#{f.field}Id" reference="#{entity.role}/#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required()}<#}#> >
  <AutocompleteInput optionText="#{f.ref.listLabel.source}" />
</ReferenceInput>
<SelectInput
  source="#{f.field}Type"
  label="uix.actionType.ExpectedTo"
  choices={singleRelActions}
  defaultValue={actionType.USE}
/>
<#
  let current = entity.UI.embedded.names[f.field];
#>
<#
  let embededEntity = entity.UI.embedded.items[current].entity;
  entity.UI.embedded.items[current].fields.filter(f=>f.name !== 'id').forEach(f=>{
-#>
<#- slot('import-from-react-admin-form', `${f.type}Input,\n`)#>
<#{f.type}Input
  <#if(f.defaultValue){#>defaultValue={#{f.defaultValue}}<#}#>
  label="resources.#{embededEntity}.fields.#{f.name}"
  source="#{f.name}"
  <# if (!f.required){#>allowEmpty<#} else {#>validate={required()}<#}#> 
/>
<#
  });
-#>