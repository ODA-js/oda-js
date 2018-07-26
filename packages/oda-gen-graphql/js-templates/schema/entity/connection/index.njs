<#@ chunks "$$$main$$$" -#>
<#@ alias 'connection-index'#>
<#@ context 'ctx'#>

#{ partial(ctx.types, 'connection-types') }
#{ partial(ctx.mutations.resolver, 'connection-mutations') }
#{ partial(ctx.mutations.types, 'connection-mutations-input-payload') }

<#-chunkStart(`../../../gql/${ctx.mutations.types.name}/connection/index.ts`); -#>
import { Schema } from '../../common';
#{slot('import-connection-index-slot')}

export default new Schema({
  name: 'ToDo.connections',
  items: [
    #{slot('export-connection-index-slot')}
  ],
});
