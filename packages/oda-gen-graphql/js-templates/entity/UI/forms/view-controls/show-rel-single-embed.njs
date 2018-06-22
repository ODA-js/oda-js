<#@ context "ctx" -#>
<#@ alias 'show-rel-single-embed' -#>
<#-
  const {entity, f, current} = ctx;
-#>
<EmbeddedField
  addLabel={false}
  source="#{f.field}Value"
>
<#
  let embededEntity = entity.UI.embedded.items[current].entity;
  let reUI = entity.UI.embedded.items[current].UI;
  entity.UI.embedded.items[current].fields
  .filter(f=>
    f.name !== 'id' &&
    (reUI.edit[f.name] ||
    reUI.list[f.name] ||
    reUI.show[f.name]) && 
    reUI.show[f.name] !== false)
  .forEach(f=>{-#>
  <#{f.type=="Number" ? "Text" : f.type}Field 
    label="resources.#{embededEntity}.fields.#{f.name}"
    source="#{f.name}"<# if (!f.required){#> allowEmpty<#}#> />
<#
        });
-#>
  <ShowButton resource="#{entity.role}/#{f.ref.entity}"/>
  <EditButton resource="#{entity.role}/#{f.ref.entity}"/>
  <DeleteButton resource="#{entity.role}/#{f.ref.entity}"/>
</EmbeddedField>