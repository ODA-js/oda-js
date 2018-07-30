<#@ chunks "$$$main$$$" -#>
<#@ alias 'query-index'#>
<#@ context 'ctx'#>

<#-chunkStart(`../../../gql/${ctx.entry.name}/query/item/index.ts`); -#>
import #{ctx.entry.singularEntry} from './#{ctx.entry.singularEntry}';
import { Schema } from '../../../common';

export default new Schema({
  name: '#{ctx.entry.name}.queries.single',
  items: [#{ctx.entry.singularEntry}],
});
<#-chunkStart(`../../../gql/${ctx.entry.name}/query/list/index.ts`); -#>
import #{ctx.entry.pluralEntry} from './#{ctx.entry.pluralEntry}';
import { Schema } from '../../../common';

export default new Schema({
  name: '#{ctx.entry.name}.queries.list',
  items: [#{ctx.entry.pluralEntry}],
});
<#-chunkStart(`../../../gql/${ctx.entry.name}/query/index.ts`); -#>

import list from './list';
import item from './item';
import filter from './filter';

import { Schema } from '../../common';

export default new Schema({
  name: '#{ctx.entry.name}.query',
  items: [list, item, filter],
});

<#- chunkEnd(); -#>

#{partial(ctx,'query-single')}
#{partial(ctx,'query-list')}
#{partial(ctx.sortOrder,'query-list-sort-order')}