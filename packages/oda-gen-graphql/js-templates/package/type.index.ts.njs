<#@ context 'pack' -#>
import { common } from 'oda-gen-graphql';
import { NodeEntity } from './node';
import { ViewerEntity } from './viewer';

<# for(let entity of pack.entities){-#>
import { #{entity.name}Entity } from './#{entity.name}';
<#}-#>

export class #{pack.name}Entities extends common.types.GQLModule {
  protected _extend = [
    new NodeEntity({}),
    new ViewerEntity({}),
<# for(let entity of pack.entities){-#>
    new #{entity.name}Entity({}),
<#}-#>
  ];
}
