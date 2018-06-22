<#@ context "ctx" -#>
<#@ alias 'edit-rel-single-not-embed' -#>
<#-
  const {entity, f} = ctx;
-#>
<ReferenceInput 
  label="resources.#{entity.name}.fields.#{f.field}"
  source="#{f.field}Id"
  reference="#{entity.role}/#{f.ref.entity}"
  <# if (!f.required){#>allowEmpty<#} else {#>validate={required()}<#}#>
>
  <AutocompleteInput 
    optionText="#{f.ref.listLabel.source}" 
  />
</ReferenceInput>