<#@ chunks "$$$main$$$" -#>
<#@ alias 'entity-index' #>
<#@ context 'entity' #>

<#- chunkStart(`../../../gql/${entity.name}/index.ts`); -#>
import connections from './connections';
import * as helpers from './helpers';
import mutations from './mutations';
import query from './query';
import subscription from './subscription';
import type from './type';
import { Schema } from 'oda-gen-common';

export { connections, mutations, query, subscription, type, helpers };

export default new Schema({
  name: '#{entity.name}',
  items: [connections, mutations, query, subscription, type],
});