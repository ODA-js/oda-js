<#@ chunks "$$$main$$$" -#>
<#@ alias 'query-index'#>
<#@ context 'ctx'#>

<#-chunkStart(`./query/item/index.ts`); -#>
import #{ctx.entry.singularEntry} from './#{ctx.entry.singularEntry}';
import { Schema } from '../../../common';

export default new Schema({
  name: '#{ctx.entry.name}.queries.single',
  items: [#{ctx.entry.singularEntry}],
});
<#-chunkStart(`./query/list/index.ts`); -#>
import #{ctx.entry.pluralEntry} from './#{ctx.entry.pluralEntry}';
import #{ctx.entry.name}ComplexFilter from './#{ctx.entry.name}ComplexFilter';
import #{ctx.entry.name}SortOrder from './#{ctx.entry.name}SortOrder';
import #{ctx.entry.plural}Connection from './#{ctx.entry.plural}Connection';
import #{ctx.entry.plural}Edge from './#{ctx.entry.plural}Edge';

import { Schema } from '../../../common';
export default new Schema({
  name: '#{ctx.entry.name}.queries.list',
  items: [
    #{ctx.entry.pluralEntry},
    #{ctx.entry.name}ComplexFilter,
    #{ctx.entry.name}SortOrder,
    #{ctx.entry.plural}Connection,
    #{ctx.entry.plural}Edge,
  ],
});
<#-chunkStart(`./query/index.ts`); -#>

import list from './list';
import item from './item';
import filters from './filters';

import { Schema } from '../../common';

export default new Schema({
  name: '#{ctx.entry.name}.query',
  items: [list, item, filters],
});

<#- chunkEnd(); -#>

#{partial(ctx,'query-single')}
#{partial(ctx,'query-list')}
#{partial(ctx.sortOrder,'query-list-sort-order')}
#{partial(ctx.filter,'query-list-complex-filter')}
#{partial(ctx.filter,'query-filters')}
