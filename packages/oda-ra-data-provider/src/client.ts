import buildApolloClient from './apollo';
import { QUERY_TYPES } from './constants';
import {
  IResource,
  IResourceContainer,
  IResourceOperation,
} from './data/resource/interfaces';

export default ({
  client: clientOptions,
  resources,
  role,
  fetchPolicy = 'network-only',
}: {
  client: any;
  role?: any;
  resources: IResourceContainer;
  fetchPolicy: string;
}) => {
  const client =
    clientOptions &&
    (clientOptions.constructor === Object ||
      clientOptions.__proto__ === ({} as any).__proto__)
      ? buildApolloClient(clientOptions)
      : clientOptions;

  /**
   * @param {string} type Request type, e.g GET_LIST
   * @param {string} resource Resource name, e.g. "posts"
   * @param {Object} payload Request parameters. Depends on the request type
   * @returns {Promise} the Promise for a REST response
   */
  return async (type: string, resourceName: string, params: object) => {
    let resource: IResource;
    resource = resources.resource(resourceName);
    if (!resource) {
      throw new Error(`No matching resource found for name ${resourceName}`);
    }

    if (!resource.operations[type]) {
      throw new Error(`No ${type} method found for name ${resourceName}`);
    }

    const operation: IResourceOperation = resource.operations[type];

    const variables =
      typeof operation.variables === 'function'
        ? operation.variables(params)
        : operation.variables;

    const shouldFakeExecute =
      typeof operation.shouldFakeExecute === 'function'
        ? operation.shouldFakeExecute(variables)
        : operation.shouldFakeExecute;

    const currentFetchPolicy =
      typeof operation.fetchPolicy === 'function'
        ? operation.fetchPolicy(params)
        : operation.fetchPolicy || fetchPolicy;

    const reFetchQueries =
      typeof operation.reFetchQueries === 'function'
        ? operation.reFetchQueries(variables)
        : operation.reFetchQueries;

    const update =
      typeof operation.update === 'function' ? operation.update : false;
    const query =
      typeof operation.query === 'function'
        ? operation.query(params)
        : operation.query;
    if (!shouldFakeExecute) {
      let action;
      if (QUERY_TYPES.includes(type)) {
        const apolloQuery: any = {
          query,
          variables,
        };
        if (fetchPolicy) {
          apolloQuery.fetchPolicy = currentFetchPolicy;
        }
        action = client.query(apolloQuery);
      } else {
        const apolloQuery: any = {
          mutation: operation.query,
          variables,
        };

        if (reFetchQueries) {
          apolloQuery.reFetchQueries = reFetchQueries;
        }

        if (update) {
          apolloQuery.update = update;
        }

        action = client.mutate(apolloQuery);
      }
      return action.then(response => operation.parseResponse(response, params));
    } else {
      return Promise.resolve(shouldFakeExecute);
    }
  };
};
