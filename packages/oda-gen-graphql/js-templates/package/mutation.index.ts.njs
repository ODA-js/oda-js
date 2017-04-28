<#@ context 'pack' -#>
import { common } from 'oda-gen-graphql';

<# for(let mutation of pack.mutations){-#>
import { #{mutation.entry}Mutation } from './#{mutation.name}';
<#}-#>

export class #{pack.name}Mutations extends common.types.GQLModule {
  protected _extend = [
<# for(let mutation of pack.mutations){-#>
    new #{mutation.entry}Mutation({}),
<#}-#>
  ];
}
