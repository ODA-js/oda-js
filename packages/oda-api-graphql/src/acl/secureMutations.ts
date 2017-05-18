
export interface Acl {
  [mutationMask: string]: boolean;
}

export interface Acls {
  [group: string]: Acl;
}

export interface Rules {
  [group: string]: {
    match: RegExp;
    key: string;
  }[];
}


export class SecureMutation {
  private acl: Acls;
  private rules: Rules;
  private defaultAccess: boolean;
  userGroup: (context) => string;
  constructor({ acls,
    userGroup = context => context.user.profileName,
    defaultAccess = false
  }: {
      acls: Acls;
      defaultAccess?: boolean;
      userGroup?: (context) => string
    }) {
    this.userGroup = userGroup;
    this.defaultAccess = defaultAccess;
    this.acl = acls;
    this.rules = {};
    Object.keys(acls).forEach(i => {
      let rule = acls[i];
      this.rules[i] = Object.keys(rule).filter(o => o !== '*').map(o => ({ match: new RegExp(o, 'ig'), key: o }));
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
      let last = '';
      if (this.rules[group].some(r => {
        last = r.key;
        return !!mutation.match(r.match);
      })) {
        result = this.acl[group][last];
      }
      return result;
    } else {
      return this.defaultAccess;
    }
  };

  public secureMutation() {
    const getMutationInfo = this.getMutationInfo.bind(this);
    const allow = this.allow.bind(this);
    const getACLGroup = this.userGroup;
    return (source, args, context, info) => {
      const group = getACLGroup(context);
      let descriptor = getMutationInfo(info);
      if (descriptor.opType === 'mutation') {
        if (!allow(group, descriptor.name)) {
          throw new Error('operation not allowed');
        }
      }
    };
  }
};
