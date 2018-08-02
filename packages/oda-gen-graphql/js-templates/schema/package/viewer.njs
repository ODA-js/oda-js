<#@ chunks "$$$main$$$" -#>
<#@ alias 'viewer' #>

<#- chunkStart(`./viewer.ts`); -#>
import gql from 'graphql-tag';
import {
  Type,
  globalIdField,
  Schema,
  Query,
  fromGlobalId,
  RegisterConnectors,
  getWithType,
} from './common';

export const Viewer = new Type({
  schema: gql`
    type Viewer implements Node {
      id: ID!
      _user: User
    }
  `,
  resolver: {
    id: globalIdField('User', ({ _id, id }) => _id || id),
    _user: async (
      owner: { id: string },
      args,
      context: { connectors: RegisterConnectors; user },
      info,
    ) => {
      if (owner.id !== undefined && owner.id !== null) {
        let result = await context.connectors.User.findOneById(owner.id);
        if (!result) {
          result = {
            ...context.user,
          };
          result.id = fromGlobalId(result.id).id;
        } else {
          result.id = result.id;
        }
        return {
          ...context.user,
          ...result,
          id: result.id,
        };
      } else {
        return null;
      }
    },
  },
});

export const viewer = new Query({
  schema: gql`
    extend type RootQuery {
      viewer: Viewer
    }
  `,
});

export default new Schema({
  name: 'Viewer',
  items: [Viewer, viewer],
});
