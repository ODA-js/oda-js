export interface Connector<T> {
  create: (org: T) => Promise<T>;
  findOneById: (id) => Promise<T>;
  findOneByIdAndUpdate: (id: string, payload: T) => Promise<T>;
  findOneByIdAndRemove: (id: string) => Promise<T>;
  canView: (obj: T) => T;
  getPayload: (obj: any, update?: boolean) => T;
  getCount: (args) => Promise<Number>;
  getList: (args, checkExtraCriteria?) => Promise<T[]>;
}
