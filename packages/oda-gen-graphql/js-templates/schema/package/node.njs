<#@ chunks "$$$main$$$" -#>
<#@ alias 'node-interface' #>

<#- chunkStart(`./node.ts`); -#>
import gql from 'graphql-tag';
import { Interface, Schema, Query, fromGlobalId, getWithType } from './common';

export const Node = new Interface({
  schema: gql`
    interface Node {
      id: ID!
    }
  `,
  resolver: (obj, context, info) => {
    if (obj && obj.__type__) {
      return info.schema.getType(obj.__type__);
    } else {
      return null;
    }
  },
});

export const node = new Query({
  schema: gql`
    extend type RootQuery {
      node(id: ID!): Node
    }
  `,
  resolver: async (_, { id: globalId }, context, info) => {
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

export default new Schema({
  name: 'INode',
  items: [Node],
});
