<#@ chunks "$$$main$$$" -#>
<#@ alias 'mutations-update-index'#>
<#@ context 'ctx'#>

<#-chunkStart(`./mutations/update/index.ts`); -#>
import { Schema } from '../../../common';
import update#{ctx.types.name} from './update#{ctx.types.name}';
import update#{ctx.types.name}Input from './update#{ctx.types.name}Input';
import update#{ctx.types.name}Payload from './update#{ctx.types.name}Payload';

export default new Schema({
  name: '#{ctx.types.name}.mutation.update',
  items: [update#{ctx.types.name}, update#{ctx.types.name}Input, update#{ctx.types.name}Payload],
});
<#- chunkEnd(); -#>
#{partial(ctx.types, 'mutations-update-types')}
#{partial(ctx.resolver, 'mutations-update-mutation')}



