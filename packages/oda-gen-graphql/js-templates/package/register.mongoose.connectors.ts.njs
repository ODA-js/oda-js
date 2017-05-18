<#@ context 'pack' -#>
<#- for(let entity of pack.entities){#>
import #{entity.name} from './#{entity.name}/mongoose/connector';
<#- }#>

import { acl } from 'oda-api-graphql';

export default class {
<#- for(let entity of pack.entities){#>
  public get #{entity.name}(): #{entity.name} {
    if (!this._#{entity.name}) {
      this._#{entity.name} = new #{entity.name}({ mongoose: this.mongoose, connectors: this, user: this.user, owner: this.owner, acls: this.acls, userGroup: this.userGroup });
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
  protected acls: acl.secureAny.ACLCRUD<(object) => object>;
  protected userGroup;

  constructor({
    user,
    owner,
    mongoose,
    acls,
    userGroup,
  }:
    {
      user?: any,
      owner?: any,
      mongoose?: any,
      acls?: acl.secureAny.Acls<(object) => object>;
      userGroup?: string;
    }) {
    this.user = user;
    this.owner = owner;
    this.mongoose = mongoose;
    this.acls = { read: new acl.secureAny.Secure<(object) => object>({ acls }) };
    this.userGroup = userGroup;
  }
};
