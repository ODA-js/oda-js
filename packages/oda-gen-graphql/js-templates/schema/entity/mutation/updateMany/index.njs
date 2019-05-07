<#@ chunks "$$$main$$$" -#>
<#@ alias 'mutations-update-many-index'#>
<#@ context 'ctx'#>

<#-chunkStart(`./mutations/updateMany/index.ts`); -#>
import { Schema } from '../../../../common';
import updateMany#{ctx.types.name} from './updateMany#{ctx.types.name}';
import updateMany#{ctx.types.name}Input from './updateMany#{ctx.types.name}Input';
import updateMany#{ctx.types.name}Payload from './updateMany#{ctx.types.name}Payload';
#{slot('import-embed-entity-update-many-rel-mutation-types')}

export default new Schema({
  name: '#{ctx.types.name}.mutation.updateMany',
  items: [
#{slot('use-embed-entity-update-many-rel-mutation-types')}
    updateMany#{ctx.types.name}, updateMany#{ctx.types.name}Input, updateMany#{ctx.types.name}Payload
    ],
});
<#- chunkEnd(); -#>
#{partial(ctx.types, 'mutations-update-many-types')}
#{partial(ctx.resolver, 'mutations-update-many-mutation')}



