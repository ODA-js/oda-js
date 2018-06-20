<#@ context "entity" -#>
<#
  const translation = {};
#>
<#@ chunks "$$$main$$$" -#>

<#- chunkStart(`../../../${entity.name}/uix/index`); -#>
import loadable from 'loadable-components'

const Title = loadable(() => import('./title'));
const Filter = loadable(() => import('./filter'));
const Form = loadable(() => import('./form'));
const Create = loadable(() => import('./create'));
const Show = loadable(() => import('./show'));
const Edit = loadable(() => import('./edit'));
const List = loadable(() => import('./list'));
const Grid = loadable(() => import('./grid'));
const GridView = loadable(() => import('./gridView'));
const CardView = loadable(() => import('./cardView'));

export default {
  name: '#{entity.name}',
  role: '#{entity.role}',
  Title,
  Filter,
  Form,
  Create,
  Show,
  Edit,
  List,
  Grid,
  GridView,
  CardView
};

<#- chunkStart(`../../../${entity.name}/uix/title`); -#>
import React from "react";
import PropTypes from 'prop-types';

const Title = ({ record },{translate}) => (
  <span>
    {translate('resources.#{entity.name}.fields.#{entity.listLabel.source}', {smart_count : 1})} {record ? `"${record.#{entity.listLabel.source}}"` : ""}
  </span>
);

Title.contextTypes = {
  translate: PropTypes.func.isRequired,
}

export default Title;

<#- chunkStart(`../../../${entity.name}/uix/list`); -#>
import React from "react";
import PropTypes from 'prop-types';
import {
  List,
} from "react-admin";

const ListView = (props, context) => {
  const { Grid, Filter } = context.uix['#{entity.role}/#{entity.name}'];

  return (
    <List {...props} filters={<Filter />} title={context.translate("resources.#{entity.name}.name", { smart_count:2 })}>
      <Grid {...props} />
    </List>
  )
};

ListView.contextTypes = {
  uix: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
}

export default ListView;

<#- chunkStart(`../../../${entity.name}/uix/grid`); -#>
import React from "react";
import PropTypes from 'prop-types';

import {
  Responsive,
} from "react-admin";

const Grid = (props, context) => {
  const { CardView, GridView } = context.uix['#{entity.role}/#{entity.name}'];
  return (
  <Responsive
    small={<CardView {...props} />}
    medium={<GridView {...props} />}
  />
);
}

Grid.contextTypes = {
  uix: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
}

export default Grid;
<#- chunkStart(`../../../${entity.name}/uix/gridView`); -#>
import React from "react";
import PropTypes from 'prop-types';

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
  Responsive,
} from "react-admin";

