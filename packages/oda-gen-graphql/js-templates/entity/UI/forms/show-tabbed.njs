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
<#- entity.props.filter(f=>f.name!== "id")
.forEach(f => {
  const ctx = {entity, f};
  if (!f.ref) {
    if((entity.UI.edit[f.name] || entity.UI.list[f.name] || entity.UI.show[f.name]) && entity.UI.show[f.name] !== false){
#>
  #{partial(ctx, "show-field")}
<#-  }
  } else if(f.ref) {
    if((entity.UI.edit[f.field] || entity.UI.list[f.field] || entity.UI.show[f.field]) && entity.UI.show[f.field] !== false) {
      ctx.verb = f.verb;
      const embedded = entity.UI.embedded.names.hasOwnProperty(f.field);
      if(f.single && !embedded){
#>
  #{partial(ctx, "show-rel-single-not-embed")}
<#-   }
    }
  }
});
#>
  </Tab>
<# entity.relations
.filter(f=>(entity.UI.edit[f.field] || entity.UI.list[f.field] || entity.UI.show[f.field]) && entity.UI.show[f.field] !== false)
.forEach(f=>{
  const embedded = entity.UI.embedded.names.hasOwnProperty(f.field);
  if ( f.single && !embedded ) {
    return;
  }
  const ctx = {entity, f};
-#>
  <Tab label="resources.#{entity.name}.fields.#{f.field}">
<#-if(f.single){-#>
<#-if(embedded){
  // for future discussions
        ctx.current = entity.UI.embedded.names[f.field];
#>
    #{partial(ctx, "show-rel-single-embed")}
<#} else {
    // #{partial(ctx, "show-rel-single-not-embed")}
  }-#>
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