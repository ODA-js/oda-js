import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';

export default ({ uri }) => {
  const httpLink = new HttpLink({ uri });
  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
  });
}
