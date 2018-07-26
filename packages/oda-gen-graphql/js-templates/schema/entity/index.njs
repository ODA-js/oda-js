<#@ alias 'entity-index' #>
<#@ context 'entity' #>
import connections from './connections';
import mutations from './mutation';
import query from './query';
import subscription from './subscription';
import type from './type';
import { Schema } from 'oda-gen-common';

export { connections, mutations, query, subscription, type };

export default new Schema({
  name: '#{entity.name}',
  items: [connections, mutations, query, subscription, type],
});