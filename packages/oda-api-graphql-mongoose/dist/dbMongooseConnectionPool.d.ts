export default class DbMongooseConnectionPool {
    defaultConnection: string;
    dbPool: Map<string, any>;
    dbConnectionList: any[];
    maxRetry: number;
    maxRetryTime: number;
    constructor(args: {
        defaultUrl: string;
        maxRetry?: number;
        maxRetryTime?: number;
    });
    checkConnectionStringIsValid(conn: any): boolean;
    release(): Promise<void>;
    remove(name: string): Promise<void>;
    set(name: string, connection: any): void;
    createConnection(connection: any): Promise<unknown>;
    get(name: string, connection?: string): Promise<any>;
}
//# sourceMappingURL=dbMongooseConnectionPool.d.ts.map