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
  list: gql`
  fragment #{entity.name}List on #{entity.name}{
<# entity.fields.forEach(f=>{-#>
    #{f.name}
<#})-#>
<# entity.relations.forEach(f=>{-#>
    #{f.field}{<#if(f.single){#>
      id
    <#} else {#>
      edges{
        node{
          id
        }
      }
    <#}#>}
<#})-#>
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
          ...#{entity.name}List
        }
      }
    }
  }
  ${fragments.list}
`


export default {
  query: gql` query #{entity.plural}($skip: Int, $limit: Int, $orderBy: [#{entity.name}SortOrder], $filter: #{entity.name}ComplexFilter){
        items: #{entity.listName}(skip:$skip, limit: $limit, orderBy: $orderBy, filter: $filter) {
          pageInfo{
            count
          }
          edges {
            node {
              ...#{entity.name}List
            }
          }
        }
      }
      ${fragments.list}
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

