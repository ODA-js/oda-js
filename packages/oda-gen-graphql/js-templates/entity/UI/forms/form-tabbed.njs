<#@ context "entity" -#>
<#@ alias 'forms-form-tabbed' -#>
<#@ extend 'forms-form-base' -#>

<# block 'import-from-react-admin' : -#>
#{slot('import-from-react-admin-form-tab')}
<#- end -#>

<# block 'use-translate-block' : -#>
#{slot('use-translate')}
<#- end -#>

<# block 'use-action-type-func-block' : -#>
#{slot('use-action-type-func')}
<#- end -#>

<# block 'use-single-rel-block' : -#>
#{slot('use-single-rel')}
<#- end -#>

<# block 'use-many-rel-block' : -#>
#{slot('use-many-rel')}
<#- end -#>

<# block 'form' : -#>
  const { props } = this;
  #{content('use-action-type-func-block')}
  #{content('use-single-rel-block')}
  #{content('use-many-rel-block')}
  #{content('use-translate-block')}
  return (
<#- slot('import-from-react-admin-form-tab', 'TabbedForm,\n')#>
<#- slot('import-from-react-admin-form-tab', 'FormTab,\n')#>
    <TabbedForm {...props} >
      <FormTab label="resources.#{entity.name}.summary">
<# entity.fields.filter(f=>!f.derived ).filter(f=>f.name!== "id")
  .filter(f=>(entity.UI.edit[f.name] || entity.UI.list[f.name] || entity.UI.show[f.name]) && entity.UI.edit[f.name]!== false )
  .forEach( f=> {
    const ctx = {entity, f};
-#>
      #{partial(ctx, "edit-field")}
<#})-#>
    </FormTab>
<# entity.relations
.filter(f => (entity.UI.edit[f.field] || entity.UI.list[f.field] || entity.UI.show[f.field]) && entity.UI.edit[f.field]!== false)
.forEach(f => {
  const ctx = {entity, f};
  const embedded = entity.UI.embedded.names.hasOwnProperty(f.field);
#>
    <FormTab label="resources.#{entity.name}.fields.#{f.field}">
<#-   if ( f.single ) {
        if(embedded) {#>
      #{partial(ctx, "edit-rel-single-embed")}
<#} else {#>
      #{partial(ctx, "edit-rel-single-not-embed")}
<#}#>
<#-
      } else {
  #>
<# if(embedded){#>
      #{partial(ctx, "edit-rel-multiple-embed")}
<#} else {-#>
      #{partial(ctx, "edit-rel-multiple-not-embed")}
<#}#>
<#-}-#>
    </FormTab>
<#-})#>
  </TabbedForm>
);
<#- end -#>