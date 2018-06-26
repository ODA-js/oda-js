<#@ context "entity" -#>
<#@ alias 'forms-grid-view' -#>

import React from "react";
import PropTypes from 'prop-types';

import {
  Datagrid,
  EditButton,
  DeleteButton,
  ShowButton,
  #{slot('import-from-react-admin-grid-view')}
} from "react-admin";

const Grid = (props) => (
  <Datagrid {...props} >
<# entity.props.filter(f=>f.name!== "id")
.filter(f =>entity.UI.list[f.name] || entity.UI.quickSearch.indexOf(f.name)!== -1)
.forEach(f => {
  if (!f.ref) {#>
<#- slot('import-from-react-admin-grid-view',`${f.type}Field`)#>
    <#{f.type}Field sortable={#{!f.derived}} label="resources.#{entity.name}.fields.#{f.name}" source="#{f.name}"<# if (!f.required){#> allowEmpty<#}#> />
<#} else if(f.ref && f.single) {#>
<#- slot('import-from-react-admin-grid-view','ReferenceField')#>
<#- slot('import-from-react-admin-grid-view',`${f.ref.listLabel.type}Field`)#>
    <ReferenceField label="resources.#{entity.name}.fields.#{f.field}" sortable={false} source="#{f.field}Id" reference="#{entity.role}/#{f.ref.entity}"<# if (!f.required){#> allowEmpty <#}#>>
      <#{f.ref.listLabel.type}Field source="#{f.ref.listLabel.source}"<# if (!f.required){#> allowEmpty <#}#>/>
    </ReferenceField>
<#-}-#>
<#-})#>
    <ShowButton label={false} />
    <EditButton label={false} />
    <DeleteButton label={false} />
  </Datagrid>
);

Grid.contextTypes = {
  translate: PropTypes.func.isRequired,
}

export default Grid;