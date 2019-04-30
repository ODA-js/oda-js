import { ApolloLink } from 'apollo-link';
import { removeDirectivesFromDocument } from 'apollo-utilities';
import { graphqlLodash } from './gql';

export const LodashLink = new ApolloLink((operation, forward) => {
  const { transform, apply } = graphqlLodash(
    operation.query,
    operation.operationName,
  );
  // удалить упоминания об _

  operation.query = removeDirectivesFromDocument(
    [{ name: '_', remove: true }],
    operation.query,
  );

  return forward(operation).map(response => {
    if (apply) {
      return transform(response);
    } else {
      return response;
    }
  });
});
