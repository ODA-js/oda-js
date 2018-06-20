<#@ context 'entity' -#>
<#@ chunks '$$$main$$$' -#>

<#- chunkStart(`../../../${entity.name}/queries/index`); -#>
import { data } from 'oda-ra-data-provider';
import { fragments, queries } from './queries';
import set from 'lodash/set';

export default {
  queries,
  fragments,
  name: '#{entity.role}/#{entity.name}',
  title: '#{entity.title}',
  role: '#{entity.role}',
  fields: {
  <#- entity.fields.forEach(f => {#>
    #{f.name}: { type: '#{f.resourceType}' },
  <#-})#>
  <#- entity.relations.forEach(f => {#>
    #{f.field}: {
      ref: {
        resource: '#{entity.role}/#{f.ref.entity}',
        type: data.resource.interfaces.refType.#{f.verb},
      },
    },
  <#-})#>
  },
  operations: {
    GET_LIST: {
      filterBy: (params) => Object.keys(params.filter).reduce((acc, key) => {
        if (key === 'ids') {
          return { ...acc, id: { in: params.filter[key] } };
        }
        if (key === 'q') {
<#-if (Array.isArray(entity.UI.quickSearch) && entity.UI.quickSearch.length > 0){#>
          return { ...acc,
            or: [
<#- entity.UI.quickSearch.forEach(sf=>{ #>
              { #{sf}: { imatch: params.filter[key] } },
<# });-#>
            ]
          };
<#-} else {#>
          return acc;
<#-}#>
        }
        return set(acc, key.replace('-', '.'), params.filter[key]);
      }, {}),
    },
    // GET_ONE: {},
    // GET_MANY: {},
    // GET_MANY_REFERENCE: {},
    // CREATE: {},
    // UPDATE: {},
    // DELETE: {},
  },
};

export const extension = [
  <#- entity.relations.filter(f=> f.verb === 'BelongsToMany').forEach(f => {#>
    {
      name:'#{entity.role}/#{f.ref.entity}',
      fields:{
      <#- f.ref.fields.filter(fld => f.ref.using.UI.edit[fld.name] ).forEach(f => {#>
        #{f.name}: { type: '#{f.resourceType}' },
      <#-})#>
      }
    },
  <#-})#>
];

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
  let current = embedded && entity.UI.embedded.names[f.field];
-#><#-if(f.single) {#>
    #{f.field}<#if(embedded) {#>Value<#} else {#>Id<#}#>: #{f.field} <#if(!embedded) {#>@_(get:"id")<#}#>
     {
      id
<# if(embedded){
  entity.UI.embedded.items[current].fields
        .filter(f=> f.name !== 'id')
        .forEach(f=>{-#>
      #{f.name}
<#
        });
  } 
-#>      
    }
<#-} else {#>
    #{f.field}<#if(embedded) {#>Values<#} else {#>Ids<#}#>: #{f.field} @_(get:"edges") {
      edges @_( <#if(embedded) {#>each: {assign:"node"}<#} else {#>map:"node"<#}#> ) {
<#- embedded && f.ref.fields.forEach(fld=>{#>
        #{fld.name}
<#-})#>
        node <#if(!embedded) {#>@_(get:"id") <#}#> {
          id
<# if(embedded){
  entity.UI.embedded.items[current].fields
        .filter(f=> f.name !== 'id')
        .forEach(f=>{-#>
          #{f.name}
<#
        });
  } 
-#>
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
  const embedded = entity.UI.embedded.names.hasOwnProperty(f.field);
  let current = embedded && entity.UI.embedded.names[f.field];
-#>
    #{f.field} {<#if(f.single) {#>
      id
<# if(embedded){
  entity.UI.embedded.items[current].fields
        .filter(f=> f.name !== 'id')
        .forEach(f=>{-#>
      #{f.name}
<#
        });
  } 
-#>  
    <#} else {#>
      edges {
<#- embedded && f.ref.fields.forEach(fld=>{#>
        #{fld.name}
<#-})#>
        node {
          id
<# if(embedded){
  entity.UI.embedded.items[current].fields
        .filter(f=> f.name !== 'id')
        .forEach(f=>{-#>
          #{f.name}
<#
        });
  } 
-#>
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
  getOne: ({ fullFragment }) => gql`query #{entity.name}($id: ID) {
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
  getManyReferenceResult: ({ resultFragment }, { getManyReferenceResultOpposite, getManyReferenceResultRegular }) => ({
<# entity.relations
  .forEach(f => {
    if( f.verb === 'BelongsToMany' ) {-#>
    #{f.field}: getManyReferenceResultOpposite({ resultFragment }),
<#} else {-#>
    #{f.field}: getManyReferenceResultRegular({ resultFragment }),
<#}})-#>
  }),
}
