<#@ context 'entity' -#>
<#@ chunks '$$$main$$$' -#>

<#- chunkStart(`../../../UI/${entity.name}/queries/index`); -#>

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

export default {
  GET_LIST,
  GET_ONE,
  CREATE,
  UPDATE,
  DELETE,
  GET_MANY,
  GET_MANY_REFERENCE,
  QUERIES: {
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
  },
}

<#- chunkStart(`../../../UI/${entity.name}/queries/queries`); -#>
import gql from 'graphql-tag';
// fragments

const resultFragment = gql`fragment #{entity.name}Result on #{entity.name}{
<# entity.fields.forEach(f=>{-#>
  #{f.name}
<#})-#>
<# entity.relations.forEach(f=>{
-#><#-if(f.single){#>
  #{f.field}Id: #{f.field} @_(get:"id") {
    id
  }
<#-} else {#>
  #{f.field}Ids: #{f.field} @_(get:"edges") {
    edges @_(map:"node") {
      node @_(get:"id"){
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
  item {
    edge @_(get: "node") {
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

<#- chunkStart(`../../../UI/${entity.name}/queries/getList`); -#>
import { reshape } from 'oda-lodash';
import { constants } from 'oda-aor-rest';
import #{entity.name}Resource from './index';

export default (_queries) => {

  const { QUERIES } = #{entity.name}Resource;
  const { SortOrder } = constants;
  const queries = _queries || { #{entity.name}: QUERIES };

  return {
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
        return { ...acc, [key]: params.filter[key] };
      }, {});
      return {
        skip: (params.pagination.page - 1) * params.pagination.perPage,
        limit: params.pagination.perPage,
        orderBy: params.sort.field !== 'id' ? `${params.sort.field}${SortOrder[params.sort.order]}` : undefined,
        filter,
      };
    },
  };
};

<#- chunkStart(`../../../UI/${entity.name}/queries/getOne`); -#>
import { reshape } from 'oda-lodash';
import #{entity.name}Resource from './index';

export default (_queries) => {
  const { QUERIES } = #{entity.name}Resource;
  const queries = _queries || { #{entity.name}: QUERIES };

  return {
    query: queries.#{entity.name}.GET_ONE,
    parseResponse: (response) => {
      const data = reshape(queries.#{entity.name}.GET_ONE_RESULT, response.data);
      return {
        data: data.item,
      };
    },
    fetchPolicy: 'network-only',
    variables: (params) => ({
      id: params.id,
    }),
  };
};

<#- chunkStart(`../../../UI/${entity.name}/queries/getMany`); -#>
import { reshape } from 'oda-lodash';
import { constants } from 'oda-aor-rest';
import #{entity.name}Resource from './index';

export default (_queries) => {
  const { QUERIES } = #{entity.name}Resource;
  const { SortOrder } = constants;
  const queries = _queries || { #{entity.name}: QUERIES };

  return {
    query: queries.#{entity.name}.GET_MANY,
    parseResponse: (response) => {
      const data = reshape(queries.#{entity.name}.GET_MANY_RESULT, response.data);
      return {
        data: data.items,
      };
    },
    fetchPolicy: 'network-only',
    variables: (params) => {
      const filter = {
        id: { in: params.ids }
      }
      return {
        filter,
      };
    },
  };
};

<#- chunkStart(`../../../UI/${entity.name}/queries/getManyReference`); -#>
import { reshape } from 'oda-lodash';
import { constants } from 'oda-aor-rest';
import #{entity.name}Resource from './index';

const useOpposite = {
<# entity.relations.filter(f=>f.verb === 'BelongsToMany')
.forEach(f=>{-#>
  #{f.field}: true,
<#})-#>};

export default (_queries) => {
  const { QUERIES } = #{entity.name}Resource;
  const { SortOrder } = constants;
  const queries = _queries || { #{entity.name}: QUERIES };

  return {
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
  };
};

<#- chunkStart(`../../../UI/${entity.name}/queries/delete`); -#>
import { reshape } from 'oda-lodash';
import #{entity.name}Resource from './index';

export default (_queries) => {
  const { QUERIES } = #{entity.name}Resource;
  const queries = _queries || { #{entity.name}: QUERIES };

  return {
    query: queries.#{entity.name}.DELETE,
    parseResponse: (response) => {
      const data = reshape(queries.#{entity.name}.DELETE_RESULT, response.data);
      return { data: data.item };
    },
    update: (store, response) => {
      // remove from cache
    },
    variables: (params) => {
      return {
        input: {
          id: params.id
        }
      };
    },
  };
};

<#- chunkStart(`../../../UI/${entity.name}/queries/create`); -#>
import { reshape } from 'oda-lodash';
import #{entity.name}Resource from './index';

export default (_queries) => {
  const { QUERIES } = #{entity.name}Resource;
  const queries = _queries || { #{entity.name}: QUERIES };

  return {
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
      const input = {};

<#- entity.fields.forEach(f=>{#>
      if (data.#{f.name} !== undefined) {
        input.#{f.name} = data.#{f.name};
      }
<#-})-#>
<# entity.relations.forEach(f=>{
#><#-if(f.single){#>
      if (data.#{f.field}Id !== undefined) {
        input.#{f.field} = { id: data.#{f.field}Id };
      }
      <#-} else {#>
      if (data.#{f.field}Ids !== undefined && Array.isArray(data.#{f.field}Ids) && data.#{f.field}Ids.length > 0) {
        input.#{f.field} = data.#{f.field}Ids.map(f => ({ id: f }));
      }
<#-}-#>
<#-})#>
      return { input };
    },
  };
};

<#- chunkStart(`../../../UI/${entity.name}/queries/update`); -#>
import { reshape } from 'oda-lodash';
import comparator from 'comparator.js';
import #{entity.name}Resource from './index';

export default (_queries) => {
  const { QUERIES } = #{entity.name}Resource;
  const queries = _queries || { #{entity.name}: QUERIES };

  return {
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
      const input = {
        id: data.id,
      };

<#- entity.fields.filter(f=>f.name !== 'id').forEach(f=>{#>
      if (data.#{f.name} !== undefined && previousData.#{f.name} !== data.#{f.name}) {
        input.#{f.name} = data.#{f.name};
      }
<#-})-#>
<# entity.relations.forEach(f=>{
#><#-if(f.single){#>
      if (data.#{f.field}Id !== undefined && previousData.#{f.field}Id !== data.#{f.field}Id) {
        input.#{f.field} = { id: data.#{f.field}Id };
      }
      <#-} else {#>

      if (data.#{f.field}Ids !== undefined && !comparator.strictEq(previousData.#{f.field}Ids, data.#{f.field}Ids)) {
        const diff = comparator.diff(previousData.#{f.field}Ids, data.#{f.field}Ids);
        if (diff.inserted) {
          input.#{f.field} = Object.keys(diff.inserted)
            .map(f => ({ id: diff.inserted[f].value }));
        }
        if (diff.removed) {
          input.#{f.field}Unlink = Object.keys(diff.removed)
            .map(f => ({ id: diff.removed[f].value }));
        }
      }

<#-}-#>
<#-})#>
      return { input };
    },
  };
};

