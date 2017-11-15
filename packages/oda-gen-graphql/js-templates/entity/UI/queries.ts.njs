<#@ context 'entity' -#>
<#@ chunks '$$$main$$$' -#>

<#- chunkStart(`../../../${entity.name}/queries/index`); -#>
import GET_LIST from './getList';
import GET_ONE from './getOne';
import CREATE from './create';
import UPDATE from './update';
import DELETE from './delete';
import GET_MANY from './getMany';
import GET_MANY_REFERENCE from './getManyReference';
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

export const resource = ({ queries, resources }) => ({
  GET_LIST: GET_LIST({ queries, resources }),
  GET_ONE: GET_ONE({ queries, resources }),
  CREATE: CREATE({ queries, resources }),
  UPDATE: UPDATE({ queries, resources }),
  DELETE: DELETE({ queries, resources }),
  GET_MANY: GET_MANY({ queries, resources }),
  GET_MANY_REFERENCE: GET_MANY_REFERENCE({ queries, resources }),
});

export const queries = {
  GET_LIST: getListOf#{entity.name},
  GET_ONE: getOneOf#{entity.name},
  GET_MANY: getManyOf#{entity.name},
  GET_MANY_REFERENCE: getManyReferenceOf#{entity.name},
  CREATE: createOf#{entity.name},
  UPDATE: updateOf#{entity.name},
  DELETE: deleteOf#{entity.name},
  GET_LIST_RESULT: getListOf#{entity.name}Result,
  GET_ONE_RESULT: getOneOf#{entity.name}Result,
  GET_MANY_RESULT: getManyOf#{entity.name}Result,
  GET_MANY_REFERENCE_RESULT: getManyReferenceOf#{entity.name}Result,
  CREATE_RESULT: createOf#{entity.name}Result,
  UPDATE_RESULT: updateOf#{entity.name}Result,
  DELETE_RESULT: deleteOf#{entity.name}Result,
};

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

<#- chunkStart(`../../../${entity.name}/queries/getList`); -#>
import { reshape } from 'oda-lodash';
import { constants } from 'oda-aor-rest';
import set from 'lodash/set';

const { SortOrder } = constants;

