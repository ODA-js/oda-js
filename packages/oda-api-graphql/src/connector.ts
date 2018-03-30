export interface Connector<T> {
  create: (org: T) => Promise<T>;
  findOneById: (id) => Promise<T>;
  findOneByIdAndUpdate: (id, payload: T) => Promise<T>;
  findOneByIdAndRemove: (id) => Promise<T>;
  can: (action: 'create' | 'read' | 'update' | 'remove', obj: { payload: T, source: any }) => T;
  getPayload: (obj: any, update?: boolean) => T;
  getCount: (args) => Promise<Number>;
  getList: (args, checkExtraCriteria?) => Promise<T[]>;
  sync: (args: { force?: boolean }) => Promise<void>;
}
