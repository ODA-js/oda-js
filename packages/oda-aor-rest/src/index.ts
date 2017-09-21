import buildApolloClient from './apollo';
import { ApolloClient } from 'apollo-client';
import { QUERY_TYPES } from './constants';

export default ({ client: clientOptions, resources: resourceList }) => {

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

    const operation = resource[type]();

    const variables = typeof operation.variables === 'function' ? operation.variables(params) : operation.variables;

    if (QUERY_TYPES.includes(type)) {
      const apolloQuery = {
        query: operation.query,
        variables,
        fetchPolicy: 'network-only',
      };
      action = client.query(apolloQuery);
    } else {
      const apolloQuery = {
        mutation: operation.query,
        variables,
      };
      action = client.mutate(apolloQuery)
    }
    return action.then(operation.parseResponse);
  };
}