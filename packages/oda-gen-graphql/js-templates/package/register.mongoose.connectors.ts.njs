<#@ context 'pack' -#>
<#- for(let entity of pack.entities){#>
import #{entity.name} from './#{entity.name}/mongoose/connector';
<#- }#>

export default class {
<#- for(let entity of pack.entities){#>
  public get #{entity.name}(): #{entity.name} {
    if (!this._#{entity.name}) {
      this._#{entity.name} = new #{entity.name}({ mongoose: this.mongoose, connectors: this, user: this.user, owner: this.owner });
    }
    return this._#{entity.name};
  }

<#- }#>

<#- for(let entity of pack.entities){#>
  protected _#{entity.name}: #{entity.name};
<#- }#>

  protected mongoose;
  protected user;
  protected owner;

  constructor(context) {
    this.user = context.user;
    this.owner = context.owner;
    this.mongoose = context.mongoose;
  }
};
