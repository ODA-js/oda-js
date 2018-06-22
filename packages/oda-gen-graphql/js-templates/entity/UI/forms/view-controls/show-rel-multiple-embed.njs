<#@ context "ctx" -#>
<#@ alias 'show-rel-multiple-embed' -#>
<#-
  const {entity, f} = ctx;
-#>
<ArrayField addLabel={false} source="#{f.field}Values" >
  <#{f.ref.entity}.Grid />
</ArrayField>