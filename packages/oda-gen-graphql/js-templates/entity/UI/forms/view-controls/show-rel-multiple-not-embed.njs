<#@ context "ctx" -#>
<#@ alias 'show-rel-multiple-not-embed' -#>
<#-
  const {entity, f} = ctx;
-#>

<#- slot('import-from-react-admin-show','ReferenceManyField,\n') #>

<ReferenceManyField 
  addLabel={false}
  reference="#{entity.role}/#{f.ref.entity}"
  target="#{f.ref.opposite}"
  source="#{f.ref.backField}"
  <# if (!f.required){#>allowEmpty<#} else {#>validate={required()}<#}#>
>
  <#{f.ref.entity}.Grid />
</ReferenceManyField>