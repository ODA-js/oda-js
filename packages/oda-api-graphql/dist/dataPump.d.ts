import { ExecutionArgs } from 'graphql';
export declare function decapitalize(name: string): string;
export declare let restoreDataDirect: (importQueries: any, queries: any, data: any, schema: any, context: any, runQuery: any) => Promise<void>;
export declare let restoreData: (importQueries: any, queries: any, client: any, data: any) => Promise<void>;
export declare let dumpDataDirect: (config: any, queries: any, schema: any, context: any, runQuery: (options: ExecutionArgs) => Promise<any>) => Promise<{}>;
export declare let dumpData: (config: any, queries: any, client: any) => Promise<{}>;
//# sourceMappingURL=dataPump.d.ts.map