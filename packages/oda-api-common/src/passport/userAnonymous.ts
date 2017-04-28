import { toGlobalId } from 'graphql-relay';

export default () => ({
  id: toGlobalId('User', '000000000000000000000000'),
  userName: 'ANONYMOUS',
  isAnonymous: true,
  owner: toGlobalId('User', '000000000000000000000000'),
  enabled: true,
  profileName: 'public',
});
