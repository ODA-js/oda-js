<#@ chunks "$$$main$$$" -#>
<#@ alias 'mutations-create-many-index'#>
<#@ context 'ctx'#>

<#-chunkStart(`./mutations/createMany/index.ts`); -#>
import { Schema } from '../../../../common';
import createMany#{ctx.types.name} from './createMany#{ctx.types.name}';
import createMany#{ctx.types.name}Input from './createMany#{ctx.types.name}Input';
import createMany#{ctx.types.name}Payload from './createMany#{ctx.types.name}Payload';
#{slot('import-embed-entity-create-many-rel-mutation-types')}

export default new Schema({
  name: '#{ctx.types.name}.mutation.createMany',
  items: [
#{slot('use-embed-entity-create-many-rel-mutation-types')}
    createMany#{ctx.types.name}, createMany#{ctx.types.name}Input, createMany#{ctx.types.name}Payload,
    ],
});
<#- chunkEnd(); -#>
#{partial(ctx.types, 'mutations-create-many-types')}
#{partial(ctx.resolver, 'mutations-create-many-mutation')}



