<#@ context "entity" -#>
<#@ alias 'forms-show-base' -#>

import React from "react";
import PropTypes from 'prop-types';
import {
  Datagrid,
  TextField,
  DateField,
  NumberField,
  FunctionField,
  BooleanField,
  EditButton,
  DeleteButton,
  ShowButton,
  ReferenceManyField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  required,
  RichTextField,
  ShowController,
  ShowView,
  ArrayField,
  #{content('import-react-admin')}
} from "react-admin";

import { consts, actions, show, components } from 'oda-ra-ui';

const LongTextField = TextField;

const { EmbeddedRefField, EmbeddedField } = components;

const showIfExists = field => root => !!root[field];

const showIfNotEmptyRel = field => root => !!root[field] || (Array.isArray(root[field]) && root[field].length > 0);

const ShowRecordView = (props, context) => {
  const { translate, uix } = context;
  const { Title } = uix['#{entity.role}/#{entity.name}'];
<#-
const manyRels = entity.relations.filter(f => !f.single);
if(manyRels.length > 0){#>
<#
 const uniqueEntities = manyRels.filter(f=> !f.single/*  && !entity.UI.embedded.names.hasOwnProperty(f.field) */)
  .reduce((hash, curr)=> {
    hash[curr.ref.entity] = curr;
    return hash;
  }, {});

  Object.keys(uniqueEntities).forEach(key=>{
    let f = uniqueEntities[key];
-#>
  const #{f.ref.entity} = uix['#{entity.role}/#{f.ref.entity}'];
<#})-#>
<#-}-#>

  return (
    <Show title={<Title />} {...props}>
      #{content('view')}
    </Show>
  );
};

ShowRecordView.contextTypes = {
  uix: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
}

export default ShowRecordView;