export default ({ queries, resources }) => ({
  query: queries.#{entity.name}.GET_LIST,
  parseResponse: (response) => {
    const data = reshape(queries.#{entity.name}.GET_LIST_RESULT, response.data);
    return {
      data: data.items.data,
      total: data.items.total,
    };
  },
  fetchPolicy: 'network-only',
  variables: (params) => {
    const filter = Object.keys(params.filter).reduce((acc, key) => {
      if (key === 'ids') {
        return { ...acc, id: { in: params.filter[key] } };
      }
      if (key === 'q') {
        return { ...acc, #{entity.UI.listName}: { imatch: params.filter[key] } };
      }
      return set(acc, key.replace('-', '.'), params.filter[key]);
    }, {});
    return {
      skip: (params.pagination.page - 1) * params.pagination.perPage,
      limit: params.pagination.perPage,
      orderBy: params.sort.field !== 'id' ? `${params.sort.field}${SortOrder[params.sort.order]}` : undefined,
      filter,
    };
  },
});

<#- chunkStart(`../../../${entity.name}/queries/getOne`); -#>
import { reshape } from 'oda-lodash';

export default ({ queries, resources }) => ({
  query: queries.#{entity.name}.GET_ONE,
  parseResponse: (response) => {
    const data = reshape(queries.#{entity.name}.GET_ONE_RESULT, response.data);
    return {
      data: data.item,
    };
  },
  fetchPolicy: 'network-only',
  variables: params => ({
    id: params.id,
  }),
});

<#- chunkStart(`../../../${entity.name}/queries/getMany`); -#>
import { reshape } from 'oda-lodash';
import { constants } from 'oda-aor-rest';

const { SortOrder } = constants;

export default ({ queries, resources }) => ({
  query: queries.#{entity.name}.GET_MANY,
  parseResponse: (response) => {
    const data = reshape(queries.#{entity.name}.GET_MANY_RESULT, response.data);
    return {
      data: data.items,
    };
  },
  fetchPolicy: 'network-only',
  variables: params => ({
    filter: {
      id: { in: params.ids },
    },
  }),
});

<#- chunkStart(`../../../${entity.name}/queries/getManyReference`); -#>
import { reshape } from 'oda-lodash';
import { constants } from 'oda-aor-rest';

const useOpposite = {
<# entity.relations.filter(f=>f.verb === 'BelongsToMany')
.forEach(f=>{-#>
  #{f.field}: true,
<#})-#>};

  const { SortOrder } = constants;

export default ({ queries, resources }) => ({
  query: params => queries.#{entity.name}.GET_MANY_REFERENCE[params.target],
  parseResponse: (response, params) => {
    const data = reshape(queries.#{entity.name}.GET_MANY_REFERENCE_RESULT[params.target], response.data);
    return {
      data: data.items.data,
      total: data.items.total,
    };
  },
  fetchPolicy: 'network-only',
  variables: (params) => {
    const filter = {};

    if (!useOpposite[params.target]) {
      filter[params.target] = { eq: params.id };
    }

    return {
      id: params.id,
      target: params.target,
      skip: (params.pagination.page - 1) * params.pagination.perPage,
      limit: params.pagination.perPage,
      orderBy: params.sort.field !== 'id' ? `${params.sort.field}${SortOrder[params.sort.order]}` : undefined,
      filter,
    };
  },
});

<#- chunkStart(`../../../${entity.name}/queries/delete`); -#>
import { reshape } from 'oda-lodash';

export default ({ queries, resources }) => ({
  query: queries.#{entity.name}.DELETE,
  parseResponse: (response) => {
    const data = reshape(queries.#{entity.name}.DELETE_RESULT, response.data);
    return { data: data.item };
  },
  update: (store, response) => {
    // remove from cache
  },
  variables: params => ({
    input: {
      id: params.id,
    },
  }),
});

<#- chunkStart(`../../../${entity.name}/queries/create`); -#>
import { reshape } from 'oda-lodash';
import { data as utils } from 'oda-aor-rest';

const { createField, createSingle, createMany } = utils;

export default ({ queries, resources }) => ({
  query: queries.#{entity.name}.CREATE,
  parseResponse: (response) => {
    const data = reshape(queries.#{entity.name}.CREATE_RESULT, response.data);
    return { data: data.item };
  },
  update: (store, response) => {
    // insert into cache
  },
  variables: (params) => {
    const data = params.data;
    const res = resources({ queries });
    return { input:
      {
<#- entity.fields.forEach(f=>{#>
        ...createField(data, '#{f.name}'),
<#-})-#>
<# entity.relations.forEach(f=>{
#><#-if(f.single){#>
        ...createSingle(data, '#{f.field}', '#{f.ref.entity}', res),
    <#-} else {#>
        ...createMany(data, '#{f.field}', '#{f.ref.entity}', res),
<#-}-#>
<#-})#>
      },
    };
  },
});

<#- chunkStart(`../../../${entity.name}/queries/update`); -#>
import { reshape } from 'oda-lodash';
import { data as utils } from 'oda-aor-rest';

const { updateField, updateSingle, updateMany } = utils;

export default ({ queries, resources }) => ({
  query: queries.#{entity.name}.UPDATE,
  parseResponse: (response) => {
    const data = reshape(queries.#{entity.name}.UPDATE_RESULT, response.data);
    return { data: data.item };
  },
  refetchQueries: variables => ([{
    query: queries.#{entity.name}.GET_ONE,
    variables: {
      id: variables.input.id,
    },
  }]),
  variables: (params) => {
    const { data, previousData } = params;
    const res = resources({ queries });
    return {
      input: {
        id: data.id,
<#- entity.fields.filter(f=>f.name !== 'id').forEach(f=>{#>
        ...updateField(data, previousData, '#{f.name}'),
<#-})-#>
<# entity.relations.forEach(f=>{
#><#-if(f.single){#>
        ...updateSingle(data, previousData, '#{f.field}', '#{f.ref.entity}', res),
    <#-} else {#>
        ...updateMany(data, previousData, '#{f.field}', '#{f.ref.entity}', res),
<#-}-#>
<#-})#>
      },
    };
  },
});
