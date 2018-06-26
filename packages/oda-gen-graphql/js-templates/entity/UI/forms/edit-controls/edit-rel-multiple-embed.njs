<#@ context "ctx" -#>
<#@ alias 'edit-rel-multiple-embed' -#>
<#-
  const {entity, f} = ctx;
-#>
<#- slot('import-from-react-admin-form', 'ArrayInput,\n')-#>
<#- slot('import-from-react-admin-form', 'SimpleFormIterator,\n')-#>
<#- slot('import-from-react-admin-form', 'SelectInput,\n')-#>
<#- slot('import-from-react-admin-form', 'ReferenceInput,\n')-#>
<#- slot('use-action-type', true)-#>
<ArrayInput label="resources.#{entity.name}.fields.#{f.field}" source="#{f.field}Values" allowEmpty >
  <SimpleFormIterator>
    <SelectInput
      source="#{f.field}Type"
      label="uix.actionType.ExpectedTo"
      choices={manyRelAction}
      defaultValue={actionType.USE}
    />
      <ReferenceInput 
        label={translate("resources.#{f.ref.entity}.name", { smart_count: 1})}
        source="id"
        reference="#{entity.role}/#{f.ref.entity}"
        <# if (!f.required){#>allowEmpty<#} else {#>validate={required()}<#}#> 
      >
        <SelectInput 
          optionText="#{f.ref.listLabel.source}" />
      </ReferenceInput>
<#-
  let current = entity.UI.embedded.names[f.field];
  let embededEntity = entity.UI.embedded.items[current].entity;
  let fields = entity.UI.embedded.items[current].fields.filter(f=>f.name !== 'id');
  const fieldCount = fields.length + (f.verb === 'BelongsToMany' ? f.ref.fields.filter(fld => f.ref.using.UI.edit[fld.name] ).length : 0);
  if(fieldCount > 0) {-#>
<#-entity.UI.embedded.items[current].fields.filter(f=>f.name !== 'id')
.forEach(f=>{-#>
<#-slot('import-from-react-admin-form', `${f.type}Input,\n`)-#>
      <#{f.type}Input
        <#-if(f.defaultValue){#>
        defaultValue={#{f.defaultValue}}<#}#>
        label="resources.#{embededEntity}.fields.#{f.name}"
        source="#{f.name}"
        <#- if (!f.required){#>
        allowEmpty<#} else {#>
        validate={required()}<#}#>
      />
<#
  });
-#><#-
  if(f.verb === 'BelongsToMany') {
    f.ref.fields
    .filter(fld => f.ref.using.UI.edit[fld.name])
    .forEach(fld=>{-#>
<#- slot('import-from-react-admin-form', `${fld.type}Input,\n`)-#>
      <#{fld.type}Input
        <#if(f.defaultValue){#>defaultValue={#{f.defaultValue}}<#}#>
        label="resources.#{f.ref.using.entity}.fields.#{fld.name}"
        source="#{fld.name}"
        <#- if (!fld.required){#>
        allowEmpty<#} else {#>
<#- slot('import-from-react-admin-form', 'required')#>
        validate={required()}<#}#> 
      />
<#-
    });
  }
-#>
<#-}-#>
  </SimpleFormIterator>
</ArrayInput>