import { getWithType } from 'oda-api-graphql';
import { common } from 'oda-gen-graphql';

import {
  fromGlobalId,
} from 'graphql-relay';

let { fillDefaults } = common.lib;

export class NodeEntity extends common.types.GQLModule {
  constructor(_args) {
    super(_args);

    this._resolver = fillDefaults(this._resolver, {
      Node: {
        __resolveType(obj, context, info) {
          if (obj && obj.__type__) {
            return info.schema.getType(obj.__type__);
          } else {
            return null;
          }
        },
      },
    });

    this._query = fillDefaults(this._query, {
      async node(_, {id: globalId}, context, info) {
        let { type, id } = fromGlobalId(globalId);
        // здесь проверить можно ли получить данные
        // поэтому нужна своя структура для получения данных. чтобы не просто null,
        // а с описанием почему
        if (context.connectors[type]) {
          return await getWithType(context.connectors[type].findOneById(id), type);
        } else {
          return null;
        }
      },
    });

    this._typeDef = fillDefaults(this._typeDef ,{
      'queryEntry': [`
      interface Node {
        id: ID!
      }
      `],
    });

    this._queryEntry = fillDefaults(this._queryEntry, {
      'viewerEntry': [`
        node(id: ID!): Node
      `],
    });
  }
}
