export type CRUD = 'create' | 'read' | 'update' | 'remove';

export interface Connector<T> {
  create: (org: T) => Promise<T>;
  findOneById: (id) => Promise<T>;
  findOneByIdAndUpdate: (id, payload: T) => Promise<T>;
  findOneByIdAndRemove: (id) => Promise<T>;
  secure: (action: CRUD, obj: { payload: T; source: any }) => T;
  getPayload: (obj: any, update?: boolean) => T;
  getCount: (args) => Promise<Number>;
  getList: (args, checkExtraCriteria?) => Promise<T[]>;
  sync: (args: { force?: boolean }) => Promise<void>;
}
