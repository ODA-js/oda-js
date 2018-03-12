import { toGlobalId } from 'oda-api-graphql';

export default () => ({
  id: toGlobalId('User', 'ffffffffffffffffffffffff'),
  userName: 'SYSTEM',
  isSystem: true,
  //just because we need to setup everything to default organization in first load
  owner: toGlobalId('Organization', 'ffffffffffffffffffffffff'),
  enabled: true,
  profileName: 'system',
});
