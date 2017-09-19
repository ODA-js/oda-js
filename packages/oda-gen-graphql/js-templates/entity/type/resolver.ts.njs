<#@ context 'entity' -#>
import * as log4js from 'log4js';
import * as _ from 'lodash';
import * as get from 'lodash/get';

let logger = log4js.getLogger('graphql:query:#{entity.name}');
import {
  globalIdField,
} from 'graphql-relay';

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

      if (#{entity.ownerFieldName} && #{entity.ownerFieldName}.#{connection.ref.backField}) {
        if(!args.filter){
          args.filter = {};
        }
        args.filter.#{connection.ref.field} =  {
          eq: #{entity.ownerFieldName}.#{connection.ref.backField}
        };
        let list = await context.connectors.#{connection.ref.entity}.getList(args);
        if (list.length > 0) {
          let cursor = pagination(args);
          let direction = detectCursorDirection(args)._id;
          let edges = list.map(l => {
            return {
              cursor: idToCursor(l.id),
              node: l,
            };
          });
          result = {
            edges,
            pageInfo: {
              startCursor: edges[0].cursor,
              endCursor: edges[edges.length - 1].cursor,
              hasPreviousPage: direction === consts.DIRECTION.BACKWARD ? list.length === cursor.limit : false,
              hasNextPage: direction === consts.DIRECTION.FORWARD ? list.length === cursor.limit : false,
            },
          };
        } else {
          result = emptyConnection();
        }
<#} else if (connection.verb === 'BelongsTo') {#>
      //BelongsTo
      if (#{entity.ownerFieldName} && #{entity.ownerFieldName}.#{connection.field}) {
        result = await context.connectors.#{connection.ref.entity}.findOneBy#{connection.ref.cField}(#{entity.ownerFieldName}.#{connection.field});
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

<# let relFields = entity.
  relations
  .filter(f => f.ref.type === 'ID' && f.verb === 'BelongsTo')
  .map(f=>f.field);#>
      let idMap = {
        id: '_id',
<# relFields.forEach(f=>{#>
        #{f}: '#{f}',
<#})-#>
      };

      const itemCheck = Filter.Process.create(args.filter || {}, idMap);

        let links = await context.connectors.#{connection.ref.using.entity}.getList(
           _args,
          async (link) => {
            let result = await context.connectors.#{connection.ref.entity}.findOneById(link.#{connection.ref.usingField});
            if (result) {
              return itemCheck({
                ...result,
              <#- for(let field of connection.ref.fields){#>
                #{field}: l.#{field},
              <#-}#>
                });
            } else {
              return false;
            }
          }
        );
        if (links.length > 0) {

          //let res = await Promise.all(links.map(i => context.connectors.#{connection.ref.entity}.findOneBy#{connection.ref.usingIndex}(i.#{connection.ref.usingField})));

          let res = await context.connectors.#{connection.ref.entity}.getList({
            filter: {
              #{connection.ref.backField}: { in: links.map(i => i.#{connection.ref.usingField}) }
            }
          });

          if (res.length > 0) {
            let hItems = res.reduce((hash, item) => {
              hash[item.#{connection.ref.field}] = item;
              return hash;
            }, {});

            let edges = links.map(l => {
              return {
              <#- for(let field of connection.ref.fields){#>
                #{field}: l.#{field},
              <#-}#>
                cursor: idToCursor(l.id),
                node: hItems[l.#{connection.ref.usingField}],
              };
            }).filter(l=>l.node);

            result = {
              edges,
              pageInfo: {
                startCursor: edges[0].cursor,
                endCursor: edges[edges.length - 1].cursor,
                hasPreviousPage: direction === consts.DIRECTION.BACKWARD ? edges.length === cursor.limit : false,
                hasNextPage: direction === consts.DIRECTION.FORWARD ? edges.length === cursor.limit : false,
              },
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
