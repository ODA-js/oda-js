export default class AclDefault {
  public constructor(acl: { [key: string]: number } = {
    system: 100000,
  }) {
    this._acl = acl;
    this.names = Object.keys(this._acl).sort((a, b) => {
      if (this._acl[a] > this._acl[b]) { return -1; }
      if (this._acl[a] < this._acl[b]) { return 1; }
      if (this._acl[a] === this._acl[b]) { return 0; }
    });
    this.map = this.names.reduce((store, cur, index) => {
      store[cur] = index;
      return store;
    }, {});
  }
  private _acl;
  // reverse order
  public names: string[];
  // reverse order
  public map: { [key: string]: number };

  public allow(role: string, access: string | string[]): boolean {
    if (Array.isArray(access)) {
      return access.some(a => this._acl[a] <= this._acl[role]);
    } else {
      return this._acl[access] <= this._acl[role];
    }
  };
}
