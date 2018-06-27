<#@ context "ctx" -#>
<#@ alias 'edit-rel-single-not-embed' -#>
<#-
  const {entity, f} = ctx;
-#>
<#- slot('import-from-react-admin-form', 'ReferenceInput')#>
<#- slot('import-from-react-admin-form', 'required')#>
<ReferenceInput 
  label="resources.#{entity.name}.fields.#{f.field}"
  source="#{f.field}Id"
  reference="#{entity.role}/#{f.ref.entity}"
  <# if (!f.required){#>allowEmpty<#} else {#>validate={required()}<#}#>
>
<#- slot('import-from-react-admin-form', 'AutocompleteInput')#>
  <AutocompleteInput 
    optionText="#{f.ref.listLabel.source}" 
  />
</ReferenceInput>