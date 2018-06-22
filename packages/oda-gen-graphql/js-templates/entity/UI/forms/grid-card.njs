<#@ context "entity" -#>
<#@ alias 'grid-card' -#>

import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import {
  Datagrid,
  TextField,
  DateField,
  NumberField,
  BooleanField,
  EditButton,
  DeleteButton,
  ShowButton,
  ReferenceField,
  FieldTitle,
} from 'react-admin';

const cardStyle = {
  width: 240,
  margin: '0.5rem',
  display: 'inline-block',
  verticalAlign: 'top',
};

const Label = ({ label }, { translate }) => (
  <label>{translate(label)}:&nbsp;</label>
);

Label.contextTypes = {
  translate: PropTypes.func.isRequired,
};

const CommentGrid = ({ ids, data, basePath }, { translate }) => (
  <div>
    { ids.length > 0 ? (
      ids.map(id => (
        <Card key={id} style={cardStyle}>
          <CardHeader title={<TextField record={data[id]} source="#{entity.listLabel.source}" />} />
          <CardContent>
            <div>
        <#- entity.fields.filter(f=>f.name!== "id")
.filter(f=>entity.UI.list[f.name] || entity.UI.quickSearch.indexOf(f.name)!== -1)
.forEach(f=>{#>
              <div>
                <Label label="resources.#{entity.name}.fields.#{f.name}" />
                <#{f.type}Field record={data[id]} source="#{f.name}" />
              </div>
<#})-#>
<# entity.relations
.filter(f=>entity.UI.list[f.field])
.forEach(f=>{
-#><#-if(f.single){-#>
              <div>
                <Label label="resources.#{entity.name}.fields.#{f.name}" />
                <ReferenceField label="resources.#{entity.name}.fields.#{f.field}" sortable={false} source="#{f.field}Id" reference="#{entity.role}/#{f.ref.entity}"<# if (!f.required){#> allowEmpty <#}#>>
                  <#{f.ref.listLabel.type}Field source="#{f.ref.listLabel.source}"<# if (!f.required){#> allowEmpty <#}#>/>
                </ReferenceField>
              </div>
<#-}-#>
<#-})#>
            </div>
          </CardContent>
          <CardActions style={{ textAlign: 'right' }}>
            <EditButton
              resource="#{entity.role}/#{entity.name}"
              basePath={basePath}
              record={data[id]}
            />
            <ShowButton
              resource="#{entity.role}/#{entity.name}"
              basePath={basePath}
              record={data[id]}
            />
            <DeleteButton
              resource="#{entity.role}/#{entity.name}"
              basePath={basePath}
              record={data[id]}
            />
          </CardActions>
        </Card>
      ))
    ) : (
      <div style={{ height: '10vh' }} />
    )}
  </div>
);

CommentGrid.defaultProps = {
  data: {},
  ids: [],
};

CommentGrid.contextTypes = {
  uix: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
};

export default CommentGrid;
