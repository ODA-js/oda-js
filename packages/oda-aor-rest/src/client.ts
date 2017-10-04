import buildApolloClient from './apollo';
import { ApolloClient } from 'apollo-client';
import { QUERY_TYPES } from './constants';

export default ({ client: clientOptions, resources: resourceList, queries = {}, fetchPolicy = 'network-only' }) => {

  const client = clientOptions && clientOptions instanceof ApolloClient
    ? clientOptions
    : buildApolloClient(clientOptions);

  /**
  * @param {string} type Request type, e.g GET_LIST
  * @param {string} resource Resource name, e.g. "posts"
  * @param {Object} payload Request parameters. Depends on the request type
  * @returns {Promise} the Promise for a REST response
  */
  return (type, resourceName, params) => {
    console.log("Type is ", type)
    const resource = resourceList[resourceName];
    if (!resource) {
      throw new Error(`No matching resource found for name ${resourceName}`);
    }

    let action;
    if (!resource.hasOwnProperty(type)) {
      throw new Error(`No ${type} method found for name ${resourceName}`);
    }

    const operation = resource[type](queries[type]);

    const variables = typeof operation.variables === 'function' ? operation.variables(params) : operation.variables;

    const currentfetchPolicy = typeof operation.fetchPolicy === 'function' ? operation.fetchPolicy(params) : operation.fetchPolicy || fetchPolicy;

    const refetchQueries = typeof operation.refetchQueries === 'function' ? operation.refetchQueries(variables) : operation.refetchQueries;

    const update = typeof operation.update === 'function' ? operation.update : false;
    const query = typeof operation.query === 'function' ? operation.query(params) : operation.query;

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
    return action.then(response => operation.parseResponse(response, params));
  };
}