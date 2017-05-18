
export interface ACLCRUD<T> {
  create?: Secure<T>;
  read?: Secure<T>;
  update?: Secure<T>;
  delete?: Secure<T>;
}

export interface Acl<T> {
  [mutationMask: string]: T;
}

export interface Acls<T> {
  // *: true, to setup default accessor
  [group: string]: Acl<T> | T;
}

export interface Rules {
  [group: string]: {
    match: RegExp;
    key: string;
  }[];
}

export class Secure<T> {
  protected acl: Acls<T>;
  protected rules: Rules;
  protected defaultAccess: T;
  protected userGroup: (context) => string;

  constructor({ acls = {},
    userGroup = context => context.user.profileName,
  }: {
      acls: Acls<T>;
      userGroup?: (context) => string
    }) {
    this.userGroup = userGroup;
    this.defaultAccess = acls['*'] as T;
    this.acl = acls;
    this.rules = {};
    Object.keys(acls).filter(o => o !== '*').forEach(i => {
      let rule = acls[i];
      this.rules[i] = Object.keys(rule).filter(o => o !== '*').map(o => ({ match: new RegExp(o, 'ig'), key: o }));
    });
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
};
