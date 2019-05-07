<#@ chunks "$$$main$$$" -#>
<#@ alias 'mutations-delete-many-index'#>
<#@ context 'ctx'#>

<#-chunkStart(`./mutations/deleteMany/index.ts`); -#>
import { Schema } from '../../../../common';
import deleteMany#{ctx.types.name} from './deleteMany#{ctx.types.name}';
import deleteMany#{ctx.types.name}Input from './deleteMany#{ctx.types.name}Input';
import deleteMany#{ctx.types.name}Payload from './deleteMany#{ctx.types.name}Payload';

export default new Schema({
  name: '#{ctx.types.name}.mutation.deleteMany',
  items: [deleteMany#{ctx.types.name}, deleteMany#{ctx.types.name}Input, deleteMany#{ctx.types.name}Payload],
});
<#- chunkEnd(); -#>
#{partial(ctx.types, 'mutations-delete-many-types')}
#{partial(ctx.resolver, 'mutations-delete-many-mutation')}



