<#@ context 'pack' -#>
<#- for(let entity of pack.entities){#>
import #{entity.name} from './#{entity.name}/adapter/connector';
import { #{entity.name}Connector } from './#{entity.name}/adapter/interface';

<#- }#>

import { acl } from 'oda-api-graphql';

export default class RegisterConnectors {
<#- for(let entity of pack.entities){#>
  public get #{entity.name}(): #{entity.name}Connector {
    return this.Init#{entity.name}();
  }

  public Init#{entity.name}(): #{entity.name}Connector {
    if (!this._#{entity.name}) {
      this._#{entity.name} = new #{entity.name}({ #{entity.adapter}: this.#{entity.adapter}, connectors: this, user: this.user, owner: this.owner, acls: this.acls, userGroup: this.userGroup });
    }
    return this._#{entity.name};
  }

<#- }#>

<#- for(let entity of pack.entities){#>
  protected _#{entity.name}: #{entity.name}Connector;
<#- }#>

  public mongoose;
  public sequelize;
  public user;
  public owner;
  public acls: acl.secureAny.ACLCRUD<(object) => object>;
  public userGroup;
  public userGQL;
  public systemGQL;

  public initGQL({
      userGQL,
      systemGQL
    }:{
      userGQL?,
      systemGQL?,}){
    this.userGQL = userGQL ? userGQL : this.userGQL;
    this.systemGQL = systemGQL ? systemGQL : this.systemGQL;
  }

  constructor({
    user,
    owner,
    mongoose,
    sequelize,
    acls,
    userGroup,
    userGQL,
    systemGQL,
  }:
    {
      user?: any,
      owner?: any,
      mongoose?: any,
      sequelize?: any,
      acls?: acl.secureAny.Acls<(object) => object>;
      userGroup?: string;
      userGQL?,
      systemGQL?,
    }) {
    this.user = user;
    this.owner = owner;
    this.mongoose = mongoose;
    this.sequelize = sequelize;
    this.acls = { read: new acl.secureAny.Secure<(object) => object>({ acls }) };
    this.userGroup = userGroup;
    this.initGQL({userGQL, systemGQL});
  }

  async syncDb(force: boolean = false) {
<#- let list = pack.entities.filter(e=>e.adapter === 'sequelize') #>
<#- if(list.length > 0){ #>
<#-   for(let entity of list){#>
    this.Init#{entity.name}();
<#-   }#>
    await this.sequelize.sync({force});
<#-}#>
  }

  async close(){
    if (this.sequelize && typeof this.sequelize.close === 'function'){
      await this.sequelize.close();
    }
    if(this.mongoose && typeof this.mongoose.close === 'function'){
      await this.mongoose.close();
    }
  }
};
