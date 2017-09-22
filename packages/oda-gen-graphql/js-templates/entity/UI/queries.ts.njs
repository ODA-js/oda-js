<#@ context 'entity' -#>
<#@ chunks '$$$main$$$' -#>

<# chunkStart(`../../../UI/${entity.name}/index`); #>

import GET_LIST from './getList';
import GET_ONE from './getOne';
import CREATE from './create';
import UPDATE from './update';
import DELETE from './delete';
import GET_MANY from './getMany';
import GET_MANY_REFERENCE from './getManyReference';

export default {
  GET_LIST,
  GET_ONE,
  CREATE,
  UPDATE,
  DELETE,
  GET_MANY,
  GET_MANY_REFERENCE,
}

<# chunkStart(`../../../UI/${entity.name}/fragments`); #>

import gql from 'graphql-tag';

export default {
  full: gql`
  fragment #{entity.name}Full on #{entity.name}{
<# entity.fields.forEach(f=>{-#>
    #{f.name}
<#})-#>
<# entity.relations.forEach(f=>{-#>
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
  `,
  fullResult: gql`
  fragment #{entity.name}FullResult on #{entity.name}{
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
  `
}

<# chunkStart(`../../../UI/${entity.name}/getList`); #>

import gql from 'graphql-tag';
import { reshape } from 'oda-lodash';
import { constants } from 'oda-aor-rest';
import fragments from './fragments';

const { SortOrder } = constants;

const listResult = gql`
query listResult{
    items {
      total: pageInfo @_(get:"count") {
        count
      }
      data: edges @_(each:{assign:"node"}) {
        node {
          ...#{entity.name}FullResult
        }
      }
    }
  }
  ${fragments.fullResult}
`


export default {
  query: gql`query #{entity.plural}($skip: Int, $limit: Int, $orderBy: [#{entity.name}SortOrder], $filter: #{entity.name}ComplexFilter){
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
  ${fragments.full}
`,
  parseResponse: response => {
    let data = reshape(listResult, response.data);
    return {
      data: data.items.data,
      total: data.items.total,
    };
  },
  variables: params => {
    const filter = Object.keys(params.filter).reduce((acc, key) => {
      if (key === 'ids') {
        return { ...acc, id: { in: params.filter[key] } };
      }
      if (key === 'q') {
        return { ...acc, name: { imatch: params.filter[key] } };
      }
      return { ...acc, [key]: params.filter[key] };
    }, {});
    return {
      skip: (params.pagination.page - 1) * params.pagination.perPage,
      limit: params.pagination.perPage,
      orderBy: params.sort.field !== 'id' ? `${params.sort.field}${SortOrder[params.sort.order]}` : undefined,
      filter,
    };
  }

}

<# chunkStart(`../../../UI/${entity.name}/getOne`); #>
import gql from 'graphql-tag';
import { reshape } from 'oda-lodash';
import fragments from './fragments';

const oneResult = gql`{
  item {
    ...#{entity.name}FullResult
  }
}
${fragments.fullResult}
`
export default {
  query: gql`
  query Person($id: ID){
    item: person(id: $id) {
      ...#{entity.name}Full
    }
  }
  ${fragments.full}
  `,
  parseResponse: response => {
    let data = reshape(oneResult, response.data);
    return {
      data: data.item,
    };
  },
  variables: params => ({
    id: params.id,
  }),
}