
export interface Acl {
  [mutationMask: string]: boolean;
}

export interface Acls {
  [group: string]: Acl;
}

export interface Rules {
  [group: string]: RegExp[];
}


export class SecureMutation {
  private acl: Acls;
  private rules: Rules;
  private defaultAccess: boolean;
  constructor(acls: Acls, defaultAccess = false) {
    this.defaultAccess = defaultAccess;
    this.acl = acls;
    this.rules = {};
    Object.keys(acls).forEach(i => {
      let rule = acls[i];
      this.rules[i] = Object.keys(rule).filter(o => o !== '*').map(o => new RegExp(o, 'ig'));
    });

  }

  public getMutationInfo(info) {
    return {
      opType: info.operation ? info.operation.operation : '',
      name: info.fieldName,
    };
  }

  public allow(group: string, mutation: string) {
    if (this.acl[group]) {
      let result = (this.acl[group] && this.acl[group]['*']) || this.defaultAccess;
      if (this.rules[group].some(r => !!mutation.match(r))) {
        result = this.acl[group][mutation];
      }
      return result;
    } else {
      return this.defaultAccess;
    }
  };

  public secureMutation() {
    const getMutationInfo = this.getMutationInfo.bind(this);
    const allow = this.allow.bind(this);
    return (source, args, context, info) => {
      const group = context.user.profileName;
      let descriptor = getMutationInfo(info);
      if (descriptor.opType === 'mutation') {
        if (!allow(group, descriptor.name)) {
          throw new Error('operation not allowed');
        }
      }
    };
  }
};
