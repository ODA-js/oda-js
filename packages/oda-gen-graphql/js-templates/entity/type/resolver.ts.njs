<#@ context 'entity' -#>
import * as log4js from 'log4js';
import * as _ from 'lodash';
let logger = log4js.getLogger('graphql:query:#{entity.name}');
import {
  globalIdField,
} from 'graphql-relay';

<#-if(entity.relations.length > 0){#>
import RegisterConnectors from '../../../../data/registerConnectors';
<# if(entity.relations.some(c=>c.verb === 'BelongsToMany' || c.verb === 'HasMany')) {-#>
import { idToCursor, emptyConnection, pagination } from 'oda-api-graphql';

<#}-#>
<#}-#>

export const resolver: { [key: string]: any } = {
  #{entity.name}: {
    id: globalIdField('#{entity.name}', ({ _id }) => _id),
<# for (let connection of entity.relations) {-#>
    #{connection.field}: async (
      {_id: id}, // owner id
      args,
      context: { connectors: RegisterConnectors },
      info) => {
      let result;
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
          let count = await context.connectors.#{connection.ref.entity}.getCount(args);
          let first = await context.connectors.#{connection.ref.entity}.getFirst(args);
          let edges = list.map(l => {
            return {
              cursor: idToCursor(l._id),
              node: l,
            };
          });
          result = {
            edges,
            pageInfo: {
              count: count || 0,
              startCursor: edges[0].cursor,
              endCursor: edges[edges.length - 1].cursor,
              hasPreviousPage: edges[0].node.id.toString() !== first.id.toString(),
              hasNextPage: list.length === cursor.limit && list.length !== count,
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
        const cursor = _.pick(args, ['limit', 'skip', 'first', 'after', 'last', 'before']);
        const _args = {
          ..._.pick(args, ['limit', 'skip', 'first', 'after', 'last', 'before']),
        };
        if(!_args.filter){
          _args.filter = {};
        }
        _args.filter.#{connection.ref.using.field}: #{entity.ownerFieldName}.#{connection.ref.backField}
        // все хитрее чем тут
        // let count = await context.connectors.Like.getCount(_args);
        // let first = await context.connectors.Like.getFirst(_args);
        // const hash = {};
        let links = await context.connectors.#{connection.ref.using.entity}.getList(
           _args,
          async (link) => {
            let result = await context.connectors.#{connection.ref.entity}.findOneById(link.#{connection.ref.usingField});
            if (result) {
              // hash[result._id] = link._id;
              return true;
            } else {
              return false;
            }
          }
        );
        if (links.length > 0) {
          let _args2 = {
            ..._.omit(args, ['limit', 'skip', 'first', 'after', 'last', 'before']),
            limit: links.length,
          };
          if(!_args2.filter){
            _args2.filter = {};
          }
          _args2.filter.#{connection.ref.field}: { $in: links.map(i => i.#{connection.ref.usingField}) }
          let res = await context.connectors.#{connection.ref.entity}.getList(_args2);

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
                cursor: idToCursor(l._id),
                node: hItems[l.#{connection.ref.usingField}],
              };
            }).filter(l=>l.node);

            result = {
              edges,
              pageInfo: {
                // count: count || 0,
                startCursor: edges[0].cursor,
                endCursor: edges[edges.length - 1].cursor,
                hasPreviousPage: !!cursor.after || !!cursor.skip,
                hasNextPage: res.length === cursor.limit,
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
