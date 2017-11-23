<#@ context 'entity' -#>
<#@ chunks '$$$main$$$' -#>

<#- chunkStart(`../../../${entity.name}/queries/index`); -#>
import GetList from './getList';
import GetOne from './getOne';
import Create from './create';
import Update from './update';
import Delete from './delete';
import GetMany from './getMany';
import GetManyReference from './getManyReference';
import { data } from 'oda-aor-rest';

import {
  getListOf#{entity.name},
  getOneOf#{entity.name},
  getManyOf#{entity.name},
  deleteOf#{entity.name},
  createOf#{entity.name},
  updateOf#{entity.name},
  getManyReferenceOf#{entity.name},
  getListOf#{entity.name}Result,
  getOneOf#{entity.name}Result,
  getManyOf#{entity.name}Result,
  deleteOf#{entity.name}Result,
  createOf#{entity.name}Result,
  updateOf#{entity.name}Result,
  getManyReferenceOf#{entity.name}Result,
} from './queries';


export default class extends data.resource.Resource {
  constructor (options, resourceContainer) {
    super(options, resourceContainer);
    this._name = '#{entity.name}';
    this._fields = {
  <#- entity.fields.forEach(f=>{
  #>
      #{f.name}: { type: '#{f.resourceType}'},
  <#-
  })#>
  <#- entity.relations.forEach(f=>{
  #>
      #{f.field}: {
        ref:{
          ref: '#{f.ref.entity}',
          type:  data.resource.interfaces.refType.#{f.verb},
        },
      },
  <#-
  })#>
    };
    this._query = {
      GET_LIST: new GetList({
        query: getListOf#{entity.name},
        resultQuery: getListOf#{entity.name}Result,
      }, this),
      GET_ONE: new GetOne({
        query: getOneOf#{entity.name},
        resultQuery: getOneOf#{entity.name}Result,
      }, this),
      GET_MANY: new GetMany({
        query: getManyOf#{entity.name},
        resultQuery: getManyOf#{entity.name}Result,
      }, this),
      GET_MANY_REFERENCE: new GetManyReference({
        query: getManyReferenceOf#{entity.name},
        resultQuery: getManyReferenceOf#{entity.name}Result,
      }, this),
      CREATE: new Create({
        query: createOf#{entity.name},
        resultQuery: createOf#{entity.name}Result,
      }, this),
      UPDATE: new Update({
        query: updateOf#{entity.name},
        resultQuery: updateOf#{entity.name}Result,
      }, this),
      DELETE: new Delete({
        query: deleteOf#{entity.name},
        resultQuery: deleteOf#{entity.name}Result,
      }, this),
    };
  }
};

<#- chunkStart(`../../../${entity.name}/queries/getList`); -#>
import { data } from 'oda-aor-rest';
import set from 'lodash/set';

