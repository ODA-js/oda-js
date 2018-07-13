<#@ context "ctx" -#>
<#@ alias 'show-rel-single-not-embed' -#>
<#-
  const {entity, f, current} = ctx;
-#>
<#- slot('import-from-react-admin-show','ReferenceField') -#>
<ReferenceField 
  addLabel={false} 
  source="#{f.field}Id" 
  reference="#{entity.role}/#{f.ref.entity}"
  linkType="show"
>
<#- slot('import-from-react-admin-show',`${f.ref.listLabel.type}Field`) #>
  <#{f.ref.listLabel.type}Field 
    source="#{f.ref.listLabel.source}"
  />
</ReferenceField>