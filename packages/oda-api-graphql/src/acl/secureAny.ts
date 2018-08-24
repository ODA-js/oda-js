import { CRUD } from './../connector';

export type ACLCRUD<T> = { [k in CRUD]: Secure<T> };

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
  public acl: Acls<T>;
  public rules: Rules;
  public defaultAccess: T;

  constructor({ acls = {} }: { acls: Acls<T> }) {
    this.defaultAccess = acls['*'] as T;
    this.acl = acls;
    this.rules = {};
    Object.keys(acls)
      .filter(o => o !== '*')
      .forEach(i => {
        let rule = acls[i];
        this.rules[i] = Object.keys(rule)
          .filter(o => o !== '*')
          .map(o => ({ match: new RegExp(o, 'ig'), key: o }));
      });
  }

  public allow(accessGroup: string, accessObject: string): T {
    if (this.acl[accessGroup]) {
      let result =
        (this.acl[accessGroup] && this.acl[accessGroup]['*']) ||
        this.defaultAccess;
      let last = '';
      let found = this.rules[accessGroup].some(r => {
        last = r.key;
        return !!accessObject.match(r.match);
      });
      if (found) {
        result = this.acl[accessGroup][last];
      }
      return result;
    } else {
      return this.defaultAccess;
    }
  }
}
