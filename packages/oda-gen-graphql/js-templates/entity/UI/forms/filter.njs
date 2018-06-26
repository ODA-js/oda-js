<#@ context "entity" -#>
<#@ alias 'forms-filter' -#>

import React from "react";
import PropTypes from 'prop-types';
import {
    Filter,
  #{slot('import-from-react-admin-filter')}
} from "react-admin";

<#var filteredFields = entity.fields.filter(f=>!f.derived ).filter(f=>f.name!== "id")
  .filter(f=>entity.UI.list[f.name]); #>
const FilterPanel = (props, {translate}) => (
  <Filter {...props} >
<#-if (Array.isArray(entity.UI.quickSearch) && entity.UI.quickSearch.length > 0) {#>
<#- slot('import-from-react-admin-filter','TextInput')-#>
    <TextInput label="uix.filter.search" source="q" allowEmpty alwaysOn />
<#}-#>
<#if(filteredFields.length > 0) {#>
<# filteredFields.forEach( f=> {
    let label = `uix.${entity.name}.filter.${f.name}`;
-#>
<#- slot('import-from-react-admin-filter','NullableBooleanInput')-#>
    <NullableBooleanInput label={translate("uix.filter.exists",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-exists" />
<#
    switch(f.filterType) {
      case "Number":
#>
<#- slot('import-from-react-admin-filter','NumberInput')-#>
    <NumberInput label={translate("uix.filter.eq",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-eq" allowEmpty />
    <NumberInput label={translate("uix.filter.lte",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-lte" allowEmpt />
    <NumberInput label={translate("uix.filter.gte",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-gte" allowEmpty />
    <NumberInput label={translate("uix.filter.lt",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-lt" allowEmpt />
    <NumberInput label={translate("uix.filter.gt",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-gt" allowEmpty />
<#
      break;
      case "Text":
#>
<#- slot('import-from-react-admin-filter',`${f.filterType}Input`)-#>
<#- slot('import-from-react-admin-filter','SelectArrayInput')-#>
    <#{f.filterType}Input label={translate("uix.filter.imatch",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-imatch" allowEmpty />
    <SelectArrayInput label={translate("uix.filter.in",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-in" allowEmpty />
    <SelectArrayInput label={translate("uix.filter.nin",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-nin" allowEmpty />
<#
      break;
      case "ID":
#>
<#- slot('import-from-react-admin-filter','TextInput')-#>
<#- slot('import-from-react-admin-filter','SelectArrayInput')-#>
    <TextInput label={translate("uix.filter.eq",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-eq" allowEmpty />
    <SelectArrayInput label={translate("uix.filter.in",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-in" allowEmpty />
    <SelectArrayInput label={translate("uix.filter.nin",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-nin" allowEmpty />
<#
      break;
      case "Date":
#>
<#- slot('import-from-react-admin-filter','DateInput')-#>
    <DateInput label={translate("uix.filter.lte",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-lte" allowEmpty />
    <DateInput label={translate("uix.filter.gte",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-gte" allowEmpty />
<#
      break;
      case "Boolean":
#>
<#- slot('import-from-react-admin-filter','BooleanInput')-#>
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