<#@ context 'entity' -#>
import * as log4js from 'log4js';
import * as _ from 'lodash';
import * as get from 'lodash/get';

let logger = log4js.getLogger('graphql:query:#{entity.name}');
import {
  globalIdField,
} from 'oda-api-graphql';

<#-if(entity.relations.length > 0){#>
import RegisterConnectors from '../../../../data/registerConnectors';
<# if(entity.relations.some(c=>c.verb === 'BelongsToMany' || c.verb === 'HasMany')) {-#>
import { idToCursor, emptyConnection, pagination, detectCursorDirection, consts, Filter } from 'oda-api-graphql';

<#}-#>
<#}-#>
import { lib } from 'oda-gen-common';
const { selectionTree: traverse } = lib;

export const resolver: { [key: string]: any } = {
  #{entity.name}: {
    id: globalIdField('#{entity.name}', ({ _id }) => _id),
<# for (let connection of entity.relations) {-#>
    #{connection.field}: async (
      {_id: id}, // owner id
      args:{
        limit?: number;
        skip?: number;
        first?: number;
        after?: string;
        last?: number;
        before?: string;
        filter?: {
          [k: string]: any
        };
        orderBy?: string | string[];
      },
      context: { connectors: RegisterConnectors },
      info) => {
      let result;
      let selectionSet = traverse(info);

<# if(!connection.derived){#>
      let #{entity.ownerFieldName} = await context.connectors.#{entity.name}.findOneById(id);
<#- if (connection.verb === 'HasOne') {#>
      //HasOne
      if (#{entity.ownerFieldName} && #{entity.ownerFieldName}.#{connection.ref.backField}) {
        let #{connection.refFieldName} = await context.connectors.#{connection.ref.entity}.getList({ filter: {
          #{connection.ref.field} : {
            eq: #{entity.ownerFieldName}.#{connection.ref.backField}}
          }
        });
        result = #{connection.refFieldName}[0];
<#} else if (connection.verb === 'HasMany') {#>
      //HasMany
        let idMap = {
          id: '#{entity.adapter == 'mongoose' ? '_id' : 'id'}',
<# connection.idMap.forEach(f=>{-#>
          #{f}: '#{f}',
<#})-#>
        };
      if (#{entity.ownerFieldName} && #{entity.ownerFieldName}.#{connection.ref.backField}) {
        if(!args.filter){
          args.filter = {};
        }
        args.filter.#{connection.ref.field} =  {
          eq: #{entity.ownerFieldName}.#{connection.ref.backField}
        };
        let list = get(selectionSet, 'edges.node') ?
          await context.connectors.#{connection.ref.entity}.getList({
            ...args,
            idMap,
          }): [];

        if (list.length > 0) {
          let cursor = pagination(args);
          let direction = detectCursorDirection(args)._id;
          let edges = list.map(l => {
            return {
              cursor: idToCursor(l.id),
              node: l,
            };
          });

          let pageInfo = get(selectionSet, 'pageInfo') ?
            {
              startCursor: get(selectionSet, 'pageInfo.startCursor')
                ? edges[0].cursor : undefined,
              endCursor: get(selectionSet, 'pageInfo.endCursor')
                ? edges[edges.length - 1].cursor : undefined,
              hasPreviousPage: get(selectionSet, 'pageInfo.hasPreviousPage') ? (direction === consts.DIRECTION.BACKWARD ? list.length === cursor.limit : false) : undefined,
              hasNextPage: get(selectionSet, 'pageInfo.hasNextPage') ? (direction === consts.DIRECTION.FORWARD ? list.length === cursor.limit : false) : undefined,
              count: get(selectionSet, 'pageInfo.count') ? await context.connectors.#{connection.ref.entity}.getCount({
                ...args,
                idMap,
                }) : 0,
            } : null;

          result = {
            edges,
            pageInfo,
          };

        } else {
          result = emptyConnection();
        }
