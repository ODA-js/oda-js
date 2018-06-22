<#@ context "ctx" -#>
<#@ alias 'edit-rel-single-embed' -#>
<#-
  const {entity, f} = ctx;
-#>
<ReferenceInput label="resources.#{entity.name}.fields.#{f.field}" source="#{f.field}Id" reference="#{entity.role}/#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required()}<#}#> >
  <AutocompleteInput optionText="#{f.ref.listLabel.source}" />
</ReferenceInput>
<SelectInput
  source="#{f.field}Type"
  label="uix.actionType.ExpectedTo"
  choices={singleRelActions}
  defaultValue={actionType.USE}
/>
<#
  let current = entity.UI.embedded.names[f.field];
#>
<#
  let embededEntity = entity.UI.embedded.items[current].entity;
  entity.UI.embedded.items[current].fields.filter(f=>f.name !== 'id').forEach(f=>{
-#>
<#{f.type}Input
  <#if(f.defaultValue){#>defaultValue={#{f.defaultValue}}<#}#>
  label="resources.#{embededEntity}.fields.#{f.name}"
  source="#{f.name}"
  <# if (!f.required){#>allowEmpty<#} else {#>validate={required()}<#}#> 
/>
<#
  });
-#>