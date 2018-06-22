<#@ context "entity" -#>
<#@ alias 'forms-filter' -#>

import React from "react";
import PropTypes from 'prop-types';
import {
  ReferenceInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput,
  SimpleForm,
  TextInput,
  DateInput,
  NumberInput,
  BooleanInput,
  NullableBooleanInput,
  Filter,
} from "react-admin";
import RichTextInput from 'ra-input-rich-text';
<#var filteredFields = entity.fields.filter(f=>!f.derived ).filter(f=>f.name!== "id")
  .filter(f=>entity.UI.list[f.name]); #>
const FilterPanel = (props, {translate}) => (
  <Filter {...props} >
<#-if (Array.isArray(entity.UI.quickSearch) && entity.UI.quickSearch.length > 0) {#>
    <TextInput label="uix.filter.search" source="q" allowEmpty alwaysOn />
<#}-#>
<#if(filteredFields.length > 0) {#>
<# filteredFields.forEach( f=> {
    let label = `uix.${entity.name}.filter.${f.name}`;
-#>
    <NullableBooleanInput label={translate("uix.filter.exists",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-exists" />
<#
    switch(f.filterType) {
      case "Number":
#>
    <NumberInput label={translate("uix.filter.eq",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-eq" allowEmpty />
    <NumberInput label={translate("uix.filter.lte",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-lte" allowEmpt />
    <NumberInput label={translate("uix.filter.gte",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-gte" allowEmpty />
    <NumberInput label={translate("uix.filter.lt",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-lt" allowEmpt />
    <NumberInput label={translate("uix.filter.gt",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-gt" allowEmpty />
<#
      break;
      case "Text":
#>
    <#{f.filterType}Input label={translate("uix.filter.imatch",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-imatch" allowEmpty />
    <SelectArrayInput label={translate("uix.filter.in",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-in" allowEmpty />
    <SelectArrayInput label={translate("uix.filter.nin",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-nin" allowEmpty />
<#
      break;
      case "ID":
#>
    <TextInput label={translate("uix.filter.eq",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-eq" allowEmpty />
    <SelectArrayInput label={translate("uix.filter.in",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-in" allowEmpty />
    <SelectArrayInput label={translate("uix.filter.nin",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-nin" allowEmpty />
<#
      break;
      case "Date":
#>
    <DateInput label={translate("uix.filter.lte",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-lte" allowEmpty />
    <DateInput label={translate("uix.filter.gte",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-gte" allowEmpty />
<#
      break;
      case "Boolean":
#>
    <BooleanInput label={translate("uix.filter.eq",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-eq" allowEmpty />
<#
      break;
    }
  })-#>
<#}#>
  </Filter>
);

FilterPanel.contextTypes = {
  translate: PropTypes.func.isRequired,
}

export default FilterPanel;