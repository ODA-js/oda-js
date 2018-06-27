<#@ context "entity" -#>
<#@ alias 'forms-show-tabbed' -#>
<#@ extend 'forms-show-base' -#>

<# block 'import-from-react-admin' : -#>
#{slot('import-from-react-admin-show-tab')}
<#- end -#>

<# block 'view' : -#>
<# slot('import-from-react-admin-show-tab', 'TabbedShowLayout')#>
<# slot('import-from-react-admin-show-tab', 'Tab')#>
<TabbedShowLayout>
  <Tab label="resources.#{entity.name}.summary">
<#entity.fields.filter(f=>f.name!== "id")
.filter(f=>(entity.UI.edit[f.name] || entity.UI.list[f.name] || entity.UI.show[f.name]) && entity.UI.show[f.name] !== false)
.forEach(f=>{
    const ctx = {entity, f};
-#>
    #{partial(ctx, "show-field")}
<#})-#>
  </Tab>
<# entity.relations
.filter(f=>(entity.UI.edit[f.field] || entity.UI.list[f.field] || entity.UI.show[f.field]) && entity.UI.show[f.field] !== false)
.forEach(f=>{
  const embedded = entity.UI.embedded.names.hasOwnProperty(f.field);
  const ctx = {entity, f};
-#>
  <Tab label="resources.#{entity.name}.fields.#{f.field}">
<#-if(f.single){-#>
<#-if(embedded){
  // for future discussions
        ctx.current = entity.UI.embedded.names[f.field];
#>
    #{partial(ctx, "show-rel-single-embed")}
<#} else {#>
    #{partial(ctx, "show-rel-single-not-embed")}
<#-}-#>
<#-} else {-#>
<#-if( embedded ){#>
    #{partial(ctx, "show-rel-multiple-embed")}
<#-} else {#>
    #{partial(ctx, "show-rel-multiple-not-embed")}
<#-}-#>
<#-}#>
  </Tab>
<#})-#>
</TabbedShowLayout>
<#- end -#>