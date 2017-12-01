<#@ context "entity" -#>
<#
  var formatJson = require('format-json-pretty');
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

export default {
  Title,
  Filter,
  Form,
  Create,
  Show,
  Edit,
  List,
  Grid,
};

<#- chunkStart(`../../../${entity.name}/uix/title`); -#>
import React from "react";
import PropTypes from 'prop-types';

const Title = ({ record },{translate}) => (
  <span>
    {translate('resources.#{entity.name}.name', {smart_count : 1})} {record ? `"${record.#{entity.listLabel.source}}"` : ""}
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
} from "admin-on-rest";

const ListView = (props, context) => {
  const Grid = context.uix.#{entity.name}.Grid;
  const Filter = context.uix.#{entity.name}.Filter;

  return (
    <List {...props} filters={<Filter />}>
      <Grid {...props} />
    </List>
)};

ListView.contextTypes = {
  uix: PropTypes.object.isRequired,
}

export default ListView;

<#- chunkStart(`../../../${entity.name}/uix/grid`); -#>
import React from "react";
import PropTypes from 'prop-types';

import {
  Datagrid,
  TextField,
  DateField,
  NumberField,`
  BooleanField,
  EditButton,
  DeleteButton,
  ShowButton,
  ReferenceField,
} from "admin-on-rest";

const Grid = (props, context) => (
  <Datagrid {...props} >
<# entity.fields.filter(f=>f.name!== "id")
.filter(f=>entity.UI.list[f.name])
.forEach(f=>{-#>
    <#{f.type}Field sortable={#{!f.derived}} label="resources.#{entity.name}.fields.#{f.name}" source="#{f.name}"<# if (!f.required){#> allowEmpty<#}#> />
<#})-#>
<# entity.relations
.filter(f=>entity.UI.list[f.field])
.forEach(f=>{
-#><#-if(f.single){#>
    <ReferenceField label="resources.#{entity.name}.fields.#{f.field}" sortable={false} source="#{f.field}Id" reference="#{f.ref.entity}"<# if (!f.required){#> allowEmpty <#}#>>
      <#{f.ref.listLabel.type}Field source="#{f.ref.listLabel.source}"<# if (!f.required){#> allowEmpty <#}#>/>
    </ReferenceField>
<#-}-#>
<#-})#>
    <ShowButton />
    <EditButton />
    <DeleteButton />
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
  RichTextInput,
  NullableBooleanInput,
  Filter,
} from "admin-on-rest";
<#var filteredFields = entity.fields.filter(f=>!f.derived ).filter(f=>f.name!== "id")
  .filter(f=>entity.UI.list[f.name]); #>
const FilterPanel = (props, {translate}) => (
  <Filter {...props} >
<#if(filteredFields.length > 0) {#>
    <TextInput label="uix.filter.search" source="q" allowEmpty alwaysOn />
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
    <#{f.filterType}Input label={translate("uix.filter.exists",{ name: translate('resources.#{entity.name}.fields.#{f.name}')})} source="#{f.name}-imatch" allowEmpty />
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
  ReferenceInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput,
  SimpleForm,
  TextInput,
  DateInput,
  NumberInput,
  BooleanInput,
  required,
} from "admin-on-rest";

import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import compose from 'recompose/compose';
import { ui } from 'oda-aor-rest';
import { EmbeddedArrayInput } from 'aor-embedded-array';

const {
  DependentInput,
  EmbeddedInput,
  GrouppedInput,
  Label,
  AutocompleteInput
} = ui.components;

const actionType = ui.consts.actionType;
const initForm = ui.actions.initForm;
const finalizeForm = ui.actions.finalizeForm;
const { selectorFor, detailsFor } = ui.show;

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
        <#{f.type}Input label="resources.#{entity.name}.fields.#{f.name}" source="#{f.name}" <# if (!f.required){#> allowEmpty<#} else {#> validate={required}<#}#> />
<#})-#>
<# entity.relations
.filter(f => (entity.UI.edit[f.field] || entity.UI.list[f.field] || entity.UI.show[f.field]) && entity.UI.edit[f.field]!== false)
.forEach(f => {
  const embedded = entity.UI.embedded.names.hasOwnProperty(f.field);
#>
<#-   if ( f.single ) {
        if(embedded) {
#>
        <Label text={translate("resources.#{entity.name}.fields.#{f.field}")} />
        <DependentInput resolve={selectorFor('#{f.field}')} scoped >
          <ReferenceInput label="resources.#{entity.name}.fields.#{f.field}" source="#{f.field}Id" reference="#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required}<#}#> >
            <AutocompleteInput optionText="#{f.ref.listLabel.source}" />
          </ReferenceInput>
        </DependentInput>
        <SelectInput
          source="#{f.field}Type"
          label="uix.actionType.ExpectedTo"
          choices={singleRelActions}
          defaultValue={actionType.USE}
        />
<#
        let current = entity.UI.embedded.names[f.field];
#>
        <DependentInput resolve={detailsFor('#{f.field}')} >
          <EmbeddedInput label="resources.#{entity.name}.fields.#{f.field}" source="#{f.field}" addLabel={false}>
<#
        let embededEntity = entity.UI.embedded.items[current].entity;
        entity.UI.embedded.items[current].fields.filter(f=>f.name !== 'id').forEach(f=>{
-#>
            <#{f.type}Input label="resources.#{embededEntity}.fields.#{f.name}" source="#{f.name}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required}<#}#> />
<#
        });
-#>
          </EmbeddedInput>
        </DependentInput>
<#
        } else {
#>
        <Label text={translate("resources.#{entity.name}.fields.#{f.field}")} />
        <ReferenceInput label="" source="#{f.field}Id" reference="#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required}<#}#> >
          <AutocompleteInput optionText="#{f.ref.listLabel.source}" />
        </ReferenceInput>
<#}#>
<#-
      } else {
  #>
<# if(embedded){#>
        <EmbeddedArrayInput label="resources.#{entity.name}.fields.#{f.field}" source="#{f.field}Values" allowEmpty >
          <SelectInput
            source="#{f.field}Type"
            label="uix.actionType.ExpectedTo"
            choices={manyRelAction}
            defaultValue={actionType.USE}
          />
          <DependentInput resolve={selectorFor('#{f.field}')} scoped >
            <ReferenceInput label={translate("resources.#{f.ref.entity}.name", { smart_count: 1})} source="id" reference="#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required}<#}#> >
              <SelectInput optionText="#{f.ref.listLabel.source}" />
            </ReferenceInput>
          </DependentInput>
          <DependentInput resolve={detailsFor('#{f.field}')} scoped >
<#
        let current = entity.UI.embedded.names[f.field];
        let embededEntity = entity.UI.embedded.items[current].entity;

        entity.UI.embedded.items[current].fields.filter(f=>f.name !== 'id').forEach(f=>{-#>
            <#{f.type}Input label="resources.#{embededEntity}.fields.#{f.name}" source="#{f.name}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required}<#}#> />
<#
        });
-#>
          </DependentInput>
        </EmbeddedArrayInput>
<#} else {#>
        <Label text={translate("resources.#{entity.name}.fields.#{f.field}")} />
        <ReferenceArrayInput label="" source="#{f.field}Ids" reference="#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required}<#}#> >
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
} from "admin-on-rest";
import { ui } from 'oda-aor-rest';
const actionType = ui.consts.actionType;

const EditForm = (props, context) => {
  const Form = context.uix.#{entity.name}.Form;
  const Title = context.uix.#{entity.name}.Title;
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
} from "admin-on-rest";
import { ui } from 'oda-aor-rest';
const actionType = ui.consts.actionType;

const CreateForm = (props, context) =>{
  const Form = context.uix.#{entity.name}.Form;
  const Title = context.uix.#{entity.name}.Title;
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
  ReferenceManyField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  required,
} from "admin-on-rest";

// import { EmbeddedArrayField } from 'aor-embedded-array';
import { ui } from 'oda-aor-rest';

const {
  DependentField,
  EmbeddedField,
  GrouppedField,
  EmbeddedArrayField,
  EmbeddedRefArrayField,
  EmbeddedRefField,
} = ui.components;

const showIfExists = field => root => !!root[field];

const showIfNotEmptyRel = field => root => !!root[field] || (Array.isArray(root[field]) && root[field].length > 0);

const ShowView = (props, context) => {
  const { uix } = context;
  const Title = uix.#{entity.name}.Title;
  const { translate } = context;
<#-
const manyRels = entity.relations.filter(f => !f.single);
if(manyRels.length > 0){#>
  const {
<#
 const uniqueEntities = manyRels.filter(f=> !f.single && !entity.UI.embedded.names.hasOwnProperty(f.field))
  .reduce((hash, curr)=> {
    hash[curr.ref.entity] = curr;
    return hash;
  }, {});

  Object.keys(uniqueEntities).forEach(key=>{
    let f = uniqueEntities[key];
-#>
    #{f.ref.entity},
<#})-#>
  } = uix;
<#-}-#>

  return (
    <Show title={<Title />} {...props} >
      <SimpleShowLayout {...props}>
<#entity.fields.filter(f=>f.name!== "id")
.filter(f=>(entity.UI.edit[f.name] || entity.UI.list[f.name] || entity.UI.show[f.name]) && entity.UI.show[f.name] !== false)
.forEach(f=>{-#>
        <DependentField resolve={showIfExists('#{f.name}')}>
          <#{f.type=="Number" ? "Text" : f.type}Field label="resources.#{entity.name}.fields.#{f.name}" source="#{f.name}"<# if (!f.required){#> allowEmpty<#}#> />
        </DependentField>
<#})-#>
<# entity.relations
.filter(f=>(entity.UI.edit[f.field] || entity.UI.list[f.field] || entity.UI.show[f.field]) && entity.UI.show[f.field] !== false)
.forEach(f=>{
  const embedded = entity.UI.embedded.names.hasOwnProperty(f.field);
-#><#-if(f.single){#>
<#-if(embedded){
        let current = entity.UI.embedded.names[f.field];
#>
        <DependentField resolve={showIfNotEmptyRel('#{f.field}Id')} source="#{f.field}" >
          <EmbeddedRefField label="resources.#{entity.name}.fields.#{f.field}" source="#{f.field}Id" reference="#{f.ref.entity}" target="#{f.ref.opposite}">
<#
        let embededEntity = entity.UI.embedded.items[current].entity;

        entity.UI.embedded.items[current].fields.filter(f=>f.name !== 'id').forEach(f=>{-#>
            <DependentField resolve={showIfExists('#{f.name}')} scoped >
              <#{f.type=="Number" ? "Text" : f.type}Field label="resources.#{embededEntity}.fields.#{f.name}" source="#{f.name}" <# if (!f.required){#> allowEmpty<#}#> />
            </DependentField>
<#
        });
-#>
          </EmbeddedRefField>
        </DependentField>
<#} else {#>
        <DependentField resolve={showIfNotEmptyRel('#{f.field}Id')} source="#{f.field}Id" >
          <ReferenceField label="resources.#{entity.name}.fields.#{f.field}" source="#{f.field}Id" reference="#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#}#> linkType="show" >
            <#{f.ref.listLabel.type}Field source="#{f.ref.listLabel.source}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required}<#}#> />
          </ReferenceField>
        </DependentField>
<#}#>
<#-} else {#>
<#-if(embedded){
        let current = entity.UI.embedded.names[f.field];
#>
        <DependentField resolve={showIfNotEmptyRel('#{f.field}Values')} source="#{f.field}Values">
          <EmbeddedArrayField reference="#{f.ref.entity}" target="#{f.ref.opposite}" label="resources.#{entity.name}.fields.#{f.field}" source="#{f.field}Values" allowEmpty >
<#
        let embededEntity = entity.UI.embedded.items[current].entity;
        entity.UI.embedded.items[current].fields.filter(f=>f.name !== 'id').forEach(f=>{
-#>
            <DependentField resolve={showIfExists('#{f.name}')} source="#{f.name}" scoped >
              <#{f.type=="Number" ? "Text" : f.type}Field label="resources.#{embededEntity}.fields.#{f.name}" source="#{f.name}" <# if (!f.required){#> allowEmpty<#}#> />
            </DependentField>
<#
        });
-#>
          </EmbeddedArrayField>
        </DependentField>
<#} else {#>
        <ReferenceManyField label="resources.#{entity.name}.fields.#{f.field}" reference="#{f.ref.entity}" target="#{f.ref.opposite}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required}<#}#> >
          <#{f.ref.entity}.Grid />
        </ReferenceManyField>
<#}#>
<#-}-#>
<#-})#>
      </SimpleShowLayout>
    </Show>
  );
};

ShowView.contextTypes = {
  uix: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
}

export default ShowView;

<#- chunkStart(`../../../${entity.name}/uix/i18n`); -#>
export default {
  resources: {
    #{entity.name}: {
      name: '#{entity.name} |||| #{entity.plural}',
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
  uix: {
    #{entity.name}:{
      label: '#{entity.name}',
    }
  },
  filter: {

  }
}