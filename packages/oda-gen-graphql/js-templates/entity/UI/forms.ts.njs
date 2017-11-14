<#@ context "entity" -#>
<#@ chunks "$$$main$$$" -#>

<#- chunkStart(`../../../UI/${entity.name}/uix/index`); -#>
import Title from "./title";
import Form from "./form";
import Create from "./create";
import Show from "./show";
import Edit from "./edit";
import Grid from "./grid";
import List from "./list";

export default {
  Create,
  Edit,
  Show,
  List,
  Grid,
};

<#- chunkStart(`../../../UI/${entity.name}/uix/title`); -#>
import React from "react";
export default ({ record }) => {
  return <span>#{entity.name} {record ? `"${record.#{entity.listLabel.source}}"` : ""}</span>;
};

<#- chunkStart(`../../../UI/${entity.name}/uix/list`); -#>
import React from "react";
import {
  List,
} from "admin-on-rest";

import Grid from "./grid";
import Filter from "./filter";

export default props => (
  <List {...props} filters={<Filter />}>
    <Grid {...props} />
  </List>
);

<#- chunkStart(`../../../UI/${entity.name}/uix/grid`); -#>
import React from "react";
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
} from "admin-on-rest";

export default props => (
  <Datagrid {...props} >
<# entity.fields.filter(f=>f.name!== "id")
.filter(f=>entity.UI.list[f.name])
.forEach(f=>{-#>
    <#{f.type}Field source="#{f.name}"<# if (!f.required){#> allowEmpty<#}#> />
<#})-#>
<# entity.relations
.filter(f=>entity.UI.list[f.field])
.forEach(f=>{
-#><#-if(f.single){#>
    <ReferenceField sortable={false} label="#{f.cField}" source="#{f.field}Id" reference="#{f.ref.entity}"<# if (!f.required){#> allowEmpty <#}#>>
      <#{f.ref.listLabel.type}Field source="#{f.ref.listLabel.source}"<# if (!f.required){#> allowEmpty <#}#>/>
    </ReferenceField>
<#-}-#>
<#-})#>
    <ShowButton />
    <EditButton />
    <DeleteButton />
  </Datagrid>
);

<#- chunkStart(`../../../UI/${entity.name}/uix/filter`); -#>
import React from "react";
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

export default props => (
  <Filter {...props} >
    <TextInput label="Search" source="q" allowEmpty alwaysOn />
<# entity.fields.filter(f=>f.name!== "id")
  .filter(f=>entity.UI.list[f.name])
  .forEach(f=>{-#>
    <NullableBooleanInput label="#{f.cName} exists" source="#{f.name}-exists" />
<#
    switch(f.filterType) {
      case "Number":
#>
    <NumberInput label="#{f.cName} =" source="#{f.name}-eq" allowEmpty />
    <NumberInput label="#{f.cName} <=" source="#{f.name}-lte" allowEmpt />
    <NumberInput label="#{f.cName} >=" source="#{f.name}-gte" allowEmpty />
    <NumberInput label="#{f.cName} <" source="#{f.name}-lt" allowEmpt />
    <NumberInput label="#{f.cName} >" source="#{f.name}-gt" allowEmpty />
<#
      break;
      case "Text":
#>
    <#{f.filterType}Input label="#{f.cName}" source="#{f.name}-imatch" allowEmpty />
    <SelectArrayInput label="#{f.cName} in" source="#{f.name}-in" allowEmpty />
    <SelectArrayInput label="#{f.cName} not in" source="#{f.name}-nin" allowEmpty />
<#
      break;
      case "ID":
#>
    <TextInput label="#{f.cName}" source="#{f.name}-eq" allowEmpty />
    <SelectArrayInput label="#{f.cName} in" source="#{f.name}-in" allowEmpty />
    <SelectArrayInput label="#{f.cName} not in" source="#{f.name}-nin" allowEmpty />
<#
      break;
      case "Date":
#>
    <DateInput label="#{f.cName} <=" source="#{f.name}-lte" allowEmpty />
    <DateInput label="#{f.cName} >=" source="#{f.name}-gte" allowEmpty />
<#
      break;
      case "Boolean":
#>
    <BooleanInput label="#{f.cName}" source="#{f.name}-eq" allowEmpty />
<#
      break;
    }
  })-#>
  </Filter>
);

<#- chunkStart(`../../../UI/${entity.name}/uix/form`); -#>
import React, { Component } from 'react';
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

    return (
      <SimpleForm {...props} >
<# entity.fields.filter(f=>f.name!== "id")
  .filter(f=>entity.UI.edit[f.name] || entity.UI.list[f.name] || entity.UI.show[f.name])
  .forEach(f=>{-#>
        <#{f.type}Input source="#{f.name}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required}<#}#>  />
<#})-#>
<# entity.relations
.filter(f=>entity.UI.edit[f.field] || entity.UI.list[f.field] || entity.UI.show[f.field])
.forEach(f=>{
  const embedded = entity.UI.embedded.names.hasOwnProperty(f.field);
#>
<#-   if ( f.single ) {
        if(embedded){
#>
        <Label text="#{f.cField}" />
        <DependentInput resolve={selectorFor('#{f.field}')} scoped >
          <ReferenceInput sortable={false} label="#{f.cField}" source="#{f.field}Id" reference="#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required}<#}#>  >
            <AutocompleteInput optionText="#{f.ref.listLabel.source}" />
          </ReferenceInput>
        </DependentInput>
        <SelectInput
          source="#{f.field}Type"
          label="Expected to"
          choices={singleRelActions}
          defaultValue={actionType.USE}
        />
<#
        const fName = f.field;
        let current = entity.UI.embedded.names[fName];
#>
        <DependentInput resolve={detailsFor('#{fName}')} >
          <EmbeddedInput label="#{f.cField}" source="#{fName}" addLabel={false}>
<#
        entity.UI.embedded.items[current].fields.filter(f=>f.name !== 'id').forEach(f=>{
-#>
            <#{f.type}Input label="#{f.cName}" source="#{f.name}" source="#{f.name}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required}<#}#> />
<#
        });
-#>
          </EmbeddedInput>
        </DependentInput>
<#
        } else {
#>
        <Label text="#{f.cField}" />
        <ReferenceInput sortable={false} label="" source="#{f.field}Id" reference="#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required}<#}#>  >
          <AutocompleteInput optionText="#{f.ref.listLabel.source}" />
        </ReferenceInput>
<#}#>
<#-
      } else {
  #>
<# if(embedded){#>
        <EmbeddedArrayInput sortable={false} label="#{f.cField}" source="#{f.field}Values" allowEmpty >
          <SelectInput
            source="#{f.field}Type"
            label="Expected to"
            choices={manyRelAction}
            defaultValue={actionType.USE}
          />
          <DependentInput resolve={selectorFor('#{f.field}')} scoped >
            <ReferenceInput sortable={false} label="#{f.ref.entity}" source="id" reference="#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required}<#}#> >
              <SelectInput optionText="#{f.ref.listLabel.source}" />
            </ReferenceInput>
          </DependentInput>
          <DependentInput resolve={detailsFor('#{f.field}')} scoped >
<#
        let current = entity.UI.embedded.names[f.field];
        entity.UI.embedded.items[current].fields.filter(f=>f.name !== 'id').forEach(f=>{
-#>
            <#{f.type}Input label="#{f.cName}" source="#{f.name}" source="#{f.name}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required}<#}#> />
<#
        });
-#>
          </DependentInput>
        </EmbeddedArrayInput>
<#} else {#>
        <Label text="#{f.cField}" />
        <ReferenceArrayInput sortable={false} label="" source="#{f.field}Ids" reference="#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required}<#}#> >
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
// сделать сразу с переводом...

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

<#- chunkStart(`../../../UI/${entity.name}/uix/edit`); -#>
import React from "react";
import {
  Edit,
} from "admin-on-rest";
import #{entity.name}Form from "./form";
import #{entity.name}Title from "./title";
import { ui } from 'oda-aor-rest';
const actionType = ui.consts.actionType;

export default props => (
  <Edit title={<#{entity.name}Title />} {...props}>
    <#{entity.name}Form
      {...props}
      singleRelActions={[
        { id: actionType.CREATE, name: 'Create' },
        { id: actionType.UPDATE, name: 'Update Existing' },
        { id: actionType.CLONE, name: 'Copy Selected' },
        { id: actionType.USE, name: 'Use Existing' },
        { id: actionType.UNLINK, name: 'Unlink' },
      ]}
      manyRelActions={[
        { id: actionType.CREATE, name: 'Create' },
        { id: actionType.UPDATE, name: 'Update Existing' },
        { id: actionType.CLONE, name: 'Copy Selected' },
        { id: actionType.USE, name: 'Use Existing' },
      ]}
    />
  </Edit >
);

<#- chunkStart(`../../../UI/${entity.name}/uix/create`); -#>
import React from "react";
import {
  Create,
} from "admin-on-rest";
import #{entity.name}Form from "./form";
import #{entity.name}Title from "./title";
import { ui } from 'oda-aor-rest';
const actionType = ui.consts.actionType;

export default props => (
  <Create title={<#{entity.name}Title />} {...props} >
    <#{entity.name}Form
      {...props}
      singleRelActions={[
        { id: actionType.CREATE, name: 'Create' },
        { id: actionType.UPDATE, name: 'Update Existing' },
        { id: actionType.CLONE, name: 'Copy Selected' },
        { id: actionType.USE, name: 'Use Existing' },
        { id: actionType.UNLINK, name: 'Unlink' },
      ]}
      manyRelActions={[
        { id: actionType.CREATE, name: 'Create' },
        { id: actionType.UPDATE, name: 'Update Existing' },
        { id: actionType.CLONE, name: 'Copy Selected' },
        { id: actionType.USE, name: 'Use Existing' },
      ]}
    />
  </Create >
);

<#- chunkStart(`../../../UI/${entity.name}/uix/show`); -#>
import React from "react";
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

import {
  uix
} from "./../../";

// import { EmbeddedArrayField } from 'aor-embedded-array';
import #{entity.name}Title from "./title";
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

export default (props) => {
<#-
const manyRels = entity.relations.filter(f => !f.single);
if(manyRels.length > 0){#>
  const {
<# manyRels.filter(f=> !f.single && !entity.UI.embedded.names.hasOwnProperty(f.field)).forEach(f=>{-#>
    #{f.ref.entity},
<#})-#>
  } = uix;
<#-}-#>

  return (
    <Show title={<#{entity.name}Title />} {...props} >
      <SimpleShowLayout {...props}>
<# entity.fields.filter(f=>f.name!== "id")
.filter(f=>entity.UI.edit[f.name] || entity.UI.list[f.name] || entity.UI.show[f.name])
.forEach(f=>{-#>
        <DependentField resolve={showIfExists('#{f.name}')}>
          <#{f.type=="Number" ? "Text" : f.type}Field source="#{f.name}"<# if (!f.required){#> allowEmpty<#}#> />
        </DependentField>
<#})-#>
<# entity.relations
.filter(f=>entity.UI.edit[f.field] || entity.UI.list[f.field] || entity.UI.show[f.field])
.forEach(f=>{
  const embedded = entity.UI.embedded.names.hasOwnProperty(f.field);
-#><#-if(f.single){#>
<#-if(embedded){
        const fName = f.field;
        let current = entity.UI.embedded.names[fName];
#>
        <DependentField resolve={showIfNotEmptyRel('#{fName}Id')} source="#{fName}" >
          <EmbeddedRefField source="#{fName}Id" reference="#{f.ref.entity}" target="#{f.ref.opposite}">
<#
        entity.UI.embedded.items[current].fields.filter(f=>f.name !== 'id').forEach(f=>{
-#>
            <DependentField resolve={showIfExists('#{f.name}')} scoped >
              <#{f.type=="Number" ? "Text" : f.type}Field source="#{f.name}" label="#{f.name}"<# if (!f.required){#> allowEmpty<#}#> />
            </DependentField>
<#
        });
-#>
          </EmbeddedRefField>
        </DependentField>
<#} else {#>
        <DependentField resolve={showIfNotEmptyRel('#{f.field}Id')} source="#{f.field}Id" >
          <ReferenceField sortable={false} label="#{f.cField}" source="#{f.field}Id" reference="#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#}#> >
            <#{f.ref.listLabel.type}Field source="#{f.ref.listLabel.source}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required}<#}#> />
          </ReferenceField>
        </DependentField>
<#}#>
<#-} else {#>
<#-if(embedded){
        const fName = f.field;
        let current = entity.UI.embedded.names[fName];
#>
        <DependentField resolve={showIfNotEmptyRel('#{f.field}Values')} source="#{f.field}Values">
          <EmbeddedArrayField reference="#{f.ref.entity}" target="#{f.ref.opposite}" sortable={false} label="#{f.cField}" source="#{f.field}Values" allowEmpty >
<#
        entity.UI.embedded.items[current].fields.filter(f=>f.name !== 'id').forEach(f=>{
-#>
            <DependentField resolve={showIfExists('#{f.name}')} source="#{f.name}" scoped >
              <#{f.type=="Number" ? "Text" : f.type}Field source="#{f.name}" label="#{f.name}"<# if (!f.required){#> allowEmpty<#}#> />
            </DependentField>
<#
        });
-#>
          </EmbeddedArrayField>
        </DependentField>
<#} else {#>
        <DependentField resolve={showIfNotEmptyRel('#{f.field}')} source="#{f.field}">
          <ReferenceManyField sortable={false} label="#{f.cField}" reference="#{f.ref.entity}" target="#{f.ref.opposite}"<# if (!f.required){#> allowEmpty<#} else {#> validate={required}<#}#> >
            <#{f.ref.entity}.Grid />
          </ReferenceManyField>
        </DependentField>
<#}#>
<#-}-#>
<#-})#>
      </SimpleShowLayout>
    </Show>
  );
};

