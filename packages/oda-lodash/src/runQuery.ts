import { QueryOptions, GraphQLResponse } from 'apollo-server-core/dist/runQuery';
import { runQuery } from 'apollo-server-core';
import { graphqlLodash } from './gql';

export function runQueryLodash(options: QueryOptions): Promise<GraphQLResponse> {
  const { transform, apply } = graphqlLodash(options.query);
  if (apply) {
    return runQuery(options).then(
      result => ({
        ...result,
        data: transform(result.data)
      })
    );
  } else {
    return runQuery(options);
  }
}