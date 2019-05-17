<#@ chunks "$$$main$$$" -#>
<#@ alias 'mutation-index'#>
<#@ context 'ctx'#>

<#-chunkStart(`./mutations/index.ts`); -#>
import create from './create';
import _delete from './delete';
import update from './update';
import createMany from './createMany';
import createSafe from './createSafe';
import deleteMany from './deleteMany';
import deleteSafe from './deleteSafe';
import updateMany from './updateMany';
import updateSafe from './updateSafe';
import embed#{ctx.types.name}Input from './embed#{ctx.types.name}Input';

import { Schema } from '../../../common';

export default new Schema({
  name: '#{ctx.types.name}.mutations',
  items: [create, _delete, update, createMany, deleteMany, updateMany, createSafe, updateSafe, deleteSafe, embed#{ctx.types.name}Input],
});
<#- chunkEnd(); -#>

#{partial(ctx.types, 'mutations-embed')}
#{partial(ctx, 'mutations-create-index')}
#{partial(ctx, 'mutations-create-safe-index')}
#{partial(ctx, 'mutations-delete-index')}
#{partial(ctx, 'mutations-delete-safe-index')}
#{partial(ctx, 'mutations-update-index')}
#{partial(ctx, 'mutations-update-safe-index')}
#{partial(ctx, 'mutations-create-many-index')}
#{partial(ctx, 'mutations-delete-many-index')}
#{partial(ctx, 'mutations-update-many-index')}


