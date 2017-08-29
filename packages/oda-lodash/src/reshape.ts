import { filter } from 'graphql-anywhere';
import { graphqlLodash } from './gql';

export default function reshape(doc, data) {
  const { transform, apply } = graphqlLodash(doc);
  const result = filter(doc, data);
  if (apply) {
    return transform(result);
  }
  return result;
}
