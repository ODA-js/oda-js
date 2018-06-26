<#@ context "ctx" -#>
<#@ alias 'show-rel-single-not-embed' -#>
<#-
  const {entity, f, current} = ctx;
-#>
<#- slot('import-from-react-admin-show','ReferenceField,\n') #>
<ReferenceField 
  addLabel={false} 
  source="#{f.field}Id" 
  reference="#{entity.role}/#{f.ref.entity}"
  <# if (!f.required){#>allowEmpty<#}#>
  linkType="show"
>
  <#{f.ref.listLabel.type}Field 
    source="#{f.ref.listLabel.source}"
    <# if (!f.required){#>allowEmpty<#} else {#>validate={required()}<#}#> 
  />
</ReferenceField>