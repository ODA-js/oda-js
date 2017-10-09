<#@ context 'entity' -#>
<#@ chunks '$$$main$$$' -#>

<#- chunkStart(`../../../UI/${entity.name}/uix/index`); -#>
import Title from './title';
import Form from './form';
import Create from './create';
import Show from './show';
import Edit from './edit';
import Grid from './grid';
import List from './list';

export default {
  Title,
  Form,
  Create,
  Edit,
  Show,
  Grid,
  List,
};

<#- chunkStart(`../../../UI/${entity.name}/uix/title`); -#>
import React from 'react';
const #{entity.name}Title = ({ record }) => {
  return <span>#{entity.name} {record ? `"${record.id}"` : ''}</span>;
};

export default #{entity.name}Title;
<#- chunkStart(`../../../UI/${entity.name}/uix/list`); -#>
import React from 'react';
import {
  Filter,
  List,
  Edit,
  Create,
  Datagrid,
  TextField,
  EditButton,
  LongTextInput,
  SimpleForm,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
} from 'admin-on-rest';

import Grid from './grid';

export default props => (
  <List {...props} >
    <Grid {...props} />
  </List>
);

<#- chunkStart(`../../../UI/${entity.name}/uix/grid`); -#>
import React from 'react';
import {
  Edit,
  ReferenceInput,
  SelectInput,
  TextInput,
  NumberInput,
  TabbedForm,
  FormTab,
  ReferenceArrayInput,
  SelectArrayInput,
  ReferenceManyField,
  Responsive,
  SimpleForm,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  ShowButton,
  ReferenceField,
} from 'admin-on-rest';

export default props => (
  <Datagrid {...props} >
<# entity.fields.filter(f=>f.name!== 'id').forEach(f=>{-#>
    <TextField source="#{f.name}"<# if (!f.required){#> allowEmpty<#}#> />
<#})-#>
<# entity.relations.forEach(f=>{
-#><#-if(f.single){#>
    <ReferenceField sortable={false} label="#{f.ref.queryName}" source="#{f.field}Id" reference="#{f.ref.entity}"<# if (!f.required){#> allowEmpty <#}#>>
      <TextField optionText="id"<# if (!f.required){#> allowEmpty <#}#>/>
    </ReferenceField>
<#-}-#>
<#-})#>
    <ShowButton />
    <EditButton />
    <DeleteButton />
  </Datagrid>
);

<#- chunkStart(`../../../UI/${entity.name}/uix/form`); -#>
import React from 'react';
import {
  Edit,
  ReferenceInput,
  SelectInput,
  TextInput,
  NumberInput,
  TabbedForm,
  FormTab,
  ReferenceArrayInput,
  SelectArrayInput,
  ReferenceManyField,
  Responsive,
  SimpleForm,
  Datagrid,
  TextField,
  EditButton,
} from 'admin-on-rest';

export default props => (
  <SimpleForm {...props} >
<# entity.fields.filter(f=>f.name!== 'id').forEach(f=>{-#>
    <TextInput source="#{f.name}"<# if (!f.required){#> allowEmpty<#}#> />
<#})-#>
<# entity.relations.forEach(f=>{
-#><#-if(f.single){#>
    <ReferenceInput sortable={false}  label="#{f.ref.queryName}" source="#{f.field}Id" reference="#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#}#> >
      <SelectInput optionText="id" />
    </ReferenceInput>
<#-} else {#>
    <ReferenceArrayInput sortable={false}  label="#{f.ref.queryName}" source="#{f.field}Ids" reference="#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#}#> >
      <SelectArrayInput options={{ fullWidth: true }} optionText="id" optionValue="id" />
    </ReferenceArrayInput>
<#-}-#>
<#-})#>
  </SimpleForm>
);

<#- chunkStart(`../../../UI/${entity.name}/uix/edit`); -#>
import React from 'react';
import {
  Edit,
} from 'admin-on-rest';
import #{entity.name}Form from './form';
import #{entity.name}Title from './title';

export default props => (
  <Edit title={<#{entity.name}Title />} {...props}>
    <#{entity.name}Form {...props} />
  </Edit >
);

<#- chunkStart(`../../../UI/${entity.name}/uix/create`); -#>
import React from 'react';
import {
  Create,
} from 'admin-on-rest';
import #{entity.name}Form from './form';
import #{entity.name}Title from './title';

export default props => (
  <Create title={<#{entity.name}Title />} {...props} >
    <#{entity.name}Form {...props} />
  </Create >
);

<#- chunkStart(`../../../UI/${entity.name}/uix/show`); -#>
import React from 'react';
import {
  Datagrid,
  TextField, EditButton,
  ReferenceManyField,
  ReferenceField,
  Show,
  SimpleShowLayout
} from 'admin-on-rest';

import {
  uix
} from './../../';

import #{entity.name}Title from './title';


export default (props) => {
<#-
const manyRels = entity.relations.filter(f => !f.single);
if(manyRels.length > 0){#>
  const {
<# manyRels.forEach(f=>{-#>
    #{f.ref.entity},
<#})-#>
  } = uix();
<#-}-#>

  return (
    <Show title={<#{entity.name}Title />} {...props} >
      <SimpleShowLayout {...props}>
<# entity.fields.filter(f=>f.name!== 'id').forEach(f=>{-#>
        <TextField source="#{f.name}"<# if (!f.required){#> allowEmpty<#}#> />
<#})-#>
<# entity.relations.forEach(f=>{
-#><#-if(f.single){#>
        <ReferenceField sortable={false} label="#{f.ref.queryName}" source="#{f.field}Id" reference="#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#}#> >
          <TextField optionText="id"<# if (!f.required){#> allowEmpty<#}#> />
        </ReferenceField>
<#-} else {#>
        <ReferenceManyField sortable={false} label="#{f.ref.queryName}" reference="#{f.ref.entity}" target="#{f.ref.opposite}"<# if (!f.required){#> allowEmpty<#}#> >
          <#{f.ref.entity}.Grid />
        </ReferenceManyField>
<#-}-#>
<#-})#>
      </SimpleShowLayout>
    </Show>
  );
};

