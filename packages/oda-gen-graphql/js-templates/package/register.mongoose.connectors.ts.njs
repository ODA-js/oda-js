<#@ context 'pack' -#>
<#- for(let entity of pack.entities){#>
import #{entity.name} from './#{entity.name}/adapter/connector';
import { #{entity.name}Connector } from './#{entity.name}/adapter/interface';

<#- }#>

import { acl } from 'oda-api-graphql';

export default class RegisterConnectors {
<#- for(let entity of pack.entities){#>
  public get #{entity.name}(): #{entity.name}Connector {
    if (!this._#{entity.name}) {
      this._#{entity.name} = new #{entity.name}({ #{entity.adapter}: this.#{entity.adapter}, connectors: this, user: this.user, owner: this.owner, acls: this.acls, userGroup: this.userGroup });
    }
    return this._#{entity.name};
  }

<#- }#>

<#- for(let entity of pack.entities){#>
  protected _#{entity.name}: #{entity.name}Connector;
<#- }#>

  protected mongoose;
  protected sequelize;
  protected user;
  protected owner;
  protected acls: acl.secureAny.ACLCRUD<(object) => object>;
  protected userGroup;

  constructor({
    user,
    owner,
    mongoose,
    sequelize,
    acls,
    userGroup,
  }:
    {
      user?: any,
      owner?: any,
      mongoose?: any,
      sequelize?: any,
      acls?: acl.secureAny.Acls<(object) => object>;
      userGroup?: string;
    }) {
    this.user = user;
    this.owner = owner;
    this.mongoose = mongoose;
    this.sequelize = sequelize;
    this.acls = { read: new acl.secureAny.Secure<(object) => object>({ acls }) };
    this.userGroup = userGroup;
  }
};
