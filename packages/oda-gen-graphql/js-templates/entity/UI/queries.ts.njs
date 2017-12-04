<#@ context 'entity' -#>
<#@ chunks '$$$main$$$' -#>

<#- chunkStart(`../../../${entity.name}/queries/index`); -#>
import _getList from './getList';
import _getOne from './getOne';
import _getMany from './getMany';
import _getManyReference from './getManyReference';
import _create from './create';
import _update from './update';
import _delete from './delete';
import { data } from 'oda-aor-rest';
import { fragments, queries } from './queries';

export default {
  queries,
  fragments,
  name: '#{entity.name}',
  fields: {
  <#- entity.fields.forEach(f => {#>
    #{f.name}: { type: '#{f.resourceType}' },
  <#-})#>
  <#- entity.relations.forEach(f => {#>
    #{f.field}: {
      ref: {
        resource: '#{f.ref.entity}',
        type: data.resource.interfaces.refType.#{f.verb},
      },
    },
  <#-})#>
  },
  operations: {
    GET_LIST: _getList,
    GET_ONE: _getOne,
    GET_MANY: _getMany,
    GET_MANY_REFERENCE: _getManyReference,
    CREATE: _create,
    UPDATE: _update,
    DELETE: _delete,
  },
};

<#- chunkStart(`../../../${entity.name}/queries/getList`); -#>
import set from 'lodash/set';

