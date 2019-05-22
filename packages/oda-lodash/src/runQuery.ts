import { execute, ExecutionArgs } from 'graphql';
import { FetchResult } from 'apollo-link';
import { removeDirectivesFromDocument } from 'apollo-utilities';

import { graphqlLodash } from './gql';
// заменить на execute.... на прямую? продумать
/// посмотреть подробнее, они что-то добавили хорошее
export function runQueryLodash(options: ExecutionArgs): Promise<FetchResult> {
  const { transform, apply } = graphqlLodash(
    options.document,
    options.operationName,
  );

  if (apply) {
    options.document = removeDirectivesFromDocument(
      [{ name: '_' }],
      options.document,
    );
    return runQuery(options).then(result => ({
      ...result,
      data: transform(result.data),
    }));
  } else {
    return runQuery(options);
  }
}

async function runQuery(options: ExecutionArgs) {
  return execute(options);
}
