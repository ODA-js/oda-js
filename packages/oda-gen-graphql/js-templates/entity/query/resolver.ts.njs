<#@ context 'entity' -#>
import * as log4js from 'log4js';
let logger = log4js.getLogger('graphql:query');
import * as _ from 'lodash';

import { fromGlobalId } from 'graphql-relay';
import RegisterConnectors from '../../../../data/registerConnectors';
import { emptyConnection, idToCursor, pagination, detectCursorDirection, consts } from 'oda-api-graphql';

export const query: { [key: string]: any } = {
  #{entity.plural}: async (
    owner,
    args: {
      after: string,
      first: number,
      before: string,
      last: number,
      orderBy: string[],
      filter: object,
      limit: number,
      skip: number,
    },
    context: { connectors: RegisterConnectors },
    info
  ) => {
    logger.trace('#{entity.plural}');
    let result;
<# let relFields = entity.
  relations
  .filter(f => f.ref.type === 'ID' && f.verb === 'BelongsTo')
  .map(f=>f.field);#>
    let idMap = {
      id: '_id',
<#- relFields.forEach(f=>{#>
      #{f}: '#{f}',
<#})-#>
    }

    let list = await context.connectors.#{entity.name}.getList({
      ...args,
      idMap,
    });
    if (list.length > 0) {
      let cursor = pagination(args);
      let direction = detectCursorDirection(args)._id;
      let edges = list.map(l => {
        return {
          cursor: idToCursor(l._id),
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
    return result;
  },
  #{entity.singular}: async (
    owner,
    args: {
    <#- for (let f of entity.unique.args) {#>
      #{f.name}?: #{f.type},
    <#-}#>
    <#- for (let f of entity.unique.complex) {
        let args = `${f.fields.map(f=>`${f.name}?: ${f.type}`).join(', ')}`;
      #>
      // #{f.name}
      #{args},
    <#-}#>
    },
    context: { connectors: RegisterConnectors },
    info
  ) => {
    logger.trace('#{entity.singular}');
    let result;
    if (args.id) {
      result = await context.connectors.#{entity.name}.findOneById(fromGlobalId(args.id).id);
    <#- for (let f of entity.unique.find) {#>
    } else if (args.#{f.name}) {
      result = await context.connectors.#{entity.name}.findOneBy#{f.cName}(args.#{f.name});
    <#-}#>
    <#- for (let f of entity.unique.complex) {
      let findBy = f.fields.map(f=>f.uName).join('And');
      let loadArgs = `${f.fields.map(f=>f.gqlType === 'ID' ? `fromGlobalId(args.${f.name}).id` : `args.${f.name}`).join(', ')}`;
      let condArgs = `${f.fields.map(f=>`args.${f.name}`).join(' && ')}`;
#>
    } else if (#{condArgs}) {
      result = await context.connectors.#{entity.name}.findOneBy#{findBy}(#{loadArgs});
    <#-}#>
    }
    return result;
  },
};
