<#@ context "ctx" -#>
<#@ alias 'edit-rel-multiple-not-embed' -#>
<#-
  const {entity, f} = ctx;
-#>
<#- slot('import-from-react-admin-form', 'ReferenceArrayInput,\n')#>
<#- slot('import-from-react-admin-form', 'SelectArrayInput,\n')#>
<#- slot('import-from-react-admin-form', 'required,\n')#>
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