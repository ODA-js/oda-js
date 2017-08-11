
import { passport } from 'oda-api-common';
import { fromGlobalId } from 'graphql-relay';
import RegisterConnectors from '../../data/registerConnectors';
import { common } from 'oda-gen-graphql';

import {
  globalIdField,
} from 'graphql-relay';

let { fillDefaults } = common.lib;

export class ViewerEntity extends common.types.GQLModule {
  constructor(_args) {
    super(_args);

    this._resolver = fillDefaults(this._resolver, {
      Viewer: {
        id: globalIdField('Viewer', ({ id }) => id),
      },
    });

    this._query = fillDefaults(this._query, {
      viewer: async (owner,
        args,
        context: { connectors: RegisterConnectors, user: { id: string, userName: string }, db },
        info) => {
        return {
          id: context.user ? fromGlobalId(context.user.id).id : null,
        };
      },
    });

    this._viewer = fillDefaults(this._viewer, {
      Viewer: {
        _user: async (owner: { id: string }, args,
          context: { connectors: RegisterConnectors, user: { id: string, userName: string } },
          info) => {
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
        },
      },
    });

    this._queryEntry = fillDefaults(this._queryEntry, {
      'queryEntry': [`
        viewer: Viewer
      `],
    });

    this._viewerEntry = fillDefaults(this._viewerEntry, {
      'viewerEntry': [`
        # current User
        _user: User
      `],
    });
  }
}
