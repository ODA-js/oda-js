<#@ context "ctx" -#>
<#@ alias 'edit-rel-multiple-not-embed' -#>
<#-
  const {entity, f} = ctx;
-#>
<ReferenceArrayInput 
  label="resources.#{entity.name}.fields.#{f.field}"
  source="#{f.field}Ids"
  reference="#{entity.role}/#{f.ref.entity}"
  <# if (!f.required){#>allowEmpty<#} else {#> validate={required()}<#}#> 
>
  <SelectArrayInput 
    options={{ fullWidth: true }}
    optionText="#{f.ref.listLabel.source}"
    optionValue="id" 
  />
</ReferenceArrayInput>