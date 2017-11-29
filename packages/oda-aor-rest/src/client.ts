import buildApolloClient from './apollo';
import { ApolloClient } from 'apollo-client';
import { QUERY_TYPES } from './constants';
import { IResourceContainer, IResource, IResourceOperation } from './data/resource/interfaces';

export default ({ client: clientOptions, resources, fetchPolicy = 'network-only' }: {
  client: any,
  resources: IResourceContainer,
  fetchPolicy: string;
}) => {

  const client = clientOptions && (clientOptions.constructor === Object || clientOptions.__proto__ === {}.__proto__)
    ? buildApolloClient(clientOptions)
    : clientOptions;

  /**
  * @param {string} type Request type, e.g GET_LIST
  * @param {string} resource Resource name, e.g. "posts"
  * @param {Object} payload Request parameters. Depends on the request type
  * @returns {Promise} the Promise for a REST response
  */
  return (type, resourceName, params) => {
    console.log("Type is ", type);
    const resource: IResource = resources.resource(resourceName);
    if (!resource) {
      throw new Error(`No matching resource found for name ${resourceName}`);
    }

    if (!resource.operations[type]) {
      throw new Error(`No ${type} method found for name ${resourceName}`);
    }

    const operation: IResourceOperation = resource.operations[type];

    const variables = typeof operation.variables === 'function' ? operation.variables(params) : operation.variables;

    const shouldFakeExecute = typeof operation.shouldFakeExecute === 'function' ? operation.shouldFakeExecute(variables) : operation.shouldFakeExecute;

    const currentfetchPolicy = typeof operation.fetchPolicy === 'function' ? operation.fetchPolicy(params) : operation.fetchPolicy || fetchPolicy;

    const refetchQueries = typeof operation.refetchQueries === 'function' ? operation.refetchQueries(variables) : operation.refetchQueries;

    const update = typeof operation.update === 'function' ? operation.update : false;
    const query = typeof operation.query === 'function' ? operation.query(params) : operation.query;
    if (!shouldFakeExecute) {
      let action;
      if (QUERY_TYPES.includes(type)) {
        const apolloQuery: any = {
          query,
          variables,
        };
        if (fetchPolicy) {
          apolloQuery.fetchPolicy = currentfetchPolicy;
        }
        action = client.query(apolloQuery);
      } else {
        const apolloQuery: any = {
          mutation: operation.query,
          variables,
        };

        if (refetchQueries) {
          apolloQuery.refetchQueries = refetchQueries;
        }

        if (update) {
          apolloQuery.update = update;
        }

        action = client.mutate(apolloQuery)
      }
      return action.then(response => operation.parseResponse(response, params)).catch(er => {
        throw er;
      });
    } else {
      return Promise.resolve(shouldFakeExecute);
    }
  };
}