export default {
  _filterBy: (params) => Object.keys(params.filter).reduce((acc, key) => {
    if (key === 'ids') {
      return { ...acc, id: { in: params.filter[key] } };
    }
    if (key === 'q') {
      return { ...acc, #{entity.UI.listName}: { imatch: params.filter[key] } };
    }
    return set(acc, key.replace('-', '.'), params.filter[key]);
  }, {}),
}

<#- chunkStart(`../../../${entity.name}/queries/getOne`); -#>
export default { }

<#- chunkStart(`../../../${entity.name}/queries/getMany`); -#>
export default { }

<#- chunkStart(`../../../${entity.name}/queries/getManyReference`); -#>
export default { }

<#- chunkStart(`../../../${entity.name}/queries/delete`); -#>
export default { }

<#- chunkStart(`../../../${entity.name}/queries/create`); -#>
export default { }

<#- chunkStart(`../../../${entity.name}/queries/update`); -#>
export default { }

<#- chunkStart(`../../../${entity.name}/queries/queries`); -#>
import gql from 'graphql-tag';
// fragments

export const fragments = {
  resultFragment: gql`fragment #{entity.name}Result on #{entity.name} {
<# entity.fields.forEach( f=> {-#>
    #{f.name}
<#})-#>
<# entity.relations.forEach(f => {
  const embedded = entity.UI.embedded.names.hasOwnProperty(f.field);
-#><#-if(f.single) {#>
    #{f.field}Id: #{f.field} @_(get:"id") {
      id
    }
<#-} else {#>
    #{f.field}<#if(embedded) {#>Values<#} else {#>Ids<#}#>: #{f.field} @_(get:"edges") {
      edges @_(map:"node") {
        node <#if(!embedded) {#>@_(get:"id") <#}#> {
          id
        }
      }
    }
<#-}-#>
<#-})#>
  }`,
  fullFragment: gql`fragment #{entity.name}Full on #{entity.name} {
<# entity.fields.forEach( f=> {-#>
    #{f.name}
<#})-#>
<# entity.relations.forEach( f=> {
-#>
    #{f.field} {<#if(f.single) {#>
      id
    <#} else {#>
      edges {
        node {
          id
        }
      }
    <#}#>}
<#})-#>
  }`,
}

export const queries = {
  // getList
  getListResult: ({ resultFragment }) => gql`query getListOf#{entity.name}Result {
    items {
      total: pageInfo @_(get:"count") {
        count
      }
      data: edges @_(each: {assign:"node"}) {
        node {
          ...#{entity.name}Result
        }
      }
    }
  }
  ${resultFragment}
  `,
  getList: ({ fullFragment }) => gql`query getListOf#{entity.name}($skip: Int, $limit: Int, $orderBy: [#{entity.name}SortOrder], $filter: #{entity.name}ComplexFilter) {
    items: #{entity.listName}(skip:$skip, limit: $limit, orderBy: $orderBy, filter: $filter) {
      pageInfo {
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
  //getOne
  getOneResult: ({ resultFragment }) => gql`{
    item {
      ...#{entity.name}Result
    }
  }
  ${resultFragment}
  `,
  getOne: ({fullFragment}) => gql`query #{entity.name}($id: ID) {
    item: #{entity.ownerFieldName}(id: $id) {
      ...#{entity.name}Full
    }
  }
  ${fullFragment}
  `,
  // getMany
  getManyResult: ({ resultFragment }) => gql`{
    items @_(get:"edges") {
      edges @_(map: "node")  {
        node {
          ...#{entity.name}Result
        }
      }
    }
  }
  ${resultFragment}
  `,
  getMany: ({ fullFragment }) => gql`query #{entity.plural}($filter: #{entity.name}ComplexFilter) {
    items: #{entity.listName}(filter: $filter) {
      edges {
        node {
          ...#{entity.name}Full
        }
      }
    }
  }
  ${fullFragment}
  `,
  //delete
  deleteResult: ({ resultFragment }) => gql`{
    item @_(get:"node") {
      node {
        ...#{entity.name}Result
      }
    }
  }
  ${resultFragment}
  `,
  delete: ({ fullFragment }) => gql`mutation delete#{entity.name} ($input : delete#{entity.name}Input!) {
    item: delete#{entity.name} (input: $input) {
      node: #{entity.ownerFieldName} {
        ...#{entity.name}Full
      }
    }
  }
  ${fullFragment}
  `,
  //create
  createResult: ({ resultFragment }) => gql`{
    item @_(get: "edge.node") {
      edge {
        node {
          ...#{entity.name}Result
        }
      }
    }
  }
  ${resultFragment}
  `,
  create: ({ fullFragment }) => gql`mutation create#{entity.name}($input: create#{entity.name}Input!) {
    item : create#{entity.name} (input : $input) {
      edge: #{entity.ownerFieldName} {
        node {
          ...#{entity.name}Full
        }
      }
    }
  }
  ${fullFragment}
  `,
  //update
  updateResult: ({ resultFragment }) => gql`{
    item @_(get:"node") {
      node {
        ...#{entity.name}Result
      }
    }
  }
  ${resultFragment}
  `,
  update: ({ fullFragment }) => gql`mutation update#{entity.name}($input: update#{entity.name}Input!) {
        item : update#{entity.name} (input : $input) {
          node: #{entity.ownerFieldName} {
            ...#{entity.name}Full
          }
        }
      }
    ${fullFragment}
  `,
  //getManyReference
  getManyReference: ({ fullFragment }) => ({
  <# entity.relations
  .forEach( f=> {
    if(f.verb === 'BelongsToMany') {
    -#>
    #{f.field}: gql`query #{f.shortName}_#{f.ref.cField}($id: ID, $skip: Int, $limit: Int, $orderBy: [#{entity.name}SortOrder], $filter: #{entity.name}ComplexFilter) {
      opposite: #{f.ref.queryName}(id:$id) {
        id
        items: #{f.ref.opposite}(skip:$skip, limit: $limit, orderBy: $orderBy, filter: $filter) {
          pageInfo {
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
    #{f.field}: gql`query #{f.shortName}_#{f.ref.cField}($skip: Int, $limit: Int, $orderBy: [#{entity.name}SortOrder], $filter: #{entity.name}ComplexFilter) {
      items: #{entity.listName}(skip:$skip, limit: $limit, orderBy: $orderBy, filter: $filter) {
        pageInfo {
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
  }),
  getManyReferenceResultOpposite: ({ resultFragment }) => gql`{
    items: opposite @_(get:"items") {
      items {
        total: pageInfo @_(get:"count") {
          count
        }
        data: edges @_(each: {assign:"node"}) {
          node {
            ...#{entity.name}Result
          }
        }
      }
    }
  }
    ${resultFragment}
  `,
  getManyReferenceResultRegular: ({ resultFragment }) => gql`{
    items {
      total: pageInfo @_(get:"count") {
        count
      }
      data: edges @_(each: {assign:"node"}) {
        node {
          ...#{entity.name}Result
        }
      }
    }
  }
    ${resultFragment}
  `,
  getManyReferenceResult: ({ resultFragment }, { getManyReferenceResultOpposite , getManyReferenceResultRegular }) => ({
  <# entity.relations
  .forEach(f => {
    if( f.verb === 'BelongsToMany' ) {
  -#>
    #{f.field}: getManyReferenceResultOpposite({ resultFragment }),
  <#} else {#>
    #{f.field}: getManyReferenceResultRegular({ resultFragment }),
  <#}})-#>}),
}
