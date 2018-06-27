<#@ context "ctx" -#>
<#@ alias 'show-rel-multiple-embed' -#>
<#-
  const {entity, f} = ctx;
-#>

<#- slot('import-from-react-admin-show','ArrayField') #>
<ArrayField addLabel={false} source="#{f.field}Values" >
  <#{f.ref.entity}.Grid />
</ArrayField>