export default class extends data.resource.operations.GetList {
  // constructor(options, resource){
  //   super(options, resource);
  // }
  _filterBy = (params) => Object.keys(params.filter).reduce((acc, key) => {
    if (key === 'ids') {
      return { ...acc, id: { in: params.filter[key] } };
    }
    if (key === 'q') {
      return { ...acc, #{entity.UI.listName}: { imatch: params.filter[key] } };
    }
    return set(acc, key.replace('-', '.'), params.filter[key]);
  }, {})
}

<#- chunkStart(`../../../${entity.name}/queries/getOne`); -#>
import { data } from 'oda-aor-rest';

export default class extends data.resource.operations.GetOne  {
  // constructor(options, resource){
  //   super(options, resource);
  // }
}

<#- chunkStart(`../../../${entity.name}/queries/getMany`); -#>
import { data } from 'oda-aor-rest';

export default class extends data.resource.operations.GetMany  {
  // constructor(options, resource){
  //   super(options, resource);
  // }
}

<#- chunkStart(`../../../${entity.name}/queries/getManyReference`); -#>
import { data } from 'oda-aor-rest';

export default class extends data.resource.operations.GetManyReference  {
  // constructor(options, resource){
  //   super(options, resource);
  // }
}

<#- chunkStart(`../../../${entity.name}/queries/delete`); -#>
import { data } from 'oda-aor-rest';

export default class extends data.resource.operations.Delete  {
  // constructor(options, resource){
  //   super(options, resource);
  // }
}

<#- chunkStart(`../../../${entity.name}/queries/create`); -#>
import { data } from 'oda-aor-rest';

export default class extends data.resource.operations.Create  {
  // constructor(options, resource){
  //   super(options, resource);
  // }
}

<#- chunkStart(`../../../${entity.name}/queries/update`); -#>
import { data } from 'oda-aor-rest';

export default class extends data.resource.operations.Update  {
  // constructor(options, resource){
  //   super(options, resource);
  // }
}

<#- chunkStart(`../../../${entity.name}/queries/queries`); -#>
import gql from 'graphql-tag';
// fragments

const resultFragment = gql`fragment #{entity.name}Result on #{entity.name}{
<# entity.fields.forEach(f=>{-#>
  #{f.name}
<#})-#>
<# entity.relations.forEach(f=>{
  const embedded = entity.UI.embedded.names.hasOwnProperty(f.field);
-#><#-if(f.single){#>
  #{f.field}Id: #{f.field} @_(get:"id") {
    id
  }
<#-} else {#>
  #{f.field}<#if(embedded){#>Values<#}else{#>Ids<#}#>: #{f.field} @_(get:"edges") {
    edges @_(map:"node") {
      node <#if(!embedded){#>@_(get:"id") <#}#>{
        id
      }
    }
  }
<#-}-#>
<#-})#>
}
`;

const fullFragment = gql`fragment #{entity.name}Full on #{entity.name}{
<# entity.fields.forEach(f=>{-#>
    #{f.name}
<#})-#>
<# entity.relations.forEach(f=>{
-#>
    #{f.field}{<#if(f.single){#>
      id
    <#} else {#>
      edges {
        node {
          id
        }
      }
    <#}#>}
<#})-#>
  }
`;

// getList
export const getListOf#{entity.name}Result = gql`query getListOf#{entity.name}Result {
  items {
    total: pageInfo @_(get:"count") {
      count
    }
    data: edges @_(each:{assign:"node"}) {
      node {
        ...#{entity.name}Result
      }
    }
  }
}
${resultFragment}
`;

export const getListOf#{entity.name} = gql`query getListOf#{entity.name}($skip: Int, $limit: Int, $orderBy: [#{entity.name}SortOrder], $filter: #{entity.name}ComplexFilter){
  items: #{entity.listName}(skip:$skip, limit: $limit, orderBy: $orderBy, filter: $filter) {
    pageInfo{
      count
    }
    edges {
      node {
        ...#{entity.name}Full
      }
    }
  }
}
${fullFragment}
`;

//getOne
export const getOneOf#{entity.name}Result = gql`{
  item {
    ...#{entity.name}Result
  }
}
${resultFragment}
`;

export const getOneOf#{entity.name} = gql`query #{entity.name}($id: ID){
  item: #{entity.ownerFieldName}(id: $id) {
    ...#{entity.name}Full
  }
}
${fullFragment}
`;

// getMany
export const getManyOf#{entity.name}Result = gql`{
  items @_(get:"edges"){
    edges @_(map: "node")  {
      node {
        ...#{entity.name}Result
      }
    }
  }
}
${resultFragment}
`;

export const getManyOf#{entity.name} = gql`query #{entity.plural}($filter: #{entity.name}ComplexFilter){
  items: #{entity.listName}(filter: $filter) {
    edges {
      node {
        ...#{entity.name}Full
      }
    }
  }
}
${fullFragment}
`;

//delete
export const deleteOf#{entity.name}Result = gql`{
  item @_(get:"node"){
    node {
      ...#{entity.name}Result
    }
  }
}
${resultFragment}
`;

export const deleteOf#{entity.name} = gql`mutation delete#{entity.name} ($input : delete#{entity.name}Input!) {
  item: delete#{entity.name} (input: $input) {
    node: #{entity.ownerFieldName} {
      ...#{entity.name}Full
    }
  }
}
${fullFragment}
`;

//create
export const createOf#{entity.name}Result = gql`{
  item @_(get: "edge.node") {
    edge {
      node {
        ...#{entity.name}Result
      }
    }
  }
}
${resultFragment}
`;

export const createOf#{entity.name} = gql`mutation create#{entity.name}($input: create#{entity.name}Input!){
  item : create#{entity.name} (input : $input) {
    edge: #{entity.ownerFieldName} {
      node {
        ...#{entity.name}Full
      }
    }
  }
}
${fullFragment}
`;

//update
export const updateOf#{entity.name}Result = gql`{
  item @_(get:"node"){
    node {
      ...#{entity.name}Result
    }
  }
}
${resultFragment}
`;

export const updateOf#{entity.name} = gql`mutation update#{entity.name}($input: update#{entity.name}Input!){
      item : update#{entity.name} (input : $input) {
        node: #{entity.ownerFieldName} {
          ...#{entity.name}Full
        }
      }
    }
  ${fullFragment}
`;

//getManyReference
export const getManyReferenceOf#{entity.name} = {
<# entity.relations
.forEach(f=>{
  if(f.verb === 'BelongsToMany'){
  -#>
  #{f.field}: gql`query #{f.shortName}_#{f.ref.cField}($id: ID, $skip: Int, $limit: Int, $orderBy: [#{entity.name}SortOrder], $filter: #{entity.name}ComplexFilter){
    opposite: #{f.ref.queryName}(id:$id){
      id
      items: #{f.ref.opposite}(skip:$skip, limit: $limit, orderBy: $orderBy, filter: $filter) {
        pageInfo{
          count
        }
        edges {
          node {
            ...#{entity.name}Full
          }
        }
      }
    }
  }
  ${fullFragment}
`,
<#} else {#>
  #{f.field}: gql`query #{f.shortName}_#{f.ref.cField}($skip: Int, $limit: Int, $orderBy: [#{entity.name}SortOrder], $filter: #{entity.name}ComplexFilter){
    items: #{entity.listName}(skip:$skip, limit: $limit, orderBy: $orderBy, filter: $filter) {
      pageInfo{
        count
      }
      edges {
        node {
          ...#{entity.name}Full
        }
      }
    }
  }
  ${fullFragment}
`,
<#}})-#>
};

export const getManyReferenceOf#{entity.name}ResultOpposite = gql`{
  items: opposite @_(get:"items") {
    items {
      total: pageInfo @_(get:"count") {
        count
      }
      data: edges @_(each:{assign:"node"}) {
        node {
          ...#{entity.name}Result
        }
      }
    }
  }
}
  ${resultFragment}
`;

export const getManyReferenceOf#{entity.name}ResultRegular = gql`{
  items {
    total: pageInfo @_(get:"count") {
      count
    }
    data: edges @_(each:{assign:"node"}) {
      node {
        ...#{entity.name}Result
      }
    }
  }
}
  ${resultFragment}
`;

export const getManyReferenceOf#{entity.name}Result = {
<# entity.relations
.forEach(f=>{
  if(f.verb === 'BelongsToMany'){
-#>
  #{f.field}: getManyReferenceOf#{entity.name}ResultOpposite,
<#} else {#>
  #{f.field}: getManyReferenceOf#{entity.name}ResultRegular,
<#}})-#>};

