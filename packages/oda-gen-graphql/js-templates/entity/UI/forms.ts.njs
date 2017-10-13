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
export default ({ record }) => {
  return <span>#{entity.name} {record ? `"${record.#{entity.listLabel.source}}"` : ''}</span>;
};

<#- chunkStart(`../../../UI/${entity.name}/uix/list`); -#>
import React from 'react';
import {
  List,
} from 'admin-on-rest';

import Grid from './grid';
import Filter from './filter';

export default props => (
  <List {...props} filters={<Filter />}>
    <Grid {...props} />
  </List>
);

<#- chunkStart(`../../../UI/${entity.name}/uix/grid`); -#>
import React from 'react';
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
} from 'admin-on-rest';

export default props => (
  <Datagrid {...props} >
<# entity.fields.filter(f=>f.name!== 'id')
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
    <ShowButton label={false}/>
    <EditButton label={false}/>
    <DeleteButton label={false}/>
  </Datagrid>
);

<#- chunkStart(`../../../UI/${entity.name}/uix/filter`); -#>
import React from 'react';
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
} from 'admin-on-rest';

export default props => (
  <Filter {...props} >
    <TextInput label='Search' source="q" allowEmpty alwaysOn />
<# entity.fields.filter(f=>f.name!== 'id')
  .filter(f=>entity.UI.list[f.name])
  .forEach(f=>{-#>
    <#{f.type}Input label='#{f.cName}' source="#{f.name}.#{f.type === 'Text'?'imatch':'eq'}" allowEmpty />
<#})-#>
  </Filter>
);

<#- chunkStart(`../../../UI/${entity.name}/uix/form`); -#>
import React from 'react';
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
} from 'admin-on-rest';

export default props => (
  <SimpleForm {...props} >
<# entity.fields.filter(f=>f.name!== 'id')
  .filter(f=>entity.UI.edit[f.name] || entity.UI.list[f.name] || entity.UI.show[f.name])
  .forEach(f=>{-#>
    <#{f.type}Input source="#{f.name}"<# if (!f.required){#> allowEmpty<#}#> />
<#})-#>
<# entity.relations
.filter(f=>entity.UI.edit[f.field] || entity.UI.list[f.field] || entity.UI.show[f.field])
.forEach(f=>{
-#><#-if(f.single){#>
    <ReferenceInput sortable={false} label="#{f.cField}" source="#{f.field}Id" reference="#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#}#> >
      <SelectInput optionText="#{f.ref.listLabel.source}" />
    </ReferenceInput>
<#-} else {#>
    <ReferenceArrayInput sortable={false} label="#{f.cField}" source="#{f.field}Ids" reference="#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#}#> >
      <SelectArrayInput options={{ fullWidth: true }} optionText="#{f.ref.listLabel.source}" optionValue="id" />
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
  TextField,
  DateField,
  NumberField,
  FunctionField,
  BooleanField,
  EditButton,
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
<# entity.fields.filter(f=>f.name!== 'id')
.filter(f=>entity.UI.edit[f.name] || entity.UI.list[f.name] || entity.UI.show[f.name])
.forEach(f=>{-#>
        <#{f.type}Field source="#{f.name}"<# if (!f.required){#> allowEmpty<#}#> />
<#})-#>
<# entity.relations
.filter(f=>entity.UI.edit[f.field] || entity.UI.list[f.field] || entity.UI.show[f.field])
.forEach(f=>{
-#><#-if(f.single){#>
        <ReferenceField sortable={false} label="#{f.cField}" source="#{f.field}Id" reference="#{f.ref.entity}"<# if (!f.required){#> allowEmpty<#}#> >
          <#{f.ref.listLabel.type}Field source="#{f.ref.listLabel.source}"<# if (!f.required){#> allowEmpty<#}#> />
        </ReferenceField>
<#-} else {#>
        <ReferenceManyField sortable={false} label="#{f.cField}" reference="#{f.ref.entity}" target="#{f.ref.opposite}"<# if (!f.required){#> allowEmpty<#}#> >
          <#{f.ref.entity}.Grid />
        </ReferenceManyField>
<#-}-#>
<#-})#>
      </SimpleShowLayout>
    </Show>
  );
};