<#} else if (connection.verb === 'BelongsTo') {#>
      //BelongsTo
      if (#{entity.ownerFieldName} && #{entity.ownerFieldName}.#{connection.ref.backField || connection.field}) {
        result = await context.connectors.#{connection.ref.entity}.findOneBy#{connection.ref.cField}(#{entity.ownerFieldName}.#{connection.ref.backField || connection.field});
<#} else if (connection.verb === 'BelongsToMany') {#>
      //BelongsToMany

      if (#{entity.ownerFieldName} && #{entity.ownerFieldName}.#{connection.ref.backField}) {
        const cursor = pagination(args);
        let direction = detectCursorDirection(args)._id;
        const _args = {
          ..._.pick(args, ['limit', 'skip', 'first', 'after', 'last', 'before']),
        } as {
            limit?: number;
            skip?: number;
            first?: number;
            after?: string;
            last?: number;
            before?: string;
            filter?: {
              [k: string]: any
            };
        };

        _args.filter = {
          #{connection.ref.using.field}: {
            eq: #{entity.ownerFieldName}.#{connection.ref.backField},
          }
        }
        let idMap = {
          id: '#{entity.adapter == 'mongoose' ? '_id' : 'id'}',
<# connection.idMap.forEach(f=>{-#>
          #{f}: '#{f}',
<#})-#>
        };
<#if(connection.ref.fields.length > 0){#>
        const itemCheck = Filter.Process.create(args.filter || {}, idMap);
<#}#>
        let links = await context.connectors.#{connection.ref.using.entity}.getList(
           _args,
<#if(connection.ref.fields.length > 0){#>
          async (link) => {
            let result = await context.connectors.#{connection.ref.entity}.findOneById(link.#{connection.ref.usingField});
            if (result) {
              return itemCheck({
                ...result,
              <#- for(let field of connection.ref.fields){#>
                #{field}: link.#{field},
              <#-}#>
                });
            } else {
              return false;
            }
          }
<#}#>
        );
        if (links.length > 0) {
          let linksHash = links.reduce((res, cur)=>{
            res[cur.#{connection.ref.usingField}] = cur;
            return res;
          }, {});

          let res = await context.connectors.#{connection.ref.entity}.getList({
            filter: {
              ...args.filter,
              #{connection.ref.backField}: { in: links.map(i => i.#{connection.ref.usingField}) }
            }
          });

          if (res.length > 0) {
            let edges = res.map(r=>({
              <#- for(let field of connection.ref.fields){#>
                #{field}: l.#{field},
              <#-}#>
              cursor: idToCursor(linksHash[r.#{connection.ref.backField}].id),
              node: r,
            }));
            let pageInfo = get(selectionSet, 'pageInfo') ?
              {
                startCursor: get(selectionSet, 'pageInfo.startCursor')
                  ? edges[0].cursor : undefined,
                endCursor: get(selectionSet, 'pageInfo.endCursor')
                  ? edges[edges.length - 1].cursor : undefined,
                hasPreviousPage: get(selectionSet, 'pageInfo.hasPreviousPage') ? (direction === consts.DIRECTION.BACKWARD ? edges.length === cursor.limit : false) : undefined,
                hasNextPage: get(selectionSet, 'pageInfo.hasNextPage') ? (direction === consts.DIRECTION.FORWARD ? edges.length === cursor.limit : false) : undefined,
                count: get(selectionSet, 'pageInfo.count') ? await context.connectors.#{connection.ref.entity}.getCount({
                  filter: {
                    #{connection.ref.backField}: { in: links.map(i => i.#{connection.ref.usingField}) }
                  }
                }) : 0,
              } : null;

            result = {
              edges,
              pageInfo,
            };
          } else {
            result = emptyConnection();
          }
        } else {
          result = emptyConnection();
        }
    <#-}#>
      }
<#} else {#>
      // let #{entity.ownerFieldName} = await context.connectors.#{entity.name}.findOneById(id);
      result = {};
      // place your code here
<#}#>
      return result;
    },
<#}-#>
<# for (let connection of entity.fields) {-#>
    #{connection.field}: async (
      {_id: id}, // owner id
      args,
      context: { connectors: RegisterConnectors },
      info) => {
      let result;
<# if(!connection.derived){#>
      // let #{entity.ownerFieldName} = await context.connectors.#{entity.name}.findOneById(id);
      result = undefined;
      // some secure code here
<#} else {#>
      // let #{entity.ownerFieldName} = await context.connectors.#{entity.name}.findOneById(id);
      result = undefined;
      // place your custom code here
<#}#>
      return result;
    },
<#}-#>
  },
};