const Grid = (props) => (
  <Datagrid {...props} >
<# entity.fields.filter(f=>f.name!== "id")
.filter(f=>entity.UI.list[f.name] || entity.UI.quickSearch.indexOf(f.name)!== -1)
.forEach(f=>{-#>
    <#{f.type}Field sortable={#{!f.derived}} label="resources.#{entity.name}.fields.#{f.name}" source="#{f.name}"<# if (!f.required){#> allowEmpty<#}#> />
<#})-#>
<# entity.relations
.filter(f=>entity.UI.list[f.field])
.forEach(f=>{
-#><#-if(f.single){#>
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

<#- chunkStart(`../../../${entity.name}/uix/filter`); -#>
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

<#- chunkStart(`../../../${entity.name}/uix/form`); -#>
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ArrayInput,
  SimpleFormIterator,
  ReferenceInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput,
  SimpleForm,
  TextInput,
  LongTextInput,
  DateInput,
  NumberInput,
  BooleanInput,
  required,
  AutocompleteInput,
} from "react-admin";
import RichTextInput from 'ra-input-rich-text';

import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import compose from 'recompose/compose';
import { consts, actions, show } from 'oda-ra-ui';

const actionType = consts.actionType;
const initForm = actions.initForm;
const finalizeForm = actions.finalizeForm;
const { selectorFor, detailsFor } = show;

class Form extends Component {
  componentWillMount() {
    this.props.initForm();
  }
  componentWillUnmount() {
    this.props.finalizeForm();
  }

  render() {
    const { props } = this;
    const singleRelActions = props.singleRelActions;
    const manyRelAction = props.manyRelActions;
    const { translate } = this.context;
    return (
      <SimpleForm {...props} >
<# entity.fields.filter(f=>!f.derived ).filter(f=>f.name!== "id")
  .filter(f=>(entity.UI.edit[f.name] || entity.UI.list[f.name] || entity.UI.show[f.name]) && entity.UI.edit[f.name]!== false )
  .forEach( f=> {-#>
        <#{f.type}Input label="resources.#{entity.name}.fields.#{f.name}" source="#{f.name}" <# if (!f.required){#> allowEmpty<#} else {#> validate={required()}<#}#> />
<#})-#>
<# entity.relations
.filter(f => (entity.UI.edit[f.field] || entity.UI.list[f.field] || entity.UI.show[f.field]) && entity.UI.edit[f.field]!== false)
.forEach(f => {
  const verb = f.verb;
  const embedded = entity.UI.embedded.names.hasOwnProperty(f.field);
#>
<#-   if ( f.single ) {
        if(embedded) {
#>
        {/* <Label text="resources.#{entity.name}.fields.#{f.field}" /> */}
        {/*<DependentInput resolve={selectorFor('#{f.field}')} scoped >*/}
          <ReferenceInput label="resources.#{entity.name}.fields.#{f.field}" source="#{f.field}Id" reference="#{entity.role}/#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required()}<#}#> >
            <AutocompleteInput optionText="#{f.ref.listLabel.source}" />
          </ReferenceInput>
        {/* </DependentInput> */}
        <SelectInput
          source="#{f.field}Type"
          label="uix.actionType.ExpectedTo"
          choices={singleRelActions}
          defaultValue={actionType.USE}
        />
<#
        let current = entity.UI.embedded.names[f.field];
#>
        {/* <DependentInput resolve={detailsFor('#{f.field}')} > */}
          {/* <EmbeddedInput label="resources.#{entity.name}.fields.#{f.field}" source="#{f.field}" addLabel={false}> */}
<#
        let embededEntity = entity.UI.embedded.items[current].entity;
        entity.UI.embedded.items[current].fields.filter(f=>f.name !== 'id').forEach(f=>{
-#>
            <#{f.type}Input label="resources.#{embededEntity}.fields.#{f.name}" source="#{f.name}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required()}<#}#> />
<#
        });
-#>
          {/* </EmbeddedInput> */}
        {/* </DependentInput> */}
<#
        } else {
#>
        <ReferenceInput label="resources.#{entity.name}.fields.#{f.field}" source="#{f.field}Id" reference="#{entity.role}/#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required()}<#}#> >
          <AutocompleteInput optionText="#{f.ref.listLabel.source}" />
        </ReferenceInput>
<#}#>
<#-
      } else {
  #>
<# if(embedded){#>
        <ArrayInput label="resources.#{entity.name}.fields.#{f.field}" source="#{f.field}Values" allowEmpty >
          <SimpleFormIterator>
            <SelectInput
              source="#{f.field}Type"
              label="uix.actionType.ExpectedTo"
              choices={manyRelAction}
              defaultValue={actionType.USE}
            />
            {/* <DependentInput resolve={selectorFor('#{f.field}'<#if(verb === 'BelongsToMany'){#>, true<#}#>)} scoped > */}
              <ReferenceInput label={translate("resources.#{f.ref.entity}.name", { smart_count: 1})} source="id" reference="#{entity.role}/#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required()}<#}#> >
                <SelectInput optionText="#{f.ref.listLabel.source}" />
              </ReferenceInput>
            {/* </DependentInput> */}
<#-
  let current = entity.UI.embedded.names[f.field];
  let embededEntity = entity.UI.embedded.items[current].entity;
  let fields = entity.UI.embedded.items[current].fields.filter(f=>f.name !== 'id');
  const fieldCount = fields.length + (verb === 'BelongsToMany' ? f.ref.fields.filter(fld => f.ref.using.UI.edit[fld.name] ).length : 0);
  if(fieldCount > 0) {#>
            {/* <DependentInput resolve={detailsFor('#{f.field}')} scoped > */}
<#
        entity.UI.embedded.items[current].fields.filter(f=>f.name !== 'id').forEach(f=>{-#>
              <#{f.type}Input label="resources.#{embededEntity}.fields.#{f.name}" source="#{f.name}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required()}<#}#> />
<#
        });
-#>
<#-
        if(verb === 'BelongsToMany') {
          f.ref.fields.filter(fld => f.ref.using.UI.edit[fld.name] ).forEach(fld=>{-#>
              <#{fld.type}Input label="resources.#{f.ref.using.entity}.fields.#{fld.name}" source="#{fld.name}"<# if (!fld.required){#> allowEmpty<#} else {#> validate={required()}<#}#> />
<#
          });
        }
-#>
            {/* </DependentInput> */}
<#-  }#>
          </SimpleFormIterator>
        </ArrayInput>
<#} else {#>
        <ReferenceArrayInput label="resources.#{entity.name}.fields.#{f.field}" source="#{f.field}Ids" reference="#{entity.role}/#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required()}<#}#> >
          <SelectArrayInput options={{ fullWidth: true }} optionText="#{f.ref.listLabel.source}" optionValue="id" />
        </ReferenceArrayInput>
<#}#>
<#-}-#>
<#-})#>
      </SimpleForm>);
  }
}

const formName = 'record-form';
const selector = formValueSelector(formName);

Form.contextTypes = {
  translate: PropTypes.func.isRequired,
}

export default compose(
  connect(
    state => ({
<# entity.UI.embedded.items.filter(f=>f.single).forEach(f=>{-#>
      #{f.name}: selector(state, '#{f.name}'),
      #{f.name}Id: selector(state, '#{f.name}Id'),
      #{f.name}Type: selector(state, '#{f.name}Type'),
<#});-#>
    }), {
      initForm: initForm('record-form', {
<#entity.UI.embedded.items.forEach(f=>{-#>
        #{f.name}: {
          resource: '#{f.entity}',
          single: #{f.single},
        },
<#});-#>
      }),
      finalizeForm,
    }),
)(Form);

<#- chunkStart(`../../../${entity.name}/uix/edit`); -#>
import React from "react";
import PropTypes from 'prop-types';
import {
  Edit,
} from "react-admin";
import { consts } from 'oda-ra-ui';
const actionType = consts.actionType;

const EditForm = (props, context) => {
  const { Form, Title } = context.uix['#{entity.role}/#{entity.name}'];
  const { translate } = context;

  return (
  <Edit title={<Title />} {...props}>
    <Form
      {...props}
      singleRelActions={[
        { id: actionType.CREATE, name: translate('uix.actionType.CREATE') },
        { id: actionType.UPDATE, name: translate('uix.actionType.UPDATE') },
        { id: actionType.CLONE, name: translate('uix.actionType.CLONE') },
        { id: actionType.USE, name: translate('uix.actionType.USE') },
        { id: actionType.UNLINK, name: translate('uix.actionType.UNLINK') },
      ]}
      manyRelActions={[
        { id: actionType.CREATE, name: translate('uix.actionType.CREATE') },
        { id: actionType.UPDATE, name: translate('uix.actionType.UPDATE') },
        { id: actionType.CLONE, name: translate('uix.actionType.CLONE') },
        { id: actionType.USE, name: translate('uix.actionType.USE') },
      ]}
    />
  </Edit >
)};

EditForm.contextTypes = {
  uix: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
}

export default EditForm;

<#- chunkStart(`../../../${entity.name}/uix/create`); -#>
import React from "react";
import PropTypes from 'prop-types';
import {
  Create,
} from "react-admin";
import { consts } from 'oda-ra-ui';
const actionType = consts.actionType;

const CreateForm = (props, context) =>{
  const { Form, Title } = context.uix['#{entity.role}/#{entity.name}'];
  const { translate } = context;

  return (
  <Create title={<Title />} {...props} >
    <Form
      {...props}
      singleRelActions={[
        { id: actionType.CREATE, name: translate('uix.actionType.CREATE') },
        { id: actionType.UPDATE, name: translate('uix.actionType.UPDATE') },
        { id: actionType.CLONE, name: translate('uix.actionType.CLONE') },
        { id: actionType.USE, name: translate('uix.actionType.USE') },
        { id: actionType.UNLINK, name: translate('uix.actionType.UNLINK') },
      ]}
      manyRelActions={[
        { id: actionType.CREATE, name: translate('uix.actionType.CREATE') },
        { id: actionType.UPDATE, name: translate('uix.actionType.UPDATE') },
        { id: actionType.CLONE, name: translate('uix.actionType.CLONE') },
        { id: actionType.USE, name: translate('uix.actionType.USE') },
      ]}
    />
  </Create >
)};

CreateForm.contextTypes = {
  uix: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
}

export default CreateForm;
<#- chunkStart(`../../../${entity.name}/uix/cardView`); -#>
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

<#- chunkStart(`../../../${entity.name}/uix/show`); -#>
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
  TabbedShowLayout,
  Tab,
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
      <TabbedShowLayout {...props}>
        <Tab label="resources.#{entity.name}.summary">
<#entity.fields.filter(f=>f.name!== "id")
.filter(f=>(entity.UI.edit[f.name] || entity.UI.list[f.name] || entity.UI.show[f.name]) && entity.UI.show[f.name] !== false)
.forEach(f=>{-#>
          <#{f.type=="Number" ? "Text" : f.type}Field 
            label="resources.#{entity.name}.fields.#{f.name}" 
            source="#{f.name}"
            <#- if (!f.required){#>
            allowEmpty<#}#>
          />
<#})-#>
        </Tab>
<# entity.relations
.filter(f=>(entity.UI.edit[f.field] || entity.UI.list[f.field] || entity.UI.show[f.field]) && entity.UI.show[f.field] !== false)
.forEach(f=>{
  const verb = f.verb;
  const embedded = entity.UI.embedded.names.hasOwnProperty(f.field);
-#>
        <Tab label="resources.#{entity.name}.fields.#{f.field}">
<#-if(f.single){#>
<#-if(embedded){
  // for future discussions
        let current = entity.UI.embedded.names[f.field];
#>
          <EmbeddedField
            addLabel={false}
            source="#{f.field}Value"
          >
<#
        let embededEntity = entity.UI.embedded.items[current].entity;
        let reUI = entity.UI.embedded.items[current].UI;
        entity.UI.embedded.items[current].fields
        .filter(f=>
          f.name !== 'id' &&
          (reUI.edit[f.name] ||
          reUI.list[f.name] ||
          reUI.show[f.name]) && 
          reUI.show[f.name] !== false)
        .forEach(f=>{-#>
            <#{f.type=="Number" ? "Text" : f.type}Field label="resources.#{embededEntity}.fields.#{f.name}" source="#{f.name}"<# if (!f.required){#> allowEmpty<#}#> />
<#
        });
-#>
            <ShowButton resource="#{entity.role}/#{f.ref.entity}"/>
            <EditButton resource="#{entity.role}/#{f.ref.entity}"/>
            <DeleteButton resource="#{entity.role}/#{f.ref.entity}"/>
          </EmbeddedField>
<#} else {#>
          <ReferenceField 
          addLabel={false} 
          source="#{f.field}Id" reference="#{entity.role}/#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#}#> linkType="show" >
            <#{f.ref.listLabel.type}Field source="#{f.ref.listLabel.source}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required()}<#}#> />
          </ReferenceField>
<#}#>
<#-} else {#>
<#-if( embedded ){
#>
          <ArrayField addLabel={false} source="#{f.field}Values" >
            <#{f.ref.entity}.Grid />
          </ArrayField>
<#} else {#>
          <ReferenceManyField addLabel={false} reference="#{entity.role}/#{f.ref.entity}" target="#{f.ref.opposite}" source="#{f.ref.backField}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required()}<#}#> >
            <#{f.ref.entity}.Grid />
          </ReferenceManyField>
<#}#>
<#-}-#>
        </Tab>

<#-})#>
      </TabbedShowLayout>
    </Show>
  );
};

ShowRecordView.contextTypes = {
  uix: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
}

export default ShowRecordView;

<#- chunkStart(`../../../i18n/${entity.name}`); -#>
export default {
  resources: {
    #{entity.name}: {
      summary: 'Summary',
      name: '#{entity.name} |||| #{entity.plural}',
      listName: '#{entity.name} |||| #{entity.plural}',
      fields: {
<#entity.fields.forEach(f=>{-#>
        #{f.name}: '#{f.label}',
<#})-#>
<#-entity.relations.forEach(f=>{-#>
        #{f.field}: '#{f.label}',
<#})-#>
      },
    },
  },
}