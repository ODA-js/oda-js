<#@ context "ctx" -#>
<#@ alias 'show-rel-multiple-not-embed' -#>
<#-
  const {entity, f} = ctx;
-#>
<#- slot('import-from-react-admin-show','ReferenceManyField') -#>
<ReferenceManyField 
  addLabel={false}
  reference="#{entity.role}/#{f.ref.entity}"
  target="#{f.ref.opposite}"
  source="#{f.ref.backField}"
>
  <#{f.ref.entity}.Grid />
</ReferenceManyField>