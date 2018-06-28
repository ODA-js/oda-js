<#@ context "entity" -#>
<#@ alias 'forms-form-tabbed' -#>
<#@ extend 'forms-form-base' -#>

<# block 'import-from-react-admin' : -#>
#{slot('import-from-react-admin-form-tab')}
<#- end -#>

<# block 'form' : -#>
  const { props } = this;
  #{slot('use-action-type-func')}
  #{slot('use-single-rel')}
  #{slot('use-many-rel')}
  #{slot('use-translate')}
  return (
<#- slot('import-from-react-admin-form-tab', 'TabbedForm')#>
<#- slot('import-from-react-admin-form-tab', 'FormTab')#>
    <TabbedForm {...props} >
      <FormTab label="resources.#{entity.name}.summary">
<#- entity.props.filter(f=>f.name!== "id")
.forEach(f => {
  const ctx = {entity, f};
  if (!f.ref) {
    if(!f.derived && 
    (entity.UI.quickSearch.indexOf(f.name)!== -1 || 
      entity.UI.edit[f.name] ||
      entity.UI.list[f.name] ||
      entity.UI.show[f.name]) &&
    entity.UI.edit[f.name]!== false) {#>
        #{partial(ctx, "edit-field")}
<#-
    }
  } else if(f.ref) {
    if(
      (entity.UI.edit[f.field] ||
       entity.UI.list[f.field] || 
       entity.UI.show[f.field]) && 
      entity.UI.edit[f.field]!== false) {
    const embedded = entity.UI.embedded.names.hasOwnProperty(f.field);
-#>
<#- if ( f.single && !embedded ) {#>
        #{partial(ctx, "edit-rel-single-not-embed")}
<#- }-#>
<#-}
  }
});
#>
      </FormTab>
<#- entity.relations
.filter(f => (entity.UI.edit[f.field] || entity.UI.list[f.field] || entity.UI.show[f.field]) && entity.UI.edit[f.field]!== false)
.forEach(f => {
  const embedded = entity.UI.embedded.names.hasOwnProperty(f.field);
  if ( f.single && !embedded ) {
    return;
  }
  const ctx = {entity, f};
#>
      <FormTab label="resources.#{entity.name}.fields.#{f.field}">
<#-   if ( f.single ) {-#>
<#        if(embedded) {
#>
        #{partial(ctx, "edit-rel-single-embed")}
<#-   } else {
        // #{partial(ctx, "edit-rel-single-not-embed")}
       }#>
<#-} else {#>
<#- if(embedded){-#>

        #{partial(ctx, "edit-rel-multiple-embed")}
<#-} else {-#>

        #{partial(ctx, "edit-rel-multiple-not-embed")}
<#-}#>
<#-}#>
      </FormTab>
<#-})#>
    </TabbedForm>
  );
<# end